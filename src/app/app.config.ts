import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, DEFAULT_CURRENCY_CODE, importProvidersFrom, isDevMode } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
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
import { environment } from 'src/environments/environment';

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

// general
// TODO redirect to login on buy and other user actions
// TODO consider using signals, check how to integrate with ngrx
// TODO impressum / legal dislaimer page
// TODO footer link to my github or some other page
// TODO use async pipe in templates to be able to react to logout change

// welcome
// TODO display some welcome message or banner
// TODO display some data protection policy

// volume search
// TODO change search page path to /volumes (header link active on volume detail)
// TODO open as firebase database stream

// volume detail
// TODO loading spinner
// TODO buy book => create a confirmation page
// TODO navigate to user books => create a success dialog
// TODO add support for 404

// volume card
// TODO loading appearence

// user book edit
// TODO navigate to user books after an action
// TODO delete book (if not sold)
// TODO bug: change detection not fired after photo upload

// user book edit / detail
// TODO add support for 404
// TODO resolve navigation between book and volume => nope, need to just display offer list

// image upload
// TODO placeholder img
// TODO progress

const appOptions: AppOptions = {
  applicationName: 'Bookstore Sample App',
  copyrightName: 'Igor Milly',
  copyrightYear: '2023',
};

const authConfig: AuthConfig = {
  loginUrl: '/login',
  afterLoginUrl: '/volumes/search',
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

function registerIconFonts(iconRegistry: MatIconRegistry): () => void {
  return () => {
    iconRegistry.registerFontClassAlias('fa', 'fa').setDefaultFontSetClass('fa', 'fa-fw'); // font-awesome v4.7.0
    iconRegistry.registerFontClassAlias('fp', 'fp'); // flagpack (4x3 variants)
  };
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
      provideFirebaseApp(() => initializeApp(environment.firebaseOptions)),
      provideAuth(() => getAuth()),
      provideFunctions(() => getFunctions()),
      provideDatabase(() => getDatabase()),
      provideStorage(() => getStorage()),

      MatDialogModule, // used centrally
      MatSnackBarModule, // used centrally
    ),

    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: APP_OPTIONS, useValue: appOptions },
    { provide: AUTH_CONFIG, useValue: authConfig },
    { provide: APP_INITIALIZER, useFactory: registerIconFonts, deps: [MatIconRegistry], multi: true },
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
