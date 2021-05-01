import { Component, Inject } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ScreenTypeService} from './shared-services/screen-type.service';
import { LanguageService } from './shared-services/language.service';
import { ConfigService } from '@app/shared-services/config.service';
import { TrackingService } from '@app/shared-services/tracking.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

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

    langService.getLang().then(lang => this.siteLanguage = lang);

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
}
