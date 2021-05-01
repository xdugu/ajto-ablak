import { Injectable, Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ConfigService } from './config.service';
import { TokenStorageService } from './token-storage.service';
import { ScriptLoaderService } from '@app/shared-module/services/script-loader.service';
import { Router, NavigationEnd } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

declare let gtag;

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  constructor(configService: ConfigService, tokenService: TokenStorageService,
              private router: Router, @Inject(PLATFORM_ID) private platformId: object,
              scriptLoader: ScriptLoaderService) {

    let trackingId = tokenService.getString('UniqueExperienceId');

    if (isPlatformBrowser(this.platformId)) {
      // Client only code.
      if (trackingId == null){
        trackingId = uuidv4();
        tokenService.setString('UniqueExperienceId', trackingId);
      }

      configService.getConfig('tracking').subscribe({
        next: tracking => {
          scriptLoader.loadScript(`https://www.googletagmanager.com/gtag/js?id=${tracking.id}`).then(() => {

            gtag('config', tracking.id, {
              client_storage: 'none',
              anonymize_ip: true,
              send_page_view: false,
              client_id: trackingId,
            });
            this.setupNavigationTracking();
          });
        }
      });
    }
  }



  // sets up navigation tracking subscription
  private setupNavigationTracking(): void{
    // add tracking to current page
    gtag('event', 'page_view', {page_path: this.router.url});

    this.router.events
      .subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('event', 'page_view', {page_path: event.url});
      }
    });
  }
}
