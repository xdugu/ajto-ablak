import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ProductGetterService} from '@app/shared-services/product-getter.service';
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

  constructor(private productGetter: ProductGetterService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.configService.getConfig('imgSrc').subscribe({
      next: res => this.bucketUrl = res
    });
    this.productGetter.getProducts(this.products).then(res => {
      this.products = res;
    });
  }

  ngOnChanges(): void{
    this.productGetter.getProducts(this.products).then(res => {
      this.finalProducts = res;
    });
  }



}
