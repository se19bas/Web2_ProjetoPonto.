import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { TokenService } from './token.service';
import { environment } from '../../environments/environment';

interface LoginRequest {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(email: string, senha: string): Observable<AuthResponse> {

    const dados: LoginRequest = {
      email: email,
      senha: senha
    };

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      dados
    ).pipe(
      tap(resposta => {
        this.tokenService.salvarTokens(
          resposta.token,
          resposta.refreshToken
        );
      })
    );
  }

  obterUsuarioLogado(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  logout(): Observable<string> {

    const refreshToken = this.tokenService.obterRefreshToken();

    return this.http.post(
      `${this.apiUrl}/logout`,
      { refreshToken },
      {responseType: 'text'}
    ).pipe(
      tap(() => {
        this.tokenService.removerTokens();
      })
    );
  }
}
