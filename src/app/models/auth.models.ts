import { InjectionToken } from '@angular/core';
import { ProviderId, User, UserInfo } from 'firebase/auth';

import { HttpEndpointUrl } from 'src/app/models/http.models';

export type AuthProviderId = typeof ProviderId.GOOGLE;

/**
 * Authenticated user data.
 *
 * @description Required due to typing inconsistencies with firebase `User` object
 */
export interface AuthUser extends UserInfo, Pick<User, 'emailVerified' | 'isAnonymous' | 'providerData' | 'tenantId'> {
  /** Additional metadata around user creation and sign-in times. */
  readonly metadata: {
    /** Time the user was created. */
    readonly createdAt: string;
    /** Time the user last signed in. */
    readonly lastLoginAt: string;
  };
}

export interface AuthConfig {
  /** URL to redirect to if authentication is required to access. */
  readonly loginUrl: string;
  /** URL to redirect to after a successful login. */
  readonly afterLoginUrl: string;
  /** URL to redirect to when un-authenticated. */
  readonly afterLogoutUrl: string;
  /** Define endpoints to be excluded from authentication checks and authorization headers. */
  readonly bearerExcluded: HttpEndpointUrl[];
  /** Define endpoints to exclude from `bearerExcluded` config. */
  readonly bearerIncluded: HttpEndpointUrl[];
  /** Messages to display after being un-authenticated. */
  readonly messages: {
    /* Message to display on manual logout. */
    readonly logout: string;
    /* Message to display on refresh error. */
    readonly refreshError: string;
    /* Message to display on request if the auth token was not found. */
    readonly tokenNotFound: string;
    /* Message to display on response error status 401. */
    readonly response401: string;
  };
}

export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AUTH_CONFIG');
