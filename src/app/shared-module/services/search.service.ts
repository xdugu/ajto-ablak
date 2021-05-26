import { Injectable } from '@angular/core';
import { LanguageService } from '@app/shared-services/language.service';
import { ConfigService } from '@app/shared-services/config.service';
import { FileService } from './file.service';



// Service to return search results
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private dict = null;
  constructor(private langService: LanguageService, private configService: ConfigService,
              private fileService: FileService) {}

  // public function that performs and returns search results
  async search(searchTerm: string, maxResults = 10): Promise<any> {

    return new Promise((resolve, reject) => {
      if (this.dict){
        const result = this.doSearch(searchTerm, this.dict.items);
        resolve(result.slice(0, maxResults));
      }
      else{
        this.getDict().then(dict => {
          this.dict = dict;
          const result = this.doSearch(searchTerm, this.dict.items);
          resolve(result.slice(0, maxResults));
        }).catch(err => reject(err));
      }

    });

  }

  // returns items with category that matches that given
  async getItemsForCategory(category: Array<string>): Promise<Array<any>>{
    return new Promise((resolve, reject) => {
      if (this.dict){
        resolve(this.dict.items.filter(item => item.category.join().indexOf(category.join()) >= 0));
      }
      else{
        this.getDict().then(dict => {
          this.dict = dict;
          resolve(this.dict.items.filter(item => item.category.join().indexOf(category.join()) >= 0));
        }).catch(err => reject(err));
      }

    });

  }

  // performs actual search
  private doSearch(searchTerm: string, dict: any): Array<any>{
    const results = dict.filter((item) => {
      const cleanedSearch = this.cleanText(searchTerm).toLowerCase();
      const cleanedText = this.cleanText(item.title).toLowerCase();

      return cleanedText.indexOf(cleanedSearch) >= 0 && item.enabled;
    });

    return results;
  }

  // cleans text from hungarian characters to english for comparison
  private cleanText(text: string): string{
    return text.replace(/á/g, 'a')
              .replace(/é/g, 'e')
              .replace(/í/g, 'i')
              .replace(/ó/g, 'o')
              .replace(/ö/g, 'o')
              .replace(/ő/g, 'o')
              .replace(/ű/g, 'u')
              .replace(/ú/g, 'u')
              .replace(/ü/g, 'u');
  }


  // gets the dictionary file containing all the products to search for
  private async getDict(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.langService.getLang().then(lang => {
        this.configService.getConfig('imgSrc').subscribe({
          next: bucketUrl => {
            this.configService.getConfig('storeId').subscribe({
              next: storeId => {
                this.fileService.get(bucketUrl, `${storeId}/productDict/${lang}/${storeId}.json`).then(
                  res => resolve(res)
                ).catch(err => reject(err));
              }
            });
          }
        });
      });
    });
  }
}
