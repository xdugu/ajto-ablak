import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment } from '@angular/router';


const routes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { matcher: resolveRoute, loadChildren: () => import('./category/category.module').then(m => m.CategoryModule) },
  { path: 'product/:productId', loadChildren: () => import('./product/product.module').then(m => m.ProductModule) },
  { path: 'basket', loadChildren: () => import('./basket/basket.module').then(m => m.BasketModule) },
  { path: 'checkout', loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule) },
  { path: 'review', loadChildren: () => import('./review/review.module').then(m => m.ReviewModule) },
  { path: 'legal', loadChildren: () => import('./legal/legal.module').then(m => m.LegalModule) },
  { path: 'blogs', loadChildren: () => import('./blogs/blogs.module').then(m => m.BlogsModule) },
  { path: 'contact', loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule) },
  { path: '**', loadChildren: () => import('./generic/generic.module').then(m => m.GenericModule) },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}

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

