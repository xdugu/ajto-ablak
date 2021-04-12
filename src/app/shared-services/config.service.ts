import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  HttpParams } from '@angular/common/http';
import { ApiManagerService, API_METHOD, API_MODE } from './api-manager.service';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  currentConfig: any = null;
  requestInProgress = false;

  constructor(private apiManager: ApiManagerService) {}

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
    const hierarchyParams = new HttpParams()
              .set('storeId', 'AjtoAblak')
              .set('get', 'WebsiteSettings');

    this.apiManager.get(API_MODE.OPEN, API_METHOD.GET, 'settings', hierarchyParams).subscribe({
      next: (res: any) => {this.currentConfig = res.WebsiteSettings; this.requestInProgress = false; },
      error: () => this.requestInProgress = false,
      complete: () => this.requestInProgress = false
    });
  }
}
