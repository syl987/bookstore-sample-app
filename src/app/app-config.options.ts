import { AppConfig, AppStrings } from './models/app.models';
import { AuthConfig } from './models/auth.models';

export const appConfig: AppConfig = {
  appName: 'Bookstore Sample App',
  copyrightName: 'Bookstore Sample App',
};

export const authConfig: AuthConfig = {
  loginUrl: '/login',
  afterLoginUrl: '/',
  afterLogoutUrl: '/login',
  bearerExcluded: [{ url: 'https://www.googleapis.com/books/v1/volumes' }],
  bearerIncluded: [],
  messages: {
    logout: `Logout successful`,
    refreshError: `Internal authentication error`,
    tokenNotFound: `Not authenticated`,
    response401: `Not authenticated`,
  },
};

export const appStrings: AppStrings = {};
