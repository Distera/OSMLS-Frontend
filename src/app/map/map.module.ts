import {NgModule} from '@angular/core';

import {MapComponent} from './map.component';
import {CommonModule} from '@angular/common';
import {MapBrowserComponent} from './map-browser/map-browser.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MapComponent, MapBrowserComponent],
  exports: [MapComponent]
})
export class MapModule {
}
