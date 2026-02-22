import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);
  private document = inject(DOCUMENT);

  getTranslation(lang: string) {
    const base = this.document.querySelector('base')?.getAttribute('href') ?? '/';
    return this.http.get<Translation>(`${base}i18n/${lang}.json`);
  }
}
