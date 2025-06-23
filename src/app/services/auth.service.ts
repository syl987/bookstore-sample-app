import { computed, Injectable, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Auth, user } from '@angular/fire/auth';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, map, Observable, of, shareReplay, take, throwError } from 'rxjs';

import { toAuthUser } from '../helpers/auth.helpers';
import { AuthProviderId } from '../models/auth.models';
import { AuthActions } from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly store = inject(Store);
  protected readonly actions = inject(Actions);
  protected readonly auth = inject(Auth);

  readonly user = toSignal(user(this.auth).pipe(map(toAuthUser)));
  readonly uid = computed(() => this.user()?.uid);

  readonly loginPending = toSignal(
    this.actions.pipe(
      ofType(AuthActions.loginWithProvider, AuthActions.loginWithProviderSUCCESS, AuthActions.loginWithProviderERROR, AuthActions.authResetState),
      map(({ type }) => type === AuthActions.loginWithProvider.type),
    ),
    { initialValue: false },
  );

  readonly logoutPending = toSignal(
    this.actions.pipe(
      ofType(AuthActions.logout, AuthActions.logoutSUCCESS, AuthActions.logoutERROR, AuthActions.authResetState),
      map(({ type }) => type === AuthActions.logout.type),
    ),
    { initialValue: false },
  );

  /**
   * Login with an external provider.
   */
  loginWithProvider(providerId: AuthProviderId): Observable<void> {
    this.store.dispatch(AuthActions.loginWithProvider({ providerId }));

    const result = this.actions.pipe(
      ofType(AuthActions.loginWithProviderSUCCESS, AuthActions.loginWithProviderERROR),
      take(1),
      concatMap(action => {
        if (action.type === AuthActions.loginWithProviderSUCCESS.type) {
          return of(undefined);
        }
        return throwError(() => action.error.err);
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    result.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    return result;
  }

  /**
   * Logout.
   */
  logout(): Observable<void> {
    this.store.dispatch(AuthActions.logout());

    const result = this.actions.pipe(
      ofType(AuthActions.logoutSUCCESS, AuthActions.logoutERROR),
      take(1),
      concatMap(action => {
        if (action.type === AuthActions.logoutSUCCESS.type) {
          return of(undefined);
        }
        return throwError(() => action.error.err);
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    result.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    return result;
  }
}
