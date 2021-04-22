import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectFilter'
})

// filters by object properties
export class ObjectFilterPipe implements PipeTransform {

  transform(items: any[], filter: any): any[] {
    if (!items || !filter) {
      return items;
   }
    return items.filter(item => {
        const props = Object.keys(filter);

        // check that each property matches condition
        for (const prop of props){
          if (item[prop] !== filter[prop]){
            return false;
          }
        }

        // if we are here, it means that all have been matched so we return true
        return true;
    });
  }

}
