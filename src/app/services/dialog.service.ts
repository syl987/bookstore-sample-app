import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ConfirmationDialogComponent, ConfirmationDialogData } from '../components/confirmation-dialog/confirmation-dialog.component';
import { ImageCropDialogComponent, ImageCropDialogData } from '../components/image-crop-dialog/image-crop-dialog.component';
import { UserBookCreateDialogComponent } from '../components/user-book-create-dialog/user-book-create-dialog.component';
import { UserSessionInfoDialogComponent, UserSessionInfoDialogData } from '../components/user-session-info-dialog/user-session-info-dialog.component';
import { AuthUser } from '../models/auth.models';
import { UserBookDTO } from '../models/book.models';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  protected readonly dialog = inject(MatDialog);

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

  openUserBookBuyDialog(): MatDialogRef<ConfirmationDialogComponent, boolean | undefined> {
    const data: ConfirmationDialogData = {
      title: $localize`Buy selected book`,
      description: $localize`Buying a book will make you the new owner. The offer will no longer be available to other users. You can always review your list of bought books in your "My Books" section.`,
      action: $localize`Buy Book`,
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

  openUserBookDeleteAllPhotosDialog(): MatDialogRef<ConfirmationDialogComponent, boolean | undefined> {
    const data: ConfirmationDialogData = {
      title: $localize`Delete all book photos`,
      description: $localize`All photos with references for this book will be deleted.`,
      action: $localize`Delete All Photos`,
      color: 'warn',
    };

    return this.dialog.open(ConfirmationDialogComponent, { data, maxWidth: 568 });
  }

  openLoginRequiredDialog(): MatDialogRef<ConfirmationDialogComponent, boolean | undefined> {
    const data: ConfirmationDialogData = {
      title: $localize`Login required`,
      description: $localize`This action requires a user to be logged in. Would you like to be redirected to the login page?`,
      action: $localize`Redirect to Login`,
      color: 'primary',
    };

    return this.dialog.open(ConfirmationDialogComponent, { data, maxWidth: 568 });
  }

  closeAllDialogs(): void {
    return this.dialog.closeAll();
  }
}
