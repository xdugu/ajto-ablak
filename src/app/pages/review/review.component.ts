import { Component, OnInit } from '@angular/core';
import { CustomerDetailsService, CustomerDetailsInterface } from '../services/customer-details.service';
import { PreferencesService, PreferencesInterface} from '../services/preferences.service';
import { BasketService, BasketInterface} from '@app/shared-services/basket.service';
import { ConfigService } from '@app/shared-services/config.service';

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

  constructor(private customerDetailsService: CustomerDetailsService,
              private prefService: PreferencesService,
              private configService: ConfigService,
              private basketService: BasketService) { }

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
}
