import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import {ApiManagerService, API_METHOD, API_MODE} from '@app/shared-services/api-manager.service';
import {ConfigService} from '@app/shared-services/config.service';

// This service will get category items

@Injectable({
  providedIn: 'root'
})
export class CategoryGetterService {

  constructor(private configService: ConfigService, private apiService: ApiManagerService) {}

  getCategory(category: Array<string>): Promise<any>{
      return new Promise((resolve, reject) => {

        this.configService.getConfig('storeId').subscribe({
          next: storeId => {
            const httpParams = new HttpParams()
            .set('category', category.join('>'))
            .set('storeId', storeId);

            const resp = this.apiService.get(API_MODE.OPEN, API_METHOD.QUERY, 'product', httpParams);
            resp.subscribe({
              next: (data: any) => {
                  resolve(data.items);
              },
              error: (err) => reject(err)
            });
          },

          error: err => reject(err)
        });
      });
  }
}
