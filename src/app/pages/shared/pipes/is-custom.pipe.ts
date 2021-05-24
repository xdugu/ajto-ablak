import { Pipe, PipeTransform } from '@angular/core';

// used to check if the product is custo
@Pipe({
  name: 'isCustom'
})
export class IsCustomPipe implements PipeTransform {

  transform(item: any): boolean {
    return item.Metadata.findIndex(meta => meta.name === 'custom') >= 0;
  }

}
