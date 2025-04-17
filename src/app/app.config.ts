import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, DEFAULT_CURRENCY_CODE, importProvidersFrom, inject, isDevMode, provideAppInitializer } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconRegistry } from '@angular/material/icon';
import { MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS } from '@angular/material/progress-spinner';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PreloadAllModules, provideRouter, TitleStrategy, withPreloading } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { environment } from 'src/environments/environment';

import { routes } from './app.routes';
import { AuthErrorInterceptor } from './interceptors/auth-error.interceptor';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import { DirtyOrTouchedMatcher } from './matchers/dirty-or-touched-matcher';
import { APP_LANGUAGES, APP_LINKS, APP_OPTIONS, AppLanguages, AppLinks, AppOptions } from './models/app.models';
import { AUTH_CONFIG, AuthConfig } from './models/auth.models';
import { dialogOptions } from './options/dialog.options';
import { formFieldOptions } from './options/form-field.options';
import { progressSpinnerOptions } from './options/progress-spinner.options';
import { snackBarOptions } from './options/snack-bar.options';
import { AppTitleStrategy } from './services/title-strategy';
import { effects, reducers, routerStoreConfig, storeConfig } from './store/app.store';

const options: AppOptions = {
  applicationName: 'Bookstore Sample App',
  copyrightName: 'Igor M.',
  copyrightYear: '2024',
};

const authConfig: AuthConfig = {
  loginUrl: '/login',
  afterLoginUrl: '/volumes',
  afterLogoutUrl: '/welcome',
  bearerExcluded: [{ url: 'https://www.googleapis.com/books/v1/volumes' }],
  bearerIncluded: [],
  messages: {
    logout: $localize`Logout successful`,
    refreshError: $localize`Internal authentication error`,
    tokenNotFound: $localize`Not authenticated`,
    response401: $localize`Not authenticated`,
  },
};

export const languages: AppLanguages = [
  { label: 'English', locale: 'en', icon: 'us' },
  { label: 'Deutsch', locale: 'de', icon: 'de' },
  { label: 'Español', locale: 'es', icon: 'es' },
];

const links: AppLinks = [
  { label: $localize`Welcome`, icon: 'celebration', path: '/welcome' },
  { label: $localize`Books`, icon: 'library_books', path: '/volumes' },
  { label: $localize`My Books`, icon: 'auto_stories', path: '/user/books', userSpecific: true },
  { label: 'Dev', icon: 'code', path: '/dev' },
];

function registerIconFonts(iconRegistry = inject(MatIconRegistry)): void {
  iconRegistry.registerFontClassAlias('fp', 'fp'); // flagpack (4x3 variants)
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    provideStore(reducers, storeConfig),
    provideEffects(effects),
    provideRouterStore(routerStoreConfig),
    provideStoreDevtools({ maxAge: 50, logOnly: !isDevMode(), connectInZone: true }),

    provideFirebaseApp(() => initializeApp(environment.firebaseOptions)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),

    provideAppInitializer(() => registerIconFonts()),
    importProvidersFrom(MatDialogModule, MatSnackBarModule), // used centrally

    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: APP_OPTIONS, useValue: options },
    { provide: AUTH_CONFIG, useValue: authConfig },
    { provide: APP_LANGUAGES, useValue: languages },
    { provide: APP_LINKS, useValue: links },
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthErrorInterceptor, multi: true },
    /* { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: checkboxOptions }, */
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: dialogOptions },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: formFieldOptions },
    { provide: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS, useValue: progressSpinnerOptions },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: snackBarOptions },
    /* { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: tooltipOptions }, */
    { provide: ErrorStateMatcher, useClass: DirtyOrTouchedMatcher },
    { provide: TitleStrategy, useClass: AppTitleStrategy },
  ],
};
