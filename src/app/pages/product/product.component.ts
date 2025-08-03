import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '@app/shared-services/config.service';
import { ProductGetterService } from '../shared/services/product-getter.service';
import { LanguageService } from '@app/shared-services/language.service';
import { BasketService } from '@app/shared-services/basket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScreenTypeService } from '@app/shared-services/screen-type.service';
import { PreferencesService } from '@app/shared-services/preferences.service';
import { Title } from '@angular/platform-browser';
import { DialogComponent, DialogInterface} from '@app/shared-module/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ImageSourcePipe } from '@app/shared-module/pipes/image-source.pipe';
import { IProductGalleryFlow } from '../shared/components/product-gallery/product-gallery.component';
import { TrackingService } from '@app/shared-services/tracking.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  carouselHeight: number;
  product = null;
  bucketUrl = null;
  pickedSpec = []; // contains the spec what the customer picks
  optionsPricing = []; // contains info on the pricing when an options is selected
  storeId: string = null;
  currencyPref = null;
  customQuestions = false;
  screenType = 'mobile';
  commonDocuments = [];
  documentList: string[] = [];
  accessoriesFlow: IProductGalleryFlow = null

  siteLang = null;
  private priceElement: ElementRef;
  private slickModal: any;

  constructor(private routeInfo: ActivatedRoute, private productGetter: ProductGetterService,
              private config: ConfigService, private langService: LanguageService,
              private basketService: BasketService, private snackBar: MatSnackBar,
              private prefService: PreferencesService, private titleService: Title,
              private route: Router, private dialog: MatDialog, private imgSourcePipe: ImageSourcePipe,
              screenService: ScreenTypeService, private trackingService: TrackingService) {

    config.getConfig('imgSrc').subscribe({
      next: res => this.bucketUrl = res
    });
    config.getConfig('storeId').subscribe({
      next: storeId => this.storeId = storeId
    });


    prefService.getPreferences().subscribe({
      next: pref => this.currencyPref = pref.currency
    });

    screenService.getScreenTypeUpdate().subscribe({next: state => this.screenType = state})
  }

  @ViewChild('price') set content(content: ElementRef) {
    if (content) { // initially setter gets called with undefined
        this.priceElement = content;
    }
  }

  @ViewChild('slickModal') set model(modal: any) {
    if (modal) { // initially setter gets called with undefined
        this.slickModal = modal;
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
    this.documentList = []

    // will get a callback anytime there is a change in the product path
    params.subscribe(param => {
      const productId = param.get('productId');
      this.documentList = []
      this.productGetter.getProduct(productId).then(res => {
        this.product = res;
       
        if (this.product.Metadata.findIndex(item => item.name === `custom_qs_${this.siteLang}`) >= 0) {
          this.customQuestions = true;
        }
        this.pickedSpec = []; // reset for product to product changes

        if (this.product.Variants.variants.length > 0){
          this.linkImagesToVariants();
          this.setupVariants();
        }
        if(this.product.Accessories.length > 0){
          this.buildAccessoriesFlow(this.product.Accessories)
        }
        this.langService.getLang().then(lang => {
            this.siteLang = lang;
            this.titleService.setTitle(this.product.Title[lang]);
            for (const doc of this.product.Documents){
              if (doc.lang === lang){
                this.documentList.push(doc.id);
              }
            }

            this.config.getConfig('pages').subscribe({
              next: pages => {
                  if (pages.product.documents){
                    for (const doc of pages.product.documents){
                      if (doc.lang === lang){
                        this.documentList.push(doc.id);
                      }
                    }
                  }
              }
            });
        });

      }).catch(() => {
        this.route.navigate(['/']);
      });
    });

  }

  // create a flow object to build gallery of accessoeries attached to product
  private buildAccessoriesFlow(accessories: string[]): void{
    this.accessoriesFlow = {
      title: {
        en: "Accessories with this item",
        hu: "Kiegészítők ehhez a termékhez",
        de: "Zubehör zu diesem Artikel"
      },
      items: accessories
    }
  }

  // attach images to variants to be used by view
  private linkImagesToVariants(): void{
    // attempt to link variant images to variants
    for (const image of this.product.Images.list){
      if (image.type.startsWith('variant')){
        const type = image.type.split('-');
        type.splice(0, 1); // remove the first element as it will always be 'variant'
        for (const variant of this.product.Variants.variants){

          if (variant.name === type[0]){
            const index = variant.options.findIndex(option => option.name === type[1]);
            if (index >= 0){
              variant.options[index].linkedImage = image.name;
              variant.hasAttachedImage = true;
            }
          }
        }
      }
    }

  }

  // Given a string of variants return the matching combinations
  private filterCombinations(combis, variantFilter: string[]){
    variantFilter.forEach((variant, index) => {
      combis = combis.filter((combi)=> {
        if (variant){
          if(combi.combination[index] == variant){
            return true;
          }
          return false
        }
        return true;
      })
    })
    return combis;
  }

  // returns the cheapest combination from list
  private cheapestCombination(combis){
     return combis.reduce((combi, cheapestCombi) => {
          if(combi.price[this.currencyPref.chosen.toLowerCase()] < cheapestCombi.price[this.currencyPref.chosen.toLowerCase()]){
            return combi;
          }
            return cheapestCombi;
          }, combis[0])
  }

  // Returns an array of strings coresponding to the chosen spec
  private getPickedSpecOptions(){
    return this.pickedSpec.reduce((pV, cV) => {
          pV.push(cV.name)
          return pV
        }, [])
  }

  // Function that constatnly updates price options whenuser is selecting a vraitn
  private updateOptionsPricing(){
    this.optionsPricing = []
    this.product.Variants.variants.forEach((variant, index) => {
      const subOptions = []
      for(const option of variant.options){
        const candidateVariants = this.getPickedSpecOptions()
        candidateVariants[index] = option.name
        const matchingCombis = this.filterCombinations(this.product.Variants.combinations,candidateVariants)
        subOptions.push(this.cheapestCombination(matchingCombis).price)
      }
      this.optionsPricing.push(subOptions)
    })
  }

  // setup variant
  private async setupVariants(): Promise<void>{
    this.pickedSpec = []
    for (const variant of this.product.Variants.variants){
      variant.groupInfo = {};
      if (variant.type === 'group'){
        for (const variantOption of variant.options){
          const resp = await this.productGetter.getGroup(variantOption.name);
          variant.groupInfo[variantOption.name] = resp.filter(item => item.Enabled);
        }
      }
    }

    if (this.product.Variants.variants.length > 0){

      for(const _ of this.product.Variants.variants){
        this.pickedSpec.push({name: null, variantId: null, enteredValue: null})
      }

      this.updateOptionsPricing()
      const finalCombi = this.cheapestCombination(this.product.Variants.combinations)
      
      this.product.Price = Object.assign(this.product.Price, finalCombi.price);
      this.product.Quantity = finalCombi.quantity;
    }

    this.determineSelectableItems();
  }

  // Called when there is a carousel event
  onCarouselEvent(event: any): void{
    const currentSlideIndex = event.currentSlide || 0;

    this.carouselHeight = ((event.slick.slideWidth * this.product.Images.list[currentSlideIndex].height) /
                            this.product.Images.list[currentSlideIndex].width) + 30;
  }


  private updateProductPrice(): void{
    if (this.product.Variants.variants.length > 0){
      const combi = this.cheapestCombination(this.filterCombinations(this.product.Variants.combinations, this.getPickedSpecOptions()))
      const prevPrice = this.product.Price[this.currencyPref.chosen.toLowerCase()];

      // only need to scroll or update price if there is a difference between the current
      // and the previous price
      if (prevPrice !== combi.price[this.currencyPref.chosen.toLowerCase()]){
        this.product.Price = Object.assign(this.product.Price, combi.price);
        this.product.Quantity = combi.quantity;
        window.scroll({top: this.priceElement.nativeElement.offsetTop - 30, behavior: 'smooth' });
      }
    }
  }

  // called to update main image shown after combination change
  private updateImageFromVariantChange(): void{
    const combi = this.cheapestCombination(this.filterCombinations(this.product.Variants.combinations, this.getPickedSpecOptions()))
    if (combi.linkedImage){
      const imagePosition = this.product.Images.list.findIndex(image => image.name === combi.linkedImage);
      if (imagePosition >= 0){
        this.slickModal.slickGoTo(imagePosition);
      }
    }
  }

  // called when there is a new selection of variant
  onVariantSelectionChange(): void{
    this.determineSelectableItems();
    this.updateProductPrice();
    this.updateOptionsPricing();
    this.updateImageFromVariantChange();
  }

  // called when a different group of patterns is selected
  onGroupSelectionChange(newOption: any, changeIndex: number): void{
    this.pickedSpec[changeIndex].name = newOption.value;
    this.pickedSpec[changeIndex].variantId = this.product.Variants.variants[changeIndex].groupInfo[newOption.value][0].ItemId;
    this.onVariantSelectionChange();
  }

  // called when a pattern is selected
  onPatternSelection(newPattern: any, index: number): void {
    this.pickedSpec[index].variantId = newPattern.ItemId;
    this.onVariantSelectionChange();
  }


  showSelectedPatternOverlay(pattern: any): void{
    const imageLink = this.imgSourcePipe.transform(this.bucketUrl + pattern.Images.path + pattern.Images.list[0].name, 300);
    const content = `<img src="${imageLink}" class="w3-center" style="max-width: 300px">`;
    const dialogData: DialogInterface = {
      title: pattern.Title[this.siteLang],
      content,
      buttons: []
    };
    this.dialog.open(DialogComponent, {
      data: dialogData
    });

  }

  showSelectedOptionOverlay(option: any): void{
    const imageLink = this.imgSourcePipe.transform(this.bucketUrl + this.product.Images.path + option.linkedImage, 300);
    const content = `<img src="${imageLink}" class="w3-center" style="max-width: 300px">`;
    const dialogData: DialogInterface = {
      title: option.text[this.siteLang],
      content,
      buttons: []
    };
    this.dialog.open(DialogComponent, {
      data: dialogData
    });
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
    this.trackingService.addToBasketEvent(this.product.ItemId)
 }

  onCurrencyChange(chosen: string): void{
    this.currencyPref.chosen = chosen;
    this.prefService.setPreference('currency', this.currencyPref);
  }

  // called when customer wants to request more customization of an item
  onCustomizeClick(): void{
    let questions = this.product.Metadata.find(item => item.name === `custom_qs_${this.siteLang}`);
    questions = questions || {value: null};

    this.route.navigate(['contact'],
        {queryParams: {topic: this.product.Title[this.siteLang], questions: questions.value}});
    this.trackingService.customiseClickEvent(this.product.ItemId)
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
    const currentCombi = this.getPickedSpecOptions()

    const isValidCombi = (myCombi): boolean => {
      if (this.product.TrackStock){
        return !myCombi.disabled && myCombi.quantity > 0;
      }
      else {
        return !myCombi.disabled;
      }
    };

    const combi = this.cheapestCombination(this.filterCombinations(this.product.Variants.combinations, currentCombi));

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
                    this.pickedSpec.push({name: option.name, enteredValue: null});
                    if (variant.type === 'group'){
                      const groupKeys = Object.keys(variant.groupInfo);
                      this.pickedSpec[this.pickedSpec.length - 1].variantId =
                          variant.groupInfo[groupKeys[0]][0].ItemId;
                      break;
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