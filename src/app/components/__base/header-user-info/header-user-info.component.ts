import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AuthUser } from 'src/app/models/auth.models';

@Component({
  selector: 'app-header-user-info',
  imports: [CommonModule],
  templateUrl: './header-user-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderUserInfoComponent {
  readonly user = input.required<AuthUser>();
}
