import { Component, OnInit } from '@angular/core';
import { CustomerDetailsService, CustomerDetailsInterface } from '../services/customer-details.service';
import { PreferencesService, PreferencesInterface} from '../services/preferences.service';
import { BasketService, BasketInterface} from '@app/shared-services/basket.service';
import { ConfigService } from '@app/shared-services/config.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent} from './dialog/dialog.component';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  basket: BasketInterface = null;
  customer: CustomerDetailsInterface = null;
  preferences: PreferencesInterface = null;
  paymentTypes = null;
  bucketUrl: string = null;
  private successMessage = {
    title:{
      en: 'Order Successful',
      hu: 'Order Successful'
    },
    bankTransfer: {
      en: `We have sent you an email with our account details. We will ship you item
        as soon as the stated amount is credited to our account. Thank you for shopping
        with us`,
      hu: `Sikeresen elküldtük a banki utaláshoz szükséges adatokat az email címedre
        Kérjük, hogy saját érdekedben az utalást minél előbb tedd meg,
        hogy mi is minél hamarabb előkészíthessük és kézbesíthessük számodra a megrendelt terméket/termékeket.`
    },
    otherPaymentMethods: {
      en: `Thank you for your order. We will ship your item as soon as we can.
          Thank you for shopping with us`,
      hu: `A megrendelés megerősítését a következő e-mail címre küldjük <strong>{{shopping.contact.email}}</strong>. 
        A megrendelésről egy automatikus emailt küldünk a megadott email címre. Amennyiben azt nem kapja meg <b>24 órán belül</b>, 
        kérjük vegye fel velünk a kapcsolatot!
        Megrendelését hamarosan kézbesítjük!`
    },
    buttons: {
      confirm: {
        en: 'Confirm',
        hu: 'Megerősítés'
      }
    }
  };

  constructor(private customerDetailsService: CustomerDetailsService,
              private prefService: PreferencesService,
              private configService: ConfigService,
              private basketService: BasketService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.customerDetailsService.get().then(contact => this.customer = contact);
    this.prefService.getPreferences().subscribe({
      next: (preferences: PreferencesInterface) => {
        this.preferences = preferences;
      }
    });

    this.configService.getConfig('paymentTypes').subscribe({
      next: paymentTypes => this.paymentTypes = paymentTypes
    });

    this.configService.getConfig('imgSrc').subscribe({
      next: bucketUrl => this.bucketUrl = bucketUrl
    });

    this.basketService.getBasket().subscribe({
      next: basket => this.basket = basket
    });
  }

  onOrderConfirmed(paymentType: string, paymentDetails: any): void{
    const lang = this.preferences.lang.chosen;
    const dialog = this.dialog.open(DialogComponent, {
      width: '350px',
      data: {
        title: this.successMessage.title[lang],
        content: paymentType === 'bankTransfer' ? this.successMessage.bankTransfer[lang] : this.successMessage.otherPaymentMethods[lang],
        buttons: []
      }
    });
  }
}
