import { Injectable, OnDestroy } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { toAuthUser } from '../helpers/auth.helpers';
import { AuthProviderId, AuthUser } from '../models/auth.models';
import { loginWithProvider, logout } from '../store/auth/auth.actions';
import * as AuthActions from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  readonly user$: Observable<AuthUser | null> = user(this.auth).pipe(map(toAuthUser));

  readonly loggedIn$ = this.user$.pipe(map(u => !!u));
  readonly loggedOut$ = this.user$.pipe(map(u => !u));

  private readonly _pending = new BehaviorSubject<boolean>(false);
  readonly pending$ = this._pending.asObservable();

  get user(): AuthUser | null {
    return this.#user ?? null;
  }
  #user?: AuthUser | null;

  get uid(): string | null {
    return this.#uid ?? null;
  }
  #uid?: string;

  private readonly _destroyed$ = new Subject<void>();

  constructor(private readonly store: Store, private readonly actions: Actions, private readonly auth: Auth) {
    this.user$.pipe(takeUntil(this._destroyed$)).subscribe(u => {
      this.#user = u as unknown as AuthUser;
      this.#uid = u?.uid;
    });

    this.actions
      .pipe(ofType(AuthActions.loginWithProvider, AuthActions.logout), takeUntil(this._destroyed$))
      .subscribe(_ => this._pending.next(true));
    this.actions
      .pipe(
        ofType(
          AuthActions.loginWithProviderSuccess,
          AuthActions.loginWithProviderError,
          AuthActions.logoutSuccess,
          AuthActions.logoutError,
          AuthActions.resetState,
        ),
        takeUntil(this._destroyed$),
      )
      .subscribe(_ => this._pending.next(false));
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  /**
   * Login with an external provider.
   */
  loginWithProvider(provider: AuthProviderId): void {
    this.store.dispatch(loginWithProvider({ providerId: provider }));
  }

  /**
   * Logout.
   */
  logout(): void {
    this.store.dispatch(logout());
  }
}
