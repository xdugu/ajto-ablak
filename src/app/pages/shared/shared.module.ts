import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule} from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModuleModule } from '@app/shared-module/shared-module.module';
import { CountryCodePipe } from './pipes/country-code.pipe';
import { IsCustomPipe } from './pipes/is-custom.pipe';
import { StringOfPipe } from './pipes/string-of.pipe';
import { CategoryGetterService } from './services/category-getter.service';
import { ProductGetterService } from './services/product-getter.service';
import { BlogGetterService} from './services/blog-getter.service';
import { IndexOfPipe } from './pipes/index-of.pipe';
import { ProductGalleryComponent } from './components/product-gallery/product-gallery.component';
import { SanitizePipe } from './pipes/sanitize.pipe';
import { DocumentLoaderDirective } from './directives/document-loader.directive';
import { MatExpansionModule } from '@angular/material/expansion';
import { DocumentComponent } from './components/document/document.component';
import { BasketItemsComponent } from './components/basket-items/basket-items.component';



@NgModule({
  declarations: [CountryCodePipe, IsCustomPipe, StringOfPipe, IndexOfPipe, ProductGalleryComponent, SanitizePipe, DocumentLoaderDirective, DocumentComponent, BasketItemsComponent],
  imports: [
    CommonModule,
    SharedModuleModule,
    RouterModule,
    MatExpansionModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatInputModule,
    MatFormFieldModule
  ],
  exports: [CountryCodePipe, IsCustomPipe, StringOfPipe, IndexOfPipe, ProductGalleryComponent, SanitizePipe, DocumentComponent, BasketItemsComponent]
})
export class SharedModule {
  static forRoot(): any{
    return {
      ngModule: SharedModule,
      providers: [CategoryGetterService, ProductGetterService, BlogGetterService, IsCustomPipe]
    };
}
}
