
import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { finalize, map, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { TokenService } from './token.service';
import type { AuthResponse } from './auth.service';

/**
 * Renova o access token usando o refresh token (POST /api/auth/refresh).
 *
 * Usa um HttpClient criado direto sobre o HttpBackend, ou seja, SEM passar pelos
 * interceptors: assim a chamada de refresh não é interceptada (evita loop) e o
 * interceptor pode usar este serviço sem dependência circular.
 *
 * Se várias requisições precisarem renovar ao mesmo tempo, todas esperam a mesma
 * chamada de refresh em vez de cada uma fazer a sua.
 */
@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {

  private http: HttpClient;
  private refreshEmAndamento$: Observable<string> | null = null;

  constructor(
    httpBackend: HttpBackend,
    private tokenService: TokenService
  ) {
    this.http = new HttpClient(httpBackend);
  }

  /** Emite o novo access token, ou erro se não for possível renovar. */
  renovar(): Observable<string> {
    if (this.refreshEmAndamento$) {
      return this.refreshEmAndamento$;
    }

    const refreshToken = this.tokenService.obterRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('Sem refresh token'));
    }

    this.refreshEmAndamento$ = this.http
      .post<AuthResponse>(`${environment.apiUrl}/api/auth/refresh`, { refreshToken })
      .pipe(
        tap((resposta) => {
          // O backend devolve o mesmo refresh token; se vier outro, guarda o novo
          this.tokenService.salvarTokens(resposta.token, resposta.refreshToken || refreshToken);
        }),
        map((resposta) => resposta.token),
        finalize(() => {
          this.refreshEmAndamento$ = null;
        }),
        shareReplay(1)
      );

    return this.refreshEmAndamento$;
  }
}
