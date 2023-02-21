import { Injectable } from '@angular/core';
import { Actions, createEffect, EffectNotification, ofType, OnRunEffects } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { requireAuth } from 'src/app/helpers/auth.helpers';
import { firebaseError } from 'src/app/models/error.models';
import { AuthService } from 'src/app/services/auth.service';
import { UserDataService } from 'src/app/services/data/user-data.service';

import * as AuthActions from '../auth/auth.actions';
import * as UserActions from './user.actions';

@Injectable()
export class UserEffects implements OnRunEffects {
    readonly loadUserData$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.authenticated),
            concatMap(() =>
                this.dataService.loadProfile(this.authService.uid!).pipe(
                    concatMap(profile => {
                        if (!profile.id) {
                            this.dataService.updateProfile(this.authService.uid!, { id: this.authService.uid! });
                        }
                        return of(profile);
                    }),
                    map(profile => UserActions.loadUserDataSuccess({ profile })),
                    catchError(error => of(UserActions.loadUserDataError({ error: firebaseError({ error }) }))),
                ),
            ),
        );
    });

    readonly updateUserProfile$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(UserActions.updateUserProfile),
            concatMap(({ changes }) =>
                this.dataService.updateProfile(this.authService.uid!, changes).pipe(
                    map(profile => UserActions.updateUserProfileSuccess({ profile })),
                    catchError(error => of(UserActions.updateUserProfileError({ error: firebaseError({ error }) }))),
                ),
            ),
        );
    });

    readonly uploadUserProfilePhoto$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(UserActions.uploadUserPhoto),
            concatMap(({ blob }) =>
                this.dataService.uploadProfilePhoto(this.authService.uid!, blob).pipe(
                    concatMap(photoUrl => this.dataService.updateProfile(this.authService.uid!, { photoUrl })),
                    map(profile => UserActions.uploadUserPhotoSuccess({ profile })),
                    catchError(error => of(UserActions.uploadUserPhotoError({ error: firebaseError({ error }) }))),
                ),
            ),
        );
    });

    readonly deleteUserProfilePhoto$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(UserActions.deleteUserPhoto),
            concatMap(() =>
                this.dataService.deleteProfilePhoto(this.authService.uid!).pipe(
                    concatMap(_ => this.dataService.updateProfile(this.authService.uid!, { photoUrl: null })),
                    map(profile => UserActions.deleteUserPhotoSuccess({ profile })),
                    catchError(error => of(UserActions.deleteUserPhotoError({ error: firebaseError({ error }) }))),
                ),
            ),
        );
    });

    // TODO toast messages

    // TODO undo operations for photo

    constructor(private readonly actions$: Actions, private readonly dataService: UserDataService, private readonly authService: AuthService) {}

    ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>): Observable<EffectNotification> {
        return requireAuth(this.actions$, resolvedEffects$);
    }
}
