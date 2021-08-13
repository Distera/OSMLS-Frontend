import {NgModule} from '@angular/core';

import {MapComponent} from './map.component';
import {CommonModule} from '@angular/common';
import {MapBrowserComponent} from './map-browser/map-browser.component';
import {MapPropertiesComponent} from './map-properties/map-properties.component';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import {NzInputModule} from 'ng-zorro-antd/input';
import {VarDirective} from 'src/app/infrastructure/ng-var.directive';

@NgModule({
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzGridModule,
    NzCollapseModule,
    NzInputModule,
  ],
  declarations: [MapComponent, MapBrowserComponent, MapPropertiesComponent, VarDirective],
  exports: [MapComponent]
})
export class MapModule {
}
