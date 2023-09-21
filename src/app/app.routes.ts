import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';

// TODO keep same page after login
// TODO guard and keep same page or redirect after logout

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
    loadComponent: () => import('./components/login-page/login-page.component').then(m => m.LoginPageComponent),
  },
  {
    path: 'welcome',
    title: $localize`Welcome`,
    loadComponent: () => import('./components/welcome-page/welcome-page.component').then(m => m.WelcomePageComponent),
  },
  {
    path: 'volumes',
    title: $localize`Books`,
    loadComponent: () => import('./components/volume-search-page/volume-search-page.component').then(m => m.VolumeSearchPageComponent),
  },
  {
    path: 'volumes/:volumeId',
    title: $localize`Volume Details`,
    loadComponent: () => import('./components/volume-detail-page/volume-detail-page.component').then(m => m.VolumeDetailPageComponent),
  },
  {
    path: 'volumes/:volumeId/offer/:offerId',
    title: $localize`Book Offer Details`,
    loadComponent: () => import('./components/volume-offer-detail-page/volume-offer-detail-page.component').then(m => m.VolumeOfferDetailPageComponent),
  },
  {
    path: 'user',
    ...canActivate(() => redirectUnauthorizedTo('/login')),
    children: [
      {
        path: 'books',
        title: $localize`My Books`,
        loadComponent: () => import('./components/user-book-list-page/user-book-list-page.component').then(m => m.UserBookListPageComponent),
      },
      {
        path: 'books/:bookId/edit',
        title: $localize`Edit Book Details`,
        loadComponent: () => import('./components/user-book-edit-page/user-book-edit-page.component').then(m => m.UserBookEditPageComponent),
      },
      {
        path: 'books/:bookId',
        title: $localize`View Book Details`,
        loadComponent: () => import('./components/user-book-detail-page/user-book-detail-page.component').then(m => m.UserBookDetailPageComponent),
      },
    ],
  },
  {
    path: 'dev',
    title: `Component Collection`,
    loadComponent: () => import('./components/dev-components-page/dev-components-page.component').then(m => m.DevComponentsPageComponent),
  },
  {
    path: '**',
    redirectTo: '/welcome',
  },
];
