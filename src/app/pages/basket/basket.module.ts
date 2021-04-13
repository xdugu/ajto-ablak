import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BasketRoutingModule } from './basket-routing.module';
import { BasketComponent } from './basket.component';
import { PagesModule} from '../pages.module';

import { SharedModuleModule} from '@app/shared-module/shared-module.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule} from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StringOfPipe } from './string-of.pipe';



@NgModule({
  declarations: [BasketComponent, StringOfPipe],
  imports: [
    CommonModule,
    BasketRoutingModule,
    SharedModuleModule,
    MatExpansionModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatInputModule,
    MatSnackBarModule,
    PagesModule
  ]
})
export class BasketModule { }
