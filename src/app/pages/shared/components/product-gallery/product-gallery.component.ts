import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProductGetterService} from '@app/pages/shared/services/product-getter.service';
import { ConfigService } from '@app/shared-services/config.service';

export interface IProductGalleryFlow{
  title: { en?: string, hu?: string}
  items: string[]
}

@Component({
  selector: 'app-product-gallery',
  templateUrl: './product-gallery.component.html',
  styleUrls: ['./product-gallery.component.scss']
})
export class ProductGalleryComponent implements OnInit, OnChanges {
  @Input() screenType = 'mobile';
  @Input() flow: IProductGalleryFlow = null;
  @Input() showPrice = false;
  @Input() lang = null;
  @Input() currency: string = null;

  finalProducts = [];
  bucketUrl = null;
  rowWidth = '48.5%';


  constructor(private productGetter: ProductGetterService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.configService.getConfig('imgSrc').subscribe({
      next: res => this.bucketUrl = res
    });
    this.getProducts();
  }

  ngOnChanges(changes: SimpleChanges): void{

    if (changes.hasOwnProperty('products')){
      this.getProducts();
    }
    switch (this.screenType){
      case 'mobile':
        this.rowWidth = '48%';
        break;

      default:
        this.rowWidth = '24%';
    }
  }

  private getProducts(): void{
    this.productGetter.getProducts(this.flow.items).then(res => {
      this.finalProducts = res;
    });
  }



}
