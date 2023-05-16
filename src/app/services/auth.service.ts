import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth, user } from '@angular/fire/auth';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { toAuthUser } from '../helpers/auth.helpers';
import { AuthProviderId, AuthUser } from '../models/auth.models';
import { AuthActions } from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly user$: Observable<AuthUser | null> = user(this.auth).pipe(map(toAuthUser));

  readonly loggedIn$ = this.user$.pipe(map(u => !!u));
  readonly loggedOut$ = this.user$.pipe(map(u => !u));

  private readonly _loginPending = new BehaviorSubject<boolean>(false);
  readonly loginPending$ = this._loginPending.asObservable();

  private readonly _logoutPending = new BehaviorSubject<boolean>(false);
  readonly logoutPending$ = this._loginPending.asObservable();

  get user(): AuthUser | null {
    return this.#user ?? null;
  }
  #user?: AuthUser | null;

  get uid(): string | null {
    return this.#uid ?? null;
  }
  #uid?: string;

  constructor(private readonly store: Store, private readonly actions: Actions, private readonly auth: Auth) {
    // set user and uid props
    this.user$.pipe(takeUntilDestroyed()).subscribe(u => {
      this.#user = u;
      this.#uid = u?.uid;
    });

    // set login pending stream
    this.actions.pipe(ofType(AuthActions.loginWithProvider), takeUntilDestroyed()).subscribe(_ => this._loginPending.next(true));
    this.actions
      .pipe(ofType(AuthActions.loginWithProviderSUCCESS, AuthActions.loginWithProviderERROR, AuthActions.authResetState), takeUntilDestroyed())
      .subscribe(_ => this._loginPending.next(false));

    // set logout pending stream
    this.actions.pipe(ofType(AuthActions.logout), takeUntilDestroyed()).subscribe(_ => this._logoutPending.next(true));
    this.actions
      .pipe(ofType(AuthActions.logoutSUCCESS, AuthActions.logoutERROR, AuthActions.authResetState), takeUntilDestroyed())
      .subscribe(_ => this._logoutPending.next(false));
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
