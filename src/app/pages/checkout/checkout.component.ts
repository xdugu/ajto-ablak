import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerDetailsService, CustomerDetailsInterface } from '@app/shared-services/customer-details.service';
import { PreferencesService, PreferencesInterface} from '@app/shared-services//preferences.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  contact: CustomerDetailsInterface = null;
  preferences: PreferencesInterface = null;
  termsAccepted = false;
  proceedButton: any;

  @ViewChild('proceedButton') set content(content: ElementRef) {
    if (content) { // initially setter gets called with undefined
        this.proceedButton = content;
    }
  }

  constructor(private customerDetailsService: CustomerDetailsService,
              private prefService: PreferencesService, private router: Router,
              titleService: Title) {
      titleService.setTitle('Checkout');
  }

  ngOnInit(): void {
    this.customerDetailsService.get().then(contact => this.contact = contact);
    this.prefService.getPreferences().subscribe({
      next: (preferences: PreferencesInterface) => {
        this.preferences = preferences;
      }
    });
  }

  // called when the checkbox is selected or deselected for accepting the terms change
  onTermsChange(event: MatCheckboxChange): void{
    if (event.checked){
      setTimeout(() => {
          window.scroll({top: this.proceedButton._elementRef.nativeElement.offsetTop - 30, behavior: 'smooth' })
      }, 500);
    }
  }

  onProceedToPayment(): void{
    this.customerDetailsService.update(this.contact);
    this.router.navigate(['/review']);
  }

}
