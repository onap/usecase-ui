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
//Registered language pack
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import en from "@angular/common/locales/en";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { EventQueueService } from "@src/app/core/services/eventQueue.service";
import { en_US, NgZorroAntdModule, NZ_I18N } from "ng-zorro-antd";
import { NgxEchartsModule } from "ngx-echarts";
import { AppRoutingModule } from "./app-routing.module";
//Custom component
import { AppComponent } from "./app.component";
//Custom Directive
import { DisableControlDirective } from "./core/Directives/disable-control.directive";
import { HomesService } from "./core/services/homes.service";
import { intentBaseService } from "./core/services/intentBase.service";
import { ManagemencsService } from "./core/services/managemencs.service";
import { networkHttpservice } from "./core/services/networkHttpservice.service";
import { onboardService } from "./core/services/onboard.service";
// Custom service
import { ServiceListService } from "./core/services/serviceList.service";
// slicingTask service
import { SlicingTaskServices } from "./core/services/slicingTaskServices";
import { TextService } from "./core/services/text.service";
import { BasicInfoComponent } from "./shared/components/basic-info/basic-info.component";
import { BarComponent } from "./shared/components/charts/bar/bar.component";
import { LineComponent } from "./shared/components/charts/line/line.component";
import { PieComponent } from "./shared/components/charts/pie/pie.component";
import { CitySelectComponent } from "./shared/components/city-select/city-select/city-select.component";
import { DetailsComponent } from "./shared/components/details/details.component";
import { GraphiclistComponent } from "./shared/components/graphiclist/graphiclist.component";
import { NotificationComponent } from "./shared/components/notification/notification.component";
import { PerformanceDetailsComponent } from "./shared/components/performance-details/performance-details.component";
// common function http
import { Http } from "./shared/utils/http";
import { Recorder } from './shared/utils/recorder';
// common function util
import { Util } from "./shared/utils/utils";
import { TestComponent } from "./test/test.component";
import { AlarmComponent } from "./views/alarm/alarm.component";
import { FcapsComponent } from "./views/fcaps/fcaps.component";
import { Monitor5gComponent } from "./views/fcaps/monitor-5g/monitor-5g.component";
import { MonitorFacpsServiceComponent } from "./views/fcaps/monitor-management-service/monitor-facps-service/monitor-facps-service.component";
import { MonitorManagementService } from "./views/fcaps/monitor-management-service/monitor-management-service.component";
import { HomeComponent } from "./views/home/home.component";
import { CustomerComponent } from "./views/management/customer/customer.component";
import { ManagementComponent } from "./views/management/management.component";
import { CcvpnNetworkComponent } from "./views/network/ccvpn-network/ccvpn-network.component";
import { MdonsNetworkComponent } from "./views/network/mdons-network/mdons-network.component";
import { NlpUploadDialogComponent } from "./views/onboard-vnf-vm/nlp-upload-dialog/nlp-upload-dialog.component";
import { OnboardVnfVmComponent } from "./views/onboard-vnf-vm/onboard-vnf-vm.component";
import { PerformanceVmComponent } from "./views/performance/performance-vm/performance-vm.component";
import { PerformanceVnfComponent } from "./views/performance/performance-vnf/performance-vnf.component";
import { PerformanceComponent } from "./views/performance/performance.component";
import { CloudLeasedLineModalComponent } from './views/services/intent-based-services/cloud-leased-line-modal/cloud-leased-line-modal.component';
import { CloudLeasedLineComponent } from './views/services/intent-based-services/cloud-leased-line/cloud-leased-line.component';
import { IntentBasedPredictComponent } from './views/services/intent-based-services/intent-based-predict/intent-based-predict.component';
import { IntentBasedServicesComponent } from './views/services/intent-based-services/intent-based-services.component';
import { SmartCloudLeasedModalComponent } from './views/services/intent-based-services/smart-cloud-leased-modal/smart-cloud-leased-modal.component';
import { CcvpnCreationComponent } from "./views/services/services-list/ccvpn-creation/ccvpn-creation.component";
import { CcvpnDetailComponent } from "./views/services/services-list/ccvpn-detail/ccvpn-detail.component";
import { CreateModelComponent } from "./views/services/services-list/create-model/create-model.component";
import { DeleteModelComponent } from "./views/services/services-list/delete-model/delete-model.component";
import { E2eCreationComponent } from "./views/services/services-list/e2e-creation/e2e-creation.component";
import { E2eDetailComponent } from "./views/services/services-list/e2e-detail/e2e-detail.component";
import { HealModelComponent } from "./views/services/services-list/heal-model/heal-model.component";
import { MdonsCreationComponent } from "./views/services/services-list/mdons-creation/mdons-creation.component";
import { MdonsDetailComponent } from "./views/services/services-list/mdons-detail/mdons-detail.component";
import { ScaleModelComponent } from "./views/services/services-list/scale-model/scale-model.component";
import { ServicesListComponent } from "./views/services/services-list/services-list.component";
import { TopCardComponent } from "./views/services/services-list/top-card/top-card.component";
import { BusinessOrderComponent } from "./views/services/slicing-management/csmf-slicing-business-management/business-order/business-order.component";
import { CsmfSlicingBusinessManagementComponent } from "./views/services/slicing-management/csmf-slicing-business-management/csmf-slicing-business-management.component";
import { InputBusinessOrderComponent } from './views/services/slicing-management/csmf-slicing-business-management/input-business-order/input-business-order.component';
import { SlicingManagementComponent } from "./views/services/slicing-management/slicing-management.component";
import { NsiModelComponent } from "./views/services/slicing-management/slicing-resource-management/nsi-management/nsi-model/nsi-model.component";
import { NsiTableComponent } from "./views/services/slicing-management/slicing-resource-management/nsi-management/nsi-table/nsi-table.component";
import { NssiModelComponent } from "./views/services/slicing-management/slicing-resource-management/nssi-management/nssi-model/nssi-model.component";
import { NssiTableComponent } from "./views/services/slicing-management/slicing-resource-management/nssi-management/nssi-table/nssi-table.component";
import { SlicingBusinessModelComponent } from "./views/services/slicing-management/slicing-resource-management/slicing-business-management/slicing-business-model/slicing-business-model.component";
import { SlicingBusinessTableComponent } from "./views/services/slicing-management/slicing-resource-management/slicing-business-management/slicing-business-table/slicing-business-table.component";
import { SlicingResourceManagementComponent } from "./views/services/slicing-management/slicing-resource-management/slicing-resource-management.component";
import { CheckProcessModelComponent } from "./views/services/slicing-management/slicing-task-management/check-process-model/check-process-model.component";
import { SlicingTaskManagementComponent } from "./views/services/slicing-management/slicing-task-management/slicing-task-management.component";
import { SlicingTaskModelComponent } from "./views/services/slicing-management/slicing-task-management/slicing-task-model/slicing-task-model.component";
import { SubnetParamsModelComponent } from "./views/services/slicing-management/slicing-task-management/slicing-task-model/subnet-params-model/subnet-params-model.component";
import { ManageServiceComponent } from "./views/services/sotn-management/manage-service/manage-service.component";
import { MonitorServiceComponent } from "./views/services/sotn-management/monitor-service/monitor-service.component";
import { OrderServiceComponent } from "./views/services/sotn-management/order-service/order-service.component";
import { SotnManagementComponent } from "./views/services/sotn-management/sotn-management.component";

export function HttpLoaderFactory(httpClient: HttpClient) {
	return new TranslateHttpLoader(httpClient, "./assets/i18n/", ".json");
}


registerLocaleData(en);






@NgModule({
	providers: [
		{ provide: LocationStrategy, useClass: HashLocationStrategy },
		{ provide: NZ_I18N, useValue: en_US },
		Util,
    Http,
    Recorder,
		ServiceListService,
		HomesService,
		onboardService,
    intentBaseService,
		networkHttpservice,
		ManagemencsService,
		TextService,
		SlicingTaskServices,
		EventQueueService,
		// fakeBackendProvider
	],
	declarations: [
		AppComponent,
		HomeComponent,
		ManagementComponent,
		ServicesListComponent,
		OnboardVnfVmComponent,
    NlpUploadDialogComponent,

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
		CustomerComponent,
		PerformanceDetailsComponent,
		FcapsComponent,
		TestComponent,
		TopCardComponent,
		CreateModelComponent,
		DeleteModelComponent,
		NotificationComponent,
		ScaleModelComponent,
		HealModelComponent,
		Monitor5gComponent,
    MonitorManagementService,
    MonitorFacpsServiceComponent,
    IntentBasedPredictComponent,
    IntentBasedServicesComponent,
    CloudLeasedLineComponent,
    CloudLeasedLineModalComponent,
    SmartCloudLeasedModalComponent,
		SlicingManagementComponent,
		SlicingTaskManagementComponent,
		SlicingResourceManagementComponent,
		SlicingTaskModelComponent,
		SubnetParamsModelComponent,
		SlicingBusinessTableComponent,
		BasicInfoComponent,
		CheckProcessModelComponent,
		NsiTableComponent,
		NssiTableComponent,
		SlicingBusinessModelComponent,
		NsiModelComponent,
		NssiModelComponent,
		CsmfSlicingBusinessManagementComponent,
    BusinessOrderComponent,
    InputBusinessOrderComponent,
		MdonsCreationComponent,
		MdonsDetailComponent,
		DisableControlDirective,
		SotnManagementComponent,
		OrderServiceComponent,
		ManageServiceComponent,
		MonitorServiceComponent,
		MdonsNetworkComponent,
		CitySelectComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient],
			},
		}),
		BrowserAnimationsModule,
		NgZorroAntdModule.forRoot(),
		NgxEchartsModule,
		AppRoutingModule,
	],
	bootstrap: [AppComponent],
	entryComponents: [
		SlicingBusinessModelComponent,
		NsiModelComponent,
		NssiModelComponent,
	],
	exports: [FormsModule, ReactiveFormsModule],
})
export class AppModule {}
