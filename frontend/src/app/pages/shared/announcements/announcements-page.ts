import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DashboardLayoutComponent } from '../../../components/dashboard-layout/dashboard-layout';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-announcements-page',
  standalone: true,
  imports: [DashboardLayoutComponent, DatePipe],
  template: `
    <app-dashboard-layout>
      <h1 class="page-title">Avisos</h1>
      @if (announcements.length) {
        <div class="announcements-list">
          @for (a of announcements; track a.id) {
            <div class="card announcement-card">
              <div class="announcement-header">
                <span class="badge badge-accent">{{ a.category || 'General' }}</span>
                <span class="date">{{ a.createdAt | date:'dd MMM yyyy' }}</span>
              </div>
              <h3>{{ a.title }}</h3>
              <p>{{ a.content }}</p>
            </div>
          }
        </div>
      } @else {
        <div class="empty card" style="padding:3rem;text-align:center;color:var(--gray-400);">No hay avisos publicados.</div>
      }
    </app-dashboard-layout>
  `,
  styles: [`
    .page-title { font-size: 1.5rem; font-weight: 700; color: var(--gray-800); margin-bottom: 1.5rem; }
    .announcements-list { display: flex; flex-direction: column; gap: 1rem; }
    .announcement-card { padding: 1.5rem;
      .announcement-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;
        .date { font-size: 0.75rem; color: var(--gray-400); }
      }
      h3 { font-size: 1.0625rem; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem; }
      p { font-size: 0.875rem; color: var(--gray-500); line-height: 1.6; }
    }
  `]
})
export class AnnouncementsPageComponent implements OnInit {
  announcements: any[] = [];
  constructor(private content: ContentService) {}
  ngOnInit() { this.content.getAnnouncements().subscribe({ next: d => this.announcements = d?.content || d || [], error: () => {} }); }
}
