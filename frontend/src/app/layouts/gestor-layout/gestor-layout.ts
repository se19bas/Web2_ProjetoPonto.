
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-gestor-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './gestor-layout.html',
  styleUrl: './gestor-layout.css'
})
export class GestorLayout {}
