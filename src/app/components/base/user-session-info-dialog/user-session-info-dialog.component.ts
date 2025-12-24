import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { AuthUser } from 'src/app/models/auth.models';

export interface UserSessionInfoDialogData {
  user: AuthUser;
}

@Component({
  selector: 'app-user-session-info-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    DatePipe,
  ],
  templateUrl: './user-session-info-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSessionInfoDialogComponent {
  readonly data = inject<UserSessionInfoDialogData>(MAT_DIALOG_DATA);

  readonly user = this.data.user;

  getAuthProviders(user: AuthUser): string {
    return user.providerData.map(p => p.providerId).join(', ');
  }
}
