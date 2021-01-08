import {NgModule} from '@angular/core';

import {AssemblyComponent} from './assembly.component';
import {CommonModule} from '@angular/common';
import {AssemblyCompositorComponent} from './assembly-compositor/assembly-compositor.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import {NzIconModule} from 'ng-zorro-antd/icon';

@NgModule({
  imports: [
    CommonModule,
    NzButtonModule,
    NzUploadModule,
    NzIconModule
  ],
  declarations: [AssemblyComponent, AssemblyCompositorComponent],
  exports: [AssemblyComponent]
})
export class AssemblyModule {
}
