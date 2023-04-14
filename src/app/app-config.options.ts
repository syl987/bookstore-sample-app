import { AppConfig, AppEntityDisplayNameMap, AppFirebaseDataServiceConfig, AppStrings } from './models/app.models';
import { AuthConfig } from './models/auth.models';
import { EntityType } from './models/entity.models';

export const appConfig: AppConfig = {
  appName: 'Silly Bookstore Example App',
  copyrightName: 'Silly Bookstore Example App',
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

export const appDataServiceConfig: AppFirebaseDataServiceConfig = {
  entityHttpResourceUrls: {
    [EntityType.USER_BOOKS]: {
      collectionResourceUrl: 'userBooks/{$uid}',
    },
    [EntityType.VOLUME]: {
      collectionResourceUrl: 'volumes',
    },
  },
};

export const appEntityNames: AppEntityDisplayNameMap = {
  [EntityType.USER_BOOKS]: `User Book`,
  [EntityType.VOLUME]: `Volume`,
};

export const appEntityPluralNames: AppEntityDisplayNameMap = {
  [EntityType.USER_BOOKS]: `User Books`,
  [EntityType.VOLUME]: `Volumes`,
};

export const appStrings: AppStrings = {};
