import { inject, Injectable, DOCUMENT } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  protected readonly document = inject(DOCUMENT);

  #theme = this._getDefaultTheme();

  get theme(): string {
    return this.#theme;
  }

  toggleTheme(): void {
    if (this.theme === 'dark') {
      this.document.body.style.colorScheme = 'light';
      this.#theme = 'light';
    } else {
      this.document.body.style.colorScheme = 'dark';
      this.#theme = 'dark';
    }
  }

  private _getDefaultTheme(): string {
    return this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
