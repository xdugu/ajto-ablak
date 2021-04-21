import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LegalRoutingModule } from './legal-routing.module';
import { LegalComponent } from './legal.component';
import { SharedModuleModule} from '@app/shared-module/shared-module.module';
import { MatExpansionModule } from '@angular/material/expansion';


@NgModule({
  declarations: [LegalComponent],
  imports: [
    CommonModule,
    LegalRoutingModule,
    SharedModuleModule,
    MatExpansionModule
  ]
})
export class LegalModule { }
