import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portal',
  imports: [],
  templateUrl: './portal.html',
  styleUrl: './portal.css'
})


export class Portal {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  sair(): void {

    this.authService.logout().subscribe({

      next: () => {
        console.log('Logout realizado com sucesso!');
        this.router.navigate(['/login']);
      },

      error: (erro) => {
        console.error('Erro ao realizar logout:', erro);
      }

    });

  }

}
