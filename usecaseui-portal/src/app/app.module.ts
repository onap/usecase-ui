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

//注册语言包
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
registerLocaleData(en);  

//自定义组件
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
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
// 自定义服务
import { MyhttpService } from './myhttp.service';
import { HomesService } from './homes.service';
import { onboardService } from './onboard.service';
import { networkHttpservice } from './networkHttpservice.service';
import { PerformanceDetailsComponent } from './components/performance-details/performance-details.component';

@NgModule({
  providers   : [ 
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: NZ_I18N, useValue: en_US },
    MyhttpService,
    HomesService,
    onboardService,
    networkHttpservice 
  ],
  declarations: [
    AppComponent,
    HomeComponent,

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