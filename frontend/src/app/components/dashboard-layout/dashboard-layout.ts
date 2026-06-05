import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

interface MenuItem {
  name: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss'
})
export class DashboardLayoutComponent {
  sidebarOpen = signal(false);

  menuItems: Record<string, MenuItem[]> = {
    admin: [
      { name: 'Dashboard', icon: 'grid', path: '/admin' },
      { name: 'Alumnos', icon: 'users', path: '/admin/alumnos' },
      { name: 'Cobranza', icon: 'dollar-sign', path: '/admin/cobranza' },
      { name: 'Uniformes', icon: 'shirt', path: '/admin/uniformes' },
      { name: 'Usuarios', icon: 'user', path: '/admin/usuarios' },
      { name: 'Avisos', icon: 'bell', path: '/admin/avisos' },
      { name: 'Noticias', icon: 'newspaper', path: '/admin/noticias' },
      { name: 'Galería', icon: 'image', path: '/admin/galeria' },
      { name: 'Calendario', icon: 'calendar', path: '/admin/calendario' },
      { name: 'Solicitudes', icon: 'mail', path: '/admin/solicitudes' },
    ],
    teacher: [
      { name: 'Dashboard', icon: 'grid', path: '/docente' },
      { name: 'Mis Grupos', icon: 'book', path: '/docente/grupos' },
      { name: 'Tareas', icon: 'clipboard', path: '/docente/tareas' },
      { name: 'Calificaciones', icon: 'bar-chart', path: '/docente/calificaciones' },
      { name: 'Avisos', icon: 'bell', path: '/docente/avisos' },
      { name: 'Mensajes', icon: 'message', path: '/docente/mensajes' },
    ],
    student: [
      { name: 'Dashboard', icon: 'grid', path: '/alumno' },
      { name: 'Tareas', icon: 'clipboard', path: '/alumno/tareas' },
      { name: 'Calificaciones', icon: 'bar-chart', path: '/alumno/calificaciones' },
      { name: 'Avisos', icon: 'bell', path: '/alumno/avisos' },
      { name: 'Calendario', icon: 'calendar', path: '/alumno/calendario' },
    ],
    parent: [
      { name: 'Dashboard', icon: 'grid', path: '/padre' },
      { name: 'Calificaciones', icon: 'bar-chart', path: '/padre/calificaciones' },
      { name: 'Tareas', icon: 'clipboard', path: '/padre/tareas' },
      { name: 'Avisos', icon: 'bell', path: '/padre/avisos' },
      { name: 'Calendario', icon: 'calendar', path: '/padre/calendario' },
      { name: 'Mensajes', icon: 'message', path: '/padre/mensajes' },
    ]
  };

  roleLabels: Record<string, string> = {
    admin: 'Administrador',
    teacher: 'Docente',
    student: 'Alumno',
    parent: 'Padre de Familia'
  };

  constructor(public auth: AuthService, private router: Router, public theme: ThemeService) {}

  get items(): MenuItem[] {
    return this.menuItems[this.auth.user()?.role || ''] || [];
  }

  get roleLabel(): string {
    return this.roleLabels[this.auth.user()?.role || ''] || '';
  }

  get initials(): string {
    const u = this.auth.user();
    return u ? (u.firstName?.[0] || '') + (u.lastName?.[0] || '') : '';
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  handleLogout() {
    this.auth.logout();
  }
}
