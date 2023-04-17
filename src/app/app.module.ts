import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import { ApplicationRef, DEFAULT_CURRENCY_CODE, DoBootstrap, LOCALE_ID, NgModule } from '@angular/core';
import { FirebaseOptions, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TitleStrategy } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ImageCropperModule } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { appConfig, appStrings, authConfig } from './app-config.options';
import { AppRoutingModule } from './app-routing.module';
import { FooterComponent } from './components/__base/footer/footer.component';
import { HeaderComponent } from './components/__base/header/header.component';
import { SidenavComponent } from './components/__base/sidenav/sidenav.component';
import { BookCreateDialogComponent } from './components/book-create-dialog/book-create-dialog.component';
import { CropImageDialogComponent } from './components/crop-image-dialog/crop-image-dialog.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { UserBookCardComponent } from './components/user-book-card/user-book-card.component';
import { UserBookEditPageComponent } from './components/user-book-edit-page/user-book-edit-page.component';
import { UserBookListPageComponent } from './components/user-book-list-page/user-book-list-page.component';
import { UserSettingsDialogComponent } from './components/user-settings-dialog/user-settings-dialog.component';
import { VolumeCardComponent } from './components/volume-card/volume-card.component';
import { VolumeDetailPageComponent } from './components/volume-detail-page/volume-detail-page.component';
import { AuthErrorInterceptor } from './interceptors/auth-error.interceptor';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import { APP_CONFIG, APP_STRINGS } from './models/app.models';
import { AUTH_CONFIG } from './models/auth.models';
import { SharedModule } from './modules/shared/shared.module';
import { AppTitleStrategy } from './services/title-strategy';
import { effects, reducers, routerStoreConfig, storeConfig } from './store/app.store';

// TODO toolbar button ripple style
// TODO snackbar icon and text
// TODO kick dialog supporting text config
// TODO fix icon button positioning

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
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(firebaseOptions)),
    provideAuth(() => getAuth()),
    provideFunctions(() => getFunctions()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
    StoreModule.forRoot(reducers, storeConfig),
    EffectsModule.forRoot(effects),
    StoreRouterConnectingModule.forRoot(routerStoreConfig),
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],
    ImageCropperModule,
    SharedModule,
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
    BookCreateDialogComponent,
    UserBookListPageComponent,
    UserBookEditPageComponent,
    VolumeDetailPageComponent,
    UserBookCardComponent,
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
    { provide: TitleStrategy, useClass: AppTitleStrategy },
  ],
})
export class AppModule implements DoBootstrap {
  ngDoBootstrap(appRef: ApplicationRef): void {
    appRef.bootstrap(AppComponent);
  }
}
