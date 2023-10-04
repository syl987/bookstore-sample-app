import { Inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { APP_OPTIONS, AppOptions } from '../models/app.models';

@Injectable()
export class AppTitleStrategy extends TitleStrategy {
  constructor(
    @Inject(APP_OPTIONS) readonly options: AppOptions,
    private readonly title: Title,
  ) {
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
