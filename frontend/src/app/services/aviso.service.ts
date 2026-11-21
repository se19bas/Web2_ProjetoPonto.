
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Aviso {
  idAviso: number;
  idRegistro: number;
  idGestor: number;
  mensagem: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AvisoService {

  private apiUrl = 'http://localhost:8080/sistemaponto/avisos/meus-avisos';

  constructor(private http: HttpClient) {}

  listarAvisos(): Observable<Aviso[]> {
    return this.http.get<Aviso[]>(this.apiUrl);
  }

  // Consultas do gestor (usam environment.apiUrl para funcionar também no Azure)

  buscarPorId(idAviso: number): Observable<Aviso> {
    return this.http.get<Aviso>(
      `${environment.apiUrl}/sistemaponto/avisos/${idAviso}`
    );
  }

  listarPorGestor(idGestor: number): Observable<Aviso[]> {
    return this.http.get<Aviso[]>(
      `${environment.apiUrl}/sistemaponto/avisos/${idGestor}/gestor`
    );
  }

  // Muda o status do aviso para LIDO
  marcarComoLido(idAviso: number): Observable<Aviso> {
    return this.http.put<Aviso>(
      `${environment.apiUrl}/sistemaponto/avisos/${idAviso}/ler`,
      {}
    );
  }
}
