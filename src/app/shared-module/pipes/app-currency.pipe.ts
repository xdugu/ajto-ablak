import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'appCurrency'
})
export class AppCurrencyPipe implements PipeTransform {

  constructor(private currencyPipe: CurrencyPipe) {}

  transform(value: any, currency: string): string {
    if (currency.toLowerCase() === 'huf'){
      return this.currencyPipe.transform(value, currency, 'symbol', '.0-0');
    }
    else{
      return this.currencyPipe.transform(value, currency, 'symbol', '.2-2');
    }
  }

}
