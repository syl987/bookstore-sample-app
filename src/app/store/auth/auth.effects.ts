import { Inject, Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Auth, authState, signInWithPopup } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';
import { toResponseErrorMessage } from 'src/app/helpers/error.helpers';
import { firebaseError } from 'src/app/models/error.models';
import { DialogService } from 'src/app/services/dialog.service';
import { ToastService } from 'src/app/services/toast.service';

import { getAuthProvider } from '../../helpers/auth.helpers';
import { AUTH_CONFIG, AuthConfig } from '../../models/auth.models';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  readonly authenticated = createEffect(() => {
    return authState(this.auth).pipe(
      map(state => {
        if (state) {
          return AuthActions.authenticated();
        }
        return AuthActions.unauthenticated();
      }),
    );
  });

  readonly loginWithProviderRequest = createEffect(() => {
    return this.actions.pipe(
      ofType(AuthActions.loginWithProvider),
      exhaustMap(({ providerId: provider }) =>
        from(signInWithPopup(this.auth, getAuthProvider(provider))).pipe(
          map(_ => AuthActions.loginWithProviderSuccess()),
          catchError((err: FirebaseError) => of(AuthActions.loginWithProviderError({ error: firebaseError({ error: err }) }))),
        ),
      ),
    );
  });

  readonly navigateHome = createEffect(
    () => {
      return this.actions.pipe(
        ofType(AuthActions.loginWithProviderSuccess),
        map(_ => this.router.navigateByUrl(this.config.afterLoginUrl)),
      );
    },
    { dispatch: false },
  );

  readonly openLoginErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(AuthActions.loginWithProviderError),
        map(({ error }) => this.toastService.showErrorToast(toResponseErrorMessage(error))),
      );
    },
    { dispatch: false },
  );

  readonly logoutRequest = createEffect(() => {
    return this.actions.pipe(
      ofType(AuthActions.logout, AuthActions.authRefreshError, AuthActions.authTokenNotFound, AuthActions.authResponseError),
      concatMap(_ =>
        from(this.auth.signOut()).pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError((err: FirebaseError) => of(AuthActions.logoutError({ error: firebaseError({ error: err }) }))),
        ),
      ),
    );
  });

  readonly closeAllDialogs = createEffect(
    () => {
      return this.actions.pipe(
        ofType(AuthActions.unauthenticated),
        map(_ => this.dialogService.closeAllDialogs()),
      );
    },
    { dispatch: false },
  );

  readonly navigateToLogin = createEffect(
    () => {
      return this.actions.pipe(
        ofType(AuthActions.unauthenticated),
        map(_ => this.router.navigateByUrl(this.config.afterLogoutUrl)),
      );
    },
    { dispatch: false },
  );

  readonly resetState = createEffect(() => {
    return this.actions.pipe(
      ofType(AuthActions.unauthenticated),
      map(_ => AuthActions.resetState()),
    );
  });

  readonly openLogoutToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(AuthActions.logoutSuccess),
        map(_ => this.toastService.showSuccessToast(this.config.messages.logout)),
      );
    },
    { dispatch: false },
  );

  readonly openRefreshErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(AuthActions.authRefreshError),
        map(_ => this.toastService.showErrorToast(this.config.messages.refreshError)),
      );
    },
    { dispatch: false },
  );

  readonly openSessionExpiredToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(AuthActions.authTokenNotFound),
        map(_ => this.toastService.showErrorToast(this.config.messages.tokenNotFound)),
      );
    },
    { dispatch: false },
  );

  readonly openResponseErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(AuthActions.authResponseError),
        map(_ => this.toastService.showInfoToast(this.config.messages.response401)),
      );
    },
    { dispatch: false },
  );

  constructor(
    @Inject(AUTH_CONFIG) private readonly config: AuthConfig,
    private readonly actions: Actions,
    private readonly router: Router,
    private readonly auth: Auth,
    private readonly toastService: ToastService,
    private readonly dialogService: DialogService,
  ) {}
}
