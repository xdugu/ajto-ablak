import { Component, Input, OnChanges, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { IBasketItem } from '@app/shared-services/basket.service';
import { ProductGetterService } from '../../services/product-getter.service';
import { ConfigService } from '@app/shared-services/config.service';
import { LanguageService } from '@app/shared-services/language.service';
import { MatSelectChange } from '@angular/material/select';
import { MatRadioChange } from '@angular/material/radio';

export interface IBasketItemsEvent{
  index: number;
  newValue: string | number | null;
}

@Component({
  selector: 'app-basket-items',
  templateUrl: './basket-items.component.html',
  styleUrls: ['./basket-items.component.scss']
})
export class BasketItemsComponent implements OnInit, OnChanges {
  @Input() basketItems: IBasketItem[] = [];
  @Input() canChange = false;
  @Input() lang = 'en';
  @Input() preferences = null;
  @Input() availableQuantities = ['1', '2', '3', '4', '5'];
  @Output() itemRemoved = new EventEmitter<IBasketItemsEvent>();
  @Output() quantityChanged = new EventEmitter<IBasketItemsEvent>();
  bucketUrl = null;
  products: any = null;
  variants: any = null;

  constructor(private productGetter: ProductGetterService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.getProductsAndVariants();
    this.configService.getConfig('imgSrc').subscribe(url => {
      this.bucketUrl = url;
    });
  }

  private async getProductsAndVariants(): Promise<void>{
    const variants = [];
    const items = this.basketItems.map((item: any) => item.ProductId);

    for (const item of this.basketItems){
      for (const combi of item.Combination){
        if (combi.variantId && !variants.includes(combi.variantId)){
          variants.push(combi.variantId);
        }
      }
    }

    if (items.length > 0){
      const products = await this.productGetter.getProducts(items);
      this.products = products.reduce((cum, prod) => {
        cum[prod.ItemId] = prod;
        return cum;
      }, {});
      if (variants.length > 0){
        const vars = await this.productGetter.getVariants(variants);
        this.variants = vars.reduce((cum, variant) => {
          cum[variant.ItemId] = variant;
          return cum;
        }, {});
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void{
    if (changes.basketItems){
      this.getProductsAndVariants();
    }
  }

  // change of quantity
  onChangeQuantity(event: any, index: number): void{
    const val = parseInt(event.value, 10);
    this.quantityChanged.emit({newValue: val, index});
  }

   // remove an item from basket
  onRemoveItem(index: number): void{
    this.itemRemoved.emit({newValue: null, index});
  }

  // to prevent a dom re-draw of the basket list, this function assigns a unique id
  // to each item in the basket based on a few unique properties of the basket item
  basketTrackFn(index: number, item: any): string{
    let finalCombi = '';
    if (item.hasOwnProperty('Combination')){
          item.Combination.forEach(combi => {
              finalCombi += combi.name;
              if (combi.enteredValue){
                finalCombi += combi.enteredValue;
              }
          });
    }

    return item.ProductId + finalCombi + item.Quantity.toString();
  }

}
