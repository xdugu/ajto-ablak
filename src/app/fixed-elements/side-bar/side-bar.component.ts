import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { ProductHierarchy, ProductHierarchyService} from '../../shared-services/product-hierarchy.service';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { Subscription } from 'rxjs';

interface SideBarProductHierarchy extends ProductHierarchy{
  expanded: boolean;
  link: Array<string>;
  sub?: SideBarProductHierarchy[];
}

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit, OnDestroy {
  @Input() lang: string;
  @Input() screenType = 'mobile';
  productHierarchy: Array<SideBarProductHierarchy>;
  private pHServiceSubscription: Subscription;
  treeControl = new NestedTreeControl<SideBarProductHierarchy>(node => node.sub);
  dataSource = new MatTreeNestedDataSource<SideBarProductHierarchy>();

  constructor(pHService: ProductHierarchyService) {

    // get product hierarchy
    this.pHServiceSubscription = pHService.getHierarchy().subscribe({
      next: res => this.updateProductHierarchy(res)
    });
  }

  ngOnInit(): void {
    this.dataSource.data = this.productHierarchy;
  }

  // A function called to indicate if current node has children - called from view
  hasChild = (_: number, node: ProductHierarchy) => !!node.sub && node.sub.length > 0;

  // called when a tree node is clicked
  // ensures that only one tree and its branches are visible at any time
  toggleTreeNodes(node: SideBarProductHierarchy): void{

    if (this.treeControl.isExpanded(node)){
       this.treeControl.collapse(node);
    }else{
      // this.treeControl.collapseAll();
      this.treeControl.expand(node);
    }

 }

  // updates current product hierarchy
  private updateProductHierarchy(newHierarchy: Array<ProductHierarchy>): void{
    this.productHierarchy = [];

    for (const h of newHierarchy){
      this.productHierarchy.push(this.convertProductHierarchy(h, false, ['category']));
    }
    this.dataSource.data = this.productHierarchy;
  }

  // converts a 'ProductHierarchy' into 'SideBarProductHierarchy'
  private convertProductHierarchy(item: ProductHierarchy, state: boolean, link: Array<string>): SideBarProductHierarchy{
    const newItem: SideBarProductHierarchy = {
      name: item.name,
      expanded: state,
      link: []
    };

    // make copy of link
    link = Object.assign([], link);
    link.push(item.name);
    newItem.link = link;

    if (item.hasOwnProperty('text')){
      newItem.text = item.text;
    }

    if (item.hasOwnProperty('sub')){

      // recursively convert all the children
      if (Array.isArray(item.sub)){
          newItem.sub = [];
          for (const sub of item.sub){
            newItem.sub.push(this.convertProductHierarchy(sub, state, link));
          }
      }
    } // if

    return newItem;
  }

  ngOnDestroy(): void{
    this.pHServiceSubscription.unsubscribe();
  }

}
