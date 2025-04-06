import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-title-bar',
  imports: [RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './title-bar.component.html',
  styleUrl: './title-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-flex flex-wrap' },
})
export class TitleBarComponent {
  protected readonly routerService = inject(RouterService);

  readonly title = this.routerService.title;

  readonly backUrl = input<string | null>();
}
