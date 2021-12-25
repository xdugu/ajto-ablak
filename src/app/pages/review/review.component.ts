import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerDetailsService, CustomerDetailsInterface } from '@app/shared-services/customer-details.service';
import { PreferencesService, PreferencesInterface} from '@app/shared-services/preferences.service';
import { BasketService, BasketInterface} from '@app/shared-services/basket.service';
import { ConfigService } from '@app/shared-services/config.service';
import { LanguageService } from '@app/shared-services/language.service';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  basket: BasketInterface = null;
  customer: CustomerDetailsInterface = null;
  customerComments = '';
  preferences: PreferencesInterface = null;
  paymentTypes = null;
  lang = null;

  constructor(private customerDetailsService: CustomerDetailsService,
              private prefService: PreferencesService,
              private configService: ConfigService,
              private basketService: BasketService,
              private route: Router,
              private titleService: Title,
              private langService: LanguageService) { }

  ngOnInit(): void {
    this.customerDetailsService.get().then(contact => this.customer = contact);
    this.prefService.getPreferences().subscribe({
      next: (preferences: PreferencesInterface) => {
        this.preferences = preferences;
      }
    });

    this.configService.getConfig('paymentTypes').subscribe({
      next: paymentTypes => {
        this.paymentTypes = paymentTypes;
      }
    });

    this.basketService.getBasket().subscribe({
      next: basket => {
        this.basket = basket;
      }
    });

    this.langService.getLang().then(lang => this.lang = lang);
    this.titleService.setTitle('Review');
  }

  onOrderConfirmed(): void{
    this.route.navigate(['/']);
  }
}
