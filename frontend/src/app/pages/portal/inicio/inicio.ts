
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type * as Leaflet from 'leaflet';
import { AuthService } from '../../../services/auth.service';
import { AreaService, AreaPermitida } from '../../../services/area.service';
import { PontoService, RegistroPonto } from '../../../services/ponto.service';

// Mesmo raio usado pelo backend para considerar o ponto "dentro da área"
const DISTANCIA_MAXIMA_METROS = 200;

// Largura mínima da tela para mostrar o mapa (abaixo disso, só o formulário)
const MEDIA_COM_MAPA = '(min-width: 900px)';

// Centro do Brasil, usado enquanto a localização do usuário não chega
const CENTRO_PADRAO: [number, number] = [-15.78, -47.93];

interface AreaComDistancia {
  area: AreaPermitida;
  distancia: number;
}

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio implements OnInit, OnDestroy {

  // Usuário logado
  idFuncionario: number | null = null;
  nomeUsuario: string = '';

  // Formulário
  tipo: string = 'ENTRADA';
  readonly tipos = [
    { valor: 'ENTRADA', rotulo: 'Entrada' },
    { valor: 'INICIO_INTERVALO', rotulo: 'Início do intervalo' },
    { valor: 'FIM_INTERVALO', rotulo: 'Fim do intervalo' },
    { valor: 'SAIDA', rotulo: 'Saída' }
  ];

  agora: Date = new Date();
  dataPorExtenso: string = '';

  readonly raioArea = DISTANCIA_MAXIMA_METROS;

  // Localização do usuário
  latitude: number | null = null;
  longitude: number | null = null;
  precisao: number | null = null;
  erroLocalizacao: string = '';

  // Áreas permitidas (só as ativas contam para o registro)
  areas: AreaPermitida[] = [];
  areaMaisProxima: AreaComDistancia | null = null;

  // Envio
  enviando: boolean = false;
  erro: string = '';
  ultimoRegistro: RegistroPonto | null = null;

  // Mapa
  mostrarMapa: boolean = false;

  private ehNavegador: boolean;
  private relogio?: ReturnType<typeof setInterval>;
  private idWatchGeolocalizacao: number | null = null;
  private media?: MediaQueryList;
  private aoMudarTamanhoTela = (e: MediaQueryListEvent) => this.definirMostrarMapa(e.matches);

  private L?: typeof Leaflet;
  private mapa?: Leaflet.Map;
  private camadaAreas?: Leaflet.LayerGroup;
  private marcadorUsuario?: Leaflet.CircleMarker;
  private circuloPrecisao?: Leaflet.Circle;
  private marcadorRegistro?: Leaflet.CircleMarker;
  private jaCentralizou = false;
  private elementoMapa?: HTMLElement;

  // O contêiner do mapa só existe quando a tela é larga o suficiente
  @ViewChild('mapaContainer')
  set mapaContainer(ref: ElementRef<HTMLElement> | undefined) {
    if (ref && ref.nativeElement !== this.elementoMapa) {
      this.elementoMapa = ref.nativeElement;
      this.iniciarMapa(ref.nativeElement);
    } else if (!ref && this.mapa) {
      this.removerMapa();
    }
  }

  constructor(
    private authService: AuthService,
    private areaService: AreaService,
    private pontoService: PontoService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.ehNavegador = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.ehNavegador) {
      return;
    }

    // Relógio do formulário (o horário enviado é o do momento do clique)
    this.atualizarRelogio();
    this.relogio = setInterval(() => {
      this.atualizarRelogio();
      this.cdr.markForCheck();
    }, 1000);

    this.media = window.matchMedia(MEDIA_COM_MAPA);
    this.definirMostrarMapa(this.media.matches);
    this.media.addEventListener('change', this.aoMudarTamanhoTela);

    this.carregarUsuario();
    this.carregarAreas();
    this.acompanharLocalizacao();
  }

  ngOnDestroy(): void {
    if (this.relogio) {
      clearInterval(this.relogio);
    }

    if (this.idWatchGeolocalizacao != null) {
      navigator.geolocation.clearWatch(this.idWatchGeolocalizacao);
    }

    this.media?.removeEventListener('change', this.aoMudarTamanhoTela);
    this.removerMapa();
  }

  private atualizarRelogio(): void {
    this.agora = new Date();
    // Ex.: "sexta-feira, 20/11/2026" (o app não registra o locale pt-BR do Angular)
    this.dataPorExtenso = this.agora.toLocaleDateString('pt-BR', {
      weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
    });
  }

  get localizacaoPronta(): boolean {
    return this.latitude != null && this.longitude != null;
  }

  get dentroDaArea(): boolean {
    return !!this.areaMaisProxima && this.areaMaisProxima.distancia <= DISTANCIA_MAXIMA_METROS;
  }

  get rotuloTipoRegistrado(): string {
    return this.tipos.find((t) => t.valor === this.ultimoRegistro?.tipo)?.rotulo
      ?? this.ultimoRegistro?.tipo ?? '';
  }

  // ---------- Dados ----------

  private carregarUsuario(): void {
    this.authService.obterUsuarioLogado().subscribe({
      next: (usuario) => {
        this.idFuncionario = usuario?.idUsuario ?? null;
        this.nomeUsuario = usuario?.nome ?? '';
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao buscar usuário logado:', erro);
        this.erro = 'Não foi possível identificar o usuário logado.';
        this.cdr.markForCheck();
      }
    });
  }

  private carregarAreas(): void {
    this.areaService.listarAreas().subscribe({
      next: (areas) => {
        this.areas = areas.filter(
          (a) => a.status === 'ATIVA' && a.latitude != null && a.longitude != null
        );
        this.atualizarAreaMaisProxima();
        this.desenharAreas();
        this.cdr.markForCheck();
      },
      error: (erro) => {
        // Sem as áreas o registro ainda funciona; só não dá para mostrá-las
        console.error('Erro ao buscar áreas permitidas:', erro);
      }
    });
  }

  private acompanharLocalizacao(): void {
    if (!navigator.geolocation) {
      this.erroLocalizacao = 'Seu navegador não permite obter a localização.';
      return;
    }

    this.idWatchGeolocalizacao = navigator.geolocation.watchPosition(
      (posicao) => {
        this.latitude = posicao.coords.latitude;
        this.longitude = posicao.coords.longitude;
        this.precisao = posicao.coords.accuracy;
        this.erroLocalizacao = '';
        this.atualizarAreaMaisProxima();
        this.atualizarMarcadorUsuario();
        this.cdr.markForCheck();
      },
      (erro) => {
        console.error('Erro ao obter localização:', erro);
        this.erroLocalizacao = erro.code === erro.PERMISSION_DENIED
          ? 'Permita o acesso à localização no navegador para marcar o ponto.'
          : 'Não foi possível obter sua localização. Tente novamente.';
        this.cdr.markForCheck();
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
    );
  }

  private atualizarAreaMaisProxima(): void {
    if (!this.localizacaoPronta || this.areas.length === 0) {
      this.areaMaisProxima = null;
      return;
    }

    this.areaMaisProxima = this.areas
      .map((area) => ({
        area,
        distancia: distanciaEmMetros(this.latitude!, this.longitude!, area.latitude, area.longitude)
      }))
      .reduce((maisProxima, atual) => (atual.distancia < maisProxima.distancia ? atual : maisProxima));
  }

  // ---------- Registro ----------

  marcarPonto(): void {

    this.erro = '';
    this.ultimoRegistro = null;

    if (!this.idFuncionario) {
      this.erro = 'Não foi possível identificar o usuário logado.';
      return;
    }

    if (!this.localizacaoPronta) {
      this.erro = 'Aguarde a sua localização para marcar o ponto.';
      return;
    }

    this.enviando = true;

    this.pontoService.registrarPonto({
      idFuncionario: this.idFuncionario,
      dataHora: dataHoraLocal(new Date()),
      tipo: this.tipo,
      latitude: this.latitude!,
      longitude: this.longitude!
    }).subscribe({
      next: (registro) => {
        this.ultimoRegistro = registro;
        this.enviando = false;
        this.marcarRegistroNoMapa(registro);
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao registrar ponto:', erro);
        this.erro = `Não foi possível registrar o ponto (erro ${erro?.status ?? '?'}).`;
        this.enviando = false;
        this.cdr.markForCheck();
      }
    });
  }

  // ---------- Mapa ----------

  private definirMostrarMapa(mostrar: boolean): void {
    if (this.mostrarMapa !== mostrar) {
      this.mostrarMapa = mostrar;
      this.cdr.markForCheck();
    }
  }

  centralizarNoUsuario(): void {
    if (this.mapa && this.localizacaoPronta) {
      this.mapa.setView([this.latitude!, this.longitude!], 17);
    }
  }

  private async iniciarMapa(elemento: HTMLElement): Promise<void> {
    if (!this.ehNavegador) {
      return;
    }

    // Import dinâmico: o Leaflet usa "window" e não pode rodar no servidor (SSR)
    // (o Leaflet é CommonJS: dependendo do bundler, o objeto vem em "default")
    if (!this.L) {
      const modulo: any = await import('leaflet');
      this.L = (modulo.default ?? modulo) as typeof Leaflet;
    }

    // A tela pode ter diminuído enquanto o Leaflet carregava
    if (this.elementoMapa !== elemento) {
      return;
    }

    this.removerMapa();
    this.jaCentralizou = false;

    const L = this.L;
    const centro: [number, number] = this.localizacaoPronta
      ? [this.latitude!, this.longitude!]
      : CENTRO_PADRAO;

    this.mapa = L.map(elemento, { zoomControl: true }).setView(centro, this.localizacaoPronta ? 17 : 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; colaboradores do <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.mapa);

    this.camadaAreas = L.layerGroup().addTo(this.mapa);

    this.desenharAreas();
    this.atualizarMarcadorUsuario();

    if (this.ultimoRegistro) {
      this.marcarRegistroNoMapa(this.ultimoRegistro);
    }

    // O contêiner pode ter mudado de tamanho depois de criado
    setTimeout(() => this.mapa?.invalidateSize(), 0);
  }

  private removerMapa(): void {
    this.mapa?.remove();
    this.mapa = undefined;
    this.camadaAreas = undefined;
    this.marcadorUsuario = undefined;
    this.circuloPrecisao = undefined;
    this.marcadorRegistro = undefined;
  }

  private desenharAreas(): void {
    if (!this.L || !this.camadaAreas) {
      return;
    }

    const L = this.L;
    this.camadaAreas.clearLayers();

    for (const area of this.areas) {
      // Raio em que o ponto conta como "dentro da área"
      L.circle([area.latitude, area.longitude], {
        radius: DISTANCIA_MAXIMA_METROS,
        color: '#2E7D32',
        weight: 2,
        fillColor: '#2E7D32',
        fillOpacity: 0.12
      }).addTo(this.camadaAreas);

      L.circleMarker([area.latitude, area.longitude], {
        radius: 7,
        color: '#FFFFFF',
        weight: 2,
        fillColor: '#2E7D32',
        fillOpacity: 1
      })
        .bindTooltip(area.nome, { direction: 'top', offset: [0, -6] })
        .addTo(this.camadaAreas);
    }
  }

  private atualizarMarcadorUsuario(): void {
    if (!this.L || !this.mapa || !this.localizacaoPronta) {
      return;
    }

    const L = this.L;
    const posicao: [number, number] = [this.latitude!, this.longitude!];

    if (!this.marcadorUsuario) {
      this.circuloPrecisao = L.circle(posicao, {
        radius: this.precisao ?? 0,
        color: '#0066FF',
        weight: 1,
        fillColor: '#0066FF',
        fillOpacity: 0.1
      }).addTo(this.mapa);

      this.marcadorUsuario = L.circleMarker(posicao, {
        radius: 9,
        color: '#FFFFFF',
        weight: 3,
        fillColor: '#0066FF',
        fillOpacity: 1
      })
        .bindTooltip('Você está aqui', { direction: 'top', offset: [0, -8] })
        .addTo(this.mapa);
    } else {
      this.marcadorUsuario.setLatLng(posicao);
      this.circuloPrecisao?.setLatLng(posicao).setRadius(this.precisao ?? 0);
    }

    // Centraliza no usuário só na primeira localização, para não "puxar" o mapa
    // enquanto a pessoa está navegando por ele
    if (!this.jaCentralizou) {
      this.mapa.setView(posicao, 17);
      this.jaCentralizou = true;
    }
  }

  private marcarRegistroNoMapa(registro: RegistroPonto): void {
    if (!this.L || !this.mapa || registro?.latitude == null || registro?.longitude == null) {
      return;
    }

    this.marcadorRegistro?.remove();

    this.marcadorRegistro = this.L.circleMarker([registro.latitude, registro.longitude], {
      radius: 6,
      color: '#FFFFFF',
      weight: 2,
      fillColor: registro.dentroArea ? '#2E7D32' : '#D32F2F',
      fillOpacity: 1
    })
      .bindTooltip('Ponto registrado', { direction: 'top', offset: [0, -6] })
      .addTo(this.mapa);
  }
}

/** Distância em metros entre duas coordenadas (fórmula de Haversine). */
function distanciaEmMetros(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const raioTerra = 6371000;
  const rad = (graus: number) => (graus * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * raioTerra * Math.asin(Math.sqrt(a));
}

/** Data/hora local no formato do LocalDateTime do backend: 2026-11-20T14:05:30 */
function dataHoraLocal(data: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${data.getFullYear()}-${p(data.getMonth() + 1)}-${p(data.getDate())}`
    + `T${p(data.getHours())}:${p(data.getMinutes())}:${p(data.getSeconds())}`;
}
