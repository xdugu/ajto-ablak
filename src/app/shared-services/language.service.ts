import { Injectable } from '@angular/core';
import { LOCALE_ID, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private lang: string;

  constructor(@Inject(LOCALE_ID) locale: string){
    console.log('Lang is ' + locale);
    if (locale.indexOf('en') >= 0){
      this.lang = 'en';
    }
    else if (locale.indexOf('hu') >= 0){
      this.lang = 'hu';
    }
    else if (locale.indexOf('de') >= 0){
      this.lang = 'de';
    }
    else console.error("Unknown lang of webpage")
  }

  getLang(): Promise<string>{
    return new Promise((resolve, reject) => {
      resolve(this.lang);
    });
  }
}
