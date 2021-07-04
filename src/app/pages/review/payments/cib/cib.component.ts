import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { BasketInterface, BasketService } from '@app/shared-services/basket.service';
import { CustomerDetailsInterface, CustomerDetailsService } from '@app/shared-services/customer-details.service';
import { PreferencesService, PreferencesInterface} from '@app/shared-services/preferences.service';
import { ApiManagerService, API_METHOD, API_MODE } from '@app/shared-services/api-manager.service';
import { ConfigService } from '@app/shared-services/config.service';
import { DialogComponent} from '@app/shared-module/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

interface CIBConfigInterface{
  supportedCurrencies: Array<string>;
  name: string;
}

@Component({
  selector: 'app-cib',
  templateUrl: './cib.component.html',
  styleUrls: ['./cib.component.scss']
})
export class CibComponent implements OnInit {
  @Input() lang = 'en';
  @Input() width = 300;
  @Input() config: CIBConfigInterface = null;
  @Input() comments = null;
  @Output() orderConfirmed = new EventEmitter<any>();

  messages = {
    confirmRedirect: {
      en: 'We will redirect you to our payment service provider to complete the transaction',
      hu: 'A tranzakció befejezéséhez átirányítjuk Önt fizetési szolgáltatónkhoz'
    },
    paymentError: {
      en: `Something went wrong during the payment process. No money has been taken from your account.
              Please try again`,
      hu: `A fizetési folyamat során valami hiba történt. Számlájáról nem került levonásra a pénzösszeg.  
            Kérjük próbálja újra.`
    },
    paymentSuccessful: {
      en: `Thank you for placing your order. We will work hard to get it to you as quickly as possible.
            If you don't receive an email in 24 hours, please contact us
          For your records, please find the transaction details below. We have also sent an email containing this information:<br>`,
      hu: `Köszönjük, hogy leadta rendelését. Igyekszünk, hogy a megrendelt termék minél hamarabb eljusson Önhöz.<br>
          A tranzakció részleteit alább láthatja illetve a kapott email-ben. A megrendelésről egy automatikus emailt küldünk a megadott email címre.
          Amennyiben azt nem kapja meg <b>24 órán belül</b>, kérjük vegye fel velünk a kapcsolatot!`
    },
    paymentCodes: {
      transactionId: {
        en: 'Transaction id',
        hu: 'A tranzakció azonosítója'
      },
      transactionResultCode: {
        en: 'Transaction result code',
        hu: 'A tranzakció eredményének kódja'
      },
      transactionResultText: {
        en: 'Transaction result text',
        hu: 'A tranzakció eredményének szöveges ismertetése'
      },
      authorisationNumber: {
        en: 'Authorisation number',
        hu: 'A tranzakció eredményének szöveges ismertetése'
      },
      total: {
        en: 'Total',
        hu: 'Végösszeg'
      }
    },
    buttons: {
      confirm: {
        en: 'Confirm',
        hu: 'Megerősítés'
      }
    }
  };

  preferences = null;
  customer = null;
  storeId = null;
  basket = null;

  constructor(private basketService: BasketService, private prefService: PreferencesService,
              private customerDetailsService: CustomerDetailsService,
              private apiManager: ApiManagerService,
              private configService: ConfigService,
              private dialog: MatDialog,
              private routeInfo: ActivatedRoute) { }

  ngOnInit(): void {
    this.prefService.getPreferences().subscribe({
      next: (prefs: PreferencesInterface) => this.preferences = prefs
    });

    this.customerDetailsService.get().then((details: CustomerDetailsInterface )=> this.customer = details);

    this.configService.getConfig('storeId').subscribe({
      next: storeId => {
        this.storeId = storeId;
        this.basketService.getBasket().subscribe({
          next: (basket: BasketInterface) => {
            this.basket = basket;
            this.checkPreviousTransation();
          }
        });
      }
    });

  }

  // checks url for evidence of a cib transaction result and takes action
  private checkPreviousTransation(): void{
    const params = this.routeInfo.queryParams;
    params.subscribe({
      next: param => {
        if (param.PID && param.DATA){
          const httpParams = new HttpParams().set('storeId', this.storeId);
          this.apiManager.post(API_MODE.OPEN, API_METHOD.UPDATE, 'transaction', httpParams, {
            cibResponse: param.DATA,
            basketId: this.basket.BasketId
          }).subscribe({
            next: (res: any) => {
              const dialog = this.dialog.open(DialogComponent, {
                width: '400px',
                data: {
                  title: null,
                  content: `
                    <div>
                      ${this.messages.paymentSuccessful[this.lang]}
                    </div>
                    <span class="important-text"><br>
                      <b>${this.messages.paymentCodes.transactionId[this.lang]}:</b> ${res.TRID}<br>
                      <b>${this.messages.paymentCodes.transactionResultCode[this.lang]}:</b> ${res.RC}<br>
                      <b>${this.messages.paymentCodes.transactionResultText[this.lang]}:</b> ${res.RT}<br>
                      <b>${this.messages.paymentCodes.total[this.lang]}</b> ${res.AMO}<br>
                      <b>${this.messages.paymentCodes.authorisationNumber[this.lang]}:</b> ${res.ANUM}<br><br>
                    </span>
                  `
                }
              });

              // emit event that transaction is complete
              dialog.afterClosed().subscribe({
                next: () => {
                  this.orderConfirmed.emit();
                  this.basketService.clearBasket();
                }
              });
            },
            error: err => {
              this.dialog.open(DialogComponent, {
                width: '400px',
                data: {
                  title: null,
                  content: `
                    <div>
                      ${this.messages.paymentError[this.lang]}
                    </div>
                    <span><br>
                      <b>${this.messages.paymentCodes.transactionId[this.lang]}:</b> ${err.error.response.TRID}<br>
                      <b>${this.messages.paymentCodes.transactionResultCode[this.lang]}:</b> ${err.error.response.RC}<br>
                      <b>${this.messages.paymentCodes.transactionResultText[this.lang]}:</b> ${err.error.response.RT}<br>
                    </span>
                  `
                }
              });
            }
          });
        }
      }
    });
  }

  onPaymentMethodActivation(): void{

    // get url with no queries
    let currentUrl = window.location.href;
    const queryPos = currentUrl.indexOf('?');
    if (queryPos > 0){
      currentUrl = currentUrl.substring(0, queryPos);
    }

    this.customer.countryCode = this.preferences.countryCode;
    this.customer.lang = this.lang;
    // create order
    const orderDetails = {
      contact: this.customer,
      currency: this.preferences.currency.chosen,
      comments: this.comments.length === 0 ? null : this.comments,
      paymentMethod: 'payBeforeDelivery',
      paymentType: 'cib',
      url: currentUrl,
      deliveryMethod: this.preferences.deliveryMethod,
    };

    const params = new HttpParams().set('storeId', this.storeId);
    this.apiManager.post(API_MODE.OPEN, API_METHOD.CREATE, 'transaction', params, {
      orderDetails,
      basketId: this.basket.BasketId
    }).subscribe({
      next: (res: any) => {
        const dialog = this.dialog.open(DialogComponent, {
          width: '350px',
          data: {
            title: null,
            content: `${this.messages.confirmRedirect[this.lang]}<br>
                      <img src="assets/cib/CIB_payment_logo.png" alt="cib" style="width:300px"><br>
                      <img src="assets/cib/${this.lang}/CIB_accepted_cards.png" style="width:300px">
                    `,
            buttons: [
              {
                id: 'Confirm',
                text: this.messages.buttons.confirm[this.lang],
                textColor: 'green',
              }
            ]
          }
        });

        dialog.afterClosed().subscribe({
          next: result => {
            if (result && result.id === 'Confirm'){
              window.location.href = res.url;
            }
          }
        });
      }
    });


  }

}
