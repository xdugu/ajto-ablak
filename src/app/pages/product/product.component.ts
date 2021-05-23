import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '@app/shared-services/config.service';
import { ProductGetterService } from '../services/product-getter.service';
import { LanguageService } from '@app/shared-services/language.service';
import { BasketService } from '@app/shared-services/basket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PreferencesService } from '@app/shared-services/preferences.service';
import { Title } from '@angular/platform-browser';

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
  customQuestions = false;

  siteLang = 'en';
  private priceElement: ElementRef;

  constructor(private routeInfo: ActivatedRoute, private productGetter: ProductGetterService,
              config: ConfigService, private langService: LanguageService,
              private basketService: BasketService, private snackBar: MatSnackBar,
              private prefService: PreferencesService, private titleService: Title,
              private route: Router) {

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
        this.titleService.setTitle(this.product.Title[this.siteLang]);
        if (this.product.Metadata.findIndex(item => item.name === `custom_qs_${this.siteLang}`) >= 0) {
          this.customQuestions = true;
        }
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

    this.determineSelectableItems();
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

  // called when customoer wants to request more customization of an item
  onCustomizeClick(): void{
    const questions = this.product.Metadata.find(item => item.name === `custom_qs_${this.siteLang}`);
    this.route.navigate(['contact'],
        {queryParams: {topic: this.product.ItemId, questions: questions.value}});
  }

  // gets combi that starts with something
  private getCombinations(startsWith: [] | any): any{
    startsWith = startsWith.join();
    return this.product.Variants.combinations.filter(combi => {
      const joinedCombi = combi.combination.join();
      return joinedCombi.startsWith(startsWith);
    });
  }

  determineSelectableItems(): void {
    this.validateAndCorrectSelection();
    for (let iLevel = 0; iLevel < this.product.Variants.variants.length; iLevel++){
      for (const option of this.product.Variants.variants[iLevel].options){
        option.isSelectable = false; // assume initially not selectable
        let combis;

        if (iLevel === 0){
          combis = this.getCombinations([option.name]);
        }
        else{
          // look up at current selection to work out what item in lower
          // variant level is selectable
          let currentSelection = this.pickedSpec.reduce((accum, currVal) => {
            accum.push(currVal.name);
            return accum;
          }, []);
          currentSelection = currentSelection.splice(0, iLevel);
          currentSelection.push(option.name);
          combis = this.getCombinations(currentSelection);
        }
        const validCombi = combis.some(combi => {
          if (this.product.TrackStock){
            return combi.quantity > 0 && !combi.disabled;
          }
          else {
            return !combi.disabled;
          }
        });
        if (validCombi){
          option.isSelectable = true;
        } // if
      } // for
    }
  }

  // checks if the current selection by user is valid. if not, determines the closest to what the customer wants
  validateAndCorrectSelection(): void{
    const currentCombi = this.pickedSpec.reduce((accum, elem) => {
      accum.push(elem.name);
      return accum;
    }, []);

    const isValidCombi = (myCombi): boolean => {
      if (this.product.TrackStock){
        return !myCombi.disabled && myCombi.quantity > 0;
      }
      else {
        return !myCombi.disabled;
      }
    };

    const combi = this.product.Variants.combinations.find(elem => elem.combination.join() === currentCombi.join());

    if (!isValidCombi(combi)){
      // find a valid combination

      for (let index = this.pickedSpec.length; index > 0; index--){
        const combinations = this.getCombinations(currentCombi.slice(0, index - 1));
        for (const combination of combinations){
          if (isValidCombi(combination)){
            this.pickedSpec = [];

            for (const combiCombi of combination.combination){
              for (const variant of this.product.Variants.variants){
                for (const option of variant.options){
                  if (combiCombi === option.name){
                    this.pickedSpec.push(option);
                    if (variant.type === 'group'){
                      // TODO: fix this. Need to actually query for groups
                      const groupKeys = Object.keys(variant.groupInfo);
                      this.pickedSpec[this.pickedSpec.length - 1].chosenVariant =
                          variant.groupInfo[groupKeys[0]][0];
                    } // if
                  } // if
                } // for
              } // for
            } // for
            return;
          }
        }

      }

    } // if

  }

}
