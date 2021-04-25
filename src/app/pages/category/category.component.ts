import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { ProductHierarchy, ProductHierarchyService } from '@app/shared-services/product-hierarchy.service';
import { ConfigService } from '@app/shared-services/config.service';
import { CategoryGetterService} from '@app/pages/services/category-getter.service';
import { ScreenTypeService } from 'app/shared-services/screen-type.service';
import { LanguageService } from 'app/shared-services/language.service';
import { PreferencesService } from '@app/shared-services/preferences.service';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  category: string;
  currentHierarchy: ProductHierarchy = null;
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
  siteLang = 'en';

  constructor(private routeInfo: ActivatedRoute, private pHService: ProductHierarchyService,
              private categoryGetter: CategoryGetterService, configService: ConfigService,
              private screenService: ScreenTypeService, private langService: LanguageService,
              private prefService: PreferencesService) {
    configService.getConfig('imgSrc').subscribe({
      next: res => this.bucketUrl = res
    });
    configService.getConfig('images').subscribe({
      next: images => this.images = images
    });

    this.prefService.getPreferences().subscribe({
      next: prefs => {
        this.currencyPref = prefs.currency;
      }
    });
  }

  ngOnInit(): void {
    const params = this.routeInfo.paramMap;

    // will get a callback anytime there is a change in the category path
    params.subscribe(param => {
      this.category = param.get('category');
      this.pHSubscription = this.pHService.getHierarchy().subscribe({
        next: (res) => {

          // get the hierarchy related to the current path
          const categories = this.category.split('>');
          for (const h of res){
            if (h.name === categories[0]){
              this.currentHierarchy = this.getFinalHierarchy(h, categories);

              // if we are at the tail-end of category, attempt to get items inside it
              if (this.currentHierarchy.sub === null || this.currentHierarchy.sub.length === 0){
                this.categoryGetter.getCategory(this.category.split('>')).then(items => {
                  this.categoryItems = items;
                });
              } // if
              break;
            } // if
          } // for
        } // next
      });
    });

    this.screenService.getScreenTypeUpdate().subscribe({
      next: type => {
        switch (type){
          case 'mobile':
            this.numOfItemsPerRow = 2;
            this.rowHeight = '300px';
            break;

          default:
            this.numOfItemsPerRow = 3;
            this.rowHeight = '350px';
        }
      }
    });



    this.langService.getLang().then(lang => this.siteLang = lang);
  }

  // Given array of names, returns the current hierarchy
  private getFinalHierarchy(currentHierarchy: ProductHierarchy, names: string[]): ProductHierarchy{
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
