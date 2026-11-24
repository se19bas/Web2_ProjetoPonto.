
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  FuncionarioService,
  Funcionario,
  AtualizarFuncionarioRequest
} from '../../../../services/funcionario.service';
import { apenasDigitosCpf, formatarCpf } from '../../../../utils/cpf';

@Component({
  selector: 'app-alterar-funcionario',
  imports: [CommonModule, FormsModule],
  templateUrl: './alterar-funcionario.html',
  styleUrl: './alterar-funcionario.css'
})
export class AlterarFuncionario implements OnInit {

  // Busca
  idBusca: number | null = null;
  buscando: boolean = false;
  erroBusca: string = '';

  // Funcionário carregado (null = nenhum selecionado)
  funcionario: Funcionario | null = null;

  // Campos do formulário
  nome: string = '';
  cpf: string = '';
  email: string = '';
  cargo: string = '';
  status: string = 'ATIVO';
  idGestor: number | null = null;

  salvando: boolean = false;
  mensagemSucesso: string = '';
  erro: string = '';

  constructor(
    private funcionarioService: FuncionarioService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Permite abrir já com um funcionário: /portal/gestor/alterar-funcionario?id=5
    const id = Number(this.route.snapshot.queryParamMap.get('id'));

    if (id) {
      this.idBusca = id;
      this.buscarFuncionario();
    }
  }

  buscarFuncionario(): void {

    this.erroBusca = '';
    this.mensagemSucesso = '';
    this.erro = '';

    if (!this.idBusca) {
      this.erroBusca = 'Informe o ID do funcionário.';
      return;
    }

    this.buscando = true;
    this.funcionario = null;

    this.funcionarioService.buscarPorId(this.idBusca).subscribe({
      next: (dados) => {
        this.funcionario = dados;
        this.preencherFormulario(dados);
        this.buscando = false;
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao buscar funcionário:', erro);
        this.erroBusca = erro?.status === 404
          ? 'Funcionário não encontrado.'
          : 'Não foi possível buscar o funcionário.';
        this.buscando = false;
        this.cdr.markForCheck();
      }
    });
  }

  salvar(): void {

    if (!this.funcionario) {
      return;
    }

    this.mensagemSucesso = '';
    this.erro = '';

    // O CPF é validado pelos dígitos e salvo formatado (000.000.000-00), como no banco
    const cpfNumeros = apenasDigitosCpf(this.cpf);

    if (!this.nome || !cpfNumeros || !this.email || !this.cargo) {
      this.erro = 'Preencha todos os campos obrigatórios.';
      return;
    }

    if (cpfNumeros.length !== 11) {
      this.erro = 'O CPF deve ter 11 dígitos.';
      return;
    }

    const dados: AtualizarFuncionarioRequest = {
      usuario: {
        nome: this.nome.trim(),
        cpf: formatarCpf(cpfNumeros),
        email: this.email.trim(),
        status: this.status
      },
      cargo: this.cargo.trim(),
      gestor: this.idGestor ? { idUsuario: this.idGestor } : null
    };

    this.salvando = true;

    this.funcionarioService.atualizarFuncionario(this.funcionario.idUsuario, dados).subscribe({
      next: (atualizado) => {
        this.funcionario = atualizado;
        this.mensagemSucesso = `Funcionário ${dados.usuario.nome} alterado com sucesso!`;
        this.salvando = false;
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao alterar funcionário:', erro);

        // Mostra o status HTTP e a mensagem do backend (quando houver) para facilitar o diagnóstico
        const detalhe = typeof erro?.error === 'string'
          ? erro.error
          : erro?.error?.message || erro?.error?.error || '';

        this.erro = `Não foi possível alterar o funcionário (erro ${erro?.status ?? '?'})`
          + (detalhe ? `: ${detalhe}` : '. Verifique se o CPF ou e-mail já pertencem a outro usuário.');
        this.salvando = false;
        this.cdr.markForCheck();
      }
    });
  }

  cancelar(): void {
    this.funcionario = null;
    this.mensagemSucesso = '';
    this.erro = '';
  }

  private preencherFormulario(dados: Funcionario): void {
    this.nome = dados.usuario.nome;
    this.cpf = formatarCpf(dados.usuario.cpf);
    this.email = dados.usuario.email;
    this.cargo = dados.cargo;
    this.status = dados.usuario.status;
    this.idGestor = dados.gestor?.idUsuario ?? null;
  }

}
