import { Injectable, Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// this service loads scripts from external sources
@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (isPlatformBrowser(this.platformId)) {
        const script = document.createElement('script');
        script.src = url;
        document.head.appendChild(script);
        script.onload = () => {
          resolve();
        };
        script.onerror = (err) => {
          reject(err);
        };

      }
      else{
        reject();
      }
    });
  }
}
