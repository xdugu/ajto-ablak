import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSourceDirective } from './image-source.directive';



@NgModule({
  declarations: [ImageSourceDirective],
  imports: [
    CommonModule
  ],
  exports:[
    ImageSourceDirective
  ]
})
export class SharedModuleModule { }
