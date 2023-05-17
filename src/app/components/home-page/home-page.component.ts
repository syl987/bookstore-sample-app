import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TitleBarComponent } from '../__base/title-bar/title-bar.component';

// TODO localization: language translations only, using German locale by default because the app is not intended to be multi-national in its nature, justmulti-language

// TODO display some welcome message or banner
// TODO display some data protection policy
// TODO display random or newest volumes
// TODO include published books data
// TODO navigate to volume detail

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, TitleBarComponent],
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
