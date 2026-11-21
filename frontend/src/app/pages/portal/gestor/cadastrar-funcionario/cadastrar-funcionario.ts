
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  FuncionarioService,
  CadastroFuncionarioRequest
} from '../../../../services/funcionario.service';
import { apenasDigitosCpf, formatarCpf } from '../../../../utils/cpf';

@Component({
  selector: 'app-cadastrar-funcionario',
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastrar-funcionario.html',
  styleUrl: './cadastrar-funcionario.css'
})
export class CadastrarFuncionario {

  nome: string = '';
  cpf: string = '';
  email: string = '';
  senha: string = '';
  confirmarSenha: string = '';
  cargo: string = '';
  status: string = 'ATIVO';
  idGestor: number | null = null;

  carregando: boolean = false;
  mensagemSucesso: string = '';
  erro: string = '';

  constructor(
    private funcionarioService: FuncionarioService,
    private cdr: ChangeDetectorRef
  ) {}

  cadastrar(): void {

    this.mensagemSucesso = '';
    this.erro = '';

    // O CPF é validado pelos dígitos e salvo formatado (000.000.000-00), como no banco
    const cpfNumeros = apenasDigitosCpf(this.cpf);

    // Verificar se os campos obrigatórios foram preenchidos
    if (!this.nome || !cpfNumeros || !this.email || !this.senha
        || !this.confirmarSenha || !this.cargo) {
      this.erro = 'Preencha todos os campos obrigatórios.';
      return;
    }

    if (cpfNumeros.length !== 11) {
      this.erro = 'O CPF deve ter 11 dígitos.';
      return;
    }

    // Verificar se as senhas coincidem
    if (this.senha !== this.confirmarSenha) {
      this.erro = 'A confirmação da senha não corresponde.';
      return;
    }

    const dados: CadastroFuncionarioRequest = {
      usuario: {
        nome: this.nome.trim(),
        cpf: formatarCpf(cpfNumeros),
        email: this.email.trim(),
        senha: this.senha,
        status: this.status
      },
      cargo: this.cargo.trim()
    };

    if (this.idGestor) {
      dados.gestor = { idUsuario: this.idGestor };
    }

    this.carregando = true;

    this.funcionarioService.cadastrarFuncionario(dados).subscribe({
      next: () => {
        this.mensagemSucesso = `Funcionário ${dados.usuario.nome} cadastrado com sucesso!`;
        this.limparFormulario();
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao cadastrar funcionário:', erro);
        // Mostra o status HTTP e a mensagem do backend (quando houver) para facilitar o diagnóstico
        const detalhe = typeof erro?.error === 'string'
          ? erro.error
          : erro?.error?.message || erro?.error?.error || '';

        this.erro = `Não foi possível cadastrar o funcionário (erro ${erro?.status ?? '?'})`
          + (detalhe ? `: ${detalhe}` : '. Verifique se o CPF ou e-mail já estão cadastrados.');
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }

  private limparFormulario(): void {
    this.nome = '';
    this.cpf = '';
    this.email = '';
    this.senha = '';
    this.confirmarSenha = '';
    this.cargo = '';
    this.status = 'ATIVO';
    this.idGestor = null;
  }
}
