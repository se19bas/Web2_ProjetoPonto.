
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-funcionario-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './funcionario-layout.html',
  styleUrl: './funcionario-layout.css'
})
export class FuncionarioLayout {}
