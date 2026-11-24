
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RegistroPonto {
  idRegistroPonto: number;
  idFuncionario: number;
  idAreaPermitida: number;
  dataHora: string;
  tipo: string;
  distanciaArea: number;
  dentroArea: boolean;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class PontoService {

  private apiUrl = `${environment.apiUrl}/sistemaponto/pontos`;

  constructor(private http: HttpClient) {}

  meusPontos(): Observable<RegistroPonto[]> {
    return this.http.get<RegistroPonto[]>(
      `${this.apiUrl}/meus-pontos`
    );
  }

  // Registra um ponto. O backend calcula a área mais próxima, a distância
  // e se está dentro da área; devolve o registro completo
  registrarPonto(dados: {
    idFuncionario: number;
    dataHora: string;   // data/hora local, sem fuso (LocalDateTime no backend)
    tipo: string;       // ENTRADA | SAIDA | INICIO_INTERVALO | FIM_INTERVALO
    latitude: number;
    longitude: number;
  }): Observable<RegistroPonto> {
    return this.http.post<RegistroPonto>(
      `${environment.apiUrl}/sistemaponto/pontos`,
      dados
    );
  }

  // Consultas do gestor

  listarTodos(): Observable<RegistroPonto[]> {
    return this.http.get<RegistroPonto[]>(
      `${environment.apiUrl}/sistemaponto/pontos`
    );
  }

  buscarPorId(idRegistro: number): Observable<RegistroPonto> {
    return this.http.get<RegistroPonto>(
      `${environment.apiUrl}/sistemaponto/pontos/${idRegistro}`
    );
  }

  listarPorFuncionario(idFuncionario: number): Observable<RegistroPonto[]> {
    return this.http.get<RegistroPonto[]>(
      `${environment.apiUrl}/sistemaponto/funcionarios/${idFuncionario}/pontos`
    );
  }
}
