import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { AuthInterceptor } from './auth.interceptor';
import { TokenService } from '../services/token.service';

// JWT de teste (sem assinatura válida: o front só lê o "exp")
function jwt(expEmSegundosAPartirDeAgora: number): string {
  const b64 = (obj: object) => btoa(JSON.stringify(obj)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  const exp = Math.floor(Date.now() / 1000) + expEmSegundosAPartirDeAgora;
  return `${b64({ alg: 'HS256' })}.${b64({ sub: 'teste@ponto.com', exp })}.assinatura`;
}

describe('AuthInterceptor (refresh token)', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let tokens: TokenService;
  let router: Router;

  const URL_API = '/sistemaponto/funcionarios';
  const URL_REFRESH = '/api/auth/refresh';

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
      ]
    });

    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
    tokens = TestBed.inject(TokenService);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => backend.verify());

  it('envia o token válido sem chamar o refresh', () => {
    const valido = jwt(600);
    tokens.salvarTokens(valido, 'refresh-1');

    http.get(URL_API).subscribe();

    const req = backend.expectOne((r) => r.url.endsWith(URL_API));
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${valido}`);
    req.flush([]);
  });

  it('renova ANTES de enviar quando o token já expirou', () => {
    tokens.salvarTokens(jwt(-60), 'refresh-1');
    const novo = jwt(600);

    let resposta: unknown;
    http.get(URL_API).subscribe((r) => (resposta = r));

    const refresh = backend.expectOne((r) => r.url.endsWith(URL_REFRESH));
    expect(refresh.request.body).toEqual({ refreshToken: 'refresh-1' });
    expect(refresh.request.headers.has('Authorization')).toBe(false);
    refresh.flush({ token: novo, refreshToken: 'refresh-1' });

    const req = backend.expectOne((r) => r.url.endsWith(URL_API));
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${novo}`);
    req.flush(['ok']);

    expect(resposta).toEqual(['ok']);
    expect(tokens.obterToken()).toBe(novo);
  });

  it('403 com token válido é falta de permissão: não renova e repassa o erro', () => {
    tokens.salvarTokens(jwt(600), 'refresh-1');

    let status = 0;
    http.get('/sistemaponto/gestores/hierarquia').subscribe({ error: (e) => (status = e.status) });

    backend.expectOne((r) => r.url.endsWith('/hierarquia')).flush(null, { status: 403, statusText: 'Forbidden' });
    backend.expectNone((r) => r.url.endsWith(URL_REFRESH));

    expect(status).toBe(403);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('se o refresh falhar, limpa a sessão e vai para o login', () => {
    tokens.salvarTokens(jwt(-60), 'refresh-vencido');

    let status = 0;
    http.get(URL_API).subscribe({ error: (e) => (status = e.status) });

    backend.expectOne((r) => r.url.endsWith(URL_REFRESH)).flush(null, { status: 401, statusText: 'Unauthorized' });
    backend.expectNone((r) => r.url.endsWith(URL_API));

    expect(status).toBe(401);
    expect(tokens.obterToken()).toBeNull();
    expect(tokens.obterRefreshToken()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('várias requisições com token expirado fazem um único refresh', () => {
    tokens.salvarTokens(jwt(-60), 'refresh-1');
    const novo = jwt(600);

    http.get(URL_API).subscribe();
    http.get('/sistemaponto/areas').subscribe();
    http.get('/sistemaponto/pontos').subscribe();

    const refreshes = backend.match((r) => r.url.endsWith(URL_REFRESH));
    expect(refreshes.length).toBe(1);
    refreshes[0].flush({ token: novo, refreshToken: 'refresh-1' });

    const reqs = backend.match((r) => !r.url.endsWith(URL_REFRESH));
    expect(reqs.length).toBe(3);
    reqs.forEach((r) => {
      expect(r.request.headers.get('Authorization')).toBe(`Bearer ${novo}`);
      r.flush([]);
    });
  });

  it('token que expira no caminho: recebe 403, renova e repete uma vez', () => {
    // Caso reativo: o token era válido ao enviar, mas venceu antes da resposta chegar
    tokens.salvarTokens(jwt(600), 'refresh-1');
    const novo = jwt(600);

    let resposta: unknown;
    http.get(URL_API).subscribe((r) => (resposta = r));

    // Simula o token ter vencido enquanto a requisição estava no ar
    vi.spyOn(tokens, 'tokenExpirado').mockReturnValue(true);

    backend.expectOne((r) => r.url.endsWith(URL_API)).flush(null, { status: 403, statusText: 'Forbidden' });
    backend.expectOne((r) => r.url.endsWith(URL_REFRESH)).flush({ token: novo, refreshToken: 'refresh-1' });

    const repetida = backend.expectOne((r) => r.url.endsWith(URL_API));
    expect(repetida.request.headers.get('Authorization')).toBe(`Bearer ${novo}`);
    repetida.flush(['ok']);

    expect(resposta).toEqual(['ok']);
  });

  it('não intercepta o login', () => {
    tokens.salvarTokens(jwt(-60), 'refresh-1');

    http.post('/api/auth/login', {}).subscribe();

    const req = backend.expectOne((r) => r.url.endsWith('/api/auth/login'));
    expect(req.request.headers.has('Authorization')).toBe(false);
    backend.expectNone((r) => r.url.endsWith(URL_REFRESH));
    req.flush({});
  });
});
