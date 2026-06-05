import { Component, OnInit } from '@angular/core';
import { DashboardLayoutComponent } from '../../../components/dashboard-layout/dashboard-layout';
import { AcademicService } from '../../../services/academic.service';

@Component({
  selector: 'app-grades-page',
  standalone: true,
  imports: [DashboardLayoutComponent],
  template: `
    <app-dashboard-layout>
      <h1 class="page-title">Calificaciones</h1>
      <div class="card table-wrapper">
        <table class="table">
          <thead><tr><th>Alumno</th><th>Materia</th><th>Periodo</th><th>Calificación</th></tr></thead>
          <tbody>
            @for (g of grades; track g.id) {
              <tr>
                <td>{{ studentName(g) }}</td>
                <td>{{ g.subject?.name || g.subjectName || '-' }}</td>
                <td>{{ g.period || '-' }}</td>
                <td><span [class]="'badge ' + (score(g) >= 6 ? 'badge-accent' : 'badge-danger')">{{ score(g) }}</span></td>
              </tr>
            } @empty {
              <tr><td colspan="4" style="text-align:center;color:var(--gray-400);">No hay calificaciones registradas</td></tr>
            }
          </tbody>
        </table>
      </div>
    </app-dashboard-layout>
  `,
  styles: [`
    .page-title { font-size: 1.5rem; font-weight: 700; color: var(--gray-800); margin-bottom: 1.5rem; }
    .table-wrapper { overflow-x: auto; }
    .badge-danger { background: #fee2e2; color: #dc2626; }
  `]
})
export class GradesPageComponent implements OnInit {
  grades: any[] = [];
  constructor(private academic: AcademicService) {}
  ngOnInit() { this.academic.getGrades().subscribe({ next: d => this.grades = d?.content || d || [], error: () => {} }); }
  score(g: any): number { return Number(g.score ?? g.value ?? 0); }
  studentName(g: any): string {
    const user = g.student?.user;
    return user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '-';
  }
}
