import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import { APP_INITIALIZER, ApplicationConfig, DEFAULT_CURRENCY_CODE, importProvidersFrom, isDevMode, LOCALE_ID } from '@angular/core';
import { FirebaseOptions, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconRegistry } from '@angular/material/icon';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
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
import { APP_OPTIONS, AppOptions } from './models/app.models';
import { AUTH_CONFIG, AuthConfig } from './models/auth.models';
import { dialogOptions } from './options/dialog.options';
import { formFieldOptions } from './options/form-field.options';
import { snackBarOptions } from './options/snack-bar.options';
import { AppTitleStrategy } from './services/title-strategy';
import { effects, reducers, routerStoreConfig, storeConfig } from './store/app.store';

// TODO check translations
// TODO kick unnecessary texts
// TODO check better translation file formats
// TODO check splitting translation files
// TODO check layout details

// TODO resolve navigation between book and volume
// TODO header search
// TODO volume and book details with breadcrumb history via navigation state
// TODO list books as table, kick accordion
// TODO upload book image

// TODO update angular fire
// TODO consider material grid-list with breakpoint observer instead of bootstrap grid
// TODO add $localize function and x18n tags to all language strings
// TODO consider using signals, check how to integrate with ngrx

// TODO impressum page
// TODO footer link to my github or some other page
// TODO copyright year as static options

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
  copyrightName: 'Igor Milly',
};

const authConfig: AuthConfig = {
  loginUrl: '/login',
  afterLoginUrl: '/',
  afterLogoutUrl: '/login',
  bearerExcluded: [{ url: 'https://www.googleapis.com/books/v1/volumes' }],
  bearerIncluded: [],
  messages: {
    logout: $localize`Logout successful`,
    refreshError: $localize`Internal authentication error`,
    tokenNotFound: $localize`Not authenticated`,
    response401: $localize`Not authenticated`,
  },
};

function registerIconFonts(iconRegistry: MatIconRegistry): () => void {
  return () => {
    iconRegistry.registerFontClassAlias('fa', 'fa').setDefaultFontSetClass('fa', 'fa-fw'); // font-awesome v4.7.0
    iconRegistry.registerFontClassAlias('fp', 'fp'); // flagpack (4x3 variants)
  };
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

      MatDialogModule, // used centrally
      MatSnackBarModule, // used centrally
    ),

    { provide: LOCALE_ID, useValue: 'de' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: APP_OPTIONS, useValue: appOptions },
    { provide: AUTH_CONFIG, useValue: authConfig },
    { provide: APP_INITIALIZER, useFactory: registerIconFonts, deps: [MatIconRegistry], multi: true },
    { provide: APP_INITIALIZER, useFactory: registerLocales, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthErrorInterceptor, multi: true },
    /* { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: checkboxOptions }, */
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: dialogOptions },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: formFieldOptions },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: snackBarOptions },
    /* { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: tooltipOptions }, */
    { provide: ErrorStateMatcher, useClass: DirtyOrTouchedMatcher },
    { provide: TitleStrategy, useClass: AppTitleStrategy },
  ],
};
