import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSourceDirective } from './image-source.directive';
import { DocumentDirective } from './document.directive';
import { FlowImagePipe } from './pipes/flow-image.pipe';
import { ObjectFilterPipe } from './pipes/object-filter.pipe';
import { DialogComponent } from './dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [ImageSourceDirective, DocumentDirective, FlowImagePipe, 
    ObjectFilterPipe, DialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    ImageSourceDirective, DocumentDirective, FlowImagePipe, ObjectFilterPipe,
      DialogComponent
  ]
})
export class SharedModuleModule { }
