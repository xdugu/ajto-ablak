import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'langUrl'
})
export class LangUrlPipe implements PipeTransform {

  transform(url: string, currLang: string, newLang: string): string {
    return url.replace(`/${currLang}/`, `/${newLang}/`);
  }

}
