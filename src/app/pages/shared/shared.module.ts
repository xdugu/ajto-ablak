import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModuleModule } from '@app/shared-module/shared-module.module';
import { CountryCodePipe } from './pipes/country-code.pipe';
import { IsCustomPipe } from './pipes/is-custom.pipe';
import { StringOfPipe } from './pipes/string-of.pipe';
import { CategoryGetterService } from './services/category-getter.service';
import { ProductGetterService } from './services/product-getter.service';
import { BlogGetterService} from './services/blog-getter.service';
import { IndexOfPipe } from './pipes/index-of.pipe';
import { ProductGalleryComponent } from './components/product-gallery/product-gallery.component';



@NgModule({
  declarations: [CountryCodePipe, IsCustomPipe, StringOfPipe, IndexOfPipe, ProductGalleryComponent],
  imports: [
    CommonModule,
    SharedModuleModule,
    RouterModule
  ],
  exports: [CountryCodePipe, IsCustomPipe, StringOfPipe, IndexOfPipe, ProductGalleryComponent]
})
export class SharedModule {
  static forRoot(): any{
    return {
      ngModule: SharedModule,
      providers: [CategoryGetterService, ProductGetterService, BlogGetterService]
    };
}
}
