import { NgModule } from '@angular/core';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';

import { BookArticleDetailPageComponent } from './components/book-article-detail-page/book-article-detail-page.component';
import { BookArticleEditPageComponent } from './components/book-article-edit-page/book-article-edit-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SearchPageComponent } from './components/search-page/search-page.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home',
    },
    {
        path: 'login',
        title: `Login`,
        component: LoginPageComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: () => redirectLoggedInTo('/home') },
    },
    {
        path: '',
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: () => redirectUnauthorizedTo('/login') },
        children: [
            {
                path: 'home',
                title: `Home`,
                component: HomePageComponent,
            },
            {
                path: 'search',
                title: `Search Results`,
                component: SearchPageComponent,
            },
            {
                path: 'articles/books/:bookArticleId/edit',
                title: `Edit Book Details`,
                component: BookArticleEditPageComponent,
                // TODO guard own article only
            },
            {
                path: 'articles/books/:bookArticleId',
                title: `Book Details`,
                component: BookArticleDetailPageComponent,
            },
        ],
    },
    {
        path: '**',
        redirectTo: '/home',
    },
];

if (!environment.production) {
    routes.splice(routes.length - 1, 0, { path: 'dev', loadChildren: () => import('./modules/dev/dev.module').then(m => m.DevModule) });
}

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
