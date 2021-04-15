import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { get } from 'scriptjs';
import { BasketInterface, BasketService } from '@app/shared-services/basket.service';
import { environment } from '../../../../../environments/environment';
import { CustomerDetailsInterface, CustomerDetailsService } from '../../../services/customer-details.service';
import { PreferencesService, PreferencesInterface} from '../../../services/preferences.service';

declare var paypal;

interface PaypalConfigInterface{
  name: string;
  tokens: {live: string; test: string};
  enabledFeatures: Array<string>;
}

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.scss']
})
export class PaypalComponent implements OnInit {
  @Input() config: PaypalConfigInterface = null;

  constructor(private basketService: BasketService, private prefService: PreferencesService,
              private customerDetailsService: CustomerDetailsService, 
              private element: ElementRef) { }

  ngOnInit(): void {
    this.basketService.getBasket().subscribe({
      next: (basket: BasketInterface) => {
        this.customerDetailsService.get().then((customer: CustomerDetailsInterface) => {
          this.prefService.getPreferences().subscribe((preferences: PreferencesInterface) => {
            const token = environment.production ? this.config.tokens.live : this.config.tokens.test;
            get(`https://www.paypal.com/sdk/js?client-id=${token}&currency=${preferences.currency.chosen.toUpperCase()}`,
                    () => this.createPaypalObject(basket, customer, preferences));
          });
        });
      }
    });
  }

  private createPaypalObject = (basket: BasketInterface, customer: CustomerDetailsInterface,
                                preferences: PreferencesInterface) => {
    paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          payer: {
            email_address:  customer.email,
            phone: {
              phone_number: {
                national_number: customer.number
                }
            }
          },
          purchase_units: [{
            amount: {
              currency_code: preferences.currency.chosen,
              value: basket.Costs[preferences.countryCode][preferences.deliveryMethod].
                payBeforeDelivery.total[preferences.currency.chosen.toLowerCase()].toString(),
              breakdown: {
                  item_total: {
                      currency_code: preferences.currency.chosen,
                      value: basket.Costs[preferences.countryCode][preferences.deliveryMethod].
                        payBeforeDelivery.subTotal[preferences.currency.chosen.toLowerCase()].toString()
                  },
                  discount: {
                    currency_code: preferences.currency.chosen,
                    value: basket.Costs[preferences.countryCode][preferences.deliveryMethod].
                      payBeforeDelivery.discount[preferences.currency.chosen.toLowerCase()].toString()
                  },
                  shipping: {
                    currency_code: preferences.currency.chosen,
                    value: basket.Costs[preferences.countryCode][preferences.deliveryMethod].
                      payBeforeDelivery.delivery[preferences.currency.chosen.toLowerCase()].toString()
                  }
              }
            },
            items: this.getPaypalBasketItems(basket.Items, preferences.currency.chosen, preferences.lang.chosen),
            description: `${basket.BasketId} Order`,
            custom_id: basket.BasketId,
            payment_options: {
              allowed_payment_method: 'INSTANT_FUNDING_SOURCE'
            },
            soft_descriptor: basket.BasketId,
            shipping: {
              name: {full_name: customer.firstName},
              address: {
                address_line_1: customer.address1,
                address_line_2: customer.address2,
                admin_area_2: customer.city,
                country_code: preferences.countryCode,
                postal_code: customer.postCode,
              }
            }
        }]
        // note_to_payer: 'Contact us at infodomelepcso@gmail.com for any questions on your order.'
        });
      },
      onApprove: (data, actions) => {
        actions.order.get().then((details: any) => {
            console.log(JSON.stringify(details));
        });

      }}).render(this.element.nativeElement);
  }

  // creates an array of paypal items from basket items
  getPaypalBasketItems(items: any, currency: string, lang: string): any{
    const paypalItems = [];

    // loop through each item
    for (const item of items){
      const itemName =  item.Title[lang];
      let wholeId = item.ItemId;

      if (item.Variants.variants.length > 0){
        for (const combi of  item.Combination){
          if (combi.hasOwnProperty('chosenVariant')){
            wholeId += ',' + combi.chosenVariant.Title[lang];
          }
          else {
            wholeId += ',' + combi.text[lang];
          }
        }
      }
      const price = {value: '', currency_code: currency};

      price.value = item.Price[currency.toLowerCase()].toString();

      paypalItems.push({name: itemName, sku: wholeId, unit_amount: price,
          quantity: item.Quantity.toString(), currency, category: 'PHYSICAL_GOODS'});
    }

    return paypalItems;
  }
}


