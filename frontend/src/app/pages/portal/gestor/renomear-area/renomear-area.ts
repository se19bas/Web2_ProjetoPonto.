
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AreaService, AreaPermitida } from '../../../../services/area.service';

@Component({
  selector: 'app-renomear-area',
  imports: [CommonModule, FormsModule],
  templateUrl: './renomear-area.html',
  styleUrl: './renomear-area.css'
})
export class RenomearArea implements OnInit {

  // Busca
  idBusca: number | null = null;
  buscando: boolean = false;
  erroBusca: string = '';

  // Área carregada (null = nenhuma selecionada)
  area: AreaPermitida | null = null;

  novoNome: string = '';

  salvando: boolean = false;
  mensagemSucesso: string = '';
  erro: string = '';

  constructor(
    private areaService: AreaService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Permite abrir já com uma área: /portal/gestor/renomear-area?id=3
    const id = Number(this.route.snapshot.queryParamMap.get('id'));

    if (id) {
      this.idBusca = id;
      this.buscarArea();
    }
  }

  buscarArea(): void {

    this.erroBusca = '';
    this.mensagemSucesso = '';
    this.erro = '';

    if (!this.idBusca) {
      this.erroBusca = 'Informe o ID da área.';
      return;
    }

    this.buscando = true;
    this.area = null;

    this.areaService.buscarPorId(this.idBusca).subscribe({
      next: (dados) => {
        this.area = dados;
        this.novoNome = dados.nome;
        this.buscando = false;
        this.cdr.markForCheck();
      },
      error: (erro) => {
        // O backend responde com erro quando a área não existe
        console.error('Erro ao buscar área:', erro);
        this.erroBusca = 'Área não encontrada.';
        this.buscando = false;
        this.cdr.markForCheck();
      }
    });
  }

  salvar(): void {

    if (!this.area) {
      return;
    }

    this.mensagemSucesso = '';
    this.erro = '';

    const nome = this.novoNome.trim();

    if (!nome) {
      this.erro = 'Informe o novo nome da área.';
      return;
    }

    if (nome === this.area.nome) {
      this.erro = 'O novo nome é igual ao atual.';
      return;
    }

    this.salvando = true;

    this.areaService.renomearArea(this.area.id, nome).subscribe({
      next: (atualizada) => {
        const nomeAnterior = this.area?.nome;
        this.area = atualizada ?? { ...this.area!, nome };
        this.novoNome = this.area.nome;
        this.mensagemSucesso = `Área "${nomeAnterior}" renomeada para "${this.area.nome}".`;
        this.salvando = false;
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao renomear área:', erro);
        this.erro = `Não foi possível renomear a área (erro ${erro?.status ?? '?'}).`;
        this.salvando = false;
        this.cdr.markForCheck();
      }
    });
  }

  cancelar(): void {
    this.area = null;
    this.mensagemSucesso = '';
    this.erro = '';
  }
}
