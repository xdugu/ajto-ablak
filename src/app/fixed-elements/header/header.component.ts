import { Component, OnInit, Output, Input, EventEmitter} from '@angular/core';
import { ProductHierarchyService} from '../../shared-services/product-hierarchy.service';
import { ScreenTypeService} from '../../shared-services/screen-type.service';
import { BasketService } from '@app/shared-services/basket.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() menuButtonClicked = new EventEmitter();
  @Input() lang: string;
  screenState = 'mobile';
  productHierarchy: any;
  basketCount = 0;

  constructor(screenTypeService: ScreenTypeService, private pHService: ProductHierarchyService,
              private basketService: BasketService) {
    screenTypeService.getScreenTypeUpdate().subscribe({
      next: state => this.screenState = state
    });
  }

  ngOnInit(): void {
     this.pHService.getHierarchy().subscribe({
       next: (res) => {this.productHierarchy = res; }
     });

     this.basketService.getBasketCount().subscribe({
       next: count => this.basketCount = count
     });
  }

  // callback from view to register when menu button is clicked
  onMenuButtonClicked(): void{
    this.menuButtonClicked.emit();
  }

}
