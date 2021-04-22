import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlogListsComponent } from './blog-lists/blog-lists.component';
import { BlogViewComponent } from './blog-view/blog-view.component';

const routes: Routes = [
    { path: 'list', component: BlogListsComponent },
    { path: 'view/:blogId', component: BlogViewComponent }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogsRoutingModule { }
