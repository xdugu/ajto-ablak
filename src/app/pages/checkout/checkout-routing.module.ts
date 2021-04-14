import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckoutComponent } from './checkout.component';
import { CheckoutGuard } from './checkout.guard';

const routes: Routes = [{ path: '', component: CheckoutComponent, canActivate: [CheckoutGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }
