import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CategoryGetterService } from '@app/pages/services/category-getter.service';
import { ConfigService } from '@app/shared-services/config.service';

@Component({
  selector: 'app-category-gallery',
  templateUrl: './category-gallery.component.html',
  styleUrls: ['./category-gallery.component.scss']
})
export class CategoryGalleryComponent implements OnInit, OnChanges {
  @Input() screenType = 'mobile';
  @Input() flow: any = null;
  @Input() lang = 'en';
  @Input() currency: string = null;

  categoryItems = [];
  bucketUrl = null;
  rowWidth = '48.5%';

  constructor(private configService: ConfigService, private catGetter: CategoryGetterService) { }

  ngOnInit(): void {
    this.configService.getConfig('imgSrc').subscribe({
      next: res => this.bucketUrl = res
    });
  }

  ngOnChanges(changes: SimpleChanges): void{
    if (changes.hasOwnProperty('flow')){
      this.getCategoryItems();
    }
    switch (this.screenType){
      case 'mobile':
        this.rowWidth = '48%';
        break;

      default:
        this.rowWidth = '24%';
    }
  }

  private getCategoryItems(): void{
    this.catGetter.getCategory(this.flow.link).then(res => {
      this.categoryItems = res;
      if (this.categoryItems.length > 4){
        this.categoryItems = this.categoryItems.slice(0, 4);
      }
    });
  }

}
