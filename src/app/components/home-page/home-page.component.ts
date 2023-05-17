import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TitleBarComponent } from '../__base/title-bar/title-bar.component';

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
