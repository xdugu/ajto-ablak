import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReviewRoutingModule } from './review-routing.module';
import { ReviewComponent } from './review.component';
import { PaypalComponent } from './payments/paypal/paypal.component';
import { PagesModule} from '../pages.module';

import { SharedModuleModule} from '@app/shared-module/shared-module.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [ReviewComponent, PaypalComponent],
  imports: [
    CommonModule,
    ReviewRoutingModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    PagesModule,
    SharedModuleModule
  ]
})
export class ReviewModule { }
