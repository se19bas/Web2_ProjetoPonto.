
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-portal-layout',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './portal-layout.html',
  styleUrl: './portal-layout.css'
})

export class PortalLayout {

}
