import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSourceDirective } from './image-source.directive';
import { DocumentDirective } from './document.directive';
import { FlowImagePipe } from './pipes/flow-image.pipe';



@NgModule({
  declarations: [ImageSourceDirective, DocumentDirective, FlowImagePipe],
  imports: [
    CommonModule
  ],
  exports:[
    ImageSourceDirective, DocumentDirective, FlowImagePipe
  ]
})
export class SharedModuleModule { }
