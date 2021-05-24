import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indexOf'
})
export class IndexOfPipe implements PipeTransform {

  transform(array: Array<any>, value: any): unknown {
    return array.indexOf(value);
  }

}
