import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  currentConfig: any = null;
  requestInProgress = false;

  constructor(private http: HttpClient) {}

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
    this.http.get(`${environment.url}/hu/assets/config.json`).subscribe({
      next: res => {this.currentConfig = res; this.requestInProgress = false; },
      error: () => this.requestInProgress = false,
      complete: () => this.requestInProgress = false
    });
  }
}
