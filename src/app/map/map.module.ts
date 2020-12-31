import {NgModule} from '@angular/core';

import {MapComponent} from './map.component';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {MapBrowserComponent} from './map-browser/map-browser.component';

registerLocaleData(en);

@NgModule({
  imports: [],
  declarations: [MapComponent, MapBrowserComponent],
  exports: [MapComponent]
})
export class MapModule {
}
