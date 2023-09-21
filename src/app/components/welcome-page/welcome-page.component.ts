import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { TitleBarComponent } from '../__base/title-bar/title-bar.component';

// TODO display some welcome message or banner
// TODO display some data protection policy

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, TitleBarComponent],
  templateUrl: './welcome-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePageComponent {}
