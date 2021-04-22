import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogsRoutingModule } from './blogs-routing.module';
import { BlogViewComponent } from './blog-view/blog-view.component';
import { BlogListsComponent } from './blog-lists/blog-lists.component';
import { SharedModuleModule} from '@app/shared-module/shared-module.module';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [BlogViewComponent, BlogListsComponent],
  imports: [
    CommonModule,
    BlogsRoutingModule,
    SharedModuleModule,
    MatListModule,
    MatButtonModule
  ]
})
export class BlogsModule { }
