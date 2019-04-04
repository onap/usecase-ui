/*
    Copyright (C) 2019 CMCC, Inc. and others. All rights reserved.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NZ_I18N, en_US } from 'ng-zorro-antd';
import { NgxEchartsModule } from 'ngx-echarts';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

import { AppRoutingModule } from './app-routing.module';

//Registered language pack
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
registerLocaleData(en);  

//Custom component
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ManagementComponent } from './management/management.component';
import { ServicesComponent } from './services/services.component';
import { ServicesListComponent } from './services/services-list/services-list.component';
import { OnboardVnfVmComponent } from './services/onboard-vnf-vm/onboard-vnf-vm.component';
import { AlarmComponent } from './alarm/alarm.component';
import { PerformanceComponent } from './performance/performance.component';
import { PerformanceVnfComponent } from './performance/performance-vnf/performance-vnf.component';
import { PerformanceVmComponent } from './performance/performance-vm/performance-vm.component';
import { CcvpnNetworkComponent } from './ccvpn-network/ccvpn-network.component';
import { CcvpnDetailComponent } from './ccvpn-detail/ccvpn-detail.component';
import { CcvpnCreationComponent } from './ccvpn-creation/ccvpn-creation.component';

import { DetailsComponent } from './components/details/details.component';
import { GraphiclistComponent } from './components/graphiclist/graphiclist.component';
import { E2eCreationComponent } from './components/e2e-creation/e2e-creation.component';

import { BarComponent } from './components/charts/bar/bar.component';
import { LineComponent } from './components/charts/line/line.component';
import { PieComponent } from './components/charts/pie/pie.component';

import {PathLocationStrategy, LocationStrategy, HashLocationStrategy} from '@angular/common';
// Custom service
import { MyhttpService } from './myhttp.service';
import { HomesService } from './homes.service';
import { onboardService } from './onboard.service';
import { networkHttpservice } from './networkHttpservice.service';
import { PerformanceDetailsComponent } from './components/performance-details/performance-details.component';
import { E2eDetailComponent } from './components/e2e-detail/e2e-detail.component';
import { CustomerComponent } from './components/customer/customer.component';
import { ManagemencsService } from './managemencs.service';

@NgModule({
  providers   : [ 
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: NZ_I18N, useValue: en_US },
    MyhttpService,
    HomesService,
    onboardService,
    networkHttpservice,
    ManagemencsService 
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    ManagementComponent,
    ServicesComponent,
    ServicesListComponent,
    OnboardVnfVmComponent,

    AlarmComponent,
    
    PerformanceComponent,
    PerformanceVnfComponent,
    PerformanceVmComponent,
    DetailsComponent,
    PieComponent,
    LineComponent,
    BarComponent,
    GraphiclistComponent,
    E2eCreationComponent,

    CcvpnNetworkComponent,
    CcvpnDetailComponent,
    CcvpnCreationComponent,
    E2eDetailComponent,
    CustomerComponent ,
    PerformanceDetailsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot(),
    NgxEchartsModule,
    AppRoutingModule
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }