import { Component, OnInit, Input, Inject, Optional } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { PreferencesService } from '@app/shared-services/preferences.service';
import { ConfigService } from '@app/shared-services/config.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  availableLangs = [];
  @Input() lang = null;
  currentUrl: string = null;
  langDict = {
    en: 'English',
    hu: 'Magyarul'
  };
  externalLinks = [];
  paymentTypes = [];

  constructor(prefService: PreferencesService, configService: ConfigService,
              router: Router, location: Location,
              @Inject(PLATFORM_ID) private platformId: object,
              @Optional() @Inject('request') private request: any) {
    const subscription = prefService.getPreferences().subscribe({
      next: prefs => {
        this.availableLangs = prefs.lang.available;
        subscription.unsubscribe();
      }
    });

    if (isPlatformBrowser(this.platformId)){
      this.currentUrl = window.location.href;
    }
    else{
      this.currentUrl = '/' + this.request.path;
    }

    // listen to route changes to update links
    router.events.subscribe({
      next: event => {
        if (event instanceof NavigationEnd && isPlatformBrowser(this.platformId)){
            this.currentUrl = window.location.href;
        }
      }
    });

    configService.getConfig('externalLinks').subscribe({
      next: links => this.externalLinks = links
    });

    configService.getConfig('paymentTypes').subscribe({
      next: types => this.paymentTypes = types
    });


  }

  ngOnInit(): void {}

}
