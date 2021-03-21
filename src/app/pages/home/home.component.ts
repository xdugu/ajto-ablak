import { Component, OnInit } from '@angular/core';
import { ScreenTypeService} from '@app/shared-services/screen-type.service';
import { ProductHierarchy, ProductHierarchyService} from '@app/shared-services/product-hierarchy.service';
import { ConfigService} from '@app/shared-services/config.service';
import { Subscription } from 'rxjs';

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
  screenType = 'mobile';

  constructor(screenTypeService: ScreenTypeService, pHService: ProductHierarchyService,
              private configService: ConfigService){
    screenTypeService.getScreenTypeUpdate().subscribe({
      next: state => {this.onScreenSizeChange(state); this.screenType = state; }
    });

    this.subscriptions.push(pHService.getHierarchy().subscribe({
      next: res => this.hierarchy = res
    }));

  }

  ngOnInit(): void {
    this.configService.getConfig('pages').subscribe({
      next: (res: any) => {
        this.pageFlow = res.home.pageFlow;
      }
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
