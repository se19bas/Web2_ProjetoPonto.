
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { CpfPipe } from '../../../utils/cpf';

@Component({
  selector: 'app-meu-perfil',
  imports: [CommonModule, CpfPipe],
  templateUrl: './meu-perfil.html',
  styleUrl: './meu-perfil.css'
})

export class MeuPerfil {

  usuario: any = null;
  erroPerfil: string = '';

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

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

}
