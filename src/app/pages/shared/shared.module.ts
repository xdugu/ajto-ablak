import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryCodePipe } from './pipes/country-code.pipe';
import { IsCustomPipe } from './pipes/is-custom.pipe';
import { StringOfPipe } from './pipes/string-of.pipe';
import { CategoryGetterService } from './services/category-getter.service';
import { ProductGetterService } from './services/product-getter.service';
import { BlogGetterService} from './services/blog-getter.service';



@NgModule({
  declarations: [CountryCodePipe, IsCustomPipe, StringOfPipe],
  imports: [
    CommonModule
  ],
  exports: [CountryCodePipe, IsCustomPipe, StringOfPipe]
})
export class SharedModule {
  static forRoot(): any{
    return {
      ngModule: SharedModule,
      providers: [CategoryGetterService, ProductGetterService, BlogGetterService]
    };
}
}
