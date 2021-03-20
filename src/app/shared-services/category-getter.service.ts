import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import {ApiManagerService, API_METHOD, API_MODE} from './api-manager.service';
import {ConfigService} from './config.service';

// This service will get category items

@Injectable({
  providedIn: 'root'
})
export class CategoryGetterService {
  private storeId = null;

  constructor(configService: ConfigService, private apiService: ApiManagerService) {
    configService.getConfig('storeId').subscribe({
      next: res => this.storeId = res
    });
  }

  getCategory(category: Array<string>): Promise<any>{
      return new Promise((resolve, reject) => {
        const httpParams = new HttpParams()
            .set('category', category.join('>'))
            .set('storeId', this.storeId + '>Product');

        const resp = this.apiService.get(API_MODE.OPEN, API_METHOD.GET, 'category', httpParams);
        resp.subscribe({
          next: (data: any) => {
              resolve(data);
          },
          error: (err) => reject(err)
        });
      });
  }
}
