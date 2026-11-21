
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then((m) => m.Login)
  },
  {
    path: 'portal',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/portal-layout/portal-layout').then(
        (m) => m.PortalLayout
      ),
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      },
      {
        path: 'inicio',
        loadComponent: () =>
          import('./pages/portal/inicio/inicio').then(
            (m) => m.Inicio
          )
      },
      {
        path: 'meu-perfil',
        loadComponent: () =>
          import('./pages/portal/meu-perfil/meu-perfil').then(
            (m) => m.MeuPerfil
          )
      },
      {
        path: 'funcionario',
        loadComponent: () =>
          import('./layouts/funcionario-layout/funcionario-layout').then(
            (m) => m.FuncionarioLayout
          ),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/portal/funcionario/funcionario').then(
                (m) => m.Funcionario
              )
          },
          {
            path: 'meus-pontos',
            loadComponent: () =>
              import('./pages/portal/funcionario/meus-pontos/meus-pontos').then(
                (m) => m.MeusPontos
              )
          },
          {
            path: 'avisos',
            loadComponent: () =>
              import('./pages/portal/funcionario/avisos/avisos').then(
                (m) => m.Avisos
              )
          }

        ]
      },
      {
        path: 'gestor',
        loadComponent: () =>
          import('./layouts/gestor-layout/gestor-layout').then(
            (m) => m.GestorLayout
          ),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/portal/gestor/gestor').then(
                (m) => m.Gestor
              )
          },
          {
            path: 'funcionarios',
            loadComponent: () =>
              import('./pages/portal/gestor/listar-funcionarios/listar-funcionarios').then(
                (m) => m.ListarFuncionarios
              )
          },
          {
            path: 'cadastrar-funcionario',
            loadComponent: () =>
              import('./pages/portal/gestor/cadastrar-funcionario/cadastrar-funcionario').then(
                (m) => m.CadastrarFuncionario
              )
          },
          {
            path: 'alterar-funcionario',
            loadComponent: () =>
              import('./pages/portal/gestor/alterar-funcionario/alterar-funcionario').then(
                (m) => m.AlterarFuncionario
              )
          },
          {
            path: 'registros-pontos',
            loadComponent: () =>
              import('./pages/portal/gestor/registros-pontos/registros-pontos').then(
                (m) => m.RegistrosPontos
              )
          },
          {
            path: 'areas',
            loadComponent: () =>
              import('./pages/portal/gestor/listar-areas/listar-areas').then(
                (m) => m.ListarAreas
              )
          },
          {
            path: 'cadastrar-area',
            loadComponent: () =>
              import('./pages/portal/gestor/cadastrar-area/cadastrar-area').then(
                (m) => m.CadastrarArea
              )
          },
          {
            path: 'renomear-area',
            loadComponent: () =>
              import('./pages/portal/gestor/renomear-area/renomear-area').then(
                (m) => m.RenomearArea
              )
          },
          {
            path: 'avisos',
            loadComponent: () =>
              import('./pages/portal/gestor/avisos-gestor/avisos-gestor').then(
                (m) => m.AvisosGestor
              )
          },
          {
            path: 'hierarquia',
            loadComponent: () =>
              import('./pages/portal/gestor/hierarquia/hierarquia').then(
                (m) => m.Hierarquia
              )
          }
        ]
      },
      {
        path: 'senha',
        loadComponent: () =>
          import('./pages/portal/senha/senha').then(
            (m) => m.Senha
          )
      }
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
