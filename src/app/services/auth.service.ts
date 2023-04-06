import { Injectable, OnDestroy } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { toAuthUser } from '../helpers/auth.helpers';
import { AuthProviderId, AuthUser } from '../models/auth.models';
import { loginWithProvider, logout } from '../store/auth/auth.actions';
import * as AuthSelectors from '../store/auth/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  readonly user$: Observable<AuthUser | null> = user(this.auth).pipe(map(toAuthUser));

  readonly loggedIn$ = this.user$.pipe(map(u => !!u));
  readonly loggedOut$ = this.user$.pipe(map(u => !u));

  readonly pending$ = this.store.select(AuthSelectors.selectAuthPending);

  get user(): AuthUser | null {
    return this.#user ?? null;
  }
  #user?: AuthUser | null;

  get uid(): string | null {
    return this.#uid ?? null;
  }
  #uid?: string;

  private readonly _destroyed$ = new Subject<void>();

  constructor(private readonly store: Store, private readonly auth: Auth) {
    this.user$.pipe(takeUntil(this._destroyed$)).subscribe(u => {
      this.#user = u as unknown as AuthUser;
      this.#uid = u?.uid;
    });
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
