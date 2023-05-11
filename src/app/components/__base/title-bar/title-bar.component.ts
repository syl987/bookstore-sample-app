import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-title-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './title-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleBarComponent {
  readonly title$ = this.routerService.title$;

  constructor(private readonly observer: BreakpointObserver, private readonly routerService: RouterService) {}
}
