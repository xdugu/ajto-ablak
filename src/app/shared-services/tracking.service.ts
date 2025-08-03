import { Injectable, Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ConfigService } from './config.service';
import { TokenStorageService } from './token-storage.service';
import { ScriptLoaderService } from '@app/shared-module/services/script-loader.service';
import { ITrackingInfo } from '@app/fixed-elements/cookie/cookie.component';
import { Router, NavigationEnd } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

declare let gtag;
declare let fbq;

// Decorator to catch all errors when tracking
function catchErrors( target: any, propertyKey: string, descriptor: PropertyDescriptor){
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    try{
      return originalMethod.apply(this, args);
    }
    catch(err){
      console.info(err)
    }
  };

  return descriptor;
}

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private fb_tracking_enabled = false;

  constructor(configService: ConfigService, tokenService: TokenStorageService,
              private router: Router, @Inject(PLATFORM_ID) private platformId: object,
              scriptLoader: ScriptLoaderService) {

    if (isPlatformBrowser(this.platformId)) {
      let trackingId = tokenService.getString('UniqueExperienceId');
      const trackingInfo: ITrackingInfo | undefined = tokenService.getObj('trackingInfo')
      // Client only code.
      if (trackingId == null){
        trackingId = uuidv4();
        tokenService.setString('UniqueExperienceId', trackingId);
      }

      if(!trackingInfo || (trackingInfo && trackingInfo.trackingEnabled)){
        this.fb_tracking_enabled = true;
        configService.getConfig('tracking').subscribe({
          next: tracking => {
            scriptLoader.loadScript(`https://www.googletagmanager.com/gtag/js?id=${tracking.id}`, 2000).then(() => {

              gtag('config', tracking.id, {
                client_storage: 'none',
                anonymize_ip: true,
                send_page_view: false,
                client_id: trackingId,
              });
              this.setupNavigationTracking();
            });

            if(tracking.fb_id){
              scriptLoader.loadLocalScript(
                `!function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${tracking.fb_id}'); fbq('track', 'PageView');`
              )
            }
          }
        });
      }
    }
  }

  @catchErrors
  addToBasketEvent(productId: string){
      if(this.fb_tracking_enabled){
        fbq('track', 'AddToCart')
      }
  }

  @catchErrors
  customiseClickEvent(productId: string){
    if(this.fb_tracking_enabled){
      fbq('track', 'CustomizeProduct')
    }
  }

  @catchErrors
  requestSubmissionEvent(){
    if(this.fb_tracking_enabled){
      fbq('track', 'Lead');
    }
  }

  @catchErrors
  purchaseComplete(total: number, currency: string){
    if(this.fb_tracking_enabled){
      fbq('track', 'Purchase', {value: total.toFixed(2), currency});
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
