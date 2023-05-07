import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import { APP_INITIALIZER, ApplicationConfig, DEFAULT_CURRENCY_CODE, importProvidersFrom, isDevMode, LOCALE_ID } from '@angular/core';
import { FirebaseOptions, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconRegistry } from '@angular/material/icon';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PreloadAllModules, provideRouter, TitleStrategy, withPreloading } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { AuthErrorInterceptor } from './interceptors/auth-error.interceptor';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import { DirtyOrTouchedMatcher } from './matchers/dirty-or-touched-matcher';
import { APP_OPTIONS, APP_STRINGS, AppOptions, AppStrings } from './models/app.models';
import { AUTH_CONFIG, AuthConfig } from './models/auth.models';
import { checkboxOptions } from './options/checkbox.options';
import { dialogOptions } from './options/dialog.options';
import { formFieldOptions } from './options/form-field.options';
import { snackBarOptions } from './options/snack-bar.options';
import { tooltipOptions } from './options/tooltip.options';
import { AppTitleStrategy } from './services/title-strategy';
import { effects, reducers, routerStoreConfig, storeConfig } from './store/app.store';

// TODO update ngrx
// TODO update angular fire

// TODO consider material grid-list with breakpoint observer instead of bootstrap grid
// TODO import specific font of sizes 400,600,700, no italics
// TODO modules or standalone components + migrate material imports to reduce initial bundle size
// TODO experimantal standalone components (possibly all) as pull request
// TODO add $localize function and x18n tags to all language strings
// TODO consider using signals, check how to integrate with ngrx

const firebaseOptions: FirebaseOptions = {
  apiKey: 'AIzaSyDrisPHet7H7y-G9GjVoJZFReIp-xqgnjo',
  authDomain: 'sample-app-a00e0.firebaseapp.com',
  databaseURL: 'https://sample-app-a00e0-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'sample-app-a00e0',
  storageBucket: 'sample-app-a00e0.appspot.com',
  messagingSenderId: '996177241422',
  appId: '1:996177241422:web:c989fc969fe444ed99ea1f',
  measurementId: 'G-1MVY64K4ZT',
};

const appOptions: AppOptions = {
  applicationName: 'Bookstore Sample App',
  copyrightName: 'Bookstore Sample App',
};

const authConfig: AuthConfig = {
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

const appStrings: AppStrings = {};

function registerIconFonts(iconRegistry: MatIconRegistry): () => void {
  return () => iconRegistry.registerFontClassAlias('fa', 'fa').setDefaultFontSetClass('fa'); // font-awesome
}

function registerLocales(): () => void {
  return () => registerLocaleData(localeDe);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    provideStore(reducers, storeConfig),
    provideEffects(effects),
    provideRouterStore(routerStoreConfig),
    provideStoreDevtools({ maxAge: 50, logOnly: !isDevMode() }),

    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(firebaseOptions)),
      provideAuth(() => getAuth()),
      provideFunctions(() => getFunctions()),
      provideDatabase(() => getDatabase()),
      provideStorage(() => getStorage()),

      MatDialogModule, // TODO check an alternative way of providing
      MatSnackBarModule, // TODO check an alternative way of providing
    ),

    { provide: LOCALE_ID, useValue: 'de-DE' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: APP_OPTIONS, useValue: appOptions },
    { provide: APP_STRINGS, useValue: appStrings },
    { provide: AUTH_CONFIG, useValue: authConfig },
    { provide: APP_INITIALIZER, useFactory: registerIconFonts, deps: [MatIconRegistry], multi: true },
    { provide: APP_INITIALIZER, useFactory: registerLocales, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthErrorInterceptor, multi: true },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: checkboxOptions },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: dialogOptions },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: formFieldOptions },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: snackBarOptions },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: tooltipOptions },
    { provide: ErrorStateMatcher, useClass: DirtyOrTouchedMatcher },
    { provide: TitleStrategy, useClass: AppTitleStrategy },
  ],
};