import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import { ApplicationRef, DEFAULT_CURRENCY_CODE, DoBootstrap, LOCALE_ID, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/compat/auth-guard';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TitleStrategy } from '@angular/router';
import { DefaultDataServiceConfig, DefaultDataServiceFactory, EntityDataModule } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ImageCropperModule } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { appConfig, appDataServiceConfig, appEntityNames, appEntityPluralNames, appStrings, authConfig } from './app-config.options';
import { AppRoutingModule } from './app-routing.module';
import { FooterComponent } from './components/__base/footer/footer.component';
import { HeaderComponent } from './components/__base/header/header.component';
import { SidenavComponent } from './components/__base/sidenav/sidenav.component';
import { BookArticleDetailPageComponent } from './components/book-article-detail-page/book-article-detail-page.component';
import { BookArticleEditPageComponent } from './components/book-article-edit-page/book-article-edit-page.component';
import { CropImageDialogComponent } from './components/crop-image-dialog/crop-image-dialog.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { UserSettingsDialogComponent } from './components/user-settings-dialog/user-settings-dialog.component';
import { AuthErrorInterceptor } from './interceptors/auth-error.interceptor';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import { ErrorResponseInterceptor } from './interceptors/error-response.interceptor';
import { APP_CONFIG, APP_ENTITY_NAMES, APP_ENTITY_PLURAL_NAMES, APP_STRINGS } from './models/app.models';
import { AUTH_CONFIG } from './models/auth.models';
import { SharedModule } from './modules/shared/shared.module';
import { AppDataServiceFactory } from './services/__data/data-service-factory';
import { AppTitleStrategy } from './services/title-strategy';
import { effects, entityDataConfig, reducers, routerStoreConfig, storeConfig } from './store/app.store';

registerLocaleData(localeDe);

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFireAuthGuardModule,
        AngularFireFunctionsModule,
        AngularFireDatabaseModule,
        AngularFireStorageModule,
        StoreModule.forRoot(reducers, storeConfig),
        EffectsModule.forRoot(effects),
        EntityDataModule.forRoot(entityDataConfig),
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
        BookArticleDetailPageComponent,
        BookArticleEditPageComponent,
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'de-DE' },
        { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
        { provide: APP_CONFIG, useValue: appConfig },
        { provide: AUTH_CONFIG, useValue: authConfig },
        { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: AuthErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorResponseInterceptor, multi: true },
        { provide: TitleStrategy, useClass: AppTitleStrategy },
        { provide: DefaultDataServiceFactory, useClass: AppDataServiceFactory },
        { provide: DefaultDataServiceConfig, useValue: appDataServiceConfig },
        { provide: APP_ENTITY_NAMES, useValue: appEntityNames },
        { provide: APP_ENTITY_PLURAL_NAMES, useValue: appEntityPluralNames },
        { provide: APP_STRINGS, useValue: appStrings },
    ],
})
export class AppModule implements DoBootstrap {
    ngDoBootstrap(appRef: ApplicationRef): void {
        appRef.bootstrap(AppComponent);
    }
}
