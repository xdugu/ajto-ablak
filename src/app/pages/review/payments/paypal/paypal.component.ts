import { Component, OnInit, Input, ElementRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { ScriptLoaderService } from '@app/shared-module/services/script-loader.service';
import { BasketInterface, BasketService } from '@app/shared-services/basket.service';
import { environment } from '../../../../../environments/environment';
import { CustomerDetailsInterface, CustomerDetailsService } from '@app/shared-services/customer-details.service';
import { PreferencesService, PreferencesInterface} from '@app/shared-services/preferences.service';
import { DialogComponent} from '@app/shared-module/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { loadScript, PayPalNamespace } from "@paypal/paypal-js";

//declare var paypal;

interface PaypalConfigInterface{
  name: string;
  tokens: {live: string; test: string};
  enabledFeatures: Array<string>;
  disabledFeatures: Array<string>;
}

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.scss']
})
export class PaypalComponent implements OnInit {
  @Input() config: PaypalConfigInterface = null;
  @Input() comments: string = null;
  @Input() lang = 'hu';
  @Output() orderConfirmed = new EventEmitter<any>();
  @ViewChild('paypalContainer', {static: false}) paypalContainer: ElementRef
  hideButton = false;

  messages = {
    paymentSuccessful: {
      title: {
        en: 'Order Successful',
        hu: 'Rendelés megerősítése',
        de: 'Order Successful',
      },
      content: {
        en: `Thank you for your order. We will ship your item as soon as we can.
          Thank you for shopping with us`,
        hu: `A megrendelésről egy automatikus emailt küldünk a megadott email címre. Amennyiben azt nem kapja meg <b>24 órán belül</b>,
          kérjük vegye fel velünk a kapcsolatot!
          Megrendelését hamarosan kézbesítjük!`,
        de: `Vielen Dank für Ihre Bestellung. Wir werden Ihren Artikel so schnell wie möglich versenden.
              Vielen Dank für Ihren Einkauf bei uns`,
      }
    }
  };

  constructor(private basketService: BasketService, private prefService: PreferencesService,
              private customerDetailsService: CustomerDetailsService,
              private scriptLoader: ScriptLoaderService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.basketService.getBasket().subscribe({
      next: (basket: BasketInterface) => {
        this.customerDetailsService.get().then((customer: CustomerDetailsInterface) => {
          this.prefService.getPreferences().subscribe((preferences: PreferencesInterface) => {
            const token = environment.production ? this.config.tokens.live : this.config.tokens.test;
            const disabledFeatures = this.config.disabledFeatures[0];
            loadScript({clientId: token, currency: preferences.currency.chosen.toUpperCase(), disableFunding: disabledFeatures})
              .then((paypal: PayPalNamespace) => {
                  this.createPaypalObject(paypal, basket, customer, preferences )
              })
          });
        });
      }
    });
  }

  private createPaypalObject = (paypal: PayPalNamespace, basket: BasketInterface, customer: CustomerDetailsInterface,
                                preferences: PreferencesInterface) => {
    const countryCodeToNumbers = {
      "HU": "36",
      "DE": "49",
      "AT": "43",
      "SK": "421",
      "RO": "40",
      "NL": "31",
      "BE": "32",
      "PO": "48",
      "FR": "33",
      "BG": "359"

    }
    paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          payer: {
            email_address:  customer.email,
            phone: {
              phone_number: {
                  national_number: customer.number,
                  country_code: countryCodeToNumbers[preferences.countryCode] ? countryCodeToNumbers[preferences.countryCode] : "36"
                }
            }
          },
          intent: "CAPTURE",
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
        });
      },
      onApprove: async (data, actions) => {
        actions.order.get().then((details: any) => {
            this.basketService.completeTransaction('paypal', details).then(() => {
              this.dialog.open(DialogComponent, {
                width: '400px',
                data: {
                  title: this.messages.paymentSuccessful.title[this.lang],
                  content: this.messages.paymentSuccessful.content[this.lang]
                }
              }).afterClosed().subscribe({
                next: () => this.orderConfirmed.emit()
              });
            });

        });

      },
      onClick: ()=> {
        this.basketService.startTransaction('paypal', this.comments).catch(() => {
          this.hideButton = true;
        })
      }
    
    }).render(this.paypalContainer.nativeElement);
  }

  // creates an array of paypal items from basket items
  getPaypalBasketItems(items: any, currency: string, lang: string): any{
    const paypalItems = [];

    // loop through each item
    for (const item of items){
      const itemName =  item.ProductId;
      let wholeId = item.ProductId;

      for (const combi of item.Combination){
          if (combi.variantId){
            wholeId += ',' + combi.variantId;
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

