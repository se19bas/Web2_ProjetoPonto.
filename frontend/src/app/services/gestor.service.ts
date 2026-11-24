
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FuncionarioHierarquia {
  idFuncionario: number;
  nome: string;
  cargo: string;
}

export interface HierarquiaGestor {
  idGestor: number;
  nomeGestor: string;
  setor: string;
  funcionarios: FuncionarioHierarquia[];
}

@Injectable({
  providedIn: 'root'
})
export class GestorService {

  private apiUrl = `${environment.apiUrl}/sistemaponto/gestores`;

  constructor(private http: HttpClient) {}

  // Transforma um funcionário em gestor do setor informado.
  // O backend não verifica se ele já é gestor: promover de novo dá erro
  promover(idFuncionario: number, setor: string): Observable<unknown> {
    return this.http.post(
      `${this.apiUrl}/promover/${idFuncionario}`,
      null,
      { params: { setor } }
    );
  }

  // Lista todos os gestores com seus funcionários (o backend exige perfil GESTOR)
  listarHierarquia(): Observable<HierarquiaGestor[]> {
    return this.http.get<HierarquiaGestor[]>(`${this.apiUrl}/hierarquia`);
  }
}
