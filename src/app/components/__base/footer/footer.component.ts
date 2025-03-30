import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { APP_OPTIONS, AppOptions } from 'src/app/models/app.models';

@Component({
  selector: 'app-footer',
  imports: [CommonModule /* ,MatButtonModule */],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly build = build;

  constructor(@Inject(APP_OPTIONS) readonly options: AppOptions) {}
}
