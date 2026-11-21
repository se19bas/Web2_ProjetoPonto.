import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { PerfilService } from '../services/perfil.service';

// Bloqueia a área do gestor para quem não é gestor (ex.: digitando a URL direto)
export const gestorGuard: CanActivateFn = () => {

  const perfilService = inject(PerfilService);
  const router = inject(Router);

  return perfilService.ehGestor().pipe(
    map((ehGestor) => ehGestor ? true : router.createUrlTree(['/portal/inicio']))
  );
};
