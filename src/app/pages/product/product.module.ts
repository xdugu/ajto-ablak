import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
// Import your library
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { PagesModule} from '../pages.module';
import { SharedModuleModule} from '@app/shared-module/shared-module.module';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [ProductComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SlickCarouselModule,
    PagesModule,
    SharedModuleModule,
    MatExpansionModule,
    MatButtonModule
  ]
})
export class ProductModule { }
