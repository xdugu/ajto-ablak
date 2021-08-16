import { Component, OnInit, Input} from '@angular/core';

interface CategoryLinkFlow{
  title: { en?: string, hu?: string};
  link: [];
  colour: string;
}

@Component({
  selector: 'app-category-link',
  templateUrl: './category-link.component.html',
  styleUrls: ['./category-link.component.scss']
})
export class CategoryLinkComponent implements OnInit {
  @Input() lang = null;
  @Input() flow: CategoryLinkFlow = null;
  @Input() imgSrc: string = null;
  @Input() screenType = 'mobile';

  constructor() { }

  ngOnInit(): void {
  }

}
