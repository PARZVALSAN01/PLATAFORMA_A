import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { DashboardLayoutComponent } from '../../../components/dashboard-layout/dashboard-layout';
import { ContentService } from '../../../services/content.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-parent-dashboard',
  standalone: true,
  imports: [DashboardLayoutComponent, RouterLink, SlicePipe],
  template: `
    <app-dashboard-layout>
      <h1 class="page-title">Portal para Padres</h1>
      <p class="welcome-text">Bienvenido, {{ auth.user()?.firstName }}. Consulta la información de tus hijos.</p>

      <div class="quick-actions">
        <h2>Consultas</h2>
        <div class="actions-grid">
          <a routerLink="/padre/calificaciones" class="card action-card"><span>📊</span><span>Calificaciones</span></a>
          <a routerLink="/padre/tareas" class="card action-card"><span>📋</span><span>Tareas</span></a>
          <a routerLink="/padre/avisos" class="card action-card"><span>📢</span><span>Avisos</span></a>
          <a routerLink="/padre/calendario" class="card action-card"><span>📅</span><span>Calendario</span></a>
          <a routerLink="/padre/mensajes" class="card action-card"><span>💬</span><span>Mensajes</span></a>
        </div>
      </div>

      @if (announcements.length) {
        <div class="recent-section">
          <h2>Avisos Recientes</h2>
          <div class="announcements-list">
            @for (a of announcements; track a.id) {
              <div class="card announcement-card">
                <h3>{{ a.title }}</h3>
                <p>{{ a.content | slice:0:150 }}...</p>
              </div>
            }
          </div>
        </div>
      }
    </app-dashboard-layout>
  `,
  styles: [`
    .page-title { font-size: 1.5rem; font-weight: 700; color: var(--gray-800); margin-bottom: 0.5rem; }
    .welcome-text { color: var(--gray-500); margin-bottom: 1.5rem; }
    .quick-actions h2, .recent-section h2 { font-size: 1.125rem; font-weight: 600; color: var(--gray-800); margin-bottom: 1rem; }
    .actions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .action-card { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1.5rem; text-decoration: none; color: var(--gray-700); font-weight: 500; font-size: 0.875rem; span:first-child { font-size: 2rem; } &:hover { transform: translateY(-2px); } }
    .announcements-list { display: flex; flex-direction: column; gap: 1rem; }
    .announcement-card { padding: 1.25rem;
      h3 { font-size: 1rem; font-weight: 600; color: var(--gray-800); margin-bottom: 0.375rem; }
      p { font-size: 0.875rem; color: var(--gray-500); line-height: 1.6; }
    }
  `]
})
export class ParentDashboardComponent implements OnInit {
  announcements: any[] = [];

  constructor(public auth: AuthService, private content: ContentService) {}

  ngOnInit() {
    this.content.getAnnouncements().subscribe({ next: d => this.announcements = (d?.content || d || []).slice(0, 5), error: () => {} });
  }
}
