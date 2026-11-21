
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AreaService, AreaPermitida } from '../../../../services/area.service';

@Component({
  selector: 'app-listar-areas',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './listar-areas.html',
  styleUrl: './listar-areas.css'
})
export class ListarAreas implements OnInit, OnDestroy {

  areas: AreaPermitida[] = [];
  carregando: boolean = true;
  erro: string = '';

  // Filtro por ID da área (vazio = todas)
  idArea: number | null = null;

  // Inativação (mensagens separadas do erro da lista para não esconder a tabela)
  inativandoId: number | null = null;
  mensagemAcao: string = '';
  erroAcao: string = '';

  // Requisição em andamento: é cancelada quando uma nova busca começa,
  // para que uma resposta antiga não sobrescreva o resultado da busca
  private requisicaoAtual?: Subscription;

  constructor(
    private areaService: AreaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarAreas();
  }

  ngOnDestroy(): void {
    this.requisicaoAtual?.unsubscribe();
  }

  carregarAreas(): void {
    this.requisicaoAtual?.unsubscribe();

    this.carregando = true;
    this.erro = '';
    this.mensagemAcao = '';
    this.erroAcao = '';

    const idArea = this.idArea;

    // Busca por ID: retorna uma única área (lista com 0 ou 1 item)
    if (idArea) {
      this.requisicaoAtual = this.areaService.buscarPorId(idArea).subscribe({
        next: (area) => {
          this.areas = area ? [area] : [];
          this.carregando = false;
          this.cdr.markForCheck();
        },
        error: (erro) => {
          // O backend responde com erro quando a área não existe:
          // mostra a mensagem de "nenhuma área encontrada"
          console.error('Erro ao buscar área:', erro);
          this.areas = [];
          this.carregando = false;
          this.cdr.markForCheck();
        }
      });
      return;
    }

    this.requisicaoAtual = this.areaService.listarAreas().subscribe({
      next: (dados) => {
        this.areas = dados;
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao buscar áreas:', erro);
        this.erro = 'Não foi possível carregar as áreas permitidas.';
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }

  limparFiltro(): void {
    this.idArea = null;
    this.carregarAreas();
  }

  inativar(area: AreaPermitida): void {

    const confirmado = confirm(
      `Deseja inativar a área ${area.nome} (#${area.id})? Os funcionários não poderão mais registrar ponto nela.`
    );

    if (!confirmado) {
      return;
    }

    this.mensagemAcao = '';
    this.erroAcao = '';
    this.inativandoId = area.id;

    this.areaService.inativarArea(area.id).subscribe({
      next: () => {
        // Atualiza só a linha, sem recarregar a lista inteira
        area.status = 'INATIVA';
        this.mensagemAcao = `Área ${area.nome} inativada com sucesso.`;
        this.inativandoId = null;
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao inativar área:', erro);
        this.erroAcao = `Não foi possível inativar a área ${area.nome} (erro ${erro?.status ?? '?'}).`;
        this.inativandoId = null;
        this.cdr.markForCheck();
      }
    });
  }

  linkMapa(area: AreaPermitida): string {
    return `https://www.google.com/maps?q=${area.latitude},${area.longitude}`;
  }
}
