import { BrowserModule } from '@angular/platform-browser';
import { enableProdMode, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FixedElementsModule} from './fixed-elements/fixed-elements.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { PagesModule } from '@app/pages/pages.module';
import { ProductHierarchyService} from './shared-services/product-hierarchy.service';
import { ScreenTypeService } from './shared-services/screen-type.service';
import { ApiManagerService } from './shared-services/api-manager.service';
import { ConfigService } from './shared-services/config.service';

import { MatSidenavModule } from '@angular/material/sidenav';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    FixedElementsModule,
    MatSidenavModule,
    HttpClientModule,
    PagesModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [ProductHierarchyService, ScreenTypeService, ApiManagerService,
    ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule {}
