
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { TokenService } from './token.service';

/**
 * Descobre se o usuário logado é gestor.
 *
 * O backend não informa o perfil no /api/auth/me nem no token, mas o endpoint
 * de hierarquia só responde 200 para quem tem o papel GESTOR (403 para os demais).
 * O resultado fica guardado por token, para não repetir a chamada a cada tela;
 * quando outro usuário entra (token diferente), consulta de novo.
 */
@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private tokenConsultado: string | null = null;
  private ehGestor$?: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  ehGestor(): Observable<boolean> {
    const token = this.tokenService.obterToken();

    if (!token) {
      return of(false);
    }

    if (!this.ehGestor$ || this.tokenConsultado !== token) {
      this.tokenConsultado = token;
      this.ehGestor$ = this.http
        .get(`${environment.apiUrl}/sistemaponto/gestores/hierarquia`, { observe: 'response' })
        .pipe(
          map(() => true),
          // 403 = não é gestor. Qualquer outro erro também esconde a área do gestor
          catchError(() => of(false)),
          shareReplay(1)
        );
    }

    return this.ehGestor$;
  }
}
