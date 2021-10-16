import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countryCode'
})
export class CountryCodePipe implements PipeTransform {
  countries = {
    HU: {
        en: 'Hungary',
        hu: 'Magyarország',
    },
    DE: {
        en: 'Germany',
        hu: 'Németország'
    },
    AT: {
        en: 'Austria',
        hu: 'Ausztria'
    },
    GB: {
        en: 'United Kingdom',
        hu: 'Egyesült Királyság'
    },
    SK: {
      en: 'Slovakia',
      hu: 'Szlovákia'
    },
    RO: {
      en: 'Romania',
      hu: 'Románia'
    },
    CH: {
      en: 'Switzerland',
      hu: 'Svájc'
    },
    NL: {
      en: 'Netherlands',
      hu: 'Hollandia'
    },
    BE: {
      en: 'Belgium',
      hu: 'Belgium'
    },
    PO: {
      en: 'Poland',
      hu: 'Lengyelország'
    },
    FR: {
      en: 'France',
      hu: 'Franciaország'
    },
    BG: {
      en: 'Bulgaria',
      hu: 'Bulgária'
    }
  };

  transform(code: string, lang: string): string {
    lang = lang || 'en';
    return this.countries[code][lang];
  }

}
