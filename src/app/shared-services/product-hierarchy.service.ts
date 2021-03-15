import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

export interface ProductHierarchy {
  name: string;
  text ?: {en?: string, hu?: string};
  sub?: ProductHierarchy[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductHierarchyService {
  constructor() {}

  private productHierarchy: Array<ProductHierarchy> = [
    {
     name: 'Kutyalepcso',
     sub: [
      {
       name: 'Rampak',
       text: {
        en: 'Ramps',
        hu: 'Rámpák'
       }
      },
      {
       name: 'Lepcsok',
       text: {
        en: 'Stairs',
        hu: 'Lépcsők'
       }
      },
      {
       name: 'Fekhelyek',
       text: {
        en: 'Bean bags, blankets and pillows',
        hu: 'Fekhelyek'
       }
      },
      {
       name: 'Kutya-kanape',
       text: {
        en: 'Dog Sofas',
        hu: 'Kutya kanape'
       }
      },
      {
       name: 'Galleria',
       text: {
        en: 'Dog Lofts',
        hu: 'Kutya galéria'
       }
      },
      {
       name: 'Raktaron',
       text: {
        en: 'Items in stock',
        hu: 'Raktáron'
       }
      }
     ],
     text: {
      en: 'Dog Stairs and ramps',
      hu: 'Kutya Lépcsők & Rámpák'
     }
    },
    {
     name: 'My-Bulldog',
     text: {
      en: 'MyBulldog',
      hu: 'MyBulldog'
     }
    },
    {
     name: 'Ruhak',
     text: {
      en: 'Dog clothes',
      hu: 'Ruhák'
     }
    },
    {
     name: 'Vegyes-termek',
     text: {
      en: 'Miscallaneous',
      hu: 'Vegyes'
     }
    }
   ];

  // return product heirarchy
  getHierarchy(): Observable<Array<ProductHierarchy>>{

    return new Observable((observer) => {
      // return copy so not to have other modules pollute this source during manipulation
      observer.next(Object.assign([], this.productHierarchy));
    });
  }

}
