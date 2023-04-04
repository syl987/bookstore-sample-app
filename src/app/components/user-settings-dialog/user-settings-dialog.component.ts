import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { AuthUser } from 'src/app/models/auth.models';

export interface UserSettingsDialogData {
  user: AuthUser;
}

@Component({
  selector: 'app-user-settings-dialog',
  templateUrl: './user-settings-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsDialogComponent {
  readonly user = this.data.user;

  constructor(@Inject(MAT_DIALOG_DATA) readonly data: UserSettingsDialogData) {}

  getProviders(user: AuthUser): string {
    return user.providerData.map((p: any) => p.providerId).join(', ');
  }
}
