import { Component, OnInit } from '@angular/core';
import { BasketService, BasketInterface } from '@app/shared-services/basket.service';
import { PreferencesService, PreferencesInterface } from '@app/shared-services/preferences.service';
import { ConfigService } from '@app/shared-services/config.service';
import { LanguageService } from '@app/shared-services/language.service';
import { MatSelectChange } from '@angular/material/select';
import { MatRadioChange } from '@angular/material/radio';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  basket: BasketInterface = null;
  preferences: PreferencesInterface = null;
  bucketUrl: string = null;
  lang = 'hu';
  availableQuantities = ['1', '2', '3', '4', '5'];

  constructor(private basketService: BasketService, private prefService: PreferencesService,
              private configService: ConfigService, private langService: LanguageService,
              titleService: Title) {
    titleService.setTitle('Basket');
  }

  ngOnInit(): void {
    this.basketService.getBasket().subscribe(basket => {
      this.basket = basket;

      this.prefService.getPreferences().subscribe(pref => {
        this.preferences = pref;
        const countries = Object.keys(this.basket.Costs);
        if (this.preferences.countryCode && countries.indexOf(this.preferences.countryCode) < 0){
          this.preferences.countryCode = null;
          this.prefService.setPreference('countryCode', null);
          this.preferences.deliveryMethod = null;
          this.prefService.setPreference('deliveryMethod', null);
        }

        if (this.preferences.countryCode && this.preferences.deliveryMethod){
          const couriers = Object.keys(this.basket.Costs[this.preferences.countryCode]);
          if (couriers.indexOf(this.preferences.deliveryMethod) < 0){
            this.preferences.deliveryMethod = couriers[0];
            this.prefService.setPreference('deliveryMethod', this.preferences.deliveryMethod);
          }
        }
      });
    });

    this.configService.getConfig('imgSrc').subscribe(url => {
      this.bucketUrl = url;
    });

    this.langService.getLang().then(lang => {
      this.lang = lang;
    });
  }

  // change of quantity
  onChangeQuantity(event: any, index: number): void{
    const val = parseInt(event.value, 10);

   // call service to update basket
    this.basketService.changeQuantity(index, val).then(basket => {
       this.basket = basket;
    });
  }

   // remove an item from basket
  onRemoveItem(index: number): void{
      this.basketService.removeItem(index).then(basket => {
        this.basket = basket;
      });
  }

  onCouponChange(basket: BasketInterface): void{
    this.basket = basket;
  }

  onCountryChange(event: MatSelectChange): void{
    this.prefService.setPreference('countryCode', event.value);
    this.preferences.countryCode = event.value;

    const couriers = Object.keys(this.basket.Costs[this.preferences.countryCode]);
    if (couriers.indexOf(this.preferences.deliveryMethod) < 0){
      this.preferences.deliveryMethod = couriers[0];
      this.prefService.setPreference('deliveryMethod', this.preferences.deliveryMethod);
    }
  }

  // called when there is a change in the selected courier
  onCourierChange(event: MatRadioChange): void{
    this.prefService.setPreference('deliveryMethod', event.value);
  }

  onCurrencyChange(chosen: string): void{
    this.preferences.currency.chosen = chosen;
    this.prefService.setPreference('currency', this.preferences.currency);
  }

  // to prevent a dom re-draw of the basket list, this function assigns a unique id
  // to each item in the basket based on a few unique properties of the basket item
  basketTrackFn(index: number, item: any): string{
    let finalCombi = '';
    if (item.hasOwnProperty('Combination')){
          item.Combination.forEach(combi => {
              finalCombi += combi.name;
              if (combi.enteredValue != null){
                finalCombi += combi.enteredValue;
              }
          });
    }

    return item.ItemId + finalCombi + item.Quantity.toString();
  }


}
