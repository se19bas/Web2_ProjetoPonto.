import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { TokenService } from '../services/token.service';
import { RefreshTokenService } from '../services/refresh-token.service';

// Rotas de autenticação que não levam token nem disparam refresh
const ROTAS_SEM_TOKEN = ['/api/auth/login', '/api/auth/refresh'];

/**
 * Adiciona o token nas requisições e renova o token expirado com o refresh token.
 *
 * Atenção: com token expirado o backend responde 403 (e não 401), o mesmo código de
 * "sem permissão" (ex.: funcionário comum consultando a hierarquia). Para não renovar
 * à toa nem entrar em loop, o interceptor:
 *  1. lê a expiração do próprio JWT e renova ANTES de enviar, se já expirou;
 *  2. se mesmo assim vier 401/403 com um token que estava expirado, renova e repete
 *     a requisição UMA vez;
 *  3. um 403 com token válido é tratado como falta de permissão e repassado à tela.
 * Se o refresh falhar (refresh token expirado/revogado), limpa os tokens e manda para o login.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService,
    private refreshTokenService: RefreshTokenService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (ROTAS_SEM_TOKEN.some((rota) => request.url.includes(rota))) {
      return next.handle(request);
    }

    const token = this.tokenService.obterToken();

    // Sem login: envia como está (o backend responde 403 e a tela trata)
    if (!token) {
      return next.handle(request);
    }

    // 1. Token já expirado: renova antes de enviar
    if (this.tokenService.tokenExpirado(token) === true && this.tokenService.obterRefreshToken()) {
      return this.renovarEEnviar(request, next);
    }

    return next.handle(this.comToken(request, token)).pipe(
      catchError((erro: unknown) => {
        // 2. Token expirou no caminho (ou não deu para ler o "exp"): renova e repete uma vez
        if (
          erro instanceof HttpErrorResponse
          && (erro.status === 401 || erro.status === 403)
          && this.tokenService.tokenExpirado(token, 0) !== false
          && this.tokenService.obterRefreshToken()
        ) {
          return this.renovarEEnviar(request, next);
        }

        // 3. Qualquer outro erro (inclusive 403 de falta de permissão) segue para a tela
        return throwError(() => erro);
      })
    );
  }

  private renovarEEnviar(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.refreshTokenService.renovar().pipe(
      catchError((erro) => {
        // Refresh token inválido, expirado ou revogado: sessão encerrada
        this.encerrarSessao();
        return throwError(() => erro);
      }),
      // Repete com o token novo. Se falhar de novo, o erro vai para a tela (sem novo refresh)
      switchMap((novoToken) => next.handle(this.comToken(request, novoToken)))
    );
  }

  private comToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private encerrarSessao(): void {
    this.tokenService.removerTokens();
    this.router.navigate(['/login']);
  }
}
