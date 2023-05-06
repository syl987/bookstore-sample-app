import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthUser } from 'src/app/models/auth.models';

export interface UserSettingsDialogData {
  user: AuthUser;
}

@Component({
  selector: 'app-user-settings-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-settings-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsDialogComponent {
  readonly user = this.data.user;

  constructor(@Inject(MAT_DIALOG_DATA) readonly data: UserSettingsDialogData) {}

  getAuthProviders(user: AuthUser): string {
    return user.providerData.map((p: any) => p.providerId).join(', ');
  }
}
