import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductHierarchy, ProductHierarchyService } from '@app/shared-services/product-hierarchy.service';
import { ConfigService } from '@app/shared-services/config.service';
import { CategoryGetterService} from '@app/pages/shared/services/category-getter.service';
import { ScreenTypeService } from 'app/shared-services/screen-type.service';
import { LanguageService } from 'app/shared-services/language.service';
import { PreferencesService } from '@app/shared-services/preferences.service';
import { SearchService } from '@app/shared-module/services/search.service';
import { Title } from '@angular/platform-browser';

interface CategoryHierarchy extends ProductHierarchy{
  image ?: string;
  sub ?: Array<CategoryHierarchy>;
}

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  category: Array<string>;
  currentHierarchy: CategoryHierarchy = null;
  pHSubscription: Subscription;
  categoryItems: [];
  bucketUrl: string = null;
  images: null;
  currencyPref = {
    chosen: null,
    available: []
  };

  numOfItemsPerRow = 2;
  rowHeight = '250px';
  siteLang = null;
  categorySettings = null;
  screenType = 'mobile';

  constructor(private routeInfo: ActivatedRoute, private pHService: ProductHierarchyService,
              private categoryGetter: CategoryGetterService, configService: ConfigService,
              private screenService: ScreenTypeService, private langService: LanguageService,
              private prefService: PreferencesService, private titleService: Title,
              private searchService: SearchService) {
    configService.getConfig('imgSrc').subscribe({
      next: res => this.bucketUrl = res
    });
    configService.getConfig('images').subscribe({
      next: images => this.images = images
    });

    configService.getConfig('pages').subscribe({
      next: pages => {
        this.categorySettings = pages.category.arrangements;
        this.updateItemsPositions(this.screenType);
      }
    });

    this.prefService.getPreferences().subscribe({
      next: prefs => {
        this.currencyPref = prefs.currency;
      }
    });
  }

  ngOnInit(): void {
    this.langService.getLang().then(lang => this.siteLang = lang);
    const params = this.routeInfo.paramMap;

    // will get a callback anytime there is a change in the category path
    params.subscribe(param => {
      this.category = param.get('category').split('>');
      this.pHSubscription = this.pHService.getHierarchy().subscribe({
        next: (res) => {

          // get the hierarchy related to the current path
          for (const h of res){
            if (h.name === this.category[0]){
              this.currentHierarchy = this.getFinalHierarchy(h, this.category);

              this.langService.getLang().then(lang => {
                this.titleService.setTitle(this.currentHierarchy.text[lang]);
              });

              // if we are at the tail-end of category, attempt to get items inside it
              if (this.currentHierarchy.sub === null || this.currentHierarchy.sub.length === 0){
                this.categoryGetter.getCategory(this.category).then(items => {
                  this.categoryItems = items;
                });
              } // if
              else{
                for (const subH of this.currentHierarchy.sub){
                  this.searchService.getItemsForCategory(this.category.concat([subH.name]))
                      .then((items: Array<any>) => {
                        if (items){
                          subH.image = items[0].image;
                        }
                      });
                }
              }
              break;
            } // if
          } // for
        } // next
      });
    });

    this.screenService.getScreenTypeUpdate().subscribe({
      next: type => {
        this.screenType = type;
        this.updateItemsPositions(type);
      }
    });

  }

  private updateItemsPositions(screenType: string): void{
    if (this.categorySettings){
      this.numOfItemsPerRow = this.categorySettings[screenType].numOfItemsPerRow;
    }

    switch (screenType){
      case 'mobile':
        if (!this.categorySettings){
          this.numOfItemsPerRow = 2;
        }
        this.rowHeight = '300px';
        break;

      case 'tablet':
        if (!this.categorySettings){
          this.numOfItemsPerRow = 3;
        }
        this.rowHeight = '300px';
        break;

      default:
        if (!this.categorySettings){
          this.numOfItemsPerRow = 3;
        }
        this.rowHeight = '300px';
    }
  }

  // Given array of names, returns the current hierarchy
  private getFinalHierarchy(currentHierarchy: CategoryHierarchy, names: string[]): CategoryHierarchy{
    if (currentHierarchy.name === names[0] && names.length > 1){
      for (const sub of currentHierarchy.sub){
        if (names[1] === sub.name){
          if (sub.hasOwnProperty('sub') && names.length > 2){
            return this.getFinalHierarchy(sub, names.slice(1));
          }
          else{
            return sub;
          }
        } // if
      } // for
      // we shouldn't get to this point
      return currentHierarchy;
    } // if
    return currentHierarchy;
  }

  onCurrencyChange(chosen: string): void{
    this.currencyPref.chosen = chosen;
    this.prefService.setPreference('currency', this.currencyPref);
  }

}
