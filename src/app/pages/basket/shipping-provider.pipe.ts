import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shippingProvider'
})
export class ShippingProviderPipe implements PipeTransform {

  transform(value: string, dict: IShippingProvider[], lang: string): unknown {
    const provider = dict.find(item => item.name == value)
    if (provider){
      return provider.text[lang]
    }
    return value
  }

}

interface IShippingProvider{
  name: string,
  text: {
    [lang: string]: string
  }
}
