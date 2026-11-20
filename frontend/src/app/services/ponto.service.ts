
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  private apiUrl = 'http://localhost:8080/sistemaponto/pontos';

  constructor(private http: HttpClient) {}

  meusPontos(): Observable<RegistroPonto[]> {
    return this.http.get<RegistroPonto[]>(
      `${this.apiUrl}/meus-pontos`
    );
  }
}
