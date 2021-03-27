import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import { ConfigService } from '@app/shared-services/config.service';
import { ProductGetterService } from '../services/product-getter.service';
import { LanguageService } from 'app/shared-services/language.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  carouselHeight: number;
  product = null;
  basketUrl = null;
  pickedSpec = [];

  siteLang = 'en';

  constructor(private routeInfo: ActivatedRoute, private productGetter: ProductGetterService,
              config: ConfigService, private langService: LanguageService) {

    config.getConfig('imgSrc').subscribe({
      next: res => this.basketUrl = res
    });
    this.carouselHeight = 600;

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
        this.setupVariants();
        // this.carouselHeight = this.getMinImageHeight(this.product.Images.list);
      });
    });

    this.langService.getLang().then(lang => this.siteLang = lang);
  }

  // setup variant
  private setupVariants(): void{

    if (this.product.Variants.variants.length > 0){

      // pre-choose the first combination in list
      const findFirstValid = (candidate) => {
        if (this.product.TrackStock){
          return !candidate.disabled && candidate.quantity > 0;
        }
        return !candidate.disabled;
      };

      let combi = this.product.Variants.combinations.find(findFirstValid);

      // in case none are valid, choose the first option
      if (combi === undefined){
        combi = this.product.item.Variants.combinations[0];
      }

      // now loop through each variant to pick right combi
      this.product.Variants.variants.forEach((variant: any, index: number) => {
        variant.options.forEach((option: any) => {
            if (combi.combination[index] === option.name){
              this.pickedSpec.push(option);
              if (variant.type === 'group'){
                // TODO: fix this. Need to actually query for groups
                const groupKeys = Object.keys(variant.groupInfo);
                this.pickedSpec[this.pickedSpec.length - 1].chosenVariant =
                    variant.groupInfo[groupKeys[0]][0];
              }
            }
        });
      });

      this.product.Price = Object.assign(this.product.Price, combi.price);
      this.product.Quantity = combi.quantity;
    }
  }

  onCarouselEvent(event: any): void{
    const currentSlideIndex = event.currentSlide || 0;

    this.carouselHeight = ((event.slick.slideWidth * this.product.Images.list[currentSlideIndex].height) /
                            this.product.Images.list[currentSlideIndex].width) + 30;
  }

  private getMinImageHeight(images: any): number{
     let minHeight = 2000;

     for (const image of images){
       if (image.height < minHeight){
         minHeight = image.height;
       }
     }

     return minHeight;
  }

}
