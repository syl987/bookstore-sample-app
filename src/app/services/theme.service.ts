import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  protected readonly document = inject(DOCUMENT);

  #theme: string = this._getDefaultTheme();

  get theme(): string {
    return this.#theme;
  }

  toggleTheme(): void {
    if (this.#theme === 'dark') {
      this.document.body.style.colorScheme = 'light';
      this.#theme = 'light';
    } else {
      this.document.body.style.colorScheme = 'dark';
      this.#theme = 'dark';
    }
  }

  private _getDefaultTheme(): string {
    const view = this.document.defaultView;
    return view && view.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
