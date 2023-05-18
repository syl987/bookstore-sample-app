import { Inject, Injectable } from '@angular/core';
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
import { AuthActions } from './auth.actions';

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

  readonly loginWithProvider = createEffect(() => {
    return this.actions.pipe(
      ofType(AuthActions.loginWithProvider),
      exhaustMap(({ providerId }) =>
        from(signInWithPopup(this.auth, getAuthProvider(providerId))).pipe(
          map(_ => AuthActions.loginWithProviderSUCCESS()),
          catchError(err => of(AuthActions.loginWithProviderERROR({ error: firebaseError({ err }) }))),
        ),
      ),
    );
  });

  readonly logout = createEffect(() => {
    return this.actions.pipe(
      ofType(AuthActions.logout, AuthActions.authRefreshERROR, AuthActions.authTokenNotFound, AuthActions.authResponseERROR),
      concatMap(_ =>
        from(this.auth.signOut()).pipe(
          map(() => AuthActions.logoutSUCCESS()),
          catchError(err => of(AuthActions.logoutERROR({ error: firebaseError({ err }) }))),
        ),
      ),
    );
  });

  readonly navigateOnLoginWithProviderSuccess = createEffect(
    () => {
      return this.actions.pipe(
        ofType(AuthActions.loginWithProviderSUCCESS),
        map(_ => this.router.navigateByUrl(this.config.afterLoginUrl)),
      );
    },
    { dispatch: false },
  );

  readonly navigateOnUnauthenticated = createEffect(
    () => {
      return this.actions.pipe(
        ofType(AuthActions.unauthenticated),
        map(_ => this.router.navigateByUrl(this.config.afterLogoutUrl)),
      );
    },
    { dispatch: false },
  );

  readonly closeAllDialogsOnUnauthenticated = createEffect(
    () => {
      return this.actions.pipe(
        ofType(AuthActions.unauthenticated),
        map(_ => this.dialogService.closeAll()),
      );
    },
    { dispatch: false },
  );

  readonly authResetState = createEffect(() => {
    return this.actions.pipe(
      ofType(AuthActions.unauthenticated),
      map(_ => AuthActions.authResetState()),
    );
  });

  readonly loginWithProviderErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(AuthActions.loginWithProviderERROR),
        map(({ error }) => this.toastService.showErrorToast(toResponseErrorMessage(error))),
      );
    },
    { dispatch: false },
  );

  readonly logoutSuccessToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(AuthActions.logoutSUCCESS),
        map(_ => this.toastService.showSuccessToast(this.config.messages.logout)),
      );
    },
    { dispatch: false },
  );

  readonly authRefreshErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(AuthActions.authRefreshERROR),
        map(_ => this.toastService.showErrorToast(this.config.messages.refreshError)),
      );
    },
    { dispatch: false },
  );

  readonly authTokenNotFoundToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(AuthActions.authTokenNotFound),
        map(_ => this.toastService.showErrorToast(this.config.messages.tokenNotFound)),
      );
    },
    { dispatch: false },
  );

  readonly authResponseErrorToast = createEffect(
    () => {
      return this.actions.pipe(
        ofType(AuthActions.authResponseERROR),
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
