import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { VolumesEffects } from './store/volume/volume.effects';
import { provideState } from '@ngrx/store';
import * as fromVolume from './store/volume/volume.reducer';

export const routes: Routes = [
  {
    path: '',
    providers: [provideState(fromVolume.volumeFeatureKey, fromVolume.reducer), provideEffects([VolumesEffects])],
    children: [
      {
        path: '',
        title: $localize`Books`,
        loadComponent: () => import('./components/volume-search-page/volume-search-page.component').then(m => m.VolumeSearchPageComponent),
      },
      {
        path: ':volumeId',
        title: $localize`Volume Details`,
        loadComponent: () => import('./components/volume-detail-page/volume-detail-page.component').then(m => m.VolumeDetailPageComponent),
      },
      {
        path: ':volumeId/offer/:offerId',
        title: $localize`Book Offer Details`,
        loadComponent: () => import('./components/volume-offer-detail-page/volume-offer-detail-page.component').then(m => m.VolumeOfferDetailPageComponent),
      },
    ],
  },
];
