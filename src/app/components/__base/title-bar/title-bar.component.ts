import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { RouterService } from 'src/app/services/router.service';

// TODO gap helper conflicts with negative link margin

@Component({
  selector: 'app-title-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-flex flex-wrap' },
})
export class TitleBarComponent {
  readonly title$ = this.routerService.title$;

  @Input() backUrl?: string | null;

  constructor(private readonly routerService: RouterService) {}
}
