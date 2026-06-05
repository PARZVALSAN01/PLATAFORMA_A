import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DashboardLayoutComponent } from '../../../components/dashboard-layout/dashboard-layout';
import { AcademicService } from '../../../services/academic.service';

@Component({
  selector: 'app-assignments-page',
  standalone: true,
  imports: [DashboardLayoutComponent, DatePipe],
  template: `
    <app-dashboard-layout>
      <h1 class="page-title">Tareas</h1>
      <div class="card table-wrapper">
        <table class="table">
          <thead><tr><th>Título</th><th>Materia</th><th>Fecha de entrega</th><th>Estado</th></tr></thead>
          <tbody>
            @for (a of assignments; track a.id) {
              <tr>
                <td>{{ a.title }}</td>
                <td>{{ a.subject?.name || a.subjectName || '-' }}</td>
                <td>{{ a.dueDate | date:'dd/MM/yyyy' }}</td>
                <td><span [class]="'badge ' + (isPastDue(a.dueDate) ? 'badge-danger' : 'badge-accent')">{{ isPastDue(a.dueDate) ? 'Vencida' : 'Pendiente' }}</span></td>
              </tr>
            } @empty {
              <tr><td colspan="4" style="text-align:center;color:var(--gray-400);">No hay tareas</td></tr>
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
export class AssignmentsPageComponent implements OnInit {
  @Input() isStudent = false;
  assignments: any[] = [];

  constructor(private academic: AcademicService) {}

  ngOnInit() {
    const obs = this.isStudent ? this.academic.getStudentAssignments() : this.academic.getAssignments();
    obs.subscribe({ next: d => this.assignments = d?.content || d || [], error: () => {} });
  }

  isPastDue(date: string): boolean { return new Date(date) < new Date(); }
}
