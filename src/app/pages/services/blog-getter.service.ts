import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiManagerService, API_METHOD, API_MODE } from '@app/shared-services/api-manager.service';
import { LanguageService } from '@app/shared-services/language.service';
import { ConfigService } from '@app/shared-services/config.service';

@Injectable({
  providedIn: 'root'
})
export class BlogGetterService {

  constructor(private apiService: ApiManagerService, private langService: LanguageService,
              private configService: ConfigService) { }

  getBlogList(): Promise<any>{

    return new Promise((resolve, reject) => {
      this.configService.getConfig('storeId').subscribe({
        next: storeId => {
          this.langService.getLang().then(lang => {
            const httpParams = new HttpParams()
              .set('storeId', storeId)
              .set('lang', lang);

            this.apiService.get(API_MODE.OPEN, API_METHOD.GET, 'blogs', httpParams).subscribe({
              next: (list: []) => {
                resolve(list.filter((item: any) => item.Published));
              },
              error: err => reject(err)
            });
          });
        }
      });
    });

  }
}
