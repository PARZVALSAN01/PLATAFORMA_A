import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../components/header/header';
import { FooterComponent } from '../../../components/footer/footer';
import { ContentService } from '../../../services/content.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule],
  template: `
    <app-header />

    <!-- Hero -->
    <div class="page-hero-ng">
      <div class="hero-orb hero-orb-1"></div>
      <div class="hero-orb hero-orb-2"></div>
      <div class="container">
        <span class="hero-badge-ng">Estamos aquí para ayudarte</span>
        <h1>Contacto</h1>
        <p>Comunícate con nosotros y resolveremos todas tus dudas sobre inscripciones y servicios</p>
      </div>
    </div>

    <section class="section">
      <div class="container contact-layout">

        <!-- Form -->
        <div class="contact-form-wrap">
          <div class="form-card">
            <h2>Envíanos un mensaje</h2>
            <p class="form-sub">Responderemos a la brevedad posible</p>
            <form (ngSubmit)="submit()" class="form-stack">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Nombre completo *</label>
                  <input type="text" class="form-input" [(ngModel)]="form.name" name="name" placeholder="Tu nombre" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Teléfono</label>
                  <input type="tel" class="form-input" [(ngModel)]="form.phone" name="phone" placeholder="55 0000 0000">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Correo electrónico *</label>
                <input type="email" class="form-input" [(ngModel)]="form.email" name="email" placeholder="tu&#64;correo.com" required>
              </div>
              <div class="form-group">
                <label class="form-label">Asunto *</label>
                <select class="form-input" [(ngModel)]="form.subject" name="subject" required>
                  <option value="">Seleccionar asunto</option>
                  <option value="inscripciones">Inscripciones</option>
                  <option value="informacion">Información general</option>
                  <option value="academico">Asuntos académicos</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Mensaje *</label>
                <textarea class="form-input" [(ngModel)]="form.message" name="message" rows="5" placeholder="Escribe tu mensaje aquí..." required></textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-lg submit-btn" [disabled]="submitting">
                {{ submitting ? 'Enviando...' : 'Enviar mensaje →' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Info sidebar -->
        <div class="contact-sidebar">
          <div class="info-cards">
            <a href="https://maps.google.com/?q=C.+Benito+Juárez+1A,+San+Mateo+Cuautepec,+54948+Fuentes+del+Valle,+México" target="_blank" class="info-card-ng">
              <div class="info-icon-wrap">📍</div>
              <div>
                <h4>Dirección</h4>
                <p>C. Benito Juárez 1A, San Mateo Cuautepec<br>54948 Fuentes del Valle, Méx.</p>
              </div>
            </a>
            <a href="tel:5525932955" class="info-card-ng">
              <div class="info-icon-wrap">📞</div>
              <div>
                <h4>Teléfono</h4>
                <p>55 2593 2955</p>
              </div>
            </a>
            <a href="mailto:informes@institutoanahuac.com" class="info-card-ng">
              <div class="info-icon-wrap">✉️</div>
              <div>
                <h4>Correo</h4>
                <p>informes&#64;institutoanahuac.com</p>
              </div>
            </a>
            <div class="info-card-ng no-link">
              <div class="info-icon-wrap">🕐</div>
              <div>
                <h4>Horario de atención</h4>
                <p>Lunes a Viernes: 7:30 – 16:00</p>
              </div>
            </div>
          </div>

          <!-- WhatsApp CTA -->
          <a href="https://wa.link/492onw" target="_blank" class="whatsapp-cta">
            <span class="wa-icon">💬</span>
            <div>
              <strong>¡Chatea con nosotros!</strong>
              <span>Respuesta inmediata vía WhatsApp</span>
            </div>
          </a>

          <!-- Social -->
          <div class="social-card">
            <p>Síguenos en redes sociales</p>
            <div class="social-links">
              <a href="https://www.facebook.com/InstitutoAnahuacTultitlan" target="_blank" class="social-link fb">f</a>
              <a href="https://www.instagram.com/instituto___anahuac" target="_blank" class="social-link ig">ig</a>
              <a href="https://www.youtube.com/@InstitutoAnahuac" target="_blank" class="social-link yt">▶</a>
            </div>
          </div>
        </div>

      </div>
    </section>

    <app-footer />
  `,
  styles: [`
    .contact-layout {
      display: grid; gap: 2.5rem;
      grid-template-columns: 1fr;
      @media (min-width: 900px) { grid-template-columns: 1fr 380px; align-items: start; }
    }

    /* Form card */
    .form-card {
      background: #fff; border-radius: 1.5rem;
      border: 1px solid var(--gray-200);
      padding: 2.5rem;
      box-shadow: 0 4px 24px rgba(0,0,0,0.05);
      h2 { font-family: 'Playfair Display', serif; font-size: 1.625rem; font-weight: 700; color: var(--primary-500); margin-bottom: 0.25rem; }
    }
    .form-sub { font-size: 0.9rem; color: var(--gray-400); margin-bottom: 2rem; }

    .form-row {
      display: grid; gap: 1rem;
      @media (min-width: 540px) { grid-template-columns: 1fr 1fr; }
    }
    .form-stack { display: flex; flex-direction: column; gap: 1rem; }

    .submit-btn {
      margin-top: 0.5rem; width: 100%; font-size: 1rem;
      background: linear-gradient(135deg, var(--primary-500), var(--accent-500));
      transition: all 0.3s; letter-spacing: 0.02em;
      &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,12,53,0.3); }
    }

    /* Info sidebar */
    .info-cards { display: flex; flex-direction: column; gap: 0.875rem; margin-bottom: 1.25rem; }

    .info-card-ng {
      display: flex; align-items: flex-start; gap: 1rem;
      background: #fff; border: 1px solid var(--gray-200);
      border-radius: 1rem; padding: 1.125rem 1.25rem;
      transition: all 0.25s; text-decoration: none; color: inherit;
      &:hover { transform: translateX(4px); box-shadow: 0 6px 20px rgba(0,12,53,0.08); border-color: var(--primary-200); }
      &.no-link:hover { transform: none; box-shadow: none; border-color: var(--gray-200); cursor: default; }
      h4 { font-size: 0.8125rem; font-weight: 700; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
      p { font-size: 0.9rem; color: var(--primary-500); font-weight: 600; line-height: 1.5; }
    }
    .info-icon-wrap {
      font-size: 1.375rem; min-width: 44px; height: 44px;
      background: var(--gray-50); border-radius: 0.75rem;
      display: flex; align-items: center; justify-content: center;
    }

    /* WhatsApp CTA */
    .whatsapp-cta {
      display: flex; align-items: center; gap: 1rem;
      background: linear-gradient(135deg, #25d366, #128c7e);
      border-radius: 1rem; padding: 1.25rem 1.5rem;
      color: #fff; text-decoration: none;
      transition: all 0.3s; margin-bottom: 1.25rem;
      &:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(37,211,102,0.35); }
      .wa-icon { font-size: 2rem; }
      strong { display: block; font-size: 0.9375rem; font-weight: 700; }
      span { font-size: 0.8125rem; opacity: 0.9; }
    }

    /* Social */
    .social-card {
      background: #fff; border: 1px solid var(--gray-200);
      border-radius: 1rem; padding: 1.25rem;
      text-align: center;
      p { font-size: 0.85rem; color: var(--gray-500); margin-bottom: 0.875rem; }
    }
    .social-links { display: flex; justify-content: center; gap: 0.75rem; }
    .social-link {
      width: 44px; height: 44px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.875rem; font-weight: 700; color: #fff;
      transition: all 0.25s; text-decoration: none;
      &.fb { background: #1877f2; &:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(24,119,242,0.4); } }
      &.ig { background: linear-gradient(135deg, #f58529, #dd2a7b, #515bd4); &:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(221,42,123,0.4); } }
      &.yt { background: #ff0000; &:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(255,0,0,0.4); } }
    }
  `]
})
export class ContactoComponent {
  form = { name: '', email: '', phone: '', subject: '', message: '' };
  submitting = false;

  constructor(private contentService: ContentService, private toast: ToastService) {}

  submit() {
    if (!this.form.name || !this.form.email || !this.form.subject || !this.form.message) {
      this.toast.show('Por favor completa los campos requeridos', 'error');
      return;
    }
    this.submitting = true;
    this.contentService.createContactRequest(this.form).subscribe({
      next: () => {
        this.toast.show('Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.', 'success');
        this.form = { name: '', email: '', phone: '', subject: '', message: '' };
        this.submitting = false;
      },
      error: () => {
        this.toast.show('Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
        this.submitting = false;
      }
    });
  }
}
