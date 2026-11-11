
import { Component, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portal',
  imports: [CommonModule],
  templateUrl: './portal.html',
  styleUrl: './portal.css'
})

export class Portal {

  usuario: any = null;
  perfilAberto: boolean = false;
  erroPerfil: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  abrirPerfil(): void {

    this.perfilAberto = true;
    this.usuario = null;
    this.erroPerfil = '';

    this.authService.obterUsuarioLogado().subscribe({

      next: (dados) => {
        this.usuario = dados;
        console.log('Dados do usuário:', dados);

        this.cdr.markForCheck();
      },

      error: (erro) => {
        console.error('Erro ao buscar dados do usuário:', erro);

        this.erroPerfil = 'Não foi possível carregar os dados do usuário.';

        this.cdr.markForCheck();
      }

    });

  }

  fecharPerfil(): void {
    this.perfilAberto = false;
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
