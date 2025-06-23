import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { APP_OPTIONS } from '../models/app.models';

@Injectable()
export class AppTitleStrategy extends TitleStrategy {
  protected readonly title = inject(Title);

  readonly options = inject(APP_OPTIONS);

  override updateTitle(routerState: RouterStateSnapshot): void {
    const title = this.buildTitle(routerState);

    if (title) {
      this.title.setTitle(title + ' - ' + this.options.applicationName);
    } else {
      this.title.setTitle(this.options.applicationName);
    }
  }
}
