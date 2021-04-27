import { Component, Input, OnInit } from '@angular/core';
import { BlogGetterService } from '../../services/blog-getter.service';
import { ConfigService } from '@app/shared-services/config.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  @Input() screenType = 'mobile';
  list = [];
  bucketUrl: string = null;
  storeId: string = null;

  constructor(blogGetter: BlogGetterService, configService: ConfigService) {

    configService.getConfig('storeId').subscribe({
      next: storeId => this.storeId = storeId
    });

    configService.getConfig('imgSrc').subscribe({
      next: bucketUrl => this.bucketUrl = bucketUrl
    });

    blogGetter.getBlogList().then(list => {
      this.list = list;
    });
  }

  ngOnInit(): void {
  }

}
