import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenericRoutingModule } from './generic-routing.module';
import { GenericComponent } from './generic.component';
import { SharedModuleModule} from '@app/shared-module/shared-module.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [GenericComponent],
  imports: [
    CommonModule,
    GenericRoutingModule,
    SharedModuleModule,
    SharedModule
  ]
})
export class GenericModule { }
