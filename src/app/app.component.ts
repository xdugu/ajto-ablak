import { Component, Inject} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environments/environment';
import { Workbox } from 'workbox-window';
import { ScreenTypeService} from './shared-services/screen-type.service';
import { LanguageService } from './shared-services/language.service';
import { ConfigService } from '@app/shared-services/config.service';
import { TrackingService } from '@app/shared-services/tracking.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ajto-ablak';
  sideBarVisible = false;
  sideBarMode = 'push';
  currentView = 'mobile';
  theme = 'default';

  siteLanguage = 'en';

  constructor(screenTypeService: ScreenTypeService, router: Router,
              langService: LanguageService, configService: ConfigService,
              tracking: TrackingService, @Inject(PLATFORM_ID) private platformId: object){

    screenTypeService.getScreenTypeUpdate().subscribe({
      next: state => this.onScreenSizeChange(state)
    });

    configService.getConfig('general').subscribe({
      next: general => this.theme = general.theme
    });

    // listen to route change events to hide sidebar in mobile devices
    router.events.subscribe({
      next: event => {
        if (event instanceof NavigationStart && this.currentView === 'mobile'){
          this.sideBarVisible = false;
        }
      }
    });

    langService.getLang().then(lang => {
      this.siteLanguage = lang;
      if (isPlatformBrowser(this.platformId)){
        this.setupServiceWorker(lang);
      }
    });

  }

  // reacts to changes in screen size
  private onScreenSizeChange(newScreenSize: string): void{
    this.currentView = newScreenSize;
    switch (newScreenSize){
      case 'wideScreen':
        this.sideBarVisible = true;
        this.sideBarMode = 'side';
        break;

      case 'mobile':
        this.sideBarVisible = false;
        this.sideBarMode = 'push';
        break;

      default:
        this.sideBarVisible = false;
        this.sideBarMode = 'push';
        break;
    }
  }

  onMenuButtonClickedInNav(): void{
    if (this.currentView === 'tablet' || this.currentView === 'mobile'){
      this.sideBarVisible = !this.sideBarVisible;
    } // if
  }

  private setupServiceWorker(lang: string): void{

    if ('serviceWorker' in navigator) {

      if (environment.production){
        const wb = new Workbox(`/${lang}/service-worker.js`);
        wb.register();
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
}
