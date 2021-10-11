import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keycount'
})
export class KeycountPipe implements PipeTransform {

  transform(obj: any): number {
     return Object.keys(obj).length;
  }

}
