import { Injectable, signal, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

const STORAGE_KEY = 'agng-lang-preference';
const AVAILABLE_LANGS = ['en', 'sr'] as const;
type Lang = (typeof AVAILABLE_LANGS)[number];

/**
 * Manages the active language for Transloco.
 * Persists preference to localStorage and exposes a signal for reactive UIs.
 * Mirrors the pattern used by ThemeService.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private transloco = inject(TranslocoService);

  readonly currentLang = signal<Lang>('en');

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    const lang: Lang = stored && (AVAILABLE_LANGS as readonly string[]).includes(stored)
      ? (stored as Lang)
      : 'en';
    this.applyLang(lang);
  }

  toggle(): void {
    this.applyLang(this.currentLang() === 'en' ? 'sr' : 'en');
  }

  private applyLang(lang: Lang): void {
    this.currentLang.set(lang);
    this.transloco.setActiveLang(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute('lang', lang);
  }
}
