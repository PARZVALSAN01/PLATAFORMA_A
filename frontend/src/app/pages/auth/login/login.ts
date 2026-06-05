import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card card">
        <div class="auth-header">
          <a routerLink="/" class="auth-logo">
            <span class="brand-primary">Instituto</span> <span class="brand-accent">Anáhuac</span>
          </a>
          <h1>Iniciar Sesión</h1>
          <p>Accede a tu portal educativo</p>
        </div>
        <form (ngSubmit)="login()" class="form-stack">
          <div class="form-group">
            <label class="form-label">Correo electrónico</label>
            <input type="email" class="form-input" [(ngModel)]="email" name="email" placeholder="correo&#64;ejemplo.com" required>
          </div>
          <div class="form-group">
            <label class="form-label">Contraseña</label>
            <input type="password" class="form-input" [(ngModel)]="password" name="password" placeholder="••••••••" required>
          </div>
          <button type="submit" class="btn btn-primary btn-lg w-full" [disabled]="loading">
            {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
          </button>
        </form>
        <div class="auth-footer">
          <p>¿No tienes cuenta? <a routerLink="/registro">Regístrate aquí</a></p>
          <a routerLink="/" class="back-link">← Volver al inicio</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper { min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, var(--primary-500), var(--accent-500)); padding: 2rem;
    }
    .auth-card { width: 100%; max-width: 420px; padding: 2.5rem; }
    .auth-header { text-align: center; margin-bottom: 2rem;
      .auth-logo { text-decoration: none; font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 700; }
      .brand-primary { color: var(--primary-500); }
      .brand-accent { color: var(--accent-500); }
      h1 { font-size: 1.5rem; font-weight: 700; color: var(--gray-800); margin: 1.5rem 0 0.25rem; }
      p { font-size: 0.875rem; color: var(--gray-500); }
    }
    .form-stack { display: flex; flex-direction: column; gap: 1rem; }
    .w-full { width: 100%; }
    .auth-footer { text-align: center; margin-top: 1.5rem;
      p { font-size: 0.875rem; color: var(--gray-500); }
      a { color: var(--primary-500); font-weight: 500; text-decoration: none;
        &:hover { text-decoration: underline; }
      }
      .back-link { display: inline-block; margin-top: 0.75rem; font-size: 0.8125rem; color: var(--gray-400); }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router, private toast: ToastService) {}

  login() {
    if (!this.email || !this.password) {
      this.toast.show('Ingresa tu correo y contraseña', 'error');
      return;
    }
    this.loading = true;
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        const user = this.auth.user();
        if (user) {
          const paths: Record<string, string> = { admin: '/admin', teacher: '/docente', student: '/alumno', parent: '/padre' };
          this.router.navigate([paths[user.role] || '/']);
        }
        this.loading = false;
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Credenciales inválidas', 'error');
        this.loading = false;
      }
    });
  }
}
