import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';

import { LoginPageComponent } from './components/main/login-page/login-page.component';
import { WelcomePageComponent } from './components/main/welcome-page/welcome-page.component';
import { VolumeSearchPageComponent } from './components/volumes/volume-search-page/volume-search-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/welcome',
  },
  {
    path: 'login',
    title: $localize`Login`,
    ...canActivate(() => redirectLoggedInTo('/volumes')),
    component: LoginPageComponent,
  },
  {
    path: 'welcome',
    title: $localize`Welcome`,
    component: WelcomePageComponent,
  },
  {
    path: 'volumes',
    title: $localize`Books`,
    component: VolumeSearchPageComponent,
  },
  {
    path: 'volumes/:volumeId',
    title: $localize`Volume Details`,
    loadComponent: () => import('./components/volumes/volume-detail-page/volume-detail-page.component').then(m => m.VolumeDetailPageComponent),
  },
  {
    path: 'volumes/:volumeId/offer/:offerId',
    title: $localize`Book Offer Details`,
    loadComponent: () => import('./components/volumes/volume-offer-detail-page/volume-offer-detail-page.component').then(m => m.VolumeOfferDetailPageComponent),
  },
  {
    path: 'user',
    ...canActivate(() => redirectUnauthorizedTo('/login')),
    children: [
      {
        path: 'books',
        title: $localize`My Books`,
        loadComponent: () => import('./components/user-books/user-book-list-page/user-book-list-page.component').then(m => m.UserBookListPageComponent),
      },
      {
        path: 'books/:bookId/edit',
        title: $localize`Edit Book Details`,
        loadComponent: () => import('./components/user-books/user-book-edit-page/user-book-edit-page.component').then(m => m.UserBookEditPageComponent),
      },
      {
        path: 'books/:bookId',
        title: $localize`View Book Details`,
        loadComponent: () => import('./components/user-books/user-book-detail-page/user-book-detail-page.component').then(m => m.UserBookDetailPageComponent),
      },
    ],
  },
  {
    path: 'dev',
    title: `Component Collection`,
    loadComponent: () => import('./components/main/dev-components-page/dev-components-page.component').then(m => m.DevComponentsPageComponent),
  },
  {
    path: '**',
    redirectTo: '/welcome',
  },
];
