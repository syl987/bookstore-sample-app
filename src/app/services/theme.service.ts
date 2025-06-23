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

  toggleTheme(): string {
    if (this.theme === 'dark') {
      this.document.body.style.colorScheme = 'light';
      this.#theme = 'light';
      return 'light';
    }
    this.document.body.style.colorScheme = 'dark';
    this.#theme = 'dark';
    return 'dark';
  }

  private _getDefaultTheme(): string {
    const view = this.document.defaultView;
    return view?.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
