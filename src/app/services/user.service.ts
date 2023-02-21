import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Profile } from '../models/user.models';
import { deleteUserPhoto, updateUserProfile, uploadUserPhoto } from '../store/user/user.actions';
import * as UserSelectors from '../store/user/user.selectors';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    readonly profile$ = this.store.select(UserSelectors.selectUserProfile);

    readonly loading$ = this.store.select(UserSelectors.selectUserLoading);
    readonly loaded$ = this.store.select(UserSelectors.selectUserLoaded);

    constructor(private readonly store: Store) {}

    updateProfile(changes: Partial<Profile>): void {
        this.store.dispatch(updateUserProfile({ changes }));
    }

    uploadProfilePhoto(blob: Blob, contentType?: string): void {
        this.store.dispatch(uploadUserPhoto({ blob, contentType }));
    }

    deleteProfilePhoto(): void {
        this.store.dispatch(deleteUserPhoto());
    }
}
