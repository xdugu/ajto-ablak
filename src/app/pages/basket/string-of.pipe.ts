import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringOf'
})
export class StringOfPipe implements PipeTransform {

  transform(value: number): string {
    return value.toString();
  }

}
