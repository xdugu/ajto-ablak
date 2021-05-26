import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';
import { SharedModuleModule} from '@app/shared-module/shared-module.module';
import { SharedModule } from '../shared/shared.module';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [CategoryComponent],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    SharedModuleModule,
    MatGridListModule,
    MatButtonModule,
    SharedModule
  ]
})
export class CategoryModule { }
