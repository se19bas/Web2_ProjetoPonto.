import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email: string = '';
  senha: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  entrar(): void {

    this.authService.login(this.email, this.senha).subscribe({

      next: (resposta) => {
        console.log('Login realizado com sucesso!');
        console.log('Access Token:', resposta.token);
        console.log('Refresh Token:', resposta.refreshToken);
        this.router.navigate(['/portal'])
      },

      error: (erro) => {
        console.error('Erro ao realizar login:', erro);
      }

    });

  }
}
