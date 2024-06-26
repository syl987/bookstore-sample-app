import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Auth, idToken } from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import { concatMap, EMPTY, first, Observable } from 'rxjs';

import { isBearerExcluded } from '../helpers/auth.helpers';
import { AUTH_CONFIG, AuthConfig } from '../models/auth.models';
import { AuthActions } from '../store/auth/auth.actions';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(
    @Inject(AUTH_CONFIG) private readonly config: AuthConfig,
    private readonly store: Store,
    private readonly auth: Auth,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (isBearerExcluded(request, this.config)) {
      // non-excluded requests should pass freely, without any change or restriction
      return next.handle(request);
    }
    return idToken(this.auth).pipe(
      first(),
      concatMap(token => {
        if (token) {
          return next.handle(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
        }
        this.store.dispatch(AuthActions.authTokenNotFound());
        return EMPTY;
      }),
    );
  }
}
