import { NgModule } from '@angular/core';

import { MapComponent } from './map.component';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

registerLocaleData(en);

@NgModule({
  imports: [],
  declarations: [MapComponent],
  exports: [MapComponent]
})
export class MapModule { }
