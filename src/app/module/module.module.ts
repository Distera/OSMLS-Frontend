import {NgModule} from '@angular/core';

import {ModuleComponent} from './module.component';
import {CommonModule} from '@angular/common';
import {ModuleManagerComponent} from './module-manager/module-manager.component';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {FormsModule} from '@angular/forms';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzButtonModule} from 'ng-zorro-antd/button';

@NgModule({
  imports: [
    CommonModule,
    NzSelectModule,
    FormsModule,
    NzIconModule,
    NzButtonModule
  ],
  declarations: [ModuleComponent, ModuleManagerComponent],
  exports: [ModuleComponent]
})
export class ModuleModule {
}
