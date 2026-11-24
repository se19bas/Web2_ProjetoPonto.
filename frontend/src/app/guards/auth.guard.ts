import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = () => {

  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Com o refresh token o interceptor consegue renovar um access token expirado,
  // então basta ter algum dos dois. Se o refresh também estiver vencido, o
  // interceptor limpa a sessão e manda para o login na primeira requisição.
  const token = tokenService.obterToken();
  const refreshToken = tokenService.obterRefreshToken();

  if (token || refreshToken) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
