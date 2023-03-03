import {NgModule} from '@angular/core';

import {ModelComponent} from './model.component';
import {CommonModule} from '@angular/common';
import {ModelStateManagerComponent} from './model-state-manager/model-state-manager.component';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzSpaceModule} from 'ng-zorro-antd/space';

@NgModule({
    imports: [
        CommonModule,
        NzIconModule,
        NzButtonModule,
        NzSpaceModule
    ],
  declarations: [ModelComponent, ModelStateManagerComponent],
  exports: [ModelComponent]
})
export class ModelModule {
}
