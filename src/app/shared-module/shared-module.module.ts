import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentDirective } from './directives/document.directive';
import { LazyLoadDirective } from './directives/lazy-load.directive';
import { FlowImagePipe } from './pipes/flow-image.pipe';
import { ObjectFilterPipe } from './pipes/object-filter.pipe';
import { DialogComponent } from './components/dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ImageSourcePipe } from './pipes/image-source.pipe';



@NgModule({
  declarations: [DocumentDirective, FlowImagePipe,
    ObjectFilterPipe, DialogComponent, LazyLoadDirective, ImageSourcePipe],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
     DocumentDirective, FlowImagePipe, ObjectFilterPipe,
      DialogComponent, LazyLoadDirective, ImageSourcePipe
  ]
})
export class SharedModuleModule { }
