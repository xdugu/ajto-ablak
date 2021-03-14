import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { ProductHierarchyService} from '../../shared-services/product-hierarchy.service';
import { ScreenTypeService} from '../../shared-services/screen-type.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  screenState = 'mobile';

  productHierarchy: any;

  constructor(screenTypeService: ScreenTypeService, private pHService: ProductHierarchyService) {
    screenTypeService.getScreenTypeUpdate().subscribe({
      next: state => this.screenState = state
    });
  }

  ngOnInit(): void {
     this.pHService.getHierarchy().subscribe({
       next: (res) => {this.productHierarchy = res; }
     });
  }

}
