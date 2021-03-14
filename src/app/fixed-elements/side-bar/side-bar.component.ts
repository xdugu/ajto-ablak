import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductHierarchy, ProductHierarchyService} from '../../shared-services/product-hierarchy.service';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { Subscription } from 'rxjs';

interface SideBarProductHierarchy extends ProductHierarchy{
  expanded: boolean;
  sub?: SideBarProductHierarchy[];
}

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit, OnDestroy {
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
      this.treeControl.collapseAll();
      this.treeControl.expand(node);
    }
 }

  private updateProductHierarchy(newHierarchy: Array<ProductHierarchy>): void{
    this.productHierarchy = [];

    for (const h of newHierarchy){
      this.productHierarchy.push(this.writeExpandedState(h, false));
    }
    this.dataSource.data = this.productHierarchy;
  }

  private writeExpandedState(item: ProductHierarchy, state: boolean): SideBarProductHierarchy{
    const newItem: SideBarProductHierarchy = {
      name: item.name,
      expanded: state
    };

    if (item.hasOwnProperty('text')){
      newItem.text = item.text;
    }

    if (item.hasOwnProperty('sub')){

      // recursively convert all the children
      if (Array.isArray(item.sub)){
          newItem.sub = [];
          for (const sub of item.sub){
            newItem.sub.push(this.writeExpandedState(sub, state));
          }
      }
    }

    return newItem;
  }

  ngOnDestroy(): void{
    this.pHServiceSubscription.unsubscribe();
  }

}
