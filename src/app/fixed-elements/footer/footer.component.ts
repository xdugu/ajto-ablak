import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { PreferencesService } from '@app/shared-services/preferences.service';

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

  constructor(prefService: PreferencesService,
              private router: Router, private activatedRoute: ActivatedRoute) {
    const subscription = prefService.getPreferences().subscribe({
      next: prefs => {
        this.availableLangs = prefs.lang.available;
        subscription.unsubscribe();
      }
    });

    this.currentUrl = router.url;

    // listen to route changes to update links
    router.events.subscribe({
      next: event => {
        if (event instanceof NavigationStart){
          this.currentUrl = event.url;
        }
      }
    });
  }

  ngOnInit(): void {
  }

}
