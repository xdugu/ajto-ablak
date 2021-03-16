import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { matcher: resolveRoute, loadChildren: () => import('./pages/category/category.module').then(m => m.CategoryModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {}

// function that checks for a caegory route and prepares its params
function resolveRoute(url: UrlSegment[]): any {
  if (url[0].path.match('category'))
  {
    const remainingPath = url.slice(1, url.length);
    const str = remainingPath.reduce((accum, item) => {
      if (accum.length > 0){
        accum += '>';
      }
      accum += item.path;

      return accum;
    }, '');
    return ({consumed: url, posParams: {category : new UrlSegment(str, {})}});
  }else {
    return null;
  }
}
