import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ConfirmationDialogComponent, ConfirmationDialogData } from '../components/confirmation-dialog/confirmation-dialog.component';
import { ImageCropDialogComponent, ImageCropDialogData } from '../components/image-crop-dialog/image-crop-dialog.component';
import { UserBookCreateDialogComponent } from '../components/user-book-create-dialog/user-book-create-dialog.component';
import { UserSessionInfoDialogComponent, UserSessionInfoDialogData } from '../components/user-session-info-dialog/user-session-info-dialog.component';
import { AuthUser } from '../models/auth.models';
import { UserBookDTO } from '../models/book.models';

// TODO refactor some as generic confirmation dialog

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private readonly dialog: MatDialog) {}

  openImageCropDialog(file: File): MatDialogRef<ImageCropDialogComponent, Blob | undefined> {
    const data: ImageCropDialogData = { file };

    return this.dialog.open(ImageCropDialogComponent, { data, maxWidth: 768 });
  }

  openUserSessionInfoDialog(user: AuthUser): MatDialogRef<UserSessionInfoDialogComponent, void> {
    const data: UserSessionInfoDialogData = { user };

    return this.dialog.open(UserSessionInfoDialogComponent, { data, maxWidth: 768 });
  }

  openUserBookCreateDialog(): MatDialogRef<UserBookCreateDialogComponent, UserBookDTO | undefined> {
    return this.dialog.open(UserBookCreateDialogComponent, { maxWidth: 768 });
  }

  openUserBookPublishDialog(): MatDialogRef<ConfirmationDialogComponent, boolean | undefined> {
    const data: ConfirmationDialogData = {
      title: $localize`Publish selected book`,
      description: $localize`Once published, a book cannot be changed anymore. It will become visible to other users who will be able to buy it.`,
      action: $localize`Publish Book`,
      color: 'accent',
    };

    return this.dialog.open(ConfirmationDialogComponent, { data, maxWidth: 568 });
  }

  openUserBookDeleteDialog(): MatDialogRef<ConfirmationDialogComponent, boolean | undefined> {
    const data: ConfirmationDialogData = {
      title: $localize`Delete selected book`,
      description: $localize`Once deleted, a book cannot be found any more. All references will be removed.`,
      action: $localize`Delete Book`,
      color: 'warn',
    };

    return this.dialog.open(ConfirmationDialogComponent, { data, maxWidth: 568 });
  }

  closeAll(): void {
    return this.dialog.closeAll();
  }
}
