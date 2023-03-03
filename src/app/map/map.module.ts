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
import {MapReportComponent} from './map-report/map-report.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzEmptyModule} from 'ng-zorro-antd/empty';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {FormsModule} from '@angular/forms';
import {NzIconModule} from 'ng-zorro-antd/icon';

@NgModule({
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzGridModule,
    NzCollapseModule,
    NzInputModule,
    NzDividerModule,
    NgxChartsModule,
    NzTabsModule,
    NzEmptyModule,
    NzInputNumberModule,
    FormsModule,
    NzIconModule,
  ],
  declarations: [MapComponent, MapBrowserComponent, MapPropertiesComponent, MapReportComponent, VarDirective],
  exports: [MapComponent]
})
export class MapModule {
}
