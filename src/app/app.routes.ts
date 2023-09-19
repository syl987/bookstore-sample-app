import { isDevMode } from '@angular/core';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';

// TODO keep same page after login
// TODO guard and keep same page or redirect after logout

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home',
  },
  {
    path: 'login',
    title: $localize`Login`,
    ...canActivate(() => redirectLoggedInTo('/home')),
    loadComponent: () => import('./components/login-page/login-page.component').then(m => m.LoginPageComponent),
  },
  {
    path: 'home',
    title: $localize`Home`,
    loadComponent: () => import('./components/home-page/home-page.component').then(m => m.HomePageComponent),
  },
  {
    path: 'search',
    title: $localize`Search`,
    loadComponent: () => import('./components/search-page/search-page.component').then(m => m.SearchPageComponent),
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
    path: '**',
    redirectTo: '/home',
  },
];

if (isDevMode()) {
  routes.splice(routes.length - 1, 0, {
    path: 'dev',
    title: `Component Collection`,
    loadComponent: () => import('./components/dev-components-page/dev-components-page.component').then(m => m.DevComponentsPageComponent),
  });
}
