import { ChangeDetectionStrategy, Component, VERSION } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { TitleBarComponent } from '../__base/title-bar/title-bar.component';

@Component({
  selector: 'app-welcome-page',
  imports: [MatCardModule, TitleBarComponent],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePageComponent {
  readonly major = VERSION.major;
}
