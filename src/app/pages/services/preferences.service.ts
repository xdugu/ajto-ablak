import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenStorageService } from '@app/shared-services/token-storage.service';
import { ConfigService } from '@app/shared-services/config.service';
import { LanguageService } from '@app/shared-services/language.service';

export interface PreferencesInterface{
  currency: {chosen: string, available: Array<string>};
  countryCode: string;
  paymentMethod: string;
  deliveryMethod: string;
  lang: {chosen: string; available: Array<string>};
}

@Injectable({
  providedIn: 'root'
})
// This service returns the current user's preferences
export class PreferencesService {
  private currentPreference: PreferencesInterface = null;
  private loadingPreferences = true;

  constructor(private storageService: TokenStorageService, private configService: ConfigService,
              langService: LanguageService) {
    const version = this.storageService.getNumber('PreferencesVersion');

    if (version == null){
      this.configService.getConfig('preferences').subscribe({
        next: (preferences: PreferencesInterface) => {
          this.currentPreference = preferences;
          langService.getLang().then(lang => {
            this.currentPreference.lang.chosen = lang;
            this.storageService.setObj('Preferences', this.currentPreference);
          });
          this.loadingPreferences = false;
        }
      });

      this.configService.getConfig('version').subscribe({
        next: v => {
            storageService.setNumber('PreferencesVersion', v);
        }
      });
    } // if

    else{
      this.currentPreference = storageService.getObj('Preferences');
      this.configService.getConfig('version').subscribe({
        next: v => {
            storageService.setNumber('PreferencesVersion', v);

            if (v > version){
              this.configService.getConfig('preferences').subscribe({
                next: (preferences: PreferencesInterface) => {
                  this.currentPreference = preferences;

                  // in case of a language change
                  langService.getLang().then(lang => {
                    this.currentPreference.lang.chosen = lang;
                    this.storageService.setObj('Preferences', this.currentPreference);
                  });
                  this.loadingPreferences = false;
                }
              });

              storageService.setNumber('PreferencesVersion', v);
            } // if
            else{
              langService.getLang().then(lang => {
                if (this.currentPreference.lang.chosen !== lang){
                  this.currentPreference.lang.chosen = lang;
                  this.storageService.setObj('Preferences', this.currentPreference);
                  this.loadingPreferences = false;
                }
                else{
                  this.loadingPreferences = false;
                }
              });

            } // else
        }
      });

    } // else
  } // constructor

  getPreferences(): Observable<PreferencesInterface> {
    return new Observable(observer => {
      if (this.loadingPreferences){
        const interval = setInterval(() => {
          if (!this.loadingPreferences){
            observer.next(JSON.parse(JSON.stringify(this.currentPreference)));
            clearInterval(interval);
            return;
          } // if
        }, 100);
      }
      else{
        observer.next(JSON.parse(JSON.stringify(this.currentPreference)));
      }
    });
  }

  setPreference(property: string, value: any): void{
    const keys = Object.keys(this.currentPreference);
    if (keys.indexOf(property) >= 0){
      this.currentPreference[property] = value;
      this.storageService.setObj('Preferences', this.currentPreference);
    }
    else{
      console.log('Cannot save a property that does not exist in preferences');
    }
  }


}
