// link to useful tutorial https://golb.hplar.ch/2018/06/workbox-serviceworker-in-angular-project.html

import { createHandlerBoundToURL, precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { clientsClaim, skipWaiting } from 'workbox-core';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import * as strategies from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

// const navigationRoute = new NavigationRoute(createHandlerBoundToURL('index.html'));
// registerRoute(navigationRoute);

// Cache the Google Fonts webfont files with a cache first strategy for 1 year.
registerRoute(
  ({url}) => url.origin === 'https://fonts.googleapis.com' ||
               url.origin === 'https://fonts.gstatic.com' ||
                url.origin === 'https://ajax.googleapis.com',

  new strategies.CacheFirst({
    cacheName: 'perm-library',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365
      }),
    ],
  }),
);

// Cache get response api server to reduce unnecessary duplicate requests
registerRoute(
  /^https:\/\/.+.execute-api.eu-central-1.amazonaws.com/,
   new strategies.CacheFirst({
     cacheName: 'product-info-cache',
     plugins: [
       new CacheableResponsePlugin({
         statuses: [0, 200],
       }),
       new ExpirationPlugin({
         maxAgeSeconds: 60 * 10 // 10 minutes cache
       }),
     ],
   }),
 );


// the js, css and html files will be cached for 24 hours to reduce the number of server requests
registerRoute(
   /\.(?:js|css|xml|json)/,

   // Use cache
   new strategies.CacheFirst({
     // Use a custom cache name
     cacheName: 'js-css-html-json-xml-cache',
   plugins: [
       new ExpirationPlugin({
         maxAgeSeconds: 60 * 60 * 24 // expire after 24 hours
       }),
     ],
   })
 );

// cache slick file extensions permanently
registerRoute(
   // Cache CSS files
   /\.(?:woff|ttf|eot|svg)/,
   // Use cache
   new strategies.CacheFirst({
     // Use a custom cache name
     cacheName: 'slick-extensions',
   plugins: [
       new ExpirationPlugin({
         maxAgeSeconds: 60 * 60 * 24 * 365 // expire after 1 year
       })
     ],
   })
 );

registerRoute(
  // Cache get response api server to reduce unnecessary duplicate requests
   /^https:\/\/adugu-common.s3.eu-central-1.amazonaws.com/,
    new strategies.CacheFirst({
      cacheName: 'img-cache',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60 * 7, // 1 week cache for external images
          purgeOnQuotaError: true, // Opt-in to automatic cleanup.
        }),
      ],
    }),
  );

// to reduce network load, secondary image caches have been added
registerRoute(
   /\.(?:png|gif|jpg|jpeg|svg)$/,
   new strategies.CacheFirst({
     cacheName: 'img-cache',
     plugins: [
       new ExpirationPlugin({
         maxEntries: 50,
         maxAgeSeconds:  86400 * 30, // 1 month
       }),
     ],
   }),
 );



