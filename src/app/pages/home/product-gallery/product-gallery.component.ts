import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProductGetterService} from '@app/pages/services/product-getter.service';
import { ConfigService } from '@app/shared-services/config.service';


@Component({
  selector: 'app-product-gallery',
  templateUrl: './product-gallery.component.html',
  styleUrls: ['./product-gallery.component.scss']
})
export class ProductGalleryComponent implements OnInit, OnChanges {
  @Input() screenType = 'mobile';
  @Input() title;
  @Input() products: [];
  @Input() showPrice = false;

  finalProducts = [];
  bucketUrl = null;
  itemsPerRow = 2;

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
        this.itemsPerRow = 2;
        break;

      default:
        this.itemsPerRow = 4;
    }
  }

  private getProducts(): void{
    this.productGetter.getProducts(this.products).then(res => {
      this.finalProducts = res;
    });
  }



}
