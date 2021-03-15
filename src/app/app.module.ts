import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './pages/home/home.module';
import { FixedElementsModule} from './fixed-elements/fixed-elements.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ProductHierarchyService} from './shared-services/product-hierarchy.service';
import { ScreenTypeService } from './shared-services/screen-type.service';
import { ApiManagerService } from './shared-services/api-manager.service';
import { ConfigService } from './shared-services/config.service';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    BrowserAnimationsModule,
    FixedElementsModule,
    MatSidenavModule,
    HttpClientModule
  ],
  providers: [ProductHierarchyService, ScreenTypeService, ApiManagerService, ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }
