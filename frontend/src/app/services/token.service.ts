
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  salvarTokens(token: string, refreshToken: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  obterToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }

    return null;
  }

  obterRefreshToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    return null;
  }

  removerTokens(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }

  /**
   * Diz se o JWT está expirado (ou vai expirar nos próximos `margemSegundos`),
   * lendo o campo "exp" do próprio token. Não valida a assinatura: serve só para
   * o front decidir quando renovar. Devolve null se não for possível ler o token.
   */
  tokenExpirado(token: string | null, margemSegundos = 30): boolean | null {
    if (!token) {
      return null;
    }

    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = JSON.parse(atob(base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=')));

      if (typeof json.exp !== 'number') {
        return null;
      }

      return json.exp * 1000 <= Date.now() + margemSegundos * 1000;
    } catch {
      return null;
    }
  }
}
