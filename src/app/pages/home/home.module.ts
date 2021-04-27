import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModuleModule } from '@app/shared-module/shared-module.module';

import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import { ProductGalleryComponent } from './product-gallery/product-gallery.component';
import { CategoryGalleryComponent } from './category-gallery/category-gallery.component';
import { CategoryLinkComponent } from './category-link/category-link.component';
import { LanderComponent } from './lander/lander.component';
import { BlogListComponent } from './blog-list/blog-list.component';

@NgModule({
  declarations: [HomeComponent, ProductGalleryComponent, CategoryGalleryComponent,
    CategoryLinkComponent, LanderComponent, BlogListComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatGridListModule,
    MatButtonModule,
    SharedModuleModule
  ]
})
export class HomeModule { }
