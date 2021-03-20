import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModuleModule } from '@app/shared-module/shared-module.module';

import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import { ProductGalleryComponent } from './product-gallery/product-gallery.component';
import { CategoryGalleryComponent } from './category-gallery/category-gallery.component';

@NgModule({
  declarations: [HomeComponent, ProductGalleryComponent, CategoryGalleryComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatGridListModule,
    MatButtonModule,
    SharedModuleModule
  ]
})
export class HomeModule { }
