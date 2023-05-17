import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AuthUser } from 'src/app/models/auth.models';
import { BooleanPipe } from 'src/app/pipes/boolean.pipe';

export interface UserSessionInfoDialogData {
  user: AuthUser;
}

@Component({
  selector: 'app-user-session-info-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, BooleanPipe],
  templateUrl: './user-session-info-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSessionInfoDialogComponent {
  readonly user = this.data.user;

  constructor(@Inject(MAT_DIALOG_DATA) readonly data: UserSessionInfoDialogData) {}

  getAuthProviders(user: AuthUser): string {
    return user.providerData.map((p: any) => p.providerId).join(', ');
  }
}
