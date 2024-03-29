import { BrowserModule, Title, Meta} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FixedElementsModule} from './fixed-elements/fixed-elements.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { PagesModule } from '@app/pages/pages.module';
import * as SharedPagesModule from '@app/pages/shared/shared.module';
import { ProductHierarchyService} from './shared-services/product-hierarchy.service';
import { ScreenTypeService } from './shared-services/screen-type.service';
import { ApiManagerService } from './shared-services/api-manager.service';
import { ConfigService } from './shared-services/config.service';
import { LanguageService } from './shared-services/language.service';
import { TokenStorageService } from './shared-services/token-storage.service';
import { BasketService } from './shared-services/basket.service';
import { TrackingService } from './shared-services/tracking.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModuleModule } from './shared-module/shared-module.module';
import { CurrencyPipe, DatePipe } from '@angular/common';

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
    PagesModule,
    SharedModuleModule.forRoot(),
    SharedPagesModule.SharedModule.forRoot(),
    MatSnackBarModule
  ],
  providers: [ProductHierarchyService, ScreenTypeService, ApiManagerService, Title, Meta,
    ConfigService, LanguageService, TokenStorageService, BasketService, TrackingService, CurrencyPipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
