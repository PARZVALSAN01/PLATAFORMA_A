import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardLayoutComponent } from '../../../components/dashboard-layout/dashboard-layout';
import { AcademicService } from '../../../services/academic.service';
import { ContentService } from '../../../services/content.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [DashboardLayoutComponent, RouterLink],
  template: `
    <app-dashboard-layout>
      <h1 class="page-title">Panel del Docente</h1>
      <p class="welcome-text">Bienvenido, {{ auth.user()?.firstName }}. Aquí puedes gestionar tus grupos, tareas y calificaciones.</p>

      <div class="stats-grid">
        <div class="card stat-card"><div class="stat-icon" style="background:var(--primary-50)">📋</div><div class="stat-info"><span class="stat-value">{{ assignments.length }}</span><span class="stat-label">Tareas</span></div></div>
        <div class="card stat-card"><div class="stat-icon" style="background:var(--accent-50)">📢</div><div class="stat-info"><span class="stat-value">{{ announcements.length }}</span><span class="stat-label">Avisos</span></div></div>
      </div>

      <div class="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div class="actions-grid">
          <a routerLink="/docente/tareas" class="card action-card"><span>📋</span><span>Mis Tareas</span></a>
          <a routerLink="/docente/calificaciones" class="card action-card"><span>📊</span><span>Calificaciones</span></a>
          <a routerLink="/docente/avisos" class="card action-card"><span>📢</span><span>Avisos</span></a>
          <a routerLink="/docente/mensajes" class="card action-card"><span>💬</span><span>Mensajes</span></a>
        </div>
      </div>
    </app-dashboard-layout>
  `,
  styles: [`
    .page-title { font-size: 1.5rem; font-weight: 700; color: var(--gray-800); margin-bottom: 0.5rem; }
    .welcome-text { color: var(--gray-500); margin-bottom: 1.5rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .stat-card { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; }
    .stat-icon { width: 48px; height: 48px; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
    .stat-info { .stat-value { display: block; font-size: 1.5rem; font-weight: 700; color: var(--gray-800); } .stat-label { font-size: 0.8125rem; color: var(--gray-500); } }
    .quick-actions h2 { font-size: 1.125rem; font-weight: 600; color: var(--gray-800); margin-bottom: 1rem; }
    .actions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
    .action-card { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1.5rem; text-decoration: none; color: var(--gray-700); font-weight: 500; font-size: 0.875rem; transition: all 0.2s; span:first-child { font-size: 2rem; } &:hover { transform: translateY(-2px); } }
  `]
})
export class TeacherDashboardComponent implements OnInit {
  assignments: any[] = [];
  announcements: any[] = [];

  constructor(public auth: AuthService, private academic: AcademicService, private content: ContentService) {}

  ngOnInit() {
    this.academic.getAssignments().subscribe({ next: d => this.assignments = d?.content || d || [], error: () => {} });
    this.content.getAnnouncements().subscribe({ next: d => this.announcements = d?.content || d || [], error: () => {} });
  }
}
