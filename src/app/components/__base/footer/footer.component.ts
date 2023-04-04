import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from 'src/app/models/app.models';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();

  constructor(@Inject(APP_CONFIG) readonly config: AppConfig) {}
}
