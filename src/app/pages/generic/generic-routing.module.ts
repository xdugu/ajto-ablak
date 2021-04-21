import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenericComponent } from './generic.component';

const routes: Routes = [{ path: '', component: GenericComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenericRoutingModule { }
