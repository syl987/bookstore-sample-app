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
  metadata: {
    createdAt: string;
    lastLoginAt: string;
  };
}

export interface AuthConfig {
  /** URL to redirect to if authentication is required to access. */
  loginUrl: string;
  /** URL to redirect to after a successful login. */
  afterLoginUrl: string;
  /** URL to redirect to when un-authenticated. */
  afterLogoutUrl: string;
  /** Define endpoints to be excluded from authentication checks and authorization headers. */
  bearerExcluded: HttpEndpointUrl[];
  /** Define endpoints to exclude from `bearerExcluded` config. */
  bearerIncluded: HttpEndpointUrl[];
  /** Messages to display after being un-authenticated. */
  messages: {
    /* Message to display on manual logout. */
    logout: string;
    /* Message to display on refresh error. */
    refreshError: string;
    /* Message to display on request if the auth token was not found. */
    tokenNotFound: string;
    /* Message to display on response error status 401. */
    response401: string;
  };
}

export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AUTH_CONFIG');
