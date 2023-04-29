import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
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
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TitleStrategy } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ImageCropperModule } from 'ngx-image-cropper';

import { AppComponent } from './app.component';
import { appConfig, appStrings, authConfig } from './app-global.options';
import { AppRoutingModule } from './app-routing.module';
import { FooterComponent } from './components/__base/footer/footer.component';
import { HeaderComponent } from './components/__base/header/header.component';
import { SidenavComponent } from './components/__base/sidenav/sidenav.component';
import { CropImageDialogComponent } from './components/crop-image-dialog/crop-image-dialog.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { UserBookCardContentComponent } from './components/user-book-card-content/user-book-card-content.component';
import { UserBookCreateDialogComponent } from './components/user-book-create-dialog/user-book-create-dialog.component';
import { UserBookDeleteDialogComponent } from './components/user-book-delete-dialog/user-book-delete-dialog.component';
import { UserBookEditPageComponent } from './components/user-book-edit-page/user-book-edit-page.component';
import { UserBookListPageComponent } from './components/user-book-list-page/user-book-list-page.component';
import { UserBookPublishDialogComponent } from './components/user-book-publish-dialog/user-book-publish-dialog.component';
import { UserSettingsDialogComponent } from './components/user-settings-dialog/user-settings-dialog.component';
import { VolumeCardComponent } from './components/volume-card/volume-card.component';
import { VolumeDetailPageComponent } from './components/volume-detail-page/volume-detail-page.component';
import { ButtonSpinnerDirective } from './directives/button-spinner.directive';
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

// TODO add requireAuth effects lifecycle
// TODO consider angular flex-layout instead of bootstrap grid
// TODO consider normalize.css instead of bootstrap reboot
// TODO consider material typography instead of bootstrap typography
// TODO consider kicking bootstrap root if not needed
// TODO adapt bootstrap variables / helpers: theme colors, font size, font weight
// TODO standalone components and migrate material imports to reduce initial bundle size
// TODO experimantal standalone components (possibly all) as pull request
// TODO resolve browser console warnings on startup
// TODO add $localize function and x18n tags to all language strings

registerLocaleData(localeDe);

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

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(firebaseOptions)),
    provideAuth(() => getAuth()),
    provideFunctions(() => getFunctions()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
    StoreModule.forRoot(reducers, storeConfig),
    EffectsModule.forRoot(effects),
    StoreRouterConnectingModule.forRoot(routerStoreConfig),
    StoreDevtoolsModule.instrument({ maxAge: 50, logOnly: !isDevMode() }),
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule,
    /* MatTooltipModule, */

    ButtonSpinnerDirective,
    ValidationErrorPipe,
    BookConditionPipe,
    BooleanPipe,

    ImageCropperModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    LoginPageComponent,
    HomePageComponent,
    SearchPageComponent,
    UserSettingsDialogComponent,
    CropImageDialogComponent,
    UserBookListPageComponent,
    UserBookEditPageComponent,
    UserBookCreateDialogComponent,
    UserBookPublishDialogComponent,
    UserBookDeleteDialogComponent,
    UserBookCardContentComponent,
    VolumeDetailPageComponent,
    VolumeCardComponent,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'de-DE' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: APP_CONFIG, useValue: appConfig },
    { provide: APP_STRINGS, useValue: appStrings },
    { provide: AUTH_CONFIG, useValue: authConfig },
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthErrorInterceptor, multi: true },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: checkboxOptions },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: dialogOptions },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: formFieldOptions },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: snackBarOptions },
    /* { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: tooltipOptions }, */
    { provide: ErrorStateMatcher, useClass: DirtyOrTouchedMatcher },
    { provide: TitleStrategy, useClass: AppTitleStrategy },
  ],
})
export class AppModule implements DoBootstrap {
  constructor(iconRegistry: MatIconRegistry) {
    iconRegistry.registerFontClassAlias('fa', 'fa'); // font-awesome
    iconRegistry.setDefaultFontSetClass('fa');
  }

  ngDoBootstrap(appRef: ApplicationRef): void {
    appRef.bootstrap(AppComponent);
  }
}
