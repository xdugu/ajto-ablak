import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import {ApiManagerService, API_METHOD, API_MODE} from './api-manager.service';
import {ConfigService} from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ProductGetterService {
  private storeId = null;

  constructor(configService: ConfigService, private apiService: ApiManagerService) {
    configService.getConfig('storeId').subscribe({
      next: res => this.storeId = res
    });
  }

  // returns a single requested product
  getProduct(productId: string): Promise<any>{

    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
      .set('itemId', productId)
      .set('storeId', this.storeId);

      const resp = this.apiService.get(API_MODE.OPEN, API_METHOD.GET, 'product', httpParams);
      resp.subscribe({
        next: (evt: any) => resolve(evt.data),
        error: err => reject(err)
        }
      );
    });
  }

  // returns an array of requested products. Note that they may not be in the order requested
  getProducts(products: Array<string>): Promise<any>{
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
      .set('items', products.join(','))
      .set('storeId', this.storeId);

      const resp = this.apiService.get(API_MODE.OPEN, API_METHOD.GET, 'products', httpParams);
      resp.subscribe({
        next: (evt: any) => resolve(evt),
        error: err => reject(err)
        }
      );
    });
  }

}
