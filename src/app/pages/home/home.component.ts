import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScreenTypeService} from '@app/shared-services/screen-type.service';
import { ProductHierarchy, ProductHierarchyService} from '@app/shared-services/product-hierarchy.service';
import { ConfigService} from '@app/shared-services/config.service';
import { LanguageService } from '@app/shared-services/language.service';
import { PreferencesService } from '@app/shared-services/preferences.service';
import { Title, Meta } from '@angular/platform-browser';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  numOfCols = 1; // determines num of cols on page
  hierarchy: ProductHierarchy[]; // determine hierarchy
  subscriptions: Subscription[] = [];
  pageFlow: [];
  images = null;
  screenType = 'mobile';
  siteLang = 'en';
  bucketUrl: string = null;
  currency: string = null;

  constructor(screenTypeService: ScreenTypeService, pHService: ProductHierarchyService,
              private configService: ConfigService, private langService: LanguageService,
              prefService: PreferencesService, private titleService: Title,
              private metaService: Meta){
    screenTypeService.getScreenTypeUpdate().subscribe({
      next: state => {this.onScreenSizeChange(state); this.screenType = state; }
    });

    this.subscriptions.push(pHService.getHierarchy().subscribe({
      next: res => this.hierarchy = res
    }));

    prefService.getPreferences().subscribe({
      next: prefs => this.currency = prefs.currency.chosen
    });

  }

  ngOnInit(): void {

    this.configService.getConfig('images').subscribe({
      next: (res: any) => {
        this.images = res;
      }
    });

    this.configService.getConfig('imgSrc').subscribe({
      next: (res: any) => {
        this.bucketUrl = res;
      }
    });

    this.configService.getConfig('pages').subscribe({
      next: (res: any) => {
        this.pageFlow = res.home.pageFlow;
      }
    });

    this.langService.getLang().then(lang => {
      this.siteLang = lang;
      this.configService.getConfig('general').subscribe({
        next: general => {
          this.titleService.setTitle(general.storeName);
          this.metaService.updateTag({name: 'description', content: general.storeDescription[lang]});
        }
      });
    });
  }

  // reacts to changes in screen size
  private onScreenSizeChange(newScreenSize: string): void{
    switch (newScreenSize){
      case 'wideScreen':
        this.numOfCols = 2;
        break;

      case 'mobile':
        this.numOfCols = 1;
        break;

      default:
        this.numOfCols = 2;
        break;
    }
  }

}
