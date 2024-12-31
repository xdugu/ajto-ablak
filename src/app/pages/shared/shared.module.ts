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
import { SanitizePipe } from './pipes/sanitize.pipe';
import { DocumentLoaderDirective } from './directives/document-loader.directive';
import { MatExpansionModule } from '@angular/material/expansion';
import { DocumentComponent } from './components/document/document.component';



@NgModule({
  declarations: [CountryCodePipe, IsCustomPipe, StringOfPipe, IndexOfPipe, ProductGalleryComponent, SanitizePipe, DocumentLoaderDirective, DocumentComponent],
  imports: [
    CommonModule,
    SharedModuleModule,
    RouterModule,
    MatExpansionModule
  ],
  exports: [CountryCodePipe, IsCustomPipe, StringOfPipe, IndexOfPipe, ProductGalleryComponent, SanitizePipe, DocumentComponent]
})
export class SharedModule {
  static forRoot(): any{
    return {
      ngModule: SharedModule,
      providers: [CategoryGetterService, ProductGetterService, BlogGetterService]
    };
}
}
