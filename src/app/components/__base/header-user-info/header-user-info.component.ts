import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AuthUser } from 'src/app/models/auth.models';

@Component({
  selector: 'app-header-user-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-user-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderUserInfoComponent {
  @Input({ required: true }) user!: AuthUser;
}
