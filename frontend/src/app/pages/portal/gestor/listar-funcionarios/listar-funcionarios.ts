
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { FuncionarioService, Funcionario } from '../../../../services/funcionario.service';
import { GestorService } from '../../../../services/gestor.service';
import { CpfPipe } from '../../../../utils/cpf';

@Component({
  selector: 'app-listar-funcionarios',
  imports: [CommonModule, FormsModule, RouterLink, CpfPipe],
  templateUrl: './listar-funcionarios.html',
  styleUrl: './listar-funcionarios.css'
})
export class ListarFuncionarios implements OnInit, OnDestroy {

  funcionarios: Funcionario[] = [];
  carregando: boolean = true;
  erro: string = '';

  // Filtros (ambos vazios = todos os funcionários)
  idFuncionario: number | null = null;
  idGestor: number | null = null;

  // Inativação (mensagens separadas do erro da lista para não esconder a tabela)
  inativandoId: number | null = null;
  mensagemAcao: string = '';
  erroAcao: string = '';

  // Mostrar somente funcionários sem gestor (filtro aplicado na própria tela)
  somenteSemGestor: boolean = false;

  // Lista filtrada guardada em cache: o getter devolve o mesmo array enquanto nada mudar,
  // evitando recriar a lista (e o erro NG0100 do modo dev) a cada detecção de mudanças
  private cacheVisiveis: Funcionario[] = [];
  private cacheOrigem: Funcionario[] | null = null;
  private cacheSomenteSemGestor: boolean | null = null;
  private cacheVersao = -1;
  private versaoGestor = 0; // incrementada quando o gestor de alguém muda

  get funcionariosVisiveis(): Funcionario[] {
    if (this.cacheOrigem !== this.funcionarios
        || this.cacheSomenteSemGestor !== this.somenteSemGestor
        || this.cacheVersao !== this.versaoGestor) {
      this.cacheOrigem = this.funcionarios;
      this.cacheSomenteSemGestor = this.somenteSemGestor;
      this.cacheVersao = this.versaoGestor;
      this.cacheVisiveis = this.somenteSemGestor
        ? this.funcionarios.filter((f) => !f.gestor?.idUsuario)
        : this.funcionarios;
    }

    return this.cacheVisiveis;
  }

  get totalSemGestor(): number {
    return this.funcionarios.filter((f) => !f.gestor?.idUsuario).length;
  }

  alternarSemGestor(): void {
    this.somenteSemGestor = !this.somenteSemGestor;
  }

  // Definir gestor: linha em edição e valor digitado
  definindoGestorId: number | null = null;
  novoIdGestor: number | null = null;
  salvandoGestor: boolean = false;

  // IDs de quem já é gestor (vem da hierarquia). null = não foi possível carregar
  idsGestores: Set<number> | null = null;

  // Promover a gestor: linha em edição e setor digitado
  promovendoId: number | null = null;
  setorPromocao: string = '';
  salvandoPromocao: boolean = false;

  // Requisição em andamento: é cancelada quando uma nova busca começa, para que
  // uma resposta antiga (ex.: a listagem geral, mais lenta) não sobrescreva o resultado do filtro
  private requisicaoAtual?: Subscription;

  constructor(
    private funcionarioService: FuncionarioService,
    private gestorService: GestorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarFuncionarios();
    this.carregarGestores();
  }

  // A listagem de funcionários não diz quem é gestor: usa a hierarquia para saber
  private carregarGestores(): void {
    this.gestorService.listarHierarquia().subscribe({
      next: (hierarquia) => {
        this.idsGestores = new Set(hierarquia.map((g) => g.idGestor));
        this.cdr.markForCheck();
      },
      error: (erro) => {
        // Sem a hierarquia, a tela só não consegue marcar quem é gestor
        console.error('Erro ao buscar gestores:', erro);
      }
    });
  }

  ehGestor(funcionario: Funcionario): boolean {
    return !!this.idsGestores?.has(funcionario.idUsuario);
  }

  abrirPromover(funcionario: Funcionario): void {
    this.mensagemAcao = '';
    this.erroAcao = '';
    this.definindoGestorId = null;
    this.promovendoId = funcionario.idUsuario;
    this.setorPromocao = '';
  }

  cancelarPromover(): void {
    this.promovendoId = null;
    this.setorPromocao = '';
  }

  promover(funcionario: Funcionario): void {

    this.mensagemAcao = '';
    this.erroAcao = '';

    const setor = this.setorPromocao.trim();

    if (!setor) {
      this.erroAcao = 'Informe o setor do novo gestor.';
      return;
    }

    if (this.ehGestor(funcionario)) {
      this.erroAcao = `${funcionario.usuario.nome} já é gestor.`;
      return;
    }

    const confirmado = confirm(
      `Deseja promover ${funcionario.usuario.nome} (#${funcionario.idUsuario}) a gestor do setor "${setor}"?`
    );

    if (!confirmado) {
      return;
    }

    this.salvandoPromocao = true;

    this.gestorService.promover(funcionario.idUsuario, setor).subscribe({
      next: () => {
        this.idsGestores = new Set([...(this.idsGestores ?? []), funcionario.idUsuario]);
        this.mensagemAcao = `${funcionario.usuario.nome} agora é gestor do setor ${setor} (ID de gestor #${funcionario.idUsuario}).`;
        this.salvandoPromocao = false;
        this.promovendoId = null;
        this.setorPromocao = '';
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao promover funcionário:', erro);
        this.erroAcao = `Não foi possível promover ${funcionario.usuario.nome} a gestor (erro ${erro?.status ?? '?'}).`;
        this.salvandoPromocao = false;
        this.cdr.markForCheck();
      }
    });
  }

  ngOnDestroy(): void {
    this.requisicaoAtual?.unsubscribe();
  }

  carregarFuncionarios(): void {
    this.requisicaoAtual?.unsubscribe();

    this.carregando = true;
    this.erro = '';
    this.mensagemAcao = '';
    this.erroAcao = '';

    const idFuncionario = this.idFuncionario;
    const idGestor = this.idGestor;

    // Busca por ID do funcionário: retorna um único funcionário (lista com 0 ou 1 item)
    if (idFuncionario) {
      this.requisicaoAtual = this.funcionarioService.buscarPorId(idFuncionario).subscribe({
        next: (funcionario) => {
          // Se o gestor também foi informado, só mostra se o funcionário for dele
          const pertenceAoGestor = !idGestor || funcionario.gestor?.idUsuario === idGestor;

          this.funcionarios = funcionario && pertenceAoGestor ? [funcionario] : [];
          this.carregando = false;
          this.cdr.markForCheck();
        },
        error: (erro) => {
          if (erro?.status === 404) {
            // Funcionário inexistente: mostra a mensagem de lista vazia
            this.funcionarios = [];
          } else {
            console.error('Erro ao buscar funcionário:', erro);
            this.erro = 'Não foi possível buscar o funcionário.';
          }
          this.carregando = false;
          this.cdr.markForCheck();
        }
      });
      return;
    }

    const requisicao = idGestor
      ? this.funcionarioService.listarPorGestor(idGestor)
      : this.funcionarioService.listarFuncionarios();

    this.requisicaoAtual = requisicao.subscribe({
      next: (dados) => {
        this.funcionarios = dados;
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao buscar funcionários:', erro);
        this.erro = 'Não foi possível carregar a lista de funcionários.';
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }

  limparFiltro(): void {
    this.idFuncionario = null;
    this.idGestor = null;
    this.carregarFuncionarios();
  }

  abrirDefinirGestor(funcionario: Funcionario): void {
    this.mensagemAcao = '';
    this.erroAcao = '';
    this.promovendoId = null;
    this.definindoGestorId = funcionario.idUsuario;
    this.novoIdGestor = funcionario.gestor?.idUsuario ?? null;
  }

  cancelarDefinirGestor(): void {
    this.definindoGestorId = null;
    this.novoIdGestor = null;
  }

  salvarGestor(funcionario: Funcionario): void {

    this.mensagemAcao = '';
    this.erroAcao = '';

    const idGestor = this.novoIdGestor;

    if (!idGestor) {
      this.erroAcao = 'Informe o ID do gestor.';
      return;
    }

    if (idGestor === funcionario.idUsuario) {
      this.erroAcao = 'Um funcionário não pode ser o próprio gestor.';
      return;
    }

    // Impede ciclos na hierarquia (ex.: A gestor de B e B gestor de A). O backend não valida
    // isso, e um ciclo deixa o JSON do funcionário infinito, quebrando a listagem
    const ciclo = this.formariaCiclo(funcionario.idUsuario, idGestor);

    if (ciclo) {
      this.erroAcao = `Não é possível: ${funcionario.usuario.nome} está acima do gestor #${idGestor} `
        + `na hierarquia (${ciclo}). Isso criaria um ciclo.`;
      return;
    }

    this.salvandoGestor = true;

    this.funcionarioService.definirGestor(funcionario.idUsuario, idGestor).subscribe({
      next: () => {
        // Atualiza só a linha, sem recarregar a lista inteira
        funcionario.gestor = { idUsuario: idGestor };
        this.versaoGestor++;
        this.mensagemAcao = `Gestor #${idGestor} definido para ${funcionario.usuario.nome}.`;
        this.salvandoGestor = false;
        this.definindoGestorId = null;
        this.novoIdGestor = null;
        this.cdr.markForCheck();
      },
      error: (erro) => {
        // O backend responde com erro quando o gestor não existe
        console.error('Erro ao definir gestor:', erro);
        // Mostra o status HTTP e a mensagem do backend (quando houver) para facilitar o diagnóstico
        const detalhe = typeof erro?.error === 'string'
          ? erro.error
          : erro?.error?.message || erro?.error?.error || erro?.message || '';

        this.erroAcao = `Não foi possível definir o gestor #${idGestor} para ${funcionario.usuario.nome} `
          + `(erro ${erro?.status ?? '?'}${detalhe ? ': ' + detalhe : ''}).`;
        this.salvandoGestor = false;
        this.cdr.markForCheck();
      }
    });
  }

  /**
   * Sobe a cadeia de gestores a partir do novo gestor, usando a lista carregada.
   * Se chegar ao próprio funcionário, a atribuição formaria um ciclo: devolve o
   * caminho (ex.: "#2 → #3 → #1"); senão devolve null.
   */
  private formariaCiclo(idFuncionario: number, idNovoGestor: number): string | null {
    const gestorDe = new Map<number, number | undefined>(
      this.funcionarios.map((f) => [f.idUsuario, f.gestor?.idUsuario])
    );

    const caminho: number[] = [idNovoGestor];
    const visitados = new Set<number>([idNovoGestor]);
    let atual = gestorDe.get(idNovoGestor);

    while (atual != null) {
      caminho.push(atual);

      if (atual === idFuncionario) {
        return caminho.map((id) => '#' + id).join(' → ');
      }

      // Ciclo já existente acima (que não passa pelo funcionário): para a busca
      if (visitados.has(atual)) {
        return null;
      }

      visitados.add(atual);
      atual = gestorDe.get(atual);
    }

    return null;
  }

  inativar(funcionario: Funcionario): void {

    const confirmado = confirm(
      `Deseja inativar o funcionário ${funcionario.usuario.nome} (#${funcionario.idUsuario})?`
    );

    if (!confirmado) {
      return;
    }

    this.mensagemAcao = '';
    this.erroAcao = '';
    this.inativandoId = funcionario.idUsuario;

    this.funcionarioService.inativarFuncionario(funcionario.idUsuario).subscribe({
      next: () => {
        // Atualiza só a linha, sem recarregar a lista inteira (a listagem do backend é lenta)
        funcionario.usuario.status = 'INATIVO';
        this.mensagemAcao = `Funcionário ${funcionario.usuario.nome} inativado com sucesso.`;
        this.inativandoId = null;
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao inativar funcionário:', erro);
        this.erroAcao = `Não foi possível inativar o funcionário ${funcionario.usuario.nome} (erro ${erro?.status ?? '?'}).`;
        this.inativandoId = null;
        this.cdr.markForCheck();
      }
    });
  }
}
