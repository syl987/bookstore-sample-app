import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { APP_OPTIONS } from 'src/app/models/app.models';

@Component({
  selector: 'app-footer',
  imports: [CommonModule /* ,MatButtonModule */],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly options = inject(APP_OPTIONS);

  readonly build = build;
}
