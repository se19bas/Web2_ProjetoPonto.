
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GestorService, HierarquiaGestor, FuncionarioHierarquia } from '../../../../services/gestor.service';
import { FuncionarioService } from '../../../../services/funcionario.service';

@Component({
  selector: 'app-hierarquia',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './hierarquia.html',
  styleUrl: './hierarquia.css'
})
export class Hierarquia implements OnInit {

  gestores: HierarquiaGestor[] = [];

  // Resultado dos filtros: recalculado só quando os dados ou o filtro mudam
  gestoresVisiveis: HierarquiaGestor[] = [];
  totalFuncionarios: number = 0;
  carregando: boolean = true;
  erro: string = '';

  // Inativação. A hierarquia do backend não informa o status dos funcionários,
  // então a tela só sabe quem foi inativado nesta visita
  inativandoId: number | null = null;
  inativados = new Set<number>();
  mensagemAcao: string = '';
  erroAcao: string = '';

  // Filtros aplicados na própria tela (o backend devolve a hierarquia completa)
  idGestor: number | null = null;
  textoBusca: string = '';

  // Filtros aplicados ao clicar em Buscar
  private idGestorAplicado: number | null = null;
  private textoAplicado: string = '';

  constructor(
    private gestorService: GestorService,
    private funcionarioService: FuncionarioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarHierarquia();
  }

  carregarHierarquia(): void {
    this.carregando = true;
    this.erro = '';

    this.gestorService.listarHierarquia().subscribe({
      next: (dados) => {
        // Gestores em ordem alfabética, e os funcionários de cada um também
        this.gestores = [...dados]
          .map((g) => ({
            ...g,
            funcionarios: [...(g.funcionarios || [])].sort((a, b) => a.nome.localeCompare(b.nome))
          }))
          .sort((a, b) => (a.nomeGestor || '').localeCompare(b.nomeGestor || ''));
        this.totalFuncionarios = this.gestores.reduce((total, g) => total + g.funcionarios.length, 0);
        this.aplicarFiltros();
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao buscar hierarquia:', erro);
        this.erro = erro?.status === 403
          ? 'Você não tem permissão para consultar a hierarquia (apenas gestores).'
          : 'Não foi possível carregar a hierarquia.';
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }

  buscar(): void {
    this.idGestorAplicado = this.idGestor;
    this.textoAplicado = this.textoBusca.trim().toLowerCase();
    this.aplicarFiltros();
  }

  limparFiltro(): void {
    this.idGestor = null;
    this.textoBusca = '';
    this.buscar();
  }

  inativar(funcionario: FuncionarioHierarquia, gestor: HierarquiaGestor): void {

    const ehOGestor = funcionario.idFuncionario === gestor.idGestor;

    const confirmado = confirm(
      `Deseja inativar o funcionário ${funcionario.nome} (#${funcionario.idFuncionario})?`
      + (ehOGestor ? '\n\nAtenção: este funcionário é o próprio gestor da equipe.' : '')
    );

    if (!confirmado) {
      return;
    }

    this.mensagemAcao = '';
    this.erroAcao = '';
    this.inativandoId = funcionario.idFuncionario;

    this.funcionarioService.inativarFuncionario(funcionario.idFuncionario).subscribe({
      next: () => {
        this.inativados.add(funcionario.idFuncionario);
        this.mensagemAcao = `Funcionário ${funcionario.nome} inativado com sucesso.`;
        this.inativandoId = null;
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao inativar funcionário:', erro);
        this.erroAcao = `Não foi possível inativar o funcionário ${funcionario.nome} (erro ${erro?.status ?? '?'}).`;
        this.inativandoId = null;
        this.cdr.markForCheck();
      }
    });
  }

  get filtroAtivo(): boolean {
    return !!this.idGestorAplicado || !!this.textoAplicado;
  }

  // Gestores visíveis após os filtros. A busca por texto procura no nome do gestor,
  // no setor e no nome/cargo dos funcionários (mostrando só os funcionários que batem,
  // a não ser que o próprio gestor ou setor bata)
  private aplicarFiltros(): void {
    const texto = this.textoAplicado;

    this.gestoresVisiveis = this.gestores
      .filter((g) => !this.idGestorAplicado || g.idGestor === this.idGestorAplicado)
      .map((g) => {
        if (!texto) {
          return g;
        }

        const gestorBate = (g.nomeGestor || '').toLowerCase().includes(texto)
          || (g.setor || '').toLowerCase().includes(texto);

        if (gestorBate) {
          return g;
        }

        const funcionarios = g.funcionarios.filter((f) =>
          (f.nome || '').toLowerCase().includes(texto)
          || (f.cargo || '').toLowerCase().includes(texto)
        );

        return funcionarios.length > 0 ? { ...g, funcionarios } : null;
      })
      .filter((g): g is HierarquiaGestor => g !== null);
  }

}
