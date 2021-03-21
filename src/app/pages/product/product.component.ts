import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import { ConfigService } from '@app/shared-services/config.service';
import { ProductGetterService } from '../services/product-getter.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  product = null;
  basketUrl = null;

  constructor(private routeInfo: ActivatedRoute, private productGetter: ProductGetterService,
              config: ConfigService) {

    config.getConfig('imgSrc').subscribe({
      next: res => this.basketUrl = res
    });

  }

  slickConfig = {
    dots: true,
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    responsive: [
      {
        breakpoint: 600, // mobile breakpoint
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  ngOnInit(): void {
    const params = this.routeInfo.paramMap;

    // will get a callback anytime there is a change in the category path
    params.subscribe(param => {
      const productId = param.get('productId');
      this.productGetter.getProduct(productId).then(res => {
        this.product = res;
      });
    });
  }

}
