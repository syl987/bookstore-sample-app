import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { APP_OPTIONS, AppOptions } from 'src/app/models/app.models';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule /* ,MatButtonModule */],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();

  constructor(@Inject(APP_OPTIONS) readonly options: AppOptions) {}
}
