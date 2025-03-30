import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AuthUser } from 'src/app/models/auth.models';

export interface UserSessionInfoDialogData {
  user: AuthUser;
}

@Component({
  selector: 'app-user-session-info-dialog',
  imports: [MatButtonModule, MatDialogModule, DatePipe],
  templateUrl: './user-session-info-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSessionInfoDialogComponent {
  readonly user = this.data.user;

  constructor(@Inject(MAT_DIALOG_DATA) readonly data: UserSessionInfoDialogData) {}

  getAuthProviders(user: AuthUser): string {
    return user.providerData.map(p => p.providerId).join(', ');
  }
}
