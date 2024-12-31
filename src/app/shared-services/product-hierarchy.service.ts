import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import { ApiManagerService, API_METHOD, API_MODE} from './api-manager.service';


export interface ProductHierarchy {
  name: string;
  text?: {en?: string, hu?: string};
  sub?: ProductHierarchy[];
  enabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductHierarchyService {
  private productHierarchy: Array<ProductHierarchy> = null;
  private loading = false;

  constructor(private configService: ConfigService, private apiService: ApiManagerService) {
    this.loadHierarchy();
  }


  // return product heirarchy
  getHierarchy(): Observable<Array<ProductHierarchy>>{

    return new Observable((observer) => {
      if (this.productHierarchy == null){
        if (!this.loading){
          this.loadHierarchy();
        }

        const interval = setInterval(() => {
          if (this.productHierarchy != null){
            clearInterval(interval);
            // return copy so not to have other modules pollute this source during manipulation
            observer.next(Object.assign([], this.productHierarchy));
          }
          else if (!this.loading){
            clearInterval(interval);
            observer.error('Getting hierarchy failed');
          }
        }, 50);
      }
      observer.next(Object.assign([], this.productHierarchy));

    });
  }

  private loadHierarchy(): void{
    this.loading = true;
    this.configService.getConfig('storeId').subscribe({
      next: storeId => {
        const hierarchyParams = new HttpParams()
              .set('storeId', storeId)
              .set('get', 'ProductHierarchy');

        const hierarchyResp = this.apiService.get(API_MODE.OPEN, API_METHOD.GET,
                                  'settings', hierarchyParams);
        hierarchyResp.subscribe({
          next: (res: any) => {
            this.productHierarchy = res.item.ProductHierarchy;
            this.loading = false;
          },
          error: (err) => {console.error(err); this.loading = false; }
        });
      },
      error: (err) => {console.log(err); this.loading = false; }
    });
  }

}
