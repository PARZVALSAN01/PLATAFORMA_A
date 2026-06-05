import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = '/api/auth';
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  private userSignal = signal<User | null>(null);
  private profileSignal = signal<any>(null);
  private loadingSignal = signal(true);

  user = this.userSignal.asReadonly();
  profile = this.profileSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  isAuthenticated = computed(() => !!this.userSignal());

  private readonly rolePaths: Record<string, string> = {
    admin: '/admin',
    teacher: '/docente',
    student: '/alumno',
    parent: '/padre'
  };

  constructor() {
    this.initAuth();
  }

  private initAuth(): void {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        this.userSignal.set(JSON.parse(savedUser));
        this.loadProfile();
      } catch {
        this.logout();
      }
    }
    this.loadingSignal.set(false);
  }

  loadProfile(): void {
    this.http.get<{ user: User; profile: any }>(`${this.API}/profile`).subscribe({
      next: (data) => {
        this.userSignal.set(data.user);
        this.profileSignal.set(data.profile);
        localStorage.setItem('user', JSON.stringify(data.user));
      },
      error: () => {}
    });
  }

  login(credentials: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.API}/login`, credentials).pipe(
      tap(data => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        this.userSignal.set(data.user);
        this.profileSignal.set(data.profile);
        this.toast.success(`¡Bienvenido/a, ${data.user.firstName}!`);
      }),
      catchError(err => {
        this.toast.error(err.error?.message || 'Error al iniciar sesión');
        throw err;
      })
    );
  }

  register(userData: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.API}/register`, userData).pipe(
      tap(data => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        this.userSignal.set(data.user);
        this.toast.success('Cuenta creada exitosamente');
      }),
      catchError(err => {
        this.toast.error(err.error?.message || 'Error al registrar');
        throw err;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSignal.set(null);
    this.profileSignal.set(null);
    this.toast.success('Sesión cerrada');
    this.router.navigate(['/']);
  }

  silentLogout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSignal.set(null);
    this.profileSignal.set(null);
  }

  getDashboardPath(): string {
    const role = this.userSignal()?.role;
    return role ? (this.rolePaths[role] || '/login') : '/login';
  }
}
