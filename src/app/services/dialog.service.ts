import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { BookCreateDialogComponent } from '../components/book-create-dialog/book-create-dialog.component';
import { CropImageDialogComponent, CropImageDialogData } from '../components/crop-image-dialog/crop-image-dialog.component';
import { UserBookPublishDialogComponent } from '../components/user-book-publish-dialog/user-book-publish-dialog.component';
import { UserSettingsDialogComponent, UserSettingsDialogData } from '../components/user-settings-dialog/user-settings-dialog.component';
import { AuthUser } from '../models/auth.models';
import { UserBookDTO } from '../models/book.models';

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

  openUserBookCreateDialog(): MatDialogRef<BookCreateDialogComponent, UserBookDTO | undefined> {
    return this.dialog.open(BookCreateDialogComponent, { maxWidth: 768 });
  }

  openUserBookPublishDialog(): MatDialogRef<UserBookPublishDialogComponent, boolean | undefined> {
    return this.dialog.open(UserBookPublishDialogComponent, { maxWidth: 568 });
  }

  closeAllDialogs(): void {
    return this.dialog.closeAll();
  }
}
