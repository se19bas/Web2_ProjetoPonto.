
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}
