import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor() { }

  getLang(): Promise<string>{
    return new Promise((resolve, reject) => {
      resolve('hu');
    });
  }
}
