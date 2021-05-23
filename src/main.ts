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
    const langs = ['en', 'hu'];

    if (environment.production){

      for (const lang of langs){
        const wb = new Workbox(`/${lang}/service-worker.js`);

        wb.register();
      }

    }

    // unregister all previous service workers not in root to prevent interference
    // now we have one service worker for all languages
    navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          if (registration.scope.indexOf(`/en`) < 0 && registration.scope.indexOf(`/hu`) < 0){
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
