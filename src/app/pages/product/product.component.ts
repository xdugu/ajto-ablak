import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '@app/shared-services/config.service';
import { ProductGetterService } from '../services/product-getter.service';
import { LanguageService } from '@app/shared-services/language.service';
import { BasketService } from '@app/shared-services/basket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PreferencesService } from '@app/shared-services/preferences.service';

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
  storeId: string = null;
  currencyPref = null;

  siteLang = 'en';
  private priceElement: ElementRef;

  constructor(private routeInfo: ActivatedRoute, private productGetter: ProductGetterService,
              config: ConfigService, private langService: LanguageService,
              private basketService: BasketService, private snackBar: MatSnackBar,
              private prefService: PreferencesService) {

    config.getConfig('imgSrc').subscribe({
      next: res => this.basketUrl = res
    });
    config.getConfig('storeId').subscribe({
      next: storeId => this.storeId = storeId
    });
    this.carouselHeight = 600;

    prefService.getPreferences().subscribe({
      next: pref => this.currencyPref = pref.currency
    });
  }

  @ViewChild('price') set content(content: ElementRef) {
    if (content) { // initially setter gets called with undefined
        this.priceElement = content;
    }
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
        combi = this.product.Variants.combinations[0];
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

  // Called when there is a carousel event
  onCarouselEvent(event: any): void{
    const currentSlideIndex = event.currentSlide || 0;

    this.carouselHeight = ((event.slick.slideWidth * this.product.Images.list[currentSlideIndex].height) /
                            this.product.Images.list[currentSlideIndex].width) + 30;
  }

  updateProductPrice(): void{
    if (this.product.Variants.variants.length > 0){
      const chosenArray = [];
      this.pickedSpec.forEach((variant) => {
        chosenArray.push(variant.name);
      });
      function combiMatches(myCombi: any): boolean{
        return JSON.stringify(myCombi.combination) === JSON.stringify(chosenArray);
      }
      const combi = this.product.Variants.combinations.find(combiMatches);
      const prevPrice = this.product.Price.huf;

      // only need to scroll or update price if there is a difference between the current
      // and the previous price
      if (prevPrice !== combi.price.huf){
        this.product.Price = Object.assign(this.product.Price, combi.price);
        this.product.Quantity = combi.quantity;
        window.scroll({top: this.priceElement.nativeElement.offsetTop - 30, behavior: 'smooth' });
      }
    }
  }

  // adds item to basket
  addToBasket(): void{
    this.basketService.addToBasket(this.product.ItemId, this.pickedSpec).subscribe(
      () => {
         const msg = {en: 'Item added successfully', hu: 'A termék a kosaradba került'};
         this.snackBar.open(msg[this.siteLang], '', {
             duration: 2000
         });
      },
      (err) => {
        console.log(err);
        const msg = {en: 'Error', hu: 'Hiba :-<'};
        this.snackBar.open(msg[this.siteLang], '', {
          duration: 4000
      });
      }
    );
 }

  onCurrencyChange(chosen: string): void{
    this.currencyPref.chosen = chosen;
    this.prefService.setPreference('currency', this.currencyPref);
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
