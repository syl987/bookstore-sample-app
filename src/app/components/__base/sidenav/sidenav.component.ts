import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { APP_NAV_LINKS } from 'src/app/models/app.models';
import { AuthUser } from 'src/app/models/auth.models';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  readonly user = toSignal(this.authService.user$);

  readonly USER_LINKS = APP_NAV_LINKS.filter(link => link.user);
  readonly PUBLIC_LINKS = APP_NAV_LINKS.filter(link => !link.user);

  @Output() readonly navigated = new EventEmitter<void>();

  constructor(private readonly router: Router, private readonly authService: AuthService, private readonly dialogService: DialogService) {}

  navigateToLogin(): void {
    this.router.navigateByUrl('/login');
  }

  openUserSessionInfoDialog(user: AuthUser): void {
    this.dialogService.openUserSessionInfoDialog(user);
  }

  logout(): void {
    this.authService.logout();
  }
}
