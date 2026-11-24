
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PerfilService } from '../../services/perfil.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})

export class Header implements OnInit {

  // A "Área do Gestor" só aparece para gestores
  ehGestor: boolean = false;

  constructor(
    private authService: AuthService,
    private perfilService: PerfilService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.perfilService.ehGestor().subscribe((ehGestor) => {
      this.ehGestor = ehGestor;
      this.cdr.markForCheck();
    });
  }

  sair(): void {

    this.authService.logout().subscribe({

      next: () => {
        console.log('Logout realizado com sucesso!');
        this.router.navigate(['/login']);
      },

      error: (erro) => {
        console.error('Erro ao realizar logout:', erro);
      }

    });

  }

}
