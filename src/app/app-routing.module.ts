import { NgModule } from '@angular/core';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';

import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { MessagePageComponent } from './components/message-page/message-page.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { UserProfilePageComponent } from './components/user-profile-page/user-profile-page.component';

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
                title: `Profile Search`,
                component: SearchPageComponent,
            },
            {
                path: 'profile/:profileId/message',
                title: `Direct Messages`,
                component: MessagePageComponent,
            },
            {
                path: 'user/profile',
                title: `Your Profile`,
                component: UserProfilePageComponent,
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
