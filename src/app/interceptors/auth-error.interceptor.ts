import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { isBearerExcluded } from '../helpers/auth.helpers';
import { AUTH_CONFIG, AuthConfig } from '../models/auth.models';
import { authResponseError } from '../store/auth/auth.actions';

@Injectable()
export class AuthErrorInterceptor implements HttpInterceptor {
  constructor(@Inject(AUTH_CONFIG) private readonly config: AuthConfig, private readonly store: Store) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (isBearerExcluded(request, this.config)) {
      // non-excluded requests should pass freely, without any change or restriction
      return next.handle(request);
    }
    return next.handle(request).pipe(
      catchError((err?: Partial<HttpErrorResponse>) => {
        if (err?.status === 401) {
          // despite frontend auth checks, backend is still the source of truth. if any non-excluded request could not authenticate, auto-logout.
          this.store.dispatch(authResponseError());
          return EMPTY;
        }
        return throwError(() => err);
      }),
    );
  }
}
