import { Component, OnInit } from '@angular/core';
import { DatePipe, SlicePipe } from '@angular/common';
import { DashboardLayoutComponent } from '../../../components/dashboard-layout/dashboard-layout';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [DashboardLayoutComponent, DatePipe, SlicePipe],
  template: `
    <app-dashboard-layout>
      <div class="cal-header">
        <div>
          <h1 class="page-title">Calendario</h1>
          <p class="page-subtitle">Eventos y actividades del instituto</p>
        </div>
        <div class="view-toggle">
          <button [class]="'toggle-btn ' + (view === 'calendar' ? 'active' : '')" (click)="view = 'calendar'">📅 Calendario</button>
          <button [class]="'toggle-btn ' + (view === 'list' ? 'active' : '')" (click)="view = 'list'">📋 Lista</button>
        </div>
      </div>

      <!-- Calendar View -->
      @if (view === 'calendar') {
        <div class="card calendar-card">
          <div class="cal-nav">
            <button class="nav-btn" (click)="prevMonth()">‹</button>
            <h2 class="cal-month">{{ monthNames[currentMonth] }} {{ currentYear }}</h2>
            <button class="nav-btn" (click)="nextMonth()">›</button>
            <button class="btn btn-sm btn-outline today-btn" (click)="goToday()">Hoy</button>
          </div>
          <div class="cal-grid">
            <div class="cal-weekday">Dom</div>
            <div class="cal-weekday">Lun</div>
            <div class="cal-weekday">Mar</div>
            <div class="cal-weekday">Mié</div>
            <div class="cal-weekday">Jue</div>
            <div class="cal-weekday">Vie</div>
            <div class="cal-weekday">Sáb</div>
            @for (day of calendarDays; track $index) {
              <div [class]="'cal-day ' + (day.isToday ? 'today ' : '') + (day.isCurrentMonth ? '' : 'other-month ') + (day.events.length ? 'has-events' : '')"
                   (click)="day.events.length && selectDay(day)">
                <span class="day-number">{{ day.date.getDate() }}</span>
                @if (day.events.length) {
                  <div class="day-dots">
                    @for (ev of day.events.slice(0, 3); track ev.id) {
                      <span class="event-dot" [style.background]="ev.color || getTypeColor(ev.type)"></span>
                    }
                  </div>
                  @if (day.events.length === 1) {
                    <span class="day-event-label" [style.background]="day.events[0].color || getTypeColor(day.events[0].type)">
                      {{ day.events[0].title | slice:0:12 }}
                    </span>
                  }
                }
              </div>
            }
          </div>

          <!-- Legend -->
          <div class="cal-legend">
            <span class="legend-item"><span class="legend-dot" style="background:#3b82f6;"></span> Académico</span>
            <span class="legend-item"><span class="legend-dot" style="background:#10b981;"></span> Festivo</span>
            <span class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span> Evento</span>
            <span class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span> Examen</span>
            <span class="legend-item"><span class="legend-dot" style="background:#8b5cf6;"></span> Reunión</span>
          </div>
        </div>
      }

      <!-- Upcoming events sidebar / list -->
      @if (view === 'list') {
        <div class="events-section">
          @if (events.length) {
            <div class="events-timeline">
              @for (ev of events; track ev.id) {
                <div class="timeline-item">
                  <div class="timeline-line">
                    <div class="timeline-dot" [style.background]="ev.color || getTypeColor(ev.type)"></div>
                  </div>
                  <div class="card event-card-enhanced">
                    <div class="event-color-strip" [style.background]="ev.color || getTypeColor(ev.type)"></div>
                    <div class="event-body">
                      <div class="event-top">
                        <div class="event-date-badge">
                          <span class="edb-day">{{ ev.startDate | date:'dd' }}</span>
                          <span class="edb-month">{{ ev.startDate | date:'MMM' }}</span>
                        </div>
                        <div class="event-details">
                          <h3>{{ ev.title }}</h3>
                          <div class="event-meta">
                            <span class="event-type-tag" [style.background]="(ev.color || getTypeColor(ev.type)) + '20'" [style.color]="ev.color || getTypeColor(ev.type)">
                              {{ getTypeLabel(ev.type) }}
                            </span>
                            <span class="event-time">🕐 {{ ev.startDate | date:'HH:mm' }} - {{ ev.endDate | date:'HH:mm' }}</span>
                          </div>
                        </div>
                      </div>
                      @if (ev.description) {
                        <p class="event-desc">{{ ev.description }}</p>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="empty-events card">
              <div class="empty-cal-icon">📅</div>
              <h3>No hay eventos programados</h3>
              <p>Los próximos eventos aparecerán aquí.</p>
            </div>
          }
        </div>
      }

      <!-- Day detail modal -->
      @if (selectedDay) {
        <div class="modal-overlay" (click)="selectedDay = null">
          <div class="modal card day-modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ selectedDay.date | date:'EEEE, d MMMM yyyy' }}</h2>
              <button class="modal-close" (click)="selectedDay = null">✕</button>
            </div>
            <div class="day-events-list">
              @for (ev of selectedDay.events; track ev.id) {
                <div class="day-event-item">
                  <div class="dei-strip" [style.background]="ev.color || getTypeColor(ev.type)"></div>
                  <div class="dei-content">
                    <h4>{{ ev.title }}</h4>
                    <span class="dei-time">{{ ev.startDate | date:'HH:mm' }} - {{ ev.endDate | date:'HH:mm' }}</span>
                    @if (ev.description) {
                      <p>{{ ev.description }}</p>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </app-dashboard-layout>
  `,
  styles: [`
    /* Header */
    .cal-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: var(--gray-800); margin-bottom: 0.25rem; }
    .page-subtitle { font-size: 0.875rem; color: var(--gray-400); }
    .view-toggle { display: flex; gap: 0.25rem; background: var(--gray-100); border-radius: 0.75rem; padding: 0.25rem; }
    .toggle-btn { padding: 0.5rem 1rem; border: none; background: none; border-radius: 0.5rem; font-size: 0.8125rem; font-weight: 500; cursor: pointer; color: var(--gray-500); transition: all 0.2s;
      &.active { background: #fff; color: var(--gray-800); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    }

    /* Calendar Card */
    .calendar-card { padding: 1.5rem; }
    .cal-nav { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
    .cal-month { font-size: 1.25rem; font-weight: 700; color: var(--gray-800); text-transform: capitalize; }
    .nav-btn { background: var(--gray-100); border: none; width: 36px; height: 36px; border-radius: 50%; font-size: 1.25rem; cursor: pointer; color: var(--gray-600); transition: all 0.2s;
      &:hover { background: var(--primary-100); color: var(--primary-600); }
    }
    .today-btn { margin-left: auto; }

    /* Calendar Grid */
    .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: var(--gray-100); border-radius: 0.75rem; overflow: hidden; border: 1px solid var(--gray-100); }
    .cal-weekday { padding: 0.75rem 0.5rem; text-align: center; font-size: 0.75rem; font-weight: 600; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.05em; background: var(--gray-50); }
    .cal-day { background: #fff; min-height: 80px; padding: 0.5rem; position: relative; transition: background 0.15s; cursor: default;
      &.has-events { cursor: pointer; &:hover { background: var(--primary-50); } }
      &.today { background: var(--primary-50);
        .day-number { background: var(--primary-500); color: #fff; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: 700; }
      }
      &.other-month { opacity: 0.35; }
    }
    .day-number { font-size: 0.8125rem; font-weight: 500; color: var(--gray-700); }
    .day-dots { display: flex; gap: 3px; margin-top: 4px; flex-wrap: wrap; }
    .event-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
    .day-event-label { display: block; margin-top: 4px; font-size: 0.625rem; padding: 1px 4px; border-radius: 3px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }

    /* Legend */
    .cal-legend { display: flex; gap: 1.25rem; flex-wrap: wrap; padding-top: 1.25rem; margin-top: 1.25rem; border-top: 1px solid var(--gray-100); }
    .legend-item { display: flex; align-items: center; gap: 0.375rem; font-size: 0.75rem; color: var(--gray-500); font-weight: 500; }
    .legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

    /* Timeline List */
    .events-timeline { position: relative; padding-left: 2rem; }
    .timeline-item { position: relative; margin-bottom: 1.25rem; }
    .timeline-line { position: absolute; left: -2rem; top: 0; bottom: -1.25rem; width: 2px; background: var(--gray-200);
      &::after { content: ''; position: absolute; bottom: 0; left: -1px; width: 2px; height: 1.25rem; background: var(--gray-200); }
    }
    .timeline-item:last-child .timeline-line { bottom: 0; &::after { display: none; } }
    .timeline-dot { position: absolute; left: -5px; top: 1.5rem; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 0 2px var(--gray-200); z-index: 1; }

    .event-card-enhanced { display: flex; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s;
      &:hover { transform: translateX(4px); box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
    }
    .event-color-strip { width: 4px; flex-shrink: 0; }
    .event-body { padding: 1.25rem; flex: 1; }
    .event-top { display: flex; gap: 1rem; align-items: flex-start; }
    .event-date-badge { min-width: 52px; text-align: center; background: var(--gray-50); border-radius: 0.625rem; padding: 0.5rem 0.625rem; border: 1px solid var(--gray-100);
      .edb-day { display: block; font-size: 1.375rem; font-weight: 800; color: var(--gray-800); line-height: 1; }
      .edb-month { display: block; font-size: 0.6875rem; color: var(--primary-500); text-transform: uppercase; font-weight: 700; margin-top: 2px; }
    }
    .event-details {
      h3 { font-size: 1rem; font-weight: 600; color: var(--gray-800); margin-bottom: 0.375rem; }
    }
    .event-meta { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
    .event-type-tag { display: inline-block; padding: 0.2rem 0.625rem; border-radius: 9999px; font-size: 0.6875rem; font-weight: 600; text-transform: capitalize; }
    .event-time { font-size: 0.8125rem; color: var(--gray-400); }
    .event-desc { font-size: 0.875rem; color: var(--gray-500); line-height: 1.5; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--gray-100); }

    /* Empty */
    .empty-events { text-align: center; padding: 4rem 2rem;
      .empty-cal-icon { font-size: 3.5rem; margin-bottom: 1rem; }
      h3 { font-size: 1.25rem; color: var(--gray-700); margin-bottom: 0.375rem; }
      p { color: var(--gray-400); font-size: 0.875rem; }
    }

    /* Day Detail Modal */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
    .day-modal { width: 100%; max-width: 480px; }
    .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--gray-100);
      h2 { font-size: 1rem; font-weight: 600; color: var(--gray-800); text-transform: capitalize; }
      .modal-close { background: none; border: none; font-size: 1.25rem; cursor: pointer; color: var(--gray-400); }
    }
    .day-events-list { padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; }
    .day-event-item { display: flex; gap: 0.75rem; padding: 0.75rem; background: var(--gray-50); border-radius: 0.625rem; }
    .dei-strip { width: 4px; border-radius: 4px; flex-shrink: 0; }
    .dei-content { flex: 1;
      h4 { font-size: 0.9375rem; font-weight: 600; color: var(--gray-800); margin-bottom: 0.25rem; }
      .dei-time { font-size: 0.75rem; color: var(--gray-400); }
      p { font-size: 0.8125rem; color: var(--gray-500); margin-top: 0.375rem; line-height: 1.4; }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .cal-grid .cal-day { min-height: 56px; padding: 0.25rem; }
      .day-event-label { display: none; }
      .cal-legend { gap: 0.75rem; }
    }
  `]
})
export class CalendarPageComponent implements OnInit {
  events: any[] = [];
  view: 'calendar' | 'list' = 'calendar';
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  calendarDays: { date: Date; isToday: boolean; isCurrentMonth: boolean; events: any[] }[] = [];
  selectedDay: { date: Date; events: any[] } | null = null;

  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  private typeColors: Record<string, string> = {
    academic: '#3b82f6', holiday: '#10b981', event: '#f59e0b', exam: '#ef4444', meeting: '#8b5cf6', other: '#6b7280'
  };
  private typeLabels: Record<string, string> = {
    academic: 'Académico', holiday: 'Festivo', event: 'Evento', exam: 'Examen', meeting: 'Reunión', other: 'Otro'
  };

  constructor(private content: ContentService) {}

  ngOnInit() {
    this.content.getCalendar().subscribe({
      next: d => { this.events = d?.content || d || []; this.buildCalendar(); },
      error: () => {}
    });
  }

  getTypeColor(type: string): string { return this.typeColors[type] || '#6b7280'; }
  getTypeLabel(type: string): string { return this.typeLabels[type] || type || 'Evento'; }

  prevMonth() {
    if (this.currentMonth === 0) { this.currentMonth = 11; this.currentYear--; }
    else { this.currentMonth--; }
    this.buildCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) { this.currentMonth = 0; this.currentYear++; }
    else { this.currentMonth++; }
    this.buildCalendar();
  }

  goToday() {
    const now = new Date();
    this.currentMonth = now.getMonth();
    this.currentYear = now.getFullYear();
    this.buildCalendar();
  }

  selectDay(day: { date: Date; events: any[] }) {
    if (day.events.length) this.selectedDay = day;
  }

  buildCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startOffset = firstDay.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.calendarDays = [];

    // Days from previous month
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(this.currentYear, this.currentMonth, -i);
      this.calendarDays.push({ date: d, isToday: false, isCurrentMonth: false, events: this.getEventsForDate(d) });
    }

    // Days in current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(this.currentYear, this.currentMonth, i);
      const isToday = d.getTime() === today.getTime();
      this.calendarDays.push({ date: d, isToday, isCurrentMonth: true, events: this.getEventsForDate(d) });
    }

    // Fill remaining cells to complete 6 rows
    const remaining = 42 - this.calendarDays.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(this.currentYear, this.currentMonth + 1, i);
      this.calendarDays.push({ date: d, isToday: false, isCurrentMonth: false, events: this.getEventsForDate(d) });
    }
  }

  private getEventsForDate(date: Date): any[] {
    return this.events.filter(ev => {
      const start = new Date(ev.startDate);
      const end = ev.endDate ? new Date(ev.endDate) : start;
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      const d = new Date(date);
      d.setHours(12, 0, 0, 0);
      return d >= start && d <= end;
    });
  }
}
