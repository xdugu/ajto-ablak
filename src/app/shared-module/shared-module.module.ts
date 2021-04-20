import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSourceDirective } from './image-source.directive';
import { DocumentDirective } from './document.directive';



@NgModule({
  declarations: [ImageSourceDirective, DocumentDirective],
  imports: [
    CommonModule
  ],
  exports:[
    ImageSourceDirective, DocumentDirective
  ]
})
export class SharedModuleModule { }
