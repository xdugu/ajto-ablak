import { Injectable } from '@angular/core';
import { get } from 'scriptjs';
import { ConfigService } from './config.service';
import { TokenStorageService } from './token-storage.service';
import { Router, NavigationEnd } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

declare let gtag;

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  constructor(configService: ConfigService, tokenService: TokenStorageService,
              private router: Router) {

    let trackingId = tokenService.getString('UniqueExperienceId');

    if (trackingId == null){
      trackingId = uuidv4();
      tokenService.setString('UniqueExperienceId', trackingId);
    }

    configService.getConfig('tracking').subscribe({
      next: tracking => {
        get(`https://www.googletagmanager.com/gtag/js?id=${tracking.id}`, () => {

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
