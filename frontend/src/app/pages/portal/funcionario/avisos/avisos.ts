
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvisoService, Aviso } from '../../../../services/aviso.service';

@Component({
  selector: 'app-avisos',
  imports: [CommonModule],
  templateUrl: './avisos.html',
  styleUrl: './avisos.css'
})
export class Avisos implements OnInit {

  avisos: Aviso[] = [];
  carregando: boolean = true;
  erro: string = '';

  constructor(
    private avisoService: AvisoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarAvisos();
  }

  carregarAvisos(): void {
    this.avisoService.listarAvisos().subscribe({
      next: (dados) => {
        this.avisos = dados;
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao buscar avisos:', erro);
        this.erro = 'Não foi possível carregar seus avisos.';
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }
}
