import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryCodePipe } from './pipes/country-code.pipe';
import { IsCustomPipe } from './pipes/is-custom.pipe';
import { StringOfPipe } from './pipes/string-of.pipe';
import { CategoryGetterService } from './services/category-getter.service';
import { ProductGetterService } from './services/product-getter.service';
import { BlogGetterService} from './services/blog-getter.service';
import { IndexOfPipe } from './pipes/index-of.pipe';
import { BasketItemsComponent } from './components/basket-items/basket-items.component';
import { SharedModuleModule} from '@app/shared-module/shared-module.module';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DocumentComponent } from './components/document/document.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { DocumentLoaderDirective } from './directives/document-loader.directive';

@NgModule({
  declarations: [CountryCodePipe, IsCustomPipe, StringOfPipe, IndexOfPipe,
      BasketItemsComponent, DocumentComponent, DocumentLoaderDirective],
  imports: [
    CommonModule,
    SharedModuleModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatExpansionModule
  ],
  exports: [CountryCodePipe, IsCustomPipe, StringOfPipe, IndexOfPipe,
    BasketItemsComponent, DocumentComponent, DocumentLoaderDirective]
})
export class SharedModule {
  static forRoot(): any{
    return {
      ngModule: SharedModule,
      providers: [CategoryGetterService, ProductGetterService, BlogGetterService]
    };
}
}
