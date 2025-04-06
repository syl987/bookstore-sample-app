import { computed, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Auth, user } from '@angular/fire/auth';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, map } from 'rxjs';

import { toAuthUser } from '../helpers/auth.helpers';
import { AuthProviderId } from '../models/auth.models';
import { AuthActions } from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly store = inject(Store);
  private readonly actions = inject(Actions);
  private readonly auth = inject(Auth);

  readonly user = toSignal(user(this.auth).pipe(map(toAuthUser)));
  readonly uid = computed(() => this.user()?.uid);

  private readonly _loginPending = new BehaviorSubject<boolean>(false);
  readonly loginPending = toSignal(this._loginPending.asObservable(), { requireSync: true });

  private readonly _logoutPending = new BehaviorSubject<boolean>(false);
  readonly logoutPending = toSignal(this._loginPending.asObservable(), { requireSync: true });

  constructor() {
    // set login pending stream
    this.actions.pipe(ofType(AuthActions.loginWithProvider), takeUntilDestroyed()).subscribe(_ => this._loginPending.next(true));
    this.actions
      .pipe(ofType(AuthActions.loginWithProviderSUCCESS, AuthActions.loginWithProviderERROR, AuthActions.authResetState), takeUntilDestroyed())
      .subscribe(_ => this._loginPending.next(false));

    // set logout pending stream
    this.actions.pipe(ofType(AuthActions.logout), takeUntilDestroyed()).subscribe(_ => this._logoutPending.next(true));
    this.actions.pipe(ofType(AuthActions.logoutSUCCESS, AuthActions.logoutERROR, AuthActions.authResetState), takeUntilDestroyed()).subscribe(_ => this._logoutPending.next(false));
  }

  /**
   * Login with an external provider.
   */
  loginWithProvider(provider: AuthProviderId): void {
    this.store.dispatch(AuthActions.loginWithProvider({ providerId: provider }));
  }

  /**
   * Logout.
   */
  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
