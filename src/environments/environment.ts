// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error';

import { Environment } from './_env.model';

export const environment: Environment = {
  firebase: {
    apiKey: 'AIzaSyDrisPHet7H7y-G9GjVoJZFReIp-xqgnjo',
    authDomain: 'sample-app-a00e0.firebaseapp.com',
    databaseURL: 'https://sample-app-a00e0-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'sample-app-a00e0',
    storageBucket: 'sample-app-a00e0.appspot.com',
    messagingSenderId: '996177241422',
    appId: '1:996177241422:web:c989fc969fe444ed99ea1f',
    measurementId: 'G-1MVY64K4ZT',
  },
  production: false,
};
