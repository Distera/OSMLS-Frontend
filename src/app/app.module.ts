import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NZ_I18N} from 'ng-zorro-antd/i18n';
import {en_US} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MapModule} from './map/map.module';
import {AssemblyModule} from './assembly/assembly.module';
import {ApiModule} from './generated/api/api.module';
import {environment} from '../environments/environment';
import {ModuleModule} from './module/module.module';
import {ModelModule} from './model/model.module';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzSpaceModule} from 'ng-zorro-antd/space';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ApiModule.forRoot({rootUrl: environment.apiUrl}),
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzGridModule,
    NzSpaceModule,
    MapModule,
    AssemblyModule,
    ModuleModule,
    ModelModule
  ],
  providers: [{provide: NZ_I18N, useValue: en_US}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
