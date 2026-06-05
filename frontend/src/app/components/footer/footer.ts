import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class FooterComponent {
  year = new Date().getFullYear();

  navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Nosotros', path: '/nosotros' },
    { name: 'Oferta Educativa', path: '/oferta-educativa' },
    { name: 'Instalaciones', path: '/instalaciones' },
    { name: 'Galería', path: '/galeria' },
    { name: 'Contacto', path: '/contacto' },
  ];

  ofertaLinks = [
    { name: 'Primaria', path: '/oferta-educativa/primaria' },
    { name: 'Secundaria', path: '/oferta-educativa/secundaria' },
    { name: 'Preparatoria (Próximamente)', path: '/oferta-educativa/preparatoria' },
  ];
}
