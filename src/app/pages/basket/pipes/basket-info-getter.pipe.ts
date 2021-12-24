import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'basketInfoGetter'
})
export class BasketInfoGetterPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
