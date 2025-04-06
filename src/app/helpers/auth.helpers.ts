import { HttpRequest } from '@angular/common/http';
import { Actions, EffectNotification, ofType } from '@ngrx/effects';
import { AuthProvider, GoogleAuthProvider, User } from 'firebase/auth';
import { exhaustMap, Observable, takeUntil } from 'rxjs';

import { matchesEndpointUrl } from 'src/app/functions/http.functions';

import { AuthConfig, AuthProviderId, AuthUser } from '../models/auth.models';
import { AuthActions } from '../store/auth/auth.actions';

/**
 * Check if the `HttpRequest` is excluded from authentication based on `bearerIncluded` and `bearerExcluded` auth config.
 */
export function isBearerExcluded(request: HttpRequest<unknown>, config: AuthConfig): boolean {
  const included = config.bearerIncluded.some(endpoint => matchesEndpointUrl(request, endpoint));
  const excluded = config.bearerExcluded.some(endpoint => matchesEndpointUrl(request, endpoint));

  return excluded && !included;
}

/**
 * Require authentication to process effects.
 *
 * Starts with `AuthActions.authenticated` (exclusive) and ends with `AuthActions.authenticated` (inclusive).
 */
export function requireAuth(actions$: Actions, resolvedEffects$: Observable<EffectNotification>): Observable<EffectNotification> {
  return actions$.pipe(
    ofType(AuthActions.authenticated),
    exhaustMap(() => resolvedEffects$.pipe(takeUntil(actions$.pipe(ofType(AuthActions.unauthenticated))))),
  );
}

/**
 * Get authentication provider based on the given provider id.
 */
export function getAuthProvider(providerId: AuthProviderId): AuthProvider {
  switch (providerId) {
    case GoogleAuthProvider.PROVIDER_ID:
      return new GoogleAuthProvider();
    default:
      throw new Error('Internal error. Unsupported auth provider.');
  }
}

/**
 * Map firebase auth user object to app auth user object.
 */
export function toAuthUser(user: User | null): AuthUser | null {
  if (!user) {
    return null;
  }
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    photoURL: user.photoURL,
    providerId: user.providerId,
    emailVerified: user.emailVerified,
    isAnonymous: user.isAnonymous,
    providerData: user.providerData,
    metadata: user.metadata as any, // incorrect firebase typing
    tenantId: user.tenantId,
  };
}
