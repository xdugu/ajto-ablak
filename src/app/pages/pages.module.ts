import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './page-routing.module';
import { CategoryGetterService } from './services/category-getter.service';
import { ProductGetterService } from './services/product-getter.service';

@NgModule({
    declarations: [],
    imports: [
      CommonModule,
      PagesRoutingModule,
    ],
    exports: []
  })
  export class PagesModule {
    static forRoot(): any{
        return {
          ngModule: PagesModule,
          providers: [CategoryGetterService, ProductGetterService]
        };
      }
   }
