import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'theme';
  private darkMode = signal(false);

  isDark = this.darkMode.asReadonly();

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved === 'dark') {
      this.applyDark(true);
    }
  }

  toggle(): void {
    this.applyDark(!this.darkMode());
  }

  private applyDark(dark: boolean): void {
    this.darkMode.set(dark);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem(this.STORAGE_KEY, dark ? 'dark' : 'light');
  }
}
