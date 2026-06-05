import { Component, OnInit } from '@angular/core';
import { DatePipe, SlicePipe } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header';
import { FooterComponent } from '../../../components/footer/footer';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-comunidad',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, DatePipe, SlicePipe],
  template: `
    <app-header />

    <!-- Hero -->
    <div class="page-hero-ng">
      <div class="hero-orb hero-orb-1"></div>
      <div class="hero-orb hero-orb-2"></div>
      <div class="container">
        <span class="hero-badge-ng">Vida escolar</span>
        <h1>Comunidad Anáhuac</h1>
        <p>Noticias, eventos y actividades de nuestra comunidad escolar. Juntos construimos el futuro.</p>
      </div>
    </div>

    <section class="section">
      <div class="container comunidad-layout">

        <!-- Noticias -->
        <div class="col-noticias">
          <div class="col-header">
            <h2 class="section-title">Noticias</h2>
            <span class="col-badge">Últimas novedades</span>
          </div>
          @if (news.length) {
            <div class="news-list">
              @for (item of news; track item.id) {
                <div class="news-card-ng">
                  <div class="news-top">
                    <span class="badge badge-accent">{{ item.category }}</span>
                    <span class="news-date">{{ item.createdAt | date:'dd MMM yyyy' }}</span>
                  </div>
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.excerpt || (item.content | slice:0:160) }}...</p>
                  <div class="news-footer">
                    <span class="read-more">Leer más →</span>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="empty-state">
              <div class="empty-icon">📰</div>
              <h3>Próximamente</h3>
              <p>Aquí encontrarás las últimas noticias de nuestra comunidad escolar. ¡Vuelve pronto!</p>
            </div>
          }
        </div>

        <!-- Eventos -->
        <div class="col-eventos">
          <div class="col-header">
            <h2 class="section-title">Próximos Eventos</h2>
            <span class="col-badge">Agenda escolar</span>
          </div>
          @if (events.length) {
            <div class="events-list">
              @for (ev of events; track ev.id) {
                <div class="event-card-ng">
                  <div class="event-date-badge">
                    <span class="day">{{ ev.startDate | date:'dd' }}</span>
                    <span class="month">{{ ev.startDate | date:'MMM' }}</span>
                  </div>
                  <div class="event-info">
                    <h3>{{ ev.title }}</h3>
                    <p>{{ ev.description }}</p>
                  </div>
                  <div class="event-arrow">→</div>
                </div>
              }
            </div>
          } @else {
            <div class="empty-state">
              <div class="empty-icon">📅</div>
              <h3>Sin eventos por ahora</h3>
              <p>Pronto publicaremos los próximos eventos y actividades de nuestra comunidad.</p>
            </div>
          }

          <!-- Social CTA -->
          <div class="social-cta-card">
            <h4>Síguenos para no perderte nada</h4>
            <p>Comparte los momentos más especiales de nuestra comunidad escolar.</p>
            <div class="sc-links">
              <a href="https://www.facebook.com/InstitutoAnahuacTultitlan" target="_blank" class="sc-btn sc-fb">Facebook</a>
              <a href="https://www.instagram.com/instituto___anahuac" target="_blank" class="sc-btn sc-ig">Instagram</a>
            </div>
          </div>
        </div>

      </div>
    </section>

    <app-footer />
  `,
  styles: [`
    .comunidad-layout {
      display: grid; gap: 3rem;
      grid-template-columns: 1fr;
      @media (min-width: 900px) { grid-template-columns: 1fr 1fr; }
    }

    .col-header {
      display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;
    }
    .col-badge {
      padding: 0.2rem 0.75rem; border-radius: 9999px;
      background: var(--gray-100); color: var(--gray-500);
      font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;
    }

    /* News cards */
    .news-list { display: flex; flex-direction: column; gap: 1rem; }
    .news-card-ng {
      background: #fff; border: 1px solid var(--gray-200);
      border-radius: 1.25rem; padding: 1.5rem;
      transition: all 0.3s ease;
      cursor: pointer;
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 16px 40px rgba(0,12,53,0.1);
        border-color: var(--primary-200);
        .read-more { color: var(--primary-500); }
      }
    }
    .news-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
    .news-date { font-size: 0.75rem; color: var(--gray-400); }
    .news-card-ng h3 { font-size: 1.0625rem; font-weight: 700; color: var(--gray-800); margin-bottom: 0.5rem; line-height: 1.4; }
    .news-card-ng p { font-size: 0.875rem; color: var(--gray-500); line-height: 1.65; }
    .news-footer { margin-top: 1rem; }
    .read-more { font-size: 0.8125rem; font-weight: 600; color: var(--gray-400); transition: color 0.2s; }

    /* Event cards */
    .events-list { display: flex; flex-direction: column; gap: 0.875rem; margin-bottom: 1.5rem; }
    .event-card-ng {
      display: flex; align-items: center; gap: 1rem;
      background: #fff; border: 1px solid var(--gray-200);
      border-radius: 1rem; padding: 1rem 1.25rem;
      transition: all 0.3s ease;
      cursor: pointer;
      &:hover {
        transform: translateX(4px);
        box-shadow: 0 8px 24px rgba(0,12,53,0.08);
        border-color: var(--primary-200);
        .event-arrow { color: var(--primary-500); transform: translateX(4px); }
      }
    }
    .event-date-badge {
      min-width: 52px; text-align: center;
      background: linear-gradient(135deg, var(--primary-500), var(--accent-500));
      border-radius: 0.875rem; padding: 0.5rem 0.375rem;
      .day { display: block; font-size: 1.375rem; font-weight: 800; color: #fff; line-height: 1; }
      .month { display: block; font-size: 0.625rem; color: rgba(255,255,255,0.8); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-top: 0.125rem; }
    }
    .event-info { flex: 1;
      h3 { font-size: 0.9375rem; font-weight: 700; color: var(--gray-800); margin-bottom: 0.25rem; }
      p { font-size: 0.8125rem; color: var(--gray-500); line-height: 1.5; }
    }
    .event-arrow { color: var(--gray-300); font-size: 1.125rem; transition: all 0.25s; }

    /* Social CTA */
    .social-cta-card {
      background: linear-gradient(135deg, var(--primary-500), var(--accent-500));
      border-radius: 1.25rem; padding: 1.75rem;
      h4 { font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 0.375rem; }
      p { font-size: 0.85rem; color: rgba(255,255,255,0.8); margin-bottom: 1.25rem; }
    }
    .sc-links { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .sc-btn {
      padding: 0.5rem 1.25rem; border-radius: 9999px;
      font-size: 0.8375rem; font-weight: 700; text-decoration: none;
      transition: all 0.25s;
      &:hover { transform: translateY(-2px); }
      &.sc-fb { background: #1877f2; color: #fff; &:hover { box-shadow: 0 6px 16px rgba(24,119,242,0.5); } }
      &.sc-ig { background: linear-gradient(135deg, #f58529, #dd2a7b); color: #fff; &:hover { box-shadow: 0 6px 16px rgba(221,42,123,0.5); } }
    }

    /* Empty state */
    .empty-state {
      text-align: center; padding: 3rem 2rem;
      background: var(--gray-50); border-radius: 1.25rem;
      border: 1px dashed var(--gray-300);
      .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
      h3 { font-size: 1.125rem; font-weight: 700; color: var(--gray-700); margin-bottom: 0.5rem; }
      p { font-size: 0.875rem; color: var(--gray-400); line-height: 1.6; }
    }
  `]
})
export class ComunidadComponent implements OnInit {
  news: any[] = [];
  events: any[] = [];

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.contentService.getPublicNews().subscribe({ next: d => this.news = d || [], error: () => {} });
    this.contentService.getPublicCalendar().subscribe({ next: d => this.events = d?.content || d || [], error: () => {} });
  }
}
