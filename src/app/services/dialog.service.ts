import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { CropImageDialogComponent, CropImageDialogData } from '../components/crop-image-dialog/crop-image-dialog.component';
import { UserSettingsDialogComponent, UserSettingsDialogData } from '../components/user-settings-dialog/user-settings-dialog.component';
import { AuthUser } from '../models/auth.models';

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    constructor(private readonly dialog: MatDialog) {}

    openCropImageDialog(file: File): MatDialogRef<CropImageDialogComponent, Blob | null | undefined> {
        const data: CropImageDialogData = { file };

        return this.dialog.open(CropImageDialogComponent, { data, maxWidth: 768 });
    }

    openUserSettingsDialog(user: AuthUser): MatDialogRef<UserSettingsDialogComponent, void> {
        const data: UserSettingsDialogData = { user };

        return this.dialog.open(UserSettingsDialogComponent, { data, maxWidth: 768 });
    }

    closeAllDialogs(): void {
        return this.dialog.closeAll();
    }
}
