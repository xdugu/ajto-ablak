import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'flowImage'
})
// This pipe returns the image name matching the flowImageId
export class FlowImagePipe implements PipeTransform {

  transform(flowImageId: string, images: any, stem: string): string {
    for (const image of images){
      if (image.type === flowImageId){
        return stem + image.name;
      }
    }
  }

}
