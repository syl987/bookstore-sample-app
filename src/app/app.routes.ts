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
    title: `Login`,
    ...canActivate(() => redirectLoggedInTo('/home')),
    loadComponent: () => import('./components/login-page/login-page.component').then(m => m.LoginPageComponent),
  },
  {
    path: 'home',
    title: `Home`,
    loadComponent: () => import('./components/home-page/home-page.component').then(m => m.HomePageComponent),
  },
  {
    path: 'search',
    title: `Search`,
    loadComponent: () => import('./components/search-page/search-page.component').then(m => m.SearchPageComponent),
  },
  {
    path: 'books/:volumeId',
    title: `Book Details`,
    loadComponent: () => import('./components/volume-detail-page/volume-detail-page.component').then(m => m.VolumeDetailPageComponent),
  },
  {
    path: 'user',
    ...canActivate(() => redirectUnauthorizedTo('/login')),
    children: [
      {
        path: 'books',
        title: `My Books`,
        loadComponent: () => import('./components/user-book-list-page/user-book-list-page.component').then(m => m.UserBookListPageComponent),
      },
      {
        path: 'books/:bookId/edit',
        title: `Edit Book Details`,
        loadComponent: () => import('./components/user-book-edit-page/user-book-edit-page.component').then(m => m.UserBookEditPageComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];

if (isDevMode()) {
  routes.splice(routes.length - 1, 0, { path: 'dev', loadChildren: () => import('./modules/dev/dev.module').then(m => m.DevModule) });
}
