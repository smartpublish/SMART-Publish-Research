// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  base_url: 'http://localhost:4200',
  auth0_config: {
    clientID: 'h1YtDN7KnKnxXixef8ZaJJbHPBEa9ZC1',
    domain: 'smartpublish.eu.auth0.com',
    responseType: 'token id_token',
    redirectUri: 'http://localhost:4200/#/home',
    scope: 'openid profile'
  },
  mailgun_config: {
    domain: 'sandbox3231349852834b0c97d8fcb93e991fb2.mailgun.org',
    api_key: '4b6c0fa8ec0475d8d4b82f2cc8def894-b3780ee5-76b3a151',
    api_base_url: 'https://api.mailgun.net/v3/sandbox3231349852834b0c97d8fcb93e991fb2.mailgun.org'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
