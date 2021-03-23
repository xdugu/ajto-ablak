import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import {ApiManagerService, API_METHOD, API_MODE} from '@app/shared-services/api-manager.service';
import {ConfigService} from '@app/shared-services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ProductGetterService {

  constructor(private configService: ConfigService, private apiService: ApiManagerService) {}

  // returns a single requested product
  getProduct(productId: string): Promise<any>{

    return new Promise((resolve, reject) => {

      this.configService.getConfig('storeId').subscribe({
        next: storeId => {
          const httpParams = new HttpParams()
          .set('itemId', productId)
          .set('storeId', storeId);

          const resp = this.apiService.get(API_MODE.OPEN, API_METHOD.GET, 'product', httpParams);
          resp.subscribe({
            next: (evt: any) => resolve(evt.data),
            error: err => reject(err)
            }
          );
        },
        error: err => reject(err)
      });

    });
  }

  // returns an array of requested products. Note that they may not be in the order requested
  getProducts(products: Array<string>): Promise<any>{
    return new Promise((resolve, reject) => {
      if (products.length === 0){
        resolve([]);
        return;
      }

      this.configService.getConfig('storeId').subscribe({
        next: storeId => {
          const httpParams = new HttpParams()
          .set('items', products.join(','))
          .set('storeId', storeId);

          const resp = this.apiService.get(API_MODE.OPEN, API_METHOD.GET, 'products', httpParams);
          resp.subscribe({
            next: (evt: any) => resolve(evt),
            error: err => reject(err)
            }
          );
        },
        error: err => reject(err)
      });

    });
  }

}
