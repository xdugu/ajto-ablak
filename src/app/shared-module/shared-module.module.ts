import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSourceDirective } from './image-source.directive';
import { DocumentDirective } from './document.directive';
import { FlowImagePipe } from './pipes/flow-image.pipe';
import { ObjectFilterPipe } from './pipes/object-filter.pipe';



@NgModule({
  declarations: [ImageSourceDirective, DocumentDirective, FlowImagePipe, ObjectFilterPipe],
  imports: [
    CommonModule
  ],
  exports: [
    ImageSourceDirective, DocumentDirective, FlowImagePipe, ObjectFilterPipe
  ]
})
export class SharedModuleModule { }
