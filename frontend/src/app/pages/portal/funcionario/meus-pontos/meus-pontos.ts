import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PontoService, RegistroPonto } from '../../../../services/ponto.service';

@Component({
  selector: 'app-meus-pontos',
  imports: [CommonModule],
  templateUrl: './meus-pontos.html',
  styleUrl: './meus-pontos.css'
})
export class MeusPontos implements OnInit {

  registros: RegistroPonto[] = [];
  carregando: boolean = true;
  erro: string = '';

  constructor(
    private pontoService: PontoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarPontos();
  }

  carregarPontos(): void {
    this.pontoService.meusPontos().subscribe({
      next: (dados) => {
        this.registros = dados;
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao buscar registros de ponto:', erro);
        this.erro = 'Não foi possível carregar seus registros de ponto.';
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }
}
