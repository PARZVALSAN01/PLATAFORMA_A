import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card card">
        <div class="auth-header">
          <a routerLink="/" class="auth-logo">
            <span class="brand-primary">Instituto</span> <span class="brand-accent">Anáhuac</span>
          </a>
          <h1>Registro</h1>
          <p>Crea tu cuenta en el portal educativo</p>
        </div>
        <form (ngSubmit)="register()" class="form-stack">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Nombre *</label>
              <input type="text" class="form-input" [(ngModel)]="form.firstName" name="firstName" required>
            </div>
            <div class="form-group">
              <label class="form-label">Apellido *</label>
              <input type="text" class="form-input" [(ngModel)]="form.lastName" name="lastName" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Correo electrónico *</label>
            <input type="email" class="form-input" [(ngModel)]="form.email" name="email" required>
          </div>
          <div class="form-group">
            <label class="form-label">Contraseña *</label>
            <input type="password" class="form-input" [(ngModel)]="form.password" name="password" required minlength="6">
          </div>
          <div class="form-group">
            <label class="form-label">Confirmar contraseña *</label>
            <input type="password" class="form-input" [(ngModel)]="confirmPassword" name="confirmPassword" required>
          </div>
          <div class="form-group">
            <label class="form-label">Rol *</label>
            <select class="form-input" [(ngModel)]="form.role" name="role" required>
              <option value="">Seleccionar rol</option>
              <option value="STUDENT">Alumno</option>
              <option value="PARENT">Padre de familia</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary btn-lg w-full" [disabled]="loading">
            {{ loading ? 'Registrando...' : 'Crear cuenta' }}
          </button>
        </form>
        <div class="auth-footer">
          <p>¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a></p>
          <a routerLink="/" class="back-link">← Volver al inicio</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper { min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, var(--primary-500), var(--accent-500)); padding: 2rem;
    }
    .auth-card { width: 100%; max-width: 480px; padding: 2.5rem; }
    .auth-header { text-align: center; margin-bottom: 2rem;
      .auth-logo { text-decoration: none; font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 700; }
      .brand-primary { color: var(--primary-500); }
      .brand-accent { color: var(--accent-500); }
      h1 { font-size: 1.5rem; font-weight: 700; color: var(--gray-800); margin: 1.5rem 0 0.25rem; }
      p { font-size: 0.875rem; color: var(--gray-500); }
    }
    .form-stack { display: flex; flex-direction: column; gap: 1rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
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
export class RegisterComponent {
  form = { firstName: '', lastName: '', email: '', password: '', role: '' };
  confirmPassword = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router, private toast: ToastService) {}

  register() {
    if (!this.form.firstName || !this.form.lastName || !this.form.email || !this.form.password || !this.form.role) {
      this.toast.show('Completa todos los campos requeridos', 'error');
      return;
    }
    if (this.form.password !== this.confirmPassword) {
      this.toast.show('Las contraseñas no coinciden', 'error');
      return;
    }
    if (this.form.password.length < 6) {
      this.toast.show('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }
    this.loading = true;
    this.auth.register(this.form).subscribe({
      next: () => {
        this.toast.show('Cuenta creada exitosamente', 'success');
        const paths: Record<string, string> = { ADMIN: '/admin', TEACHER: '/docente', STUDENT: '/alumno', PARENT: '/padre' };
        this.router.navigate([paths[this.form.role] || '/']);
        this.loading = false;
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Error al registrarse', 'error');
        this.loading = false;
      }
    });
  }
}
