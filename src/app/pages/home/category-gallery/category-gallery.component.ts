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
  @Input() title;
  @Input() categoryName: [];
  @Input() maxItems = 4;
  @Input() lang = 'en';

  categoryItems = [];
  bucketUrl = null;
  itemsPerRow = 2;
  rowHeight = '200px';

  constructor(private configService: ConfigService, private catGetter: CategoryGetterService) { }

  ngOnInit(): void {
    this.configService.getConfig('imgSrc').subscribe({
      next: res => this.bucketUrl = res
    });
    this.getCategoryItems();
  }

  ngOnChanges(changes: SimpleChanges): void{
    if (changes.hasOwnProperty('categoryName')){
      this.getCategoryItems();
    }
    switch (this.screenType){
      case 'mobile':
        this.itemsPerRow = 2;
        this.rowHeight = '250px';
        break;

      default:
        this.itemsPerRow = 4;
        this.rowHeight = '350px';
    }
  }

  private getCategoryItems(): void{
    this.catGetter.getCategory(this.categoryName).then(res => {
      this.categoryItems = res;
      if (this.categoryItems.length > this.maxItems){
        this.categoryItems = this.categoryItems.slice(0, this.maxItems);
      }
    });
  }

}
