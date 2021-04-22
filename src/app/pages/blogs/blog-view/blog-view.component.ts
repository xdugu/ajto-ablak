import { Component, OnInit } from '@angular/core';
import { ApiManagerService, API_MODE, API_METHOD} from '@app/shared-services/api-manager.service';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '@app/shared-services/config.service';

@Component({
  selector: 'app-blog-view',
  templateUrl: './blog-view.component.html',
  styleUrls: ['./blog-view.component.scss']
})
export class BlogViewComponent implements OnInit {
  blog = null;

  constructor(apiManager: ApiManagerService, configService: ConfigService,
              routeInfo: ActivatedRoute) {
      routeInfo.paramMap.subscribe({
        next: params => {
          configService.getConfig('storeId').subscribe({
            next: storeId => {

              // set parameters to get blog
              const httpParams = new HttpParams()
                .set('storeId', storeId)
                .set('blogId', params.get('blogId'));

              apiManager.get(API_MODE.OPEN, API_METHOD.GET, 'blog', httpParams).subscribe( res => {
                this.blog = res;
              });
            }
          });
        }
      });
  }

  ngOnInit(): void {
  }

}
