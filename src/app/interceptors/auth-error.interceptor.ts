import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';

import { isBearerExcluded } from '../helpers/auth.helpers';
import { AUTH_CONFIG } from '../models/auth.models';
import { AuthActions } from '../store/auth/auth.actions';

@Injectable()
export class AuthErrorInterceptor implements HttpInterceptor {
  private readonly config = inject(AUTH_CONFIG);
  private readonly store = inject(Store);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (isBearerExcluded(request, this.config)) {
      // non-excluded requests should pass freely, without any change or restriction
      return next.handle(request);
    }
    return next.handle(request).pipe(
      catchError((err?: Partial<HttpErrorResponse>) => {
        if (err?.status === 401) {
          // despite frontend auth checks, backend is still the source of truth. if any non-excluded request could not authenticate, auto-logout.
          this.store.dispatch(AuthActions.authResponseERROR());
          return EMPTY;
        }
        return throwError(() => err);
      }),
    );
  }
}
