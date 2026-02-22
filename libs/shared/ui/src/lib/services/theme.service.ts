import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'agng-theme-preference';

/**
 * Manages light/dark theme via the CSS color-scheme property.
 *
 * Angular Material v19+ mat.theme() emits color values using the CSS
 * light-dark() function. Toggling `color-scheme: dark` on <body> is all
 * that's needed — the browser switches every light-dark() value instantly.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal(false);

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY);
    const prefersDark = stored
      ? stored === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.applyDark(prefersDark);
  }

  toggle(): void {
    this.applyDark(!this.isDark());
  }

  private applyDark(dark: boolean): void {
    this.isDark.set(dark);
    document.documentElement.classList.toggle('dark-mode', dark);
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  }
}
