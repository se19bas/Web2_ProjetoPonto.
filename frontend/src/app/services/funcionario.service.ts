
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Usuario {
  idUsuario: number;
  nome: string;
  cpf: string;
  email: string;
  status: string;
}

export interface Funcionario {
  idUsuario: number;
  usuario: Usuario;
  cargo: string;
  gestor?: { idUsuario: number } | null;
}

export interface AtualizarFuncionarioRequest {
  usuario: {
    nome: string;
    cpf: string;
    email: string;
    status: string;
  };
  cargo: string;
  // null remove o gestor do funcionário (o backend sobrescreve o valor atual)
  gestor: { idUsuario: number } | null;
}

export interface CadastroFuncionarioRequest {
  usuario: {
    nome: string;
    cpf: string;
    email: string;
    senha: string;
    status: string;
  };
  cargo: string;
  gestor?: { idUsuario: number };
}

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  private apiUrl = `${environment.apiUrl}/sistemaponto/funcionarios`;

  constructor(private http: HttpClient) {}

  listarFuncionarios(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.apiUrl);
  }

  cadastrarFuncionario(dados: CadastroFuncionarioRequest): Observable<Funcionario> {
    return this.http.post<Funcionario>(this.apiUrl, dados);
  }

  buscarPorId(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.apiUrl}/${id}`);
  }

  atualizarFuncionario(id: number, dados: AtualizarFuncionarioRequest): Observable<Funcionario> {
    return this.http.put<Funcionario>(`${this.apiUrl}/${id}`, dados);
  }

  // O backend não apaga: apenas muda o status do usuário para INATIVO
  inativarFuncionario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Vincula o funcionário a um gestor (o backend exige que o gestor exista)
  definirGestor(idFuncionario: number, idGestor: number): Observable<Funcionario> {
    return this.http.put<Funcionario>(
      `${this.apiUrl}/${idFuncionario}/gestor`,
      null,
      { params: { idGestor } }
    );
  }

  listarPorGestor(idGestor: number): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(
      `${environment.apiUrl}/sistemaponto/gestores/${idGestor}/funcionarios`
    );
  }
}
