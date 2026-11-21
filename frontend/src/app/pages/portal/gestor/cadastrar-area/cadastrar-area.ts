
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AreaService } from '../../../../services/area.service';

@Component({
  selector: 'app-cadastrar-area',
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastrar-area.html',
  styleUrl: './cadastrar-area.css'
})
export class CadastrarArea {

  nome: string = '';
  latitude: number | null = null;
  longitude: number | null = null;

  carregando: boolean = false;
  obtendoLocalizacao: boolean = false;
  mensagemSucesso: string = '';
  erro: string = '';

  constructor(
    private areaService: AreaService,
    private cdr: ChangeDetectorRef
  ) {}

  // Preenche latitude/longitude com a localização atual do navegador
  usarMinhaLocalizacao(): void {

    this.erro = '';

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      this.erro = 'Seu navegador não permite obter a localização.';
      return;
    }

    this.obtendoLocalizacao = true;

    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        this.latitude = Number(posicao.coords.latitude.toFixed(6));
        this.longitude = Number(posicao.coords.longitude.toFixed(6));
        this.obtendoLocalizacao = false;
        this.cdr.markForCheck();
      },
      (erro) => {
        console.error('Erro ao obter localização:', erro);
        this.erro = 'Não foi possível obter sua localização. Verifique a permissão do navegador.';
        this.obtendoLocalizacao = false;
        this.cdr.markForCheck();
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  cadastrar(): void {

    this.mensagemSucesso = '';
    this.erro = '';

    if (!this.nome.trim() || this.latitude == null || this.longitude == null) {
      this.erro = 'Preencha todos os campos.';
      return;
    }

    if (this.latitude < -90 || this.latitude > 90) {
      this.erro = 'A latitude deve estar entre -90 e 90.';
      return;
    }

    if (this.longitude < -180 || this.longitude > 180) {
      this.erro = 'A longitude deve estar entre -180 e 180.';
      return;
    }

    this.carregando = true;

    this.areaService.cadastrarArea({
      nome: this.nome.trim(),
      latitude: this.latitude,
      longitude: this.longitude
    }).subscribe({
      next: (area) => {
        this.mensagemSucesso = `Área ${area?.nome ?? this.nome} cadastrada com sucesso`
          + (area?.id ? ` (ID #${area.id}).` : '.');
        this.nome = '';
        this.latitude = null;
        this.longitude = null;
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao cadastrar área:', erro);
        this.erro = `Não foi possível cadastrar a área (erro ${erro?.status ?? '?'}).`;
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }
}
