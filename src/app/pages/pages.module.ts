import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './page-routing.module';
import { CategoryGetterService } from './services/category-getter.service';
import { ProductGetterService } from './services/product-getter.service';
import { PreferencesService } from '@app/shared-services/preferences.service';
import { CustomerDetailsService } from '@app/shared-services/customer-details.service';
import { CountryCodePipe } from './pipes/country-code.pipe';
import { StringOfPipe } from './pipes/string-of.pipe';

@NgModule({
    declarations: [CountryCodePipe, StringOfPipe],
    imports: [
      CommonModule,
      PagesRoutingModule,
    ],
    exports: [CountryCodePipe, StringOfPipe]
  })
  export class PagesModule {
    static forRoot(): any{
        return {
          ngModule: PagesModule,
          providers: [CategoryGetterService, ProductGetterService, PreferencesService, CustomerDetailsService]
        };
      }
   }
