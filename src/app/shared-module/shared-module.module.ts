import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentDirective } from './directives/document.directive';
import { LazyLoadDirective } from './directives/lazy-load.directive';
import { FlowImagePipe } from './pipes/flow-image.pipe';
import { ObjectFilterPipe } from './pipes/object-filter.pipe';
import { DialogComponent } from './components/dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import { ImageSourcePipe } from './pipes/image-source.pipe';
import { CurrencyChooserComponent } from './components/currency-chooser/currency-chooser.component';
import { ScriptLoaderService } from './services/script-loader.service';


@NgModule({
  declarations: [DocumentDirective, FlowImagePipe,
    ObjectFilterPipe, DialogComponent, LazyLoadDirective, ImageSourcePipe, CurrencyChooserComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatChipsModule
  ],
  exports: [
     DocumentDirective, FlowImagePipe, ObjectFilterPipe,
      DialogComponent, LazyLoadDirective, ImageSourcePipe, CurrencyChooserComponent
  ]
})
export class SharedModuleModule {
  static forRoot(): any{
    return {
      ngModule: SharedModuleModule,
      providers: [ScriptLoaderService]
    };
  }
}
