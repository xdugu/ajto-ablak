import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageSource'
})
export class ImageSourcePipe implements PipeTransform {

  transform(url: string, width: number = null): string {
    const extInd = url.search(/\.[a-z]{2,}$/i);

    if (extInd >= 0 && width != null){
      const urlWithoutExt = url.substring(0, extInd);
      return urlWithoutExt + '_' + width.toString() + 'w.jpg'; //+ url.substring(extInd).toLowerCase();
    }
    else{
      return url;
    }
  }

}
