import { ApplicationConfig, importProvidersFrom, APP_INITIALIZER, inject } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withXsrfConfiguration, withInterceptors } from '@angular/common/http';
import { ApplicationRef, DEFAULT_CURRENCY_CODE, DoBootstrap, isDevMode, LOCALE_ID, NgModule } from '@angular/core';
import { FirebaseOptions, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxModule } from '@angular/material/checkbox';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry, ICON_REGISTRY_PROVIDER } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { TitleStrategy } from '@angular/router';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { StoreRouterConnectingModule, provideRouterStore } from '@ngrx/router-store';
import { StoreModule, provideStore } from '@ngrx/store';
import { StoreDevtoolsModule, provideStoreDevtools } from '@ngrx/store-devtools';
import { ImageCropperModule } from 'ngx-image-cropper';

import { AuthErrorInterceptor } from './interceptors/auth-error.interceptor';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import { DirtyOrTouchedMatcher } from './matchers/dirty-or-touched-matcher';
import { APP_CONFIG, APP_STRINGS } from './models/app.models';
import { AUTH_CONFIG } from './models/auth.models';
import { checkboxOptions } from './options/checkbox.options';
import { dialogOptions } from './options/dialog.options';
import { formFieldOptions } from './options/form-field.options';
import { snackBarOptions } from './options/snack-bar.options';
import { BookConditionPipe } from './pipes/book-condition.pipe';
import { BooleanPipe } from './pipes/boolean.pipe';
import { ValidationErrorPipe } from './pipes/validation-error.pipe';
import { AppTitleStrategy } from './services/title-strategy';
import { effects, reducers, routerStoreConfig, storeConfig } from './store/app.store';
import { routes } from './app.routes';
import { AppConfig, AppStrings } from './models/app.models';
import { AuthConfig } from './models/auth.models';
import { tooltipOptions } from './options/tooltip.options';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

// TODO import browser module
// TODO check more router configuration features

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

const appConfig2: AppConfig = {
  appName: 'Bookstore Sample App',
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
  return () => {
    iconRegistry.registerFontClassAlias('fa', 'fa').setDefaultFontSetClass('fa'); // font-awesome
  };
}

function registerLocales(): () => void {
  return () => {
    registerLocaleData(localeDe);
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
      /* BrowserModule, */

      provideFirebaseApp(() => initializeApp(firebaseOptions)),
      provideAuth(() => getAuth()),
      provideFunctions(() => getFunctions()),
      provideDatabase(() => getDatabase()),
      provideStorage(() => getStorage()),

      MatDialogModule,
      MatSnackBarModule,
    ),

    { provide: LOCALE_ID, useValue: 'de-DE' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: APP_CONFIG, useValue: appConfig2 },
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
