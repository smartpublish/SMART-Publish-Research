// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  auth0_config: {
    clientID: 'h1YtDN7KnKnxXixef8ZaJJbHPBEa9ZC1',
    domain: 'smartpublish.eu.auth0.com',
    responseType: 'token id_token',
    redirectUri: 'http://localhost:4200/#/home',
    scope: 'openid profile'
  }
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
