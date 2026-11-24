
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { PontoService, RegistroPonto } from '../../../../services/ponto.service';

@Component({
  selector: 'app-registros-pontos',
  imports: [CommonModule, FormsModule],
  templateUrl: './registros-pontos.html',
  styleUrl: './registros-pontos.css'
})
export class RegistrosPontos implements OnInit, OnDestroy {

  registros: RegistroPonto[] = [];
  carregando: boolean = true;
  erro: string = '';

  // Filtros (ambos vazios = todos os registros)
  idRegistro: number | null = null;
  idFuncionario: number | null = null;

  // Resultado da última busca, usado no título e nas colunas da tabela
  tituloLista: string = 'Histórico Geral de Pontos';
  filtradoPorFuncionario: boolean = false;
  filtroAtivo: boolean = false;

  // Requisição em andamento: é cancelada quando uma nova busca começa, para que
  // uma resposta antiga (ex.: a listagem geral, mais lenta) não sobrescreva o resultado do filtro
  private requisicaoAtual?: Subscription;

  constructor(
    private pontoService: PontoService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Permite abrir já filtrado pelo funcionário: /portal/gestor/registros-pontos?id=5
    const id = Number(this.route.snapshot.queryParamMap.get('id'));

    if (id) {
      this.idFuncionario = id;
    }

    this.carregarRegistros();
  }

  ngOnDestroy(): void {
    this.requisicaoAtual?.unsubscribe();
  }

  carregarRegistros(): void {
    this.requisicaoAtual?.unsubscribe();

    this.carregando = true;
    this.erro = '';

    const idRegistro = this.idRegistro;
    const idFuncionario = this.idFuncionario;

    // Busca por ID do registro: retorna um único registro (lista com 0 ou 1 item)
    if (idRegistro) {
      this.requisicaoAtual = this.pontoService.buscarPorId(idRegistro).subscribe({
        next: (registro) => {
          // Se o funcionário também foi informado, só mostra se o registro for dele
          const pertenceAoFuncionario = !idFuncionario || registro?.idFuncionario === idFuncionario;

          this.registros = registro && pertenceAoFuncionario ? [registro] : [];
          this.finalizarBusca(`Registro de Ponto #${idRegistro}`, !!idFuncionario, true);
        },
        error: (erro) => {
          // O backend responde com erro quando o registro não existe:
          // mostra a mensagem de "nenhum registro encontrado"
          console.error('Erro ao buscar registro de ponto:', erro);
          this.registros = [];
          this.finalizarBusca(`Registro de Ponto #${idRegistro}`, !!idFuncionario, true);
        }
      });
      return;
    }

    const requisicao = idFuncionario
      ? this.pontoService.listarPorFuncionario(idFuncionario)
      : this.pontoService.listarTodos();

    this.requisicaoAtual = requisicao.subscribe({
      next: (dados) => {
        // Mais recentes primeiro
        this.registros = [...dados].sort(
          (a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
        );
        this.finalizarBusca(
          idFuncionario ? `Pontos do Funcionário #${idFuncionario}` : 'Histórico Geral de Pontos',
          !!idFuncionario,
          !!idFuncionario
        );
      },
      error: (erro) => {
        console.error('Erro ao buscar registros de ponto:', erro);
        this.erro = 'Não foi possível carregar os registros de ponto.';
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }

  limparFiltro(): void {
    this.idRegistro = null;
    this.idFuncionario = null;
    this.carregarRegistros();
  }

  private finalizarBusca(titulo: string, porFuncionario: boolean, filtroAtivo: boolean): void {
    this.tituloLista = titulo;
    this.filtradoPorFuncionario = porFuncionario;
    this.filtroAtivo = filtroAtivo;
    this.carregando = false;
    this.cdr.markForCheck();
  }
}
