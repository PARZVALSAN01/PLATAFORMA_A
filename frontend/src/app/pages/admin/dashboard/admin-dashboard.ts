import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { DashboardLayoutComponent } from '../../../components/dashboard-layout/dashboard-layout';
import { UsersService } from '../../../services/users.service';
import { StudentsService } from '../../../services/students.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DashboardLayoutComponent, RouterLink, DecimalPipe],
  template: `
    <app-dashboard-layout>
      <h1 class="page-title">Panel de Administración</h1>

      <!-- Stat Cards -->
      <div class="stats-grid">
        @for (s of statCards; track s.label) {
          <div class="card stat-card">
            <div class="stat-icon" [style.background]="s.bg">{{ s.icon }}</div>
            <div class="stat-info">
              <span class="stat-value">{{ s.value }}</span>
              <span class="stat-label">{{ s.label }}</span>
            </div>
          </div>
        }
      </div>

      <!-- Cobranza Stats -->
      <div class="stats-grid financial">
        <div class="card stat-card">
          <div class="stat-icon" style="background: #d1fae5">💰</div>
          <div class="stat-info">
            <span class="stat-value">\${{ cobranzaStats.totalPronosticoAnual | number:'1.0-0' }}</span>
            <span class="stat-label">Pronóstico Anual</span>
          </div>
        </div>
        <div class="card stat-card">
          <div class="stat-icon" style="background: #dbeafe">📊</div>
          <div class="stat-info">
            <span class="stat-value">\${{ cobranzaStats.totalColegiaturasMensual | number:'1.0-0' }}</span>
            <span class="stat-label">Colegiaturas Mensuales</span>
          </div>
        </div>
        <div class="card stat-card">
          <div class="stat-icon" style="background: #fef3c7">🎓</div>
          <div class="stat-info">
            <span class="stat-value">{{ cobranzaStats.alumnosConBeca }}</span>
            <span class="stat-label">Alumnos con Beca</span>
          </div>
        </div>
        <div class="card stat-card">
          <div class="stat-icon" style="background: #fce7f3">📋</div>
          <div class="stat-info">
            <span class="stat-value">{{ cobranzaStats.alumnosSinBeca }}</span>
            <span class="stat-label">Sin Beca</span>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="charts-grid">
        <div class="card chart-card">
          <h3>Pronóstico de Ingresos Anuales</h3>
          <canvas #pronosticoChart></canvas>
        </div>
        <div class="card chart-card">
          <h3>Estado de Pagos</h3>
          <canvas #pagosChart></canvas>
        </div>
        <div class="card chart-card">
          <h3>Alumnos por Nivel</h3>
          <canvas #nivelesChart></canvas>
        </div>
        <div class="card chart-card">
          <h3>Adeudo vs Pagado</h3>
          <canvas #adeudoChart></canvas>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div class="actions-grid">
          <a routerLink="/admin/alumnos" class="card action-card"><span>👨‍🎓</span><span>Gestión de Alumnos</span></a>
          <a routerLink="/admin/cobranza" class="card action-card"><span>💰</span><span>Cobranza</span></a>
          <a routerLink="/admin/uniformes" class="card action-card"><span>👔</span><span>Uniformes</span></a>
          <a routerLink="/admin/usuarios" class="card action-card"><span>👥</span><span>Gestionar Usuarios</span></a>
          <a routerLink="/admin/avisos" class="card action-card"><span>📢</span><span>Publicar Aviso</span></a>
          <a routerLink="/admin/noticias" class="card action-card"><span>📰</span><span>Publicar Noticia</span></a>
          <a routerLink="/admin/calendario" class="card action-card"><span>📅</span><span>Crear Evento</span></a>
        </div>
      </div>
    </app-dashboard-layout>
  `,
  styles: [`
    .page-title { font-size: 1.5rem; font-weight: 700; color: var(--gray-800); margin-bottom: 1.5rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
    .stats-grid.financial { margin-bottom: 2rem; }
    .stat-card { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; }
    .stat-icon { width: 48px; height: 48px; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; }
    .stat-info { .stat-value { display: block; font-size: 1.25rem; font-weight: 700; color: var(--gray-800); } .stat-label { font-size: 0.8125rem; color: var(--gray-500); } }
    .charts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
    .chart-card { padding: 1.5rem; h3 { font-size: 1rem; font-weight: 600; color: var(--gray-700); margin-bottom: 1rem; } }
    .quick-actions h2 { font-size: 1.125rem; font-weight: 600; color: var(--gray-800); margin-bottom: 1rem; }
    .actions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
    .action-card { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1.5rem; text-decoration: none; color: var(--gray-700); font-weight: 500; font-size: 0.875rem; transition: all 0.2s;
      span:first-child { font-size: 2rem; }
      &:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
    }
    @media (max-width: 900px) { .charts-grid { grid-template-columns: 1fr; } }
  `]
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('pronosticoChart') pronosticoCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pagosChart') pagosCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('nivelesChart') nivelesCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('adeudoChart') adeudoCanvas!: ElementRef<HTMLCanvasElement>;

  statCards = [
    { icon: '👥', label: 'Usuarios', value: 0, bg: 'var(--primary-50)' },
    { icon: '👨‍🎓', label: 'Alumnos', value: 0, bg: 'var(--accent-50)' },
    { icon: '👨‍🏫', label: 'Docentes', value: 0, bg: '#fef3c7' },
    { icon: '👨‍👩‍👧', label: 'Padres', value: 0, bg: '#dbeafe' },
  ];

  cobranzaStats: any = {
    totalPronosticoAnual: 0,
    totalColegiaturasMensual: 0,
    alumnosConBeca: 0,
    alumnosSinBeca: 0,
    porNivel: {}
  };

  private chartsReady = false;
  private dataReady = false;

  constructor(private usersService: UsersService, private studentsService: StudentsService) {}

  ngOnInit() {
    this.usersService.getStats().subscribe({
      next: (stats: any) => {
        this.statCards[0].value = stats.totalUsers || 0;
        this.statCards[1].value = stats.totalStudents || 0;
        this.statCards[2].value = stats.totalTeachers || 0;
        this.statCards[3].value = stats.totalParents || 0;
      },
      error: () => {}
    });

    this.studentsService.getCobranzaStats().subscribe({
      next: (stats: any) => {
        this.cobranzaStats = stats;
        this.dataReady = true;
        if (this.chartsReady) this.renderCharts();
      },
      error: () => {}
    });
  }

  ngAfterViewInit() {
    this.chartsReady = true;
    if (this.dataReady) this.renderCharts();
  }

  private renderCharts() {
    this.renderPronosticoChart();
    this.renderPagosChart();
    this.renderNivelesChart();
    this.renderAdeudoChart();
  }

  private renderPronosticoChart() {
    const meses = ['Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'];
    const mensual = this.cobranzaStats.totalColegiaturasMensual || 0;
    const acumulado: number[] = [];
    meses.forEach((_, i) => acumulado.push(mensual * (i + 1)));

    new Chart(this.pronosticoCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: meses,
        datasets: [
          {
            label: 'Ingreso Mensual',
            data: meses.map(() => mensual),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderRadius: 6,
          },
          {
            label: 'Acumulado',
            data: acumulado,
            type: 'line',
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.3,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
        scales: { y: { beginAtZero: true, ticks: { callback: (v) => '$' + Number(v).toLocaleString() } } }
      }
    });
  }

  private renderPagosChart() {
    const pagado = this.cobranzaStats.totalColegiaturasMensual || 0;
    const pronostico = this.cobranzaStats.totalPronosticoAnual || 0;
    const pendiente = pronostico - pagado;

    new Chart(this.pagosCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Pagado (estimado mes actual)', 'Pendiente'],
        datasets: [{
          data: [pagado, pendiente > 0 ? pendiente : 0],
          backgroundColor: ['#10b981', '#ef4444'],
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
        },
        cutout: '60%',
      }
    });
  }

  private renderNivelesChart() {
    const niveles = this.cobranzaStats.porNivel || {};
    const labels = Object.keys(niveles).map(n => n.charAt(0).toUpperCase() + n.slice(1));
    const data = Object.values(niveles) as number[];

    new Chart(this.nivelesCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: ['#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'],
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
      }
    });
  }

  private renderAdeudoChart() {
    const conBeca = this.cobranzaStats.alumnosConBeca || 0;
    const sinBeca = this.cobranzaStats.alumnosSinBeca || 0;

    new Chart(this.adeudoCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Con Beca', 'Sin Beca'],
        datasets: [{
          label: 'Alumnos',
          data: [conBeca, sinBeca],
          backgroundColor: ['#8b5cf6', '#f59e0b'],
          borderRadius: 8,
          barThickness: 60,
        }]
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }
}
