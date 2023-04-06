import { NgModule } from '@angular/core';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { environment } from '../environments/environment';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { UserBookEditPageComponent } from './components/user-book-edit-page/user-book-edit-page.component';
import { UserBookListPageComponent } from './components/user-book-list-page/user-book-list-page.component';
import { VolumeDetailPageComponent } from './components/volume-detail-page/volume-detail-page.component';

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
    ...canActivate(() => redirectLoggedInTo('/home')),
  },
  {
    path: 'home',
    title: `Home`,
    component: HomePageComponent,
  },
  {
    path: 'search',
    title: `Search`,
    component: SearchPageComponent,
  },
  {
    path: 'books/:volumeId',
    title: `Book Details`,
    component: VolumeDetailPageComponent,
    // TODO leave naming as book?
  },
  {
    path: 'user',
    ...canActivate(() => redirectUnauthorizedTo('/login')),
    children: [
      {
        path: 'books',
        title: `My Books`,
        component: UserBookListPageComponent,
      },
      {
        path: 'books/:bookId/edit',
        title: `Edit Book Details`,
        component: UserBookEditPageComponent,
        // TODO guard own article only
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
