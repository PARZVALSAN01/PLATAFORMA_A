import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header';
import { FooterComponent } from '../../../components/footer/footer';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  template: `
    <app-header />
    <div class="page-hero">
      <div class="container">
        <h1>Nosotros</h1>
        <p>Conoce la historia y misión del Instituto Anáhuac</p>
      </div>
    </div>
    <section class="section">
      <div class="container content-grid">
        <div>
          <h2 class="section-title">Nuestra Historia</h2>
          <p class="text-body" style="text-align:justify;">Con más de 22 años de historia inspiradora, el Instituto Anáhuac se distingue por su excelencia académica y una formación integral que enciende la pasión por el aprendizaje en cada uno de sus estudiantes, preparándolos para enfrentar con entusiasmo y valentía los retos del mundo actual.</p>
          <p class="text-body" style="text-align:justify;">A lo largo de nuestra trayectoria, hemos formado a más de 5,000 estudiantes que hoy son líderes en sus comunidades y profesiones, manteniendo siempre nuestro compromiso con la calidad educativa y los valores que nos distinguen en Fuentes del Valle, Estado de México.</p>
        </div>
        <div class="mission-cards">
          <div class="card mission-card">
            <h3>🎯 Misión</h3>
            <p>Formar personas íntegras con excelencia académica, valores sólidos y compromiso social, preparadas para enfrentar con entusiasmo y valentía los retos del mundo actual.</p>
          </div>
          <div class="card mission-card">
            <h3>🔭 Visión</h3>
            <p>Ser la institución educativa líder en Fuentes del Valle, Estado de México, reconocida por su innovación pedagógica, formación en valores y contribución al desarrollo de la comunidad.</p>
          </div>
          <div class="card mission-card">
            <h3>⭐ Valores</h3>
            <p>Respeto, responsabilidad, honestidad, solidaridad, excelencia y compromiso con la verdad y los valores mexicanos son los pilares que guían nuestra labor educativa.</p>
          </div>
        </div>
      </div>
    </section>
    <app-footer />
  `,
  styles: [`
    .page-hero {
      background: linear-gradient(135deg, var(--primary-500), var(--accent-500));
      padding: 8rem 0 4rem; color: #fff;
      h1 { font-family: 'Playfair Display', serif; font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; }
      p { font-size: 1.125rem; opacity: 0.8; }
    }
    .content-grid {
      display: grid; grid-template-columns: 1fr; gap: 3rem;
      @media (min-width: 768px) { grid-template-columns: 1fr 1fr; }
    }
    .text-body { color: var(--gray-600); line-height: 1.8; margin-bottom: 1rem; }
    .mission-cards { display: flex; flex-direction: column; gap: 1rem; }
    .mission-card { h3 { font-size: 1.125rem; font-weight: 600; color: var(--primary-500); margin-bottom: 0.5rem; } p { color: var(--gray-500); font-size: 0.875rem; line-height: 1.6; } }
  `]
})
export class AboutComponent {}
