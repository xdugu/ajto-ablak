import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { PreferencesService } from '@app/shared-services/preferences.service';
import { ConfigService } from '@app/shared-services/config.service';

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

  constructor(prefService: PreferencesService, configService: ConfigService,
              router: Router, location: Location) {
    const subscription = prefService.getPreferences().subscribe({
      next: prefs => {
        this.availableLangs = prefs.lang.available;
        subscription.unsubscribe();
      }
    });

    this.currentUrl = location.path();

    // listen to route changes to update links
    router.events.subscribe({
      next: event => {
        if (event instanceof NavigationEnd){
          this.currentUrl = location.path();
        }
      }
    });

    configService.getConfig('externalLinks').subscribe({
      next: links => this.externalLinks = links
    });


  }

  ngOnInit(): void {}

}
