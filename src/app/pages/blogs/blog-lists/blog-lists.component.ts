import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiManagerService, API_METHOD, API_MODE } from '@app/shared-services/api-manager.service';
import { LanguageService } from '@app/shared-services/language.service';
import { ConfigService } from '@app/shared-services/config.service';

@Component({
  selector: 'app-blog-lists',
  templateUrl: './blog-lists.component.html',
  styleUrls: ['./blog-lists.component.scss']
})
export class BlogListsComponent implements OnInit {
  list: any = [];
  bucketUrl: string = null;
  storeId: string = null;

  constructor(private apiService: ApiManagerService, private langService: LanguageService,
              private configService: ConfigService) {

      this.configService.getConfig('imgSrc').subscribe({
        next: bucket => this.bucketUrl = bucket
      });

      this.configService.getConfig('storeId').subscribe({
        next: storeId => {
          this.storeId = storeId;
          this.langService.getLang().then(lang => {
            const httpParams = new HttpParams()
              .set('storeId', storeId)
              .set('lang', lang);

            this.apiService.get(API_MODE.OPEN, API_METHOD.GET, 'blogs', httpParams).subscribe({
              next: list => this.list = list
            });
          });
        }
      });
  }

  ngOnInit(): void {
  }

}
