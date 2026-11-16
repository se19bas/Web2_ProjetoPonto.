
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})

export class Header {

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
