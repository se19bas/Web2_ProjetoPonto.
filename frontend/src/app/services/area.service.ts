
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AreaPermitida {
  id: number;
  nome: string;
  status: string; // ATIVA | INATIVA
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  private apiUrl = `${environment.apiUrl}/sistemaponto/areas`;

  constructor(private http: HttpClient) {}

  listarAreas(): Observable<AreaPermitida[]> {
    return this.http.get<AreaPermitida[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<AreaPermitida> {
    return this.http.get<AreaPermitida>(`${this.apiUrl}/${id}`);
  }

  // O backend define o status como ATIVA ao cadastrar
  cadastrarArea(dados: { nome: string; latitude: number; longitude: number }): Observable<AreaPermitida> {
    return this.http.post<AreaPermitida>(this.apiUrl, dados);
  }

  // O backend só altera o nome
  renomearArea(id: number, nome: string): Observable<AreaPermitida> {
    return this.http.put<AreaPermitida>(`${this.apiUrl}/${id}`, { nome });
  }

  // O backend não apaga: apenas muda o status para INATIVA
  inativarArea(id: number): Observable<AreaPermitida> {
    return this.http.delete<AreaPermitida>(`${this.apiUrl}/${id}`);
  }
}
