import { Component, OnInit } from '@angular/core';
import { DashboardLayoutComponent } from '../../../components/dashboard-layout/dashboard-layout';
import { AcademicService } from '../../../services/academic.service';

@Component({
  selector: 'app-teacher-groups',
  standalone: true,
  imports: [DashboardLayoutComponent],
  template: `
    <app-dashboard-layout>
      <h1 class="page-title">Mis Grupos</h1>

      <div class="groups-grid">
        @for (group of groups; track group.id) {
          <div class="card group-card">
            <div class="group-header">
              <div>
                <h2>{{ group.name }}</h2>
                <p>{{ group.level }} {{ group.grade }}{{ group.group ? ' - ' + group.group : '' }}</p>
              </div>
              <span class="badge badge-accent">{{ group.schoolYear }}</span>
            </div>

            <div class="metrics">
              <div>
                <strong>{{ group.students?.length || 0 }}</strong>
                <span>Alumnos</span>
              </div>
              <div>
                <strong>{{ group.subjects?.length || 0 }}</strong>
                <span>Materias</span>
              </div>
            </div>

            @if (group.subjects?.length) {
              <div class="subjects">
                @for (subject of group.subjects; track subject.id) {
                  <span>{{ subject.name }}</span>
                }
              </div>
            }
          </div>
        } @empty {
          <div class="card empty-state">No tienes grupos asignados.</div>
        }
      </div>
    </app-dashboard-layout>
  `,
  styles: [`
    .page-title { font-size: 1.5rem; font-weight: 700; color: var(--gray-800); margin-bottom: 1.5rem; }
    .groups-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
    .group-card { padding: 1.25rem; }
    .group-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1.25rem;
      h2 { font-size: 1.125rem; font-weight: 700; color: var(--gray-800); }
      p { font-size: 0.875rem; color: var(--gray-500); margin-top: 0.25rem; text-transform: capitalize; }
    }
    .metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;
      div { background: var(--gray-50); border-radius: 0.5rem; padding: 0.875rem; }
      strong { display: block; font-size: 1.35rem; color: var(--gray-800); }
      span { color: var(--gray-500); font-size: 0.8125rem; }
    }
    .subjects { display: flex; flex-wrap: wrap; gap: 0.5rem;
      span { background: var(--primary-50); color: var(--primary-700); padding: 0.25rem 0.625rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
    }
    .empty-state { padding: 2rem; color: var(--gray-400); text-align: center; }
  `]
})
export class TeacherGroupsComponent implements OnInit {
  groups: any[] = [];

  constructor(private academic: AcademicService) {}

  ngOnInit() {
    this.academic.getClasses().subscribe({
      next: (data: any) => this.groups = data?.content || data || [],
      error: () => {}
    });
  }
}
