import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Workbox } from 'workbox-window';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

function loadServiceWorker(): void {
  if ('serviceWorker' in navigator) {

    if (environment.production){
      const wb = new Workbox('/service-worker.js');

      // listen to when sw is intalled
      wb.addEventListener('activated', () => {

        // delete old caches which will probably never be used
        caches.keys().then((names) => {
          for (const name of names){
            if (['img-cache', 'slick-extensions', 'perm-library'].indexOf(name) < 0){
              caches.delete(name);
            } // if
          }
        });
      });

      navigator.serviceWorker.register('/service-worker.js')
        .catch(err => console.error('Service worker registration failed with:', err));
    }

    // unregister all previous service workers not in root to prevent interference
    // now we have one service worker for all languages
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        if (registration.scope.indexOf('/en') > 0 || registration.scope.indexOf('/hu') > 0 ||
          registration.scope.indexOf('/assets') > 0){
            registration.unregister();
        } // if
      } // for
    });
  }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(_ => loadServiceWorker())
  .catch(err => console.error(err));

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
});
