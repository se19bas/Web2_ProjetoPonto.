
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AvisoService, Aviso } from '../../../../services/aviso.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-avisos-gestor',
  imports: [CommonModule, FormsModule],
  templateUrl: './avisos-gestor.html',
  styleUrl: './avisos-gestor.css'
})
export class AvisosGestor implements OnInit, OnDestroy {

  avisos: Aviso[] = [];
  carregando: boolean = true;
  erro: string = '';

  // Filtros
  idGestor: number | null = null;   // começa com o ID do gestor logado
  idAviso: number | null = null;    // quando preenchido, busca só este aviso
  somenteNaoLidos: boolean = false;

  // Descrição da última busca, usada no título
  tituloLista: string = 'Avisos';

  // ID do usuário logado (no backend, o ID do gestor é o mesmo do usuário)
  private idUsuarioLogado: number | null = null;

  // Marcar como lido (mensagens separadas do erro da lista para não esconder os avisos)
  marcandoId: number | null = null;
  mensagemAcao: string = '';
  erroAcao: string = '';

  // Requisição em andamento: é cancelada quando uma nova busca começa
  private requisicaoAtual?: Subscription;

  constructor(
    private avisoService: AvisoService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Começa mostrando os avisos do gestor logado
    this.authService.obterUsuarioLogado().subscribe({
      next: (usuario) => {
        this.idUsuarioLogado = usuario?.idUsuario ?? null;
        this.idGestor = this.idUsuarioLogado;
        this.carregarAvisos();
      },
      error: (erro) => {
        console.error('Erro ao buscar usuário logado:', erro);
        this.carregando = false;
        this.erro = 'Não foi possível identificar o gestor logado. Informe o ID do gestor.';
        this.cdr.markForCheck();
      }
    });
  }

  ngOnDestroy(): void {
    this.requisicaoAtual?.unsubscribe();
  }

  // Lista filtrada guardada em cache: o getter devolve o mesmo array enquanto nada mudar,
  // evitando recriar a lista (e o erro NG0100 do modo dev) a cada detecção de mudanças
  private cacheVisiveis: Aviso[] = [];
  private cacheOrigem: Aviso[] | null = null;
  private cacheSomenteNaoLidos: boolean | null = null;
  private cacheVersao = -1;
  private versaoStatus = 0; // incrementada quando um aviso muda de status

  get avisosVisiveis(): Aviso[] {
    if (this.cacheOrigem !== this.avisos
        || this.cacheSomenteNaoLidos !== this.somenteNaoLidos
        || this.cacheVersao !== this.versaoStatus) {
      this.cacheOrigem = this.avisos;
      this.cacheSomenteNaoLidos = this.somenteNaoLidos;
      this.cacheVersao = this.versaoStatus;
      this.cacheVisiveis = this.somenteNaoLidos
        ? this.avisos.filter((a) => a.status !== 'LIDO')
        : this.avisos;
    }

    return this.cacheVisiveis;
  }

  // Só o gestor dono do aviso pode marcá-lo como lido
  podeMarcarComoLido(aviso: Aviso): boolean {
    return aviso.status !== 'LIDO'
      && this.idUsuarioLogado != null
      && aviso.idGestor === this.idUsuarioLogado;
  }

  get totalNaoLidos(): number {
    return this.avisos.filter((a) => a.status !== 'LIDO').length;
  }

  carregarAvisos(): void {
    this.requisicaoAtual?.unsubscribe();

    this.erro = '';
    this.mensagemAcao = '';
    this.erroAcao = '';

    const idAviso = this.idAviso;
    const idGestor = this.idGestor;

    // O backend não tem listagem geral: é preciso informar o gestor ou o aviso
    if (!idAviso && !idGestor) {
      this.avisos = [];
      this.carregando = false;
      this.erro = 'Informe o ID do gestor ou o ID do aviso.';
      return;
    }

    this.carregando = true;

    // Busca por ID do aviso: retorna um único aviso (lista com 0 ou 1 item)
    if (idAviso) {
      this.requisicaoAtual = this.avisoService.buscarPorId(idAviso).subscribe({
        next: (aviso) => {
          this.avisos = aviso ? [aviso] : [];
          this.tituloLista = `Aviso #${idAviso}`;
          this.carregando = false;
          this.cdr.markForCheck();
        },
        error: (erro) => {
          // O backend responde com erro quando o aviso não existe
          console.error('Erro ao buscar aviso:', erro);
          this.avisos = [];
          this.tituloLista = `Aviso #${idAviso}`;
          this.carregando = false;
          this.cdr.markForCheck();
        }
      });
      return;
    }

    this.requisicaoAtual = this.avisoService.listarPorGestor(idGestor!).subscribe({
      next: (dados) => {
        // Não lidos primeiro; dentro de cada grupo, os mais recentes (maior ID) primeiro
        this.avisos = [...dados].sort((a, b) => {
          const lidoA = a.status === 'LIDO' ? 1 : 0;
          const lidoB = b.status === 'LIDO' ? 1 : 0;
          return lidoA - lidoB || b.idAviso - a.idAviso;
        });
        this.tituloLista = idGestor === this.idUsuarioLogado
          ? 'Meus Avisos'
          : `Avisos do Gestor #${idGestor}`;
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao buscar avisos:', erro);
        this.erro = 'Não foi possível carregar os avisos.';
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }

  limparFiltro(): void {
    this.idAviso = null;
    this.idGestor = this.idUsuarioLogado;
    this.somenteNaoLidos = false;
    this.carregarAvisos();
  }

  marcarComoLido(aviso: Aviso): void {

    this.mensagemAcao = '';
    this.erroAcao = '';
    this.marcandoId = aviso.idAviso;

    this.avisoService.marcarComoLido(aviso.idAviso).subscribe({
      next: () => {
        // Atualiza só o card, sem recarregar a lista
        aviso.status = 'LIDO';
        this.versaoStatus++;
        this.mensagemAcao = `Aviso #${aviso.idAviso} marcado como lido.`;
        this.marcandoId = null;
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao marcar aviso como lido:', erro);
        this.erroAcao = `Não foi possível marcar o aviso #${aviso.idAviso} como lido (erro ${erro?.status ?? '?'}).`;
        this.marcandoId = null;
        this.cdr.markForCheck();
      }
    });
  }
}
