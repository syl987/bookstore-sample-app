import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { APP_OPTIONS, AppOptions } from '../models/app.models';

@Injectable()
export class AppTitleStrategy extends TitleStrategy {
  readonly options = inject<AppOptions>(APP_OPTIONS);
  private readonly title = inject(Title);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot): void {
    const title = this.buildTitle(routerState);

    if (title) {
      this.title.setTitle(title + ' - ' + this.options.applicationName);
    } else {
      this.title.setTitle(this.options.applicationName);
    }
  }
}
