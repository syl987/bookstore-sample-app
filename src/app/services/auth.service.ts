import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { AuthProviderId, AuthUser } from '../models/auth.models';
import { loginWithProvider, logout } from '../store/auth/auth.actions';
import * as AuthSelectors from '../store/auth/auth.selectors';

@Injectable({
    providedIn: 'root',
})
export class AuthService implements OnDestroy {
    readonly user$: Observable<AuthUser | null> = this.fireAuth.user;

    readonly loggedIn$ = this.user$.pipe(map(user => !!user));
    readonly loggedOut$ = this.user$.pipe(map(user => !user));

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

    constructor(private readonly store: Store, private readonly fireAuth: AngularFireAuth) {
        this.fireAuth.user.pipe(takeUntil(this._destroyed$)).subscribe(user => {
            this.#user = user as unknown as AuthUser;
            this.#uid = user?.uid;
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
