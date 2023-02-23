import { AppConfig, AppEntityDisplayNameMap, AppFirebaseDataServiceConfig, AppStrings } from './models/app.models';
import { AuthConfig } from './models/auth.models';
import { EntityType } from './models/entity.models';

export const appConfig: AppConfig = {
    appName: 'SillyBookstoreExampleApp',
    copyrightName: 'SillyBookstoreExampleApp',
};

export const authConfig: AuthConfig = {
    loginUrl: '/login',
    afterLoginUrl: '/',
    afterLogoutUrl: '/login',
    bearerExcluded: [],
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
        [EntityType.CAR]: {
            collectionResourceUrl: 'cars',
        },
    },
};

export const appEntityNames: AppEntityDisplayNameMap = {
    [EntityType.CAR]: `Car`,
};

export const appEntityPluralNames: AppEntityDisplayNameMap = {
    [EntityType.CAR]: `Cars`,
};

export const appStrings: AppStrings = {};
