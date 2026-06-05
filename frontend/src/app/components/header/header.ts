import { Component, HostListener, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  isOpen = signal(false);
  scrolled = signal(false);
  dropdown = signal<string | null>(null);

  navItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Nosotros', path: '/nosotros' },
    {
      name: 'Oferta Educativa', path: '/oferta-educativa',
      children: [
        { name: 'Primaria', path: '/oferta-educativa/primaria' },
        { name: 'Secundaria', path: '/oferta-educativa/secundaria' },
        { name: 'Preparatoria (Próximamente)', path: '/oferta-educativa/preparatoria' },
      ]
    },
    { name: 'Instalaciones', path: '/instalaciones' },
    { name: 'Galería', path: '/galeria' },
    { name: 'Comunidad', path: '/comunidad' },
    { name: 'Contacto', path: '/contacto' },
  ];

  constructor(public auth: AuthService, private router: Router, public theme: ThemeService) {}

  goToPortal() {
    // Siempre limpiar sesión y pedir credenciales de nuevo
    this.auth.silentLogout();
    this.closeMenu();
    this.router.navigate(['/login']);
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 20);
  }

  toggleMenu() {
    this.isOpen.update(v => !v);
  }

  closeMenu() {
    this.isOpen.set(false);
    this.dropdown.set(null);
  }

  setDropdown(name: string | null) {
    this.dropdown.set(name);
  }
}
