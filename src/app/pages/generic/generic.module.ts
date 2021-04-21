import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenericRoutingModule } from './generic-routing.module';
import { GenericComponent } from './generic.component';
import { SharedModuleModule} from '@app/shared-module/shared-module.module';

@NgModule({
  declarations: [GenericComponent],
  imports: [
    CommonModule,
    GenericRoutingModule,
    SharedModuleModule
  ]
})
export class GenericModule { }
