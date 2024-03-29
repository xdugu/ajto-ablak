import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReviewRoutingModule } from './review-routing.module';
import { ReviewComponent } from './review.component';
import { PaypalComponent } from './payments/paypal/paypal.component';
import { BankTransferComponent } from './payments/bank-transfer/bank-transfer.component';
import { SharedModule} from '../shared/shared.module';

import { SharedModuleModule} from '@app/shared-module/shared-module.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PayOnDeliveryComponent } from './payments/pay-on-delivery/pay-on-delivery.component';
import { CibComponent } from './payments/cib/cib.component';


@NgModule({
  declarations: [ReviewComponent, PaypalComponent, BankTransferComponent, PayOnDeliveryComponent, CibComponent],
  imports: [
    CommonModule,
    ReviewRoutingModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    SharedModuleModule
  ]
})
export class ReviewModule { }
