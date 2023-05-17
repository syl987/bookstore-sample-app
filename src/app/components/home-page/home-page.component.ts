import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TitleBarComponent } from '../__base/title-bar/title-bar.component';

// display some welcome message or banner
// display some data protection policy
// display random or newest volumes
// include published books data
// navigate to volume detail

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, TitleBarComponent],
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
