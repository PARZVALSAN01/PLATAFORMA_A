import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../components/header/header';
import { FooterComponent } from '../../../components/footer/footer';

@Component({
  selector: 'app-oferta',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterLink],
  template: `
    <app-header />

    <!-- Hero -->
    <div class="page-hero-ng">
      <div class="hero-orb hero-orb-1"></div>
      <div class="hero-orb hero-orb-2"></div>
      <div class="container">
        <span class="hero-badge-ng">Educación de excelencia</span>
        <h1>Oferta Educativa</h1>
        <p>Programas académicos de primer nivel diseñados para formar líderes del mañana</p>
      </div>
    </div>

    <!-- Level Tabs -->
    <div class="levels-nav-ng">
      <div class="container levels-inner">
        <a routerLink="/oferta-educativa/primaria" [class]="'level-tab-ng ' + (activeLevel === 'primaria' ? 'active' : '')">
          <span class="tab-icon">🎒</span>
          <span>Primaria</span>
        </a>
        <a routerLink="/oferta-educativa/secundaria" [class]="'level-tab-ng ' + (activeLevel === 'secundaria' ? 'active' : '')">
          <span class="tab-icon">📚</span>
          <span>Secundaria</span>
        </a>
        <a routerLink="/oferta-educativa/preparatoria" [class]="'level-tab-ng ' + (activeLevel === 'preparatoria' ? 'active' : '')">
          <span class="tab-icon">🎓</span>
          <span>Preparatoria</span>
        </a>
      </div>
    </div>

    <section class="section">
      <div class="container">

        <!-- PRIMARIA -->
        @if (activeLevel === 'primaria') {
          <div class="level-content">
            <div class="level-intro">
              <div class="level-intro-text">
                <div class="level-badge">Nivel Primaria</div>
                <h2 class="section-title">Primaria</h2>
                <p class="level-desc">Nuestro programa de primaria sienta las bases para el aprendizaje integral. Con un enfoque en lectura, matemáticas, ciencias y desarrollo socioemocional, preparamos a nuestros alumnos para los retos académicos futuros. Contamos con profesores altamente especializados y programas complementarios que fortalecen cada aspecto del desarrollo infantil.</p>
                <a href="https://wa.link/492onw" target="_blank" class="btn btn-primary btn-lg">
                  💬 ¡Inscríbete Ya!
                </a>
              </div>
              <div class="level-stats">
                <div class="stat-pill"><span class="stat-num">9h</span><span class="stat-lbl">Inglés / semana</span></div>
                <div class="stat-pill"><span class="stat-num">2h</span><span class="stat-lbl">Cómputo / semana</span></div>
                <div class="stat-pill"><span class="stat-num">1h</span><span class="stat-lbl">Música / semana</span></div>
                <div class="stat-pill"><span class="stat-num">1h</span><span class="stat-lbl">Ed. Física / semana</span></div>
              </div>
            </div>

            <h3 class="features-title">Materias y Programas</h3>
            <div class="features-grid-ng">
              <div class="feature-card-ng">
                <div class="fc-icon">🇬🇧</div>
                <div class="fc-body">
                  <h4>Inglés Bilingüe</h4>
                  <p>Programa bilingüe completo con 9 horas semanales. Gramática, conversación, lectura, escritura y pronunciación.</p>
                </div>
              </div>
              <div class="feature-card-ng">
                <div class="fc-icon">💻</div>
                <div class="fc-body">
                  <h4>Computación</h4>
                  <p>Tecnología y programación básica desde primaria. Laboratorio de última generación con internet de alta velocidad.</p>
                </div>
              </div>
              <div class="feature-card-ng">
                <div class="fc-icon">🧠</div>
                <div class="fc-body">
                  <h4>Habilidades Cognitivas</h4>
                  <p>Profesionales académicos especializados en el desarrollo de habilidades del pensamiento y razonamiento lógico.</p>
                </div>
              </div>
              <div class="feature-card-ng">
                <div class="fc-icon">🎵</div>
                <div class="fc-body">
                  <h4>Música</h4>
                  <p>Expresión artística y musical. Desarrollamos la sensibilidad y creatividad desde los primeros años.</p>
                </div>
              </div>
              <div class="feature-card-ng">
                <div class="fc-icon">⚽</div>
                <div class="fc-body">
                  <h4>Educación Física</h4>
                  <p>Desarrollo motor y salud integral. Actividades deportivas con canchas y áreas las más grandes de la zona.</p>
                </div>
              </div>
              <div class="feature-card-ng">
                <div class="fc-icon">🧡</div>
                <div class="fc-body">
                  <h4>Psicopedagógico</h4>
                  <p>Departamento especializado en el área emocional y académica, acompañando a cada alumno en su desarrollo personal.</p>
                </div>
              </div>
            </div>

            <div class="beneficios-bar">
              <h3 class="features-title">Beneficios Académicos</h3>
              <div class="beneficios-grid">
                <div class="beneficio-item-ng"><span>✅</span> Programa Nacional de Convivencia Escolar</div>
                <div class="beneficio-item-ng"><span>✅</span> Programa Nacional de Lectura</div>
                <div class="beneficio-item-ng"><span>✅</span> Profesores altamente capacitados</div>
                <div class="beneficio-item-ng"><span>✅</span> Actualización y capacitación continua</div>
                <div class="beneficio-item-ng"><span>✅</span> Conferencias y campañas preventivas</div>
                <div class="beneficio-item-ng"><span>✅</span> Participación en Olimpiadas del Conocimiento</div>
              </div>
            </div>
          </div>
        }

        <!-- SECUNDARIA -->
        @else if (activeLevel === 'secundaria') {
          <div class="level-content">
            <div class="level-intro">
              <div class="level-intro-text">
                <div class="level-badge">Nivel Secundaria</div>
                <h2 class="section-title">Secundaria</h2>
                <p class="level-desc">En secundaria profundizamos el conocimiento con un enfoque en el pensamiento crítico, la investigación y la preparación universitaria. Nuestros alumnos participan en Olimpiadas del Conocimiento con resultados sobresalientes, respaldados por un equipo docente de alto nivel y programas SEP con valor agregado institucional.</p>
                <a href="https://wa.link/492onw" target="_blank" class="btn btn-primary btn-lg">
                  💬 ¡Inscríbete Ya!
                </a>
              </div>
              <div class="level-stats">
                <div class="stat-pill"><span class="stat-num">🏆</span><span class="stat-lbl">Olimpiadas del Conocimiento</span></div>
                <div class="stat-pill"><span class="stat-num">100%</span><span class="stat-lbl">Plan SEP oficial</span></div>
                <div class="stat-pill"><span class="stat-num">3 labs</span><span class="stat-lbl">Ciencias, Cómputo, Idiomas</span></div>
              </div>
            </div>

            <h3 class="features-title">Materias y Programas</h3>
            <div class="features-grid-ng">
              <div class="feature-card-ng">
                <div class="fc-icon">📋</div>
                <div class="fc-body">
                  <h4>Plan de Estudios SEP</h4>
                  <p>Cumplimiento riguroso del plan oficial con valor agregado institucional y enfoque en competencias del siglo XXI.</p>
                </div>
              </div>
              <div class="feature-card-ng">
                <div class="fc-icon">💻</div>
                <div class="fc-body">
                  <h4>Tecnología y Programación</h4>
                  <p>Laboratorio de cómputo de última generación con programación básica, ofimática y uso responsable de internet.</p>
                </div>
              </div>
              <div class="feature-card-ng">
                <div class="fc-icon">🔬</div>
                <div class="fc-body">
                  <h4>Laboratorios de Ciencias</h4>
                  <p>Prácticas experimentales de física, química y biología en laboratorios completamente equipados y modernos.</p>
                </div>
              </div>
              <div class="feature-card-ng">
                <div class="fc-icon">🇬🇧</div>
                <div class="fc-body">
                  <h4>Inglés Avanzado</h4>
                  <p>Continuación del programa bilingüe con énfasis en gramática avanzada, comprensión lectora y expresión oral.</p>
                </div>
              </div>
              <div class="feature-card-ng">
                <div class="fc-icon">🧭</div>
                <div class="fc-body">
                  <h4>Orientación Vocacional</h4>
                  <p>Acompañamiento especializado para descubrir aptitudes, intereses y vocación rumbo a preparatoria y universidad.</p>
                </div>
              </div>
              <div class="feature-card-ng">
                <div class="fc-icon">🏅</div>
                <div class="fc-body">
                  <h4>Olimpiadas del Conocimiento</h4>
                  <p>Preparación y participación activa en competencias académicas con resultados sobresalientes a nivel municipal y estatal.</p>
                </div>
              </div>
            </div>

            <div class="beneficios-bar">
              <h3 class="features-title">Beneficios Académicos</h3>
              <div class="beneficios-grid">
                <div class="beneficio-item-ng"><span>✅</span> Programa Nacional de Convivencia Escolar</div>
                <div class="beneficio-item-ng"><span>✅</span> Programa Nacional de Lectura</div>
                <div class="beneficio-item-ng"><span>✅</span> Profesores altamente capacitados</div>
                <div class="beneficio-item-ng"><span>✅</span> Actualización y capacitación continua</div>
                <div class="beneficio-item-ng"><span>✅</span> Conferencias y campañas preventivas</div>
                <div class="beneficio-item-ng"><span>✅</span> Departamento psicopedagógico propio</div>
              </div>
            </div>
          </div>
        }

        <!-- PREPARATORIA -->
        @else {
          <div class="level-content">
            <div class="coming-soon-ng">
              <div class="cs-particles">
                <span></span><span></span><span></span>
              </div>
              <div class="cs-badge">Próximamente</div>
              <div class="cs-icon-wrap">🎓</div>
              <h2>Preparatoria</h2>
              <p>Estamos diseñando un programa de preparatoria de excelencia con enfoque en la preparación universitaria y el desarrollo de competencias del siglo XXI.</p>
              <div class="cs-features">
                <div class="cs-feature"><span>🚀</span> Preparación universitaria intensiva</div>
                <div class="cs-feature"><span>💡</span> Competencias profesionales</div>
                <div class="cs-feature"><span>🌎</span> Perspectiva global</div>
              </div>
              <a routerLink="/contacto" class="btn btn-primary btn-lg" style="margin-top: 2rem;">
                📩 Solicitar más información
              </a>
            </div>
          </div>
        }

      </div>
    </section>

    <app-footer />
  `,
  styles: [`
    .levels-nav-ng {
      background: #fff; border-bottom: 1px solid var(--gray-200);
      position: sticky; top: 80px; z-index: 90;
      box-shadow: 0 2px 16px rgba(0,0,0,0.05);
    }
    .levels-inner {
      display: flex; gap: 0.25rem; padding-top: 0.75rem; padding-bottom: 0.75rem;
      overflow-x: auto;
    }
    .level-tab-ng {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.625rem 1.5rem; border-radius: 9999px;
      font-size: 0.9375rem; font-weight: 600; text-decoration: none;
      color: var(--gray-500); transition: all 0.25s; white-space: nowrap;
      border: 2px solid transparent;
      .tab-icon { font-size: 1.1rem; }
      &.active {
        background: var(--primary-500); color: #fff;
        box-shadow: 0 4px 14px rgba(0,12,53,0.25);
      }
      &:hover:not(.active) { background: var(--gray-100); color: var(--gray-800); }
    }

    .level-content { animation: fadeInUp 0.5s ease both; }

    .level-intro {
      display: grid; gap: 2.5rem; margin-bottom: 3rem;
      @media (min-width: 768px) { grid-template-columns: 1fr auto; align-items: start; }
    }
    .level-intro-text {
      .level-badge {
        display: inline-block; padding: 0.25rem 0.875rem; border-radius: 9999px;
        background: var(--primary-50); color: var(--primary-500);
        font-size: 0.8rem; font-weight: 700; text-transform: uppercase;
        letter-spacing: 0.05em; margin-bottom: 1rem;
      }
    }
    .level-desc { color: var(--gray-600); font-size: 1.05rem; line-height: 1.8; margin: 1rem 0 1.5rem; }

    .level-stats {
      display: flex; flex-direction: column; gap: 0.75rem; min-width: 200px;
    }
    .stat-pill {
      display: flex; align-items: center; gap: 0.75rem;
      background: var(--gray-50); border: 1px solid var(--gray-200);
      border-radius: 0.75rem; padding: 0.75rem 1rem;
      .stat-num { font-size: 1.125rem; font-weight: 800; color: var(--primary-500); }
      .stat-lbl { font-size: 0.8rem; color: var(--gray-500); }
    }

    .features-title {
      font-size: 1.25rem; font-weight: 700; color: var(--gray-700);
      margin-bottom: 1.5rem; padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--gray-100);
    }

    .features-grid-ng {
      display: grid; gap: 1.25rem; margin-bottom: 3rem;
      grid-template-columns: 1fr;
      @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
      @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
    }

    .feature-card-ng {
      display: flex; gap: 1rem; align-items: flex-start;
      background: #fff; border: 1px solid var(--gray-200);
      border-radius: 1rem; padding: 1.5rem;
      transition: all 0.3s ease;
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 36px rgba(0,12,53,0.1);
        border-color: var(--primary-200);
      }
      .fc-icon {
        font-size: 1.75rem; min-width: 44px; height: 44px;
        display: flex; align-items: center; justify-content: center;
        background: var(--gray-50); border-radius: 0.75rem;
      }
      .fc-body {
        h4 { font-size: 0.9375rem; font-weight: 700; color: var(--primary-500); margin-bottom: 0.375rem; }
        p { font-size: 0.8375rem; color: var(--gray-500); line-height: 1.6; }
      }
    }

    .beneficios-bar {
      background: var(--gray-50); border-radius: 1.25rem; padding: 2rem;
      border: 1px solid var(--gray-200);
    }
    .beneficios-grid {
      display: grid; gap: 0.75rem;
      grid-template-columns: 1fr;
      @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
      @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
    }
    .beneficio-item-ng {
      display: flex; align-items: center; gap: 0.625rem;
      font-size: 0.875rem; color: var(--gray-700); font-weight: 500;
    }

    /* Coming soon */
    .coming-soon-ng {
      text-align: center; padding: 5rem 2rem; max-width: 620px; margin: 0 auto;
      position: relative;
      h2 { font-family: 'Playfair Display', serif; font-size: 2.25rem; font-weight: 700; color: var(--primary-500); margin: 1rem 0 0.75rem; }
      p { color: var(--gray-500); font-size: 1.05rem; line-height: 1.7; margin-bottom: 1.5rem; }
    }
    .cs-badge {
      display: inline-block; padding: 0.35rem 1rem; border-radius: 9999px;
      background: linear-gradient(135deg, var(--gold-400), var(--gold-500));
      color: #fff; font-size: 0.8rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.07em; margin-bottom: 1.25rem;
    }
    .cs-icon-wrap { font-size: 4rem; display: block; margin-bottom: 0.75rem; animation: float 4s ease-in-out infinite; }
    .cs-features {
      display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; margin-top: 1.5rem;
    }
    .cs-feature {
      display: flex; align-items: center; gap: 0.5rem;
      background: var(--gray-50); border: 1px solid var(--gray-200);
      padding: 0.5rem 1rem; border-radius: 9999px;
      font-size: 0.875rem; color: var(--gray-700); font-weight: 500;
    }
    .cs-particles {
      position: absolute; inset: 0; pointer-events: none; overflow: hidden;
      span {
        position: absolute; border-radius: 50%;
        background: var(--primary-50);
        &:nth-child(1) { width: 120px; height: 120px; top: 10%; left: -5%; opacity: 0.5; animation: float 7s ease-in-out infinite; }
        &:nth-child(2) { width: 80px; height: 80px; top: 20%; right: 5%; opacity: 0.4; animation: float 9s ease-in-out infinite reverse; }
        &:nth-child(3) { width: 60px; height: 60px; bottom: 15%; left: 10%; opacity: 0.3; animation: float 6s ease-in-out infinite; }
      }
    }
  `]
})
export class OfertaComponent implements AfterViewInit {
  activeLevel = 'primaria';

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.activeLevel = params['nivel'] || 'primaria';
    });
  }

  ngAfterViewInit() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).style.opacity = '1'; (e.target as HTMLElement).style.transform = 'translateY(0)'; } });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.feature-card-ng').forEach((el, i) => {
      (el as HTMLElement).style.cssText += `opacity:0;transform:translateY(24px);transition:opacity 0.55s ${i * 0.08}s ease,transform 0.55s ${i * 0.08}s ease,box-shadow 0.3s,border-color 0.3s`;
      obs.observe(el);
    });
  }
}
