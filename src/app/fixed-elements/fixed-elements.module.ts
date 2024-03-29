import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { SharedModuleModule } from '@app/shared-module/shared-module.module';

import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTreeModule} from '@angular/material/tree';
import {MatBadgeModule} from '@angular/material/badge';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LangUrlPipe } from './footer/lang-url.pipe';
import { SearchComponent } from './search/search.component';
import { NotificationsComponent } from './notifications/notifications.component';



@NgModule({
  declarations: [HeaderComponent, FooterComponent, SideBarComponent, LangUrlPipe, SearchComponent, NotificationsComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModuleModule,
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTreeModule,
    MatBadgeModule,
    MatListModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  exports: [HeaderComponent, FooterComponent, SideBarComponent, SearchComponent, NotificationsComponent]
})
export class FixedElementsModule { }
