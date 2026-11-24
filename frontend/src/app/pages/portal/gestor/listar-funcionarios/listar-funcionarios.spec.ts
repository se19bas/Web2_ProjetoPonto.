import { TestBed } from '@angular/core/testing';
import { HttpBackend, HttpEvent, HttpRequest, HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Observable, delay, of } from 'rxjs';
import { ListarFuncionarios } from './listar-funcionarios';

const func = (id: number, gestor: number | null = null) => ({
  idUsuario: id,
  cargo: 'Cargo ' + id,
  gestor: gestor ? { idUsuario: gestor } : null,
  usuario: { idUsuario: id, nome: 'Func ' + id, cpf: '12345678901', email: `f${id}@x.com`, status: 'ATIVO' }
});

// Backend falso assíncrono: a listagem geral é lenta (300 ms), as buscas filtradas são rápidas (50 ms)
class BackendFalso implements HttpBackend {
  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    if (/\/funcionarios\/\d+$/.test(req.url)) {
      return of(new HttpResponse({ status: 200, body: func(Number(req.url.split('/').pop())) })).pipe(delay(50));
    }
    if (/\/gestores\/\d+\/funcionarios$/.test(req.url)) {
      return of(new HttpResponse({ status: 200, body: [func(2, 1)] })).pipe(delay(50));
    }
    return of(new HttpResponse({ status: 200, body: [func(1), func(2, 1)] })).pipe(delay(300));
  }
}

const esperar = (ms: number) => new Promise(r => setTimeout(r, ms));
const texto = (el: HTMLElement) => el.textContent!.replace(/\s+/g, ' ');

function buscar(el: HTMLElement, campo: string, valor: string): void {
  const input = el.querySelector('#' + campo) as HTMLInputElement;
  input.value = valor;
  input.dispatchEvent(new Event('input'));
  (el.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
}

describe('ListarFuncionarios', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarFuncionarios],
      providers: [provideHttpClient(), { provide: HttpBackend, useClass: BackendFalso }, provideRouter([])]
    }).compileComponents();
  });

  it('renderiza a resposta da busca por ID sem precisar de outra interação', async () => {
    const fixture = TestBed.createComponent(ListarFuncionarios);
    const el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    await esperar(500);
    expect(texto(el)).toContain('Func 1');

    buscar(el, 'idFuncionario', '2');
    await esperar(200);

    expect(texto(el)).not.toContain('Carregando');
    expect(texto(el)).toContain('Func 2');
    expect(texto(el)).not.toContain('Func 1');
  });

  it('listagem geral lenta não sobrescreve a busca feita enquanto ela carregava', async () => {
    const fixture = TestBed.createComponent(ListarFuncionarios);
    const el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();

    // Busca antes da carga inicial (lenta, 300 ms) terminar.
    // A pequena espera é só para o ngModel terminar de se ligar ao campo.
    await esperar(20);
    buscar(el, 'idFuncionario', '2');
    await esperar(500);

    expect(texto(el)).not.toContain('Carregando');
    expect(texto(el)).toContain('Func 2');
    expect(texto(el)).not.toContain('Func 1');
  });
});
