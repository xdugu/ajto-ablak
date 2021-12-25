import { Injectable,  Inject, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiManagerService, API_METHOD, API_MODE } from './api-manager.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private currentConfig: any = null;
  private requestInProgress = false;

  constructor(private apiManager: ApiManagerService,
              @Inject(PLATFORM_ID) private platformId: object,
              @Optional() @Inject('host') private host: any) {}

  // returns the config given the config nam
  getConfig(configName: string): Observable<any>{
    return new Observable(observer => {
      if (this.currentConfig == null){
        if (!this.requestInProgress){
          this.getConfigFromNetwork();
        }

        // set interval to wait every 50ms for a result
        const interval = setInterval(() => {
          if (this.currentConfig != null){
            clearInterval(interval);
            observer.next(this.currentConfig[configName]);
          }
          else if (!this.requestInProgress){
            clearInterval(interval);
            observer.error('Error getting config');
          }
        }, 50);
      } // if
      else{
        observer.next(this.currentConfig[configName]);
      }
    });
  }

  // performs network getting of config
  private getConfigFromNetwork(): void{
    this.requestInProgress = true;

    let hierarchyParams = new HttpParams().set('get', 'WebsiteSettings');

    // if in prod mode, get settings directly from server. Don't guess the store id

    if ( isPlatformBrowser(this.platformId)){
      if (environment.production){
        hierarchyParams = hierarchyParams.set('domain', window.location.href);
      }
      else{
        hierarchyParams = hierarchyParams.set('storeId', 'KutyaLepcso');
      }
    } else{
      console.log(this.host);
      hierarchyParams = hierarchyParams.set('domain', this.host);
    }

    this.apiManager.get(API_MODE.OPEN, API_METHOD.GET, 'settings', hierarchyParams).subscribe({
      next: (res: any) => {
        this.currentConfig = res.item.WebsiteSettings;
        this.requestInProgress = false;
      },
      error: () => this.requestInProgress = false,
      complete: () => this.requestInProgress = false
    });
  }
}
