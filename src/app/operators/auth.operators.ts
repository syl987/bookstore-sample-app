import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthUser } from '../models/auth.models';
import { AuthService } from '../services/auth.service';

/**
 * Return current user uid or throw an exception if not logged in.
 */
export function getAuthUidOrThrow<T>(authService: AuthService): OperatorFunction<T, [string, T]> {
  return map(value => {
    if (!authService.uid) {
      throw new Error(`User not logged in.`);
    }
    return [authService.uid, value];
  });
}

/**
 * Return current user object or throw an exception if not logged in.
 */
export function getAuthUserOrThrow<T>(authService: AuthService): OperatorFunction<T, [AuthUser, T]> {
  return map(value => {
    if (!authService.user) {
      throw new Error(`User not logged in.`);
    }
    return [authService.user, value];
  });
}
