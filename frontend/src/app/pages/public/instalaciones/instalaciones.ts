import { Component, AfterViewInit } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header';
import { FooterComponent } from '../../../components/footer/footer';

@Component({
  selector: 'app-instalaciones',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  template: `
    <app-header />

    <!-- Hero -->
    <div class="page-hero-ng">
      <div class="hero-orb hero-orb-1"></div>
      <div class="hero-orb hero-orb-2"></div>
      <div class="container">
        <span class="hero-badge-ng">Instalaciones de primer nivel</span>
        <h1>Nuestras Instalaciones</h1>
        <p>Las instalaciones más grandes de la zona, diseñadas para el aprendizaje y desarrollo integral de nuestros alumnos.</p>
      </div>
    </div>

    <!-- Highlights banner -->
    <div class="highlights-bar">
      <div class="container highlights-inner">
        <div class="highlight-item">🏆 Las más grandes de la zona</div>
        <div class="highlight-sep">•</div>
        <div class="highlight-item">📹 Videovigilancia 24h</div>
        <div class="highlight-sep">•</div>
        <div class="highlight-item">💻 Tecnología de punta</div>
        <div class="highlight-sep">•</div>
        <div class="highlight-item">🌳 Áreas verdes amplias</div>
      </div>
    </div>

    <!-- Facilities grid -->
    <section class="section">
      <div class="container">
        <div class="section-header-ng">
          <h2 class="section-title">Conoce nuestros espacios</h2>
          <p class="section-subtitle">Infraestructura moderna pensada para el desarrollo integral</p>
        </div>
        <div class="facilities-grid">
          @for (f of facilities; track f.name) {
            <div class="facility-card-ng">
              <div class="facility-icon-wrap">
                <span class="facility-icon">{{ f.icon }}</span>
              </div>
              <div class="facility-body">
                <h3>{{ f.name }}</h3>
                <p>{{ f.desc }}</p>
              </div>
              <div class="facility-glow"></div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-ng">
      <div class="container cta-ng-inner">
        <h2>¿Quieres conocer nuestras instalaciones?</h2>
        <p>Agenda una visita guiada y descubre por qué somos la mejor opción en Fuentes del Valle.</p>
        <a href="https://wa.link/492onw" target="_blank" class="btn btn-white btn-lg">
          💬 Agendar visita por WhatsApp
        </a>
      </div>
    </section>

    <app-footer />
  `,
  styles: [`
    .highlights-bar {
      background: var(--primary-500); padding: 1rem 0; overflow: hidden;
    }
    .highlights-inner {
      display: flex; align-items: center; justify-content: center;
      gap: 1.5rem; flex-wrap: wrap;
    }
    .highlight-item {
      color: #fff; font-size: 0.9rem; font-weight: 500; white-space: nowrap;
    }
    .highlight-sep { color: var(--gold-400); font-weight: 700; }

    .section-header-ng {
      text-align: center; margin-bottom: 3rem;
    }

    .facilities-grid {
      display: grid; gap: 1.5rem;
      grid-template-columns: 1fr;
      @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
      @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
    }

    .facility-card-ng {
      position: relative; overflow: hidden;
      background: #fff; border-radius: 1.25rem;
      border: 1px solid var(--gray-200);
      padding: 2rem 1.75rem;
      display: flex; align-items: flex-start; gap: 1.25rem;
      transition: transform 0.35s cubic-bezier(.25,.8,.25,1), box-shadow 0.35s ease, border-color 0.3s;
      cursor: default;

      &:hover {
        transform: translateY(-6px);
        box-shadow: 0 20px 50px rgba(0,12,53,0.12);
        border-color: var(--primary-200);
        .facility-glow { opacity: 1; }
        .facility-icon-wrap { transform: scale(1.1) rotate(-5deg); background: linear-gradient(135deg, var(--primary-500), var(--accent-500)); }
        .facility-icon { filter: brightness(10); }
      }
    }

    .facility-glow {
      position: absolute; inset: 0; pointer-events: none; opacity: 0;
      background: radial-gradient(circle at top left, rgba(0,12,53,0.05), transparent 60%);
      transition: opacity 0.4s;
    }

    .facility-icon-wrap {
      min-width: 56px; height: 56px; border-radius: 1rem;
      background: var(--gray-100); display: flex; align-items: center;
      justify-content: center; transition: all 0.35s ease;
    }

    .facility-icon { font-size: 1.75rem; }

    .facility-body {
      h3 { font-size: 1.0625rem; font-weight: 700; color: var(--primary-500); margin-bottom: 0.375rem; }
      p { font-size: 0.875rem; color: var(--gray-500); line-height: 1.65; }
    }

    .cta-ng {
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--accent-500) 100%);
      padding: 5rem 0; text-align: center;
    }
    .cta-ng-inner {
      h2 { font-family: 'Playfair Display', serif; font-size: 2rem; color: #fff; margin-bottom: 1rem;
        @media (min-width: 768px) { font-size: 2.5rem; }
      }
      p { color: rgba(255,255,255,0.82); font-size: 1.1rem; margin-bottom: 2rem; }
    }
  `]
})
export class InstalacionesComponent implements AfterViewInit {
  facilities = [
    { icon: '🏫', name: 'Aulas Modernas', desc: 'Salones equipados con tecnología multimedia, proyectores interactivos y aire acondicionado para un aprendizaje óptimo.' },
    { icon: '💻', name: 'Laboratorio de Cómputo', desc: 'Computadoras de última generación con acceso a internet de alta velocidad. Equipos modernos para el aprendizaje digital.' },
    { icon: '🔬', name: 'Laboratorio de Ciencias', desc: 'Equipamiento completo para prácticas de física, química y biología. Aprendizaje experimental de primer nivel.' },
    { icon: '📚', name: 'Biblioteca', desc: 'Acervo bibliográfico amplio con zona de lectura, estudio individual y acceso a recursos digitales educativos.' },
    { icon: '⚽', name: 'Gran Patio Escolar', desc: 'Las instalaciones deportivas más grandes de la zona. Espacio multideportivo para fútbol, basquetbol y actividades recreativas.' },
    { icon: '🎭', name: 'Auditorio Teatral', desc: 'Auditorio equipado para eventos culturales, presentaciones artísticas y ceremonias escolares de gran formato.' },
    { icon: '🍽️', name: 'Cafetería', desc: 'Servicio de alimentos saludables y nutritivos para toda la comunidad escolar.' },
    { icon: '🌳', name: 'Áreas Verdes', desc: 'Amplios jardines y espacios al aire libre para recreación, actividades ecológicas y convivencia sana.' },
    { icon: '📹', name: 'Videovigilancia 24h', desc: 'Sistema completo de videovigilancia las 24 horas para garantizar la seguridad de toda nuestra comunidad.' },
  ];

  ngAfterViewInit() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).style.opacity = '1'; (e.target as HTMLElement).style.transform = 'translateY(0)'; } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.facility-card-ng').forEach((el, i) => {
      (el as HTMLElement).style.cssText += `opacity:0;transform:translateY(30px);transition:opacity 0.6s ${i * 0.07}s ease,transform 0.6s ${i * 0.07}s ease,box-shadow 0.35s ease,border-color 0.3s`;
      obs.observe(el);
    });
  }
}
