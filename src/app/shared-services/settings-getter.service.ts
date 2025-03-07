import { Injectable } from '@angular/core';
import { ApiManagerService, API_METHOD, API_MODE } from './api-manager.service';
import { ConfigService } from './config.service';
import { HttpParams } from '@angular/common/http';

interface ISettings{
  [key: string]: any
}

@Injectable({
  providedIn: 'root'
})
export class SettingsGetterService {
  private storeId = null
  constructor(private apiService: ApiManagerService, private configService: ConfigService) {
    
   }

  getSettings(names: string[]): Promise<ISettings>{
    return new Promise((resolve, reject)=> {
      this.getStoreId().then(storeId => {
        const params = new HttpParams().set('storeId', storeId).set('get', names.join(','))
        this.apiService.get(API_MODE.OPEN, API_METHOD.GET, 'settings', params).subscribe({
          next: (res: any) => resolve(res.item),
          error: (err) => reject(err)
        })
      })
    })
  }

  async getSetting(name: string): Promise<any>{
    const resp = await this.getSettings([name])
    return resp[name]
  }

  private getStoreId(): Promise<string>{
    return new Promise((resolve, reject) => {
      if (this.storeId){
        resolve(this.storeId)
      }
      else{
        this.configService.getConfig('storeId').subscribe({
          next: (storeId) => {
              this.storeId = storeId
              resolve(this.storeId)
            },
            error: (err) => reject(err)
          })
      }
    })
   
  }
}
