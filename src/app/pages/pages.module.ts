import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './page-routing.module';
import { CategoryGetterService } from './services/category-getter.service';
import { ProductGetterService } from './services/product-getter.service';
import { PreferencesService } from './services/preferences.service';
import { CountryCodePipe } from './pipes/country-code.pipe';

@NgModule({
    declarations: [CountryCodePipe],
    imports: [
      CommonModule,
      PagesRoutingModule,
    ],
    exports: [CountryCodePipe]
  })
  export class PagesModule {
    static forRoot(): any{
        return {
          ngModule: PagesModule,
          providers: [CategoryGetterService, ProductGetterService, PreferencesService]
        };
      }
   }
