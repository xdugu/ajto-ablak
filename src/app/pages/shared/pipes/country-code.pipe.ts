import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countryCode'
})
export class CountryCodePipe implements PipeTransform {
  countries = {
    HU: {
        en: 'Hungary',
        hu: 'Magyarország',
        de: "Ungarn"
    },
    DE: {
        en: 'Germany',
        hu: 'Németország',
        de: 'Deutschland'
    },
    AT: {
        en: 'Austria',
        hu: 'Ausztria',
        de: 'Österreich'
    },
    GB: {
        en: 'United Kingdom',
        hu: 'Egyesült Királyság',
        de: 'Vereinigtes Königreich'
    },
    SK: {
      en: 'Slovakia',
      hu: 'Szlovákia',
      de: 'Slowakei'
    },
    RO: {
      en: 'Romania',
      hu: 'Románia',
      de: 'Rumänien'
    },
    CH: {
      en: 'Switzerland',
      hu: 'Svájc',
      de: 'Schweiz'
    },
    NL: {
      en: 'Netherlands',
      hu: 'Hollandia',
      de: 'Niederlande'
    },
    BE: {
      en: 'Belgium',
      hu: 'Belgium',
      de: 'Belgien'
    },
    PO: {
      en: 'Poland',
      hu: 'Lengyelország',
      de: 'Polen'
    },
    FR: {
      en: 'France',
      hu: 'Franciaország',
      de: 'Frankreich'
    },
    BG: {
      en: 'Bulgaria',
      hu: 'Bulgária',
      de: 'Bulgarien'
    }
  };

  transform(code: string, lang: string): string {
    lang = lang || 'en';
    return this.countries[code][lang];
  }

}
