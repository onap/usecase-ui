/*
    Copyright (C) 2018 CMCC, Inc. and others. All rights reserved.

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
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { homeData, homeVmLineData, servicesSelectData, servicesTableData, creatensData, onboardTableData, onboardDataVNF, onboardDataPNF } from './dataInterface';



@Injectable()
export class MyhttpService {

  constructor(private http: HttpClient) { }

  // baseUrl = "./assets/json";
  // url={
  //   home_serviceData:this.baseUrl + "/home_serviceData.json",
  //   home_performanceData:this.baseUrl + "/home_performanceData.json",
  //   home_alarmData:this.baseUrl + "/home_alarmData.json",
  //   home_alarmChartData:this.baseUrl + "/home_alarmChartData.json",
  //   sourceNames:this.baseUrl + "/SourceName.json",

  //   customers:this.baseUrl + "/customers.json?",
  //   serviceType:this.baseUrl + "/serviceTypes.json?*_*",
  //   servicesTableData:this.baseUrl + "/servicesTableData.json",
  //   serviceTemplates:this.baseUrl + "/serviceTemplates2.json?",
  //   templateParameters:this.baseUrl + "/*_*" + "ServiceTemplateParameters.json?",
  //   vimInfo:this.baseUrl + "/vimInfo.json?",
  //   sdnControllers:this.baseUrl + "/sdnControllers.json?",
  //   addressData: this.baseUrl + "/siteAddressData.json?",
  //   createService:this.baseUrl + "/createService.json",
  //   ns_createService: this.baseUrl + "/createNsService.json?",
  //   ns_createService2: this.baseUrl + "/createNsService2.json",
  //   inputNamesTransform: this.baseUrl + "/configuration_files/inputNamesTranslate.json?",
  //   deleteService: this.baseUrl + "/deleteService.json?",
  //   ns_deleteService: this.baseUrl + "/deleteNsService.json?",
  //   ns_stopService: this.baseUrl + "/stopNsService.json?",
  //   ns_healService: this.baseUrl + "/healNsService.json?",
  //   vnfInfo: this.baseUrl + "/vnfInfo.json?",
  //   progress:this.baseUrl + "/progress.json?",
  //   nsProgress:this.baseUrl + "nsProgress.json?",
  //   e2eScale:this.baseUrl + "/e2eScale.json?",
  //   e2e_nsdata:this.baseUrl + "/e2e_nsdata.json?",

  //   allottedResource:this.baseUrl + "/allotted-resources2.json?",
  //   pnfDetail:this.baseUrl + "/pnfdetail-domain.json?",
  //   connectivity:this.baseUrl + "/sotn-connectivity2.json?",
  //   vpnBinding:this.baseUrl + "/vpnbinding.json?",
  //   alarmFormData:this.baseUrl + "/alarmFormData.json?",
  // }

  // baseUrl = 'http://172.19.44.223/api/usecaseui-server/v1';
  baseUrl = '/api/usecaseui-server/v1';
  url = {
    home_serviceData: this.baseUrl + "/uui-lcm/serviceNumByCustomer",
    home_performanceData: this.baseUrl + "/performance/queryAllSourceNames",
    home_alarmData: this.baseUrl + "/alarm/statusCount",
    home_alarmChartData: this.baseUrl + "/alarm/diagram",
    sourceNames: this.baseUrl + "/alarm/getSourceNames",

    customers: this.baseUrl + "/uui-lcm/customers",
    serviceType: this.baseUrl + "/uui-lcm/customers/" + "*_*" + "/service-subscriptions",
    servicesTableData: this.baseUrl + '/uui-lcm/service-instances',
    serviceTemplates: this.baseUrl + "/uui-lcm/service-templates",
    templateParameters: this.baseUrl + "/uui-lcm/service-templates/" + "*_*" + "?toscaModelPath=",
    nstemplateParameters: this.baseUrl + "/uui-lcm/fetchNsTemplateData",
    vimInfo: this.baseUrl + "/uui-lcm/locations/",
    sdnControllers: this.baseUrl + "/uui-lcm/sdnc-controllers/",
    addressData: this.baseUrl + "/uui-sotn/getOssInvenory",
    createService: this.baseUrl + "/uui-lcm/services",
    ns_createService: this.baseUrl + "/uui-lcm/createNetworkServiceInstance",
    ns_createService2: this.baseUrl + "/uui-lcm/instantiateNetworkServiceInstance",
    inputNamesTransform: "./assets/json/configuration_files/inputNamesTranslate.json?",
    deleteService: this.baseUrl + "/uui-lcm/services/",
    ns_deleteService: this.baseUrl + "/uui-lcm/deleteNetworkServiceInstance?ns_instance_id=",
    ns_stopService: this.baseUrl + "/uui-lcm/terminateNetworkServiceInstance?ns_instance_id=",
    ns_healService: this.baseUrl + "/uui-lcm/healNetworkServiceInstance?ns_instance_id=",
    vnfInfo: this.baseUrl + "/uui-lcm/VnfInfo/",
    progress: this.baseUrl + "/uui-lcm/services/" + "*_*" + "/operations/",
    nsProgress: this.baseUrl + "/uui-lcm/jobs/getNsLcmJobStatus/" + "*_*" + "?responseId=",
    e2eScale: this.baseUrl + "/services/scaleServices/",
    e2e_nsdata: this.baseUrl + "/getServiceInstanceById/customerId/",

    allottedResource: this.baseUrl + "/uui-sotn/getAllottedResources",
    pnfDetail: this.baseUrl + "/uui-sotn/getPnfInfo/",
    connectivity: this.baseUrl + "/uui-sotn/getConnectivityInfo/",
    vpnBinding: this.baseUrl + "/uui-sotn/getPinterfaceByVpnId/",
  }

  // home
  getHomeServiceData() {
    return this.http.get<any>(this.url.home_serviceData);
  }
  getHomePerformanceData() {
    return this.http.get<String[]>(this.url.home_performanceData);
  }
  getHomeAlarmData() {
    return this.http.get<any>(this.url.home_alarmData);
  }
  getHomeAlarmChartData(paramsObj) {
    let params = new HttpParams({ fromObject: paramsObj });
    return this.http.get<any>(this.url.home_alarmChartData, { params });
  }

  // serviceTable list
  getServicesTableData(paramsObj): Observable<HttpResponse<servicesTableData>> {
    let params = new HttpParams({ fromObject: paramsObj });
    return this.http.get<servicesTableData>(this.url.servicesTableData, { observe: 'response', params });
  }

  //---------------------------------------------------------------------------------

  // Get all customers
  getAllCustomers() {
    return this.http.get<any>(this.url.customers);
  }

  // Get relevant serviceType
  getServiceTypes(customer) {
    let url = this.url.serviceType.replace("*_*", customer.id);
    return this.http.get<any>(url);
  }


  // Get all template types
  getAllServiceTemplates(type) {
    if (type == "Network Service") {
      let nsUrl = this.url.serviceTemplates.replace("service-templates", "listNsTemplates").replace("serviceTemplates2", "serviceTemplates-ns");
      console.log(nsUrl);
      return this.http.get<any>(nsUrl);
    }
    return this.http.get<any>(this.url.serviceTemplates);
  }


  //Get template input parameters
  getTemplateParameters(type, template) {
    // let url = this.url.templateParameters.replace("*_*",type) + template.toscaModelURL;  //Local simulation
    if (type == "ns") {
      let body = {
        csarId: template.id,
        inputs: ""
      }
      return this.http.post<any>(this.url.nstemplateParameters, body);
    }
    let url = this.url.templateParameters.replace("*_*", template.uuid) + template.toscaModelURL;
    return this.http.get<any>(url);
  }
  // siteAddress address
  getSiteAddress() {
    return this.http.get<any>(this.url.addressData);
  }

  getVimInfo() {
    return this.http.get<any>(this.url.vimInfo);
  };
  getSdnControllers() {
    return this.http.get<any>(this.url.sdnControllers);
  }

  // Create interface
  createInstance(requestBody, createParams) {
    // return this.http.get<any>(this.url.createService + createParams);  //Local simulation
    return this.http.post<any>(this.url.createService, requestBody);
  }
  nsCreateInstance(requestBody) {
    // return this.http.get<any>(this.url.ns_createService);  //Local simulation
    return this.http.post<any>(this.url.ns_createService, requestBody);
  }
  nsCreateInstance2(params, requestBody) {
    // return this.http.get<any>(this.url.ns_createService2 + params);  //Local simulation
    return this.http.post<any>(this.url.ns_createService + params, requestBody);
  }

  // Input parameter name conversion
  inputNamesTransform() {
    return this.http.get(this.url.inputNamesTransform);
  }

  // Delete interface
  deleteInstance(obj) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic SW5mcmFQb3J0YWxDbGllbnQ6cGFzc3dvcmQxJA=='
      }),
      body: {
        'globalSubscriberId': obj.globalSubscriberId,
        'serviceType': obj.serviceType
      }
    };
    // return this.http.get<any>(this.url.deleteService);  //Local simulation
    return this.http.delete<any>(this.url.deleteService + obj.serviceInstanceId, httpOptions);
  }
  nsDeleteInstance(id) {
    // return this.http.get<any>(this.url.ns_deleteService);  //Local simulation
    return this.http.delete<any>(this.url.ns_deleteService + id);
  }
  stopNsService(id, requestBody) {  //You need to terminate before deleting
    // return this.http.get<any>(this.url.ns_stopService);  //Local simulation
    return this.http.post<any>(this.url.ns_stopService + id, requestBody);
  }

  getVnfInfo(id) {
    return this.http.get<any>(this.url.vnfInfo + id)
  }
  healNsService(id, requestBody) {
    // return this.http.get<any>(this.url.ns_healService);  //Local simulation
    return this.http.post<any>(this.url.ns_healService + id, requestBody);
  }

  // scale
  scaleE2eService(id, requestBody) {
    // return this.http.get<any>(this.url.e2eScale + id);  
    return this.http.post<any>(this.url.e2eScale + id, requestBody);
  }
  getE2e_nsData(paramsObj) {
    let params = new HttpParams({ fromObject: paramsObj });
    return this.http.get<any>(this.url.e2e_nsdata, { params });
  }

  // Query progress interface
  getProgress(obj) {
    let url = this.url.progress.replace("*_*", obj.serviceId) + obj.operationId;
    return this.http.get<any>(url);
  }
  getNsProgress(jobid, responseId) {
    let url = this.url.nsProgress.replace("*_*", jobid) + responseId;
    return this.http.get<any>(url);
  }

  // Get allotted-resource to get tp and pnf values
  getAllottedResource(obj) {
    let params = new HttpParams({ fromObject: obj });
    let url = this.url.allottedResource;
    return this.http.get<any>(url, { params });
  }
  //Get the corresponding domain (network-resource) by pnf value
  getPnfDetail(name) {
    let url = this.url.pnfDetail + name;
    return this.http.get<any>(url);
  }
  //Get connectivity by sotn, find vpn-id
  getSotnConnectivity(id) {
    let url = this.url.connectivity + id;
    return this.http.get<any>(url);
  }
  //Find tp and pnf by vpn-id
  getVpnBinding(id) {
    let url = this.url.vpnBinding + id;
    return this.http.get<any>(url);
  }
  // Time formatting milliseconds to normal
  dateformater(vmstime) {
    if (!vmstime) {
      return ''
    }
    let mstime = Number((vmstime + '').slice(0, 13));
    let time = new Date(mstime);
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let day = time.getDate();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    let formattime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    return formattime;
  }


  // alarm data
  getAlarmFormData(currentPage: number, pageSize: number, sourceName?: string, priority?: string, startTime?: string, endTime?: string, vfStatus?: string) {
    return this.http.get<any>('/api/usecaseui-server/v1/alarm/' + '/' + currentPage + '/' + pageSize + '?sourceName=' + sourceName + '&priority=' + priority + '&startTime=' + startTime + '&endTime=' + endTime + '&vfStatus=' + vfStatus);
  }

  getSourceNames() {
    return this.http.get<any>('/api/usecaseui-server/v1/alarm/getSourceNames/');
  }

  getstatuscount() {
    let httpurl = '/api/usecaseui-server/v1/alarm/statusCount';
    return this.http.get<any>(httpurl);
  }
  getAlarmDetailData(id) {
    let httpurl = '/api/usecaseui-server/v1/alarm/getAlarmsHeaderDetail/' + id;
    return this.http.get<any>(httpurl);
  }

  // performance data
  getqueryAllSourceNames() {
    let httpurl = this.baseUrl + "/api/usecaseui-server/v1/performance/queryAllSourceNames";
    return this.http.get<any>(httpurl);
  }
  getperformanceSourceNames(currentPage: number, pageSize: number, sourceName: string) {
    let httpurl = this.baseUrl + "/api/usecaseui-server/v1/performanceSsourceNames" + "/" + currentPage + "/" + pageSize + "?sourceName=" + sourceName;
    return this.http.get<any>(httpurl);
  }
  getPerformanceFormData(currentPage: number, pageSize: number, sourceName?: string, startTime?: string, endTime?: string) {
    return this.http.get<any>('/api/usecaseui-server/v1/performance' + '/' + currentPage + '/' + pageSize + '?sourceName=' + sourceName + '&startTime=' + startTime + '&endTime=' + endTime);
  }
  getPerformanceHeaderDetail(id) {
    let httpurl = '/api/usecaseui-server/v1/performance/getPerformanceHeaderDetail/' + id;
    return this.http.get<any>(httpurl);
  }
}
