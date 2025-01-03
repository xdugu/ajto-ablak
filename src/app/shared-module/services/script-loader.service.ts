import { Injectable, Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// this service loads scripts from external sources
@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  loadScript(url: string, delay = 500): Promise<void> {
    return new Promise((resolve, reject) => {
      if (isPlatformBrowser(this.platformId)) {
        const script = document.createElement('script');
        script.src = url;
        document.head.appendChild(script);
        script.onload = () => {
          setTimeout(resolve, delay);
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

  async loadLocalScript(code: string): Promise<void>{
    if (isPlatformBrowser(this.platformId)) {
      const script = document.createElement('script');
      script.innerHTML = code
      document.head.appendChild(script);
    }
  }
}
