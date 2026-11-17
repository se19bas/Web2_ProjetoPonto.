
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-senha',
  imports: [CommonModule , FormsModule],
  templateUrl: './senha.html',
  styleUrl: './senha.css'
})
export class Senha {

  senhaAtual: string = '';
  novaSenha: string = '';
  confirmarSenha: string = '';

  carregando: boolean = false;
  mensagemSucesso: string = '';
  erro: string = '';

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  alterarSenha(): void {

    this.mensagemSucesso = '';
    this.erro = '';

    // Verificar se os campos foram preenchidos
    if (!this.senhaAtual || !this.novaSenha || !this.confirmarSenha) {
      this.erro = 'Preencha todos os campos.';
      return;
    }

    // Verificar se as senhas coincidem
    if (this.novaSenha !== this.confirmarSenha) {
      this.erro = 'A confirmação da nova senha não corresponde.';
      return;
    }

    this.carregando = true;

    this.authService.alterarSenha(
      this.senhaAtual,
      this.novaSenha
    ).subscribe({
      next: (resposta) => {
        this.mensagemSucesso = resposta;

        this.senhaAtual = '';
        this.novaSenha = '';
        this.confirmarSenha = '';

        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao alterar senha:', erro);

        this.erro = 'Não foi possível alterar sua senha. Verifique sua senha atual.';
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }
}
