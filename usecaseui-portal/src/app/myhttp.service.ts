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
  // baseUrl = 'http://172.19.44.223/api/usecaseui-server/v1';
  baseUrl = '/api/usecaseui-server/v1';
  url = {
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
    nsProgress: this.baseUrl + "/uui-lcm/jobs/getNsLcmJobStatus/" + "*_*" + "?responseId=0&serviceInstanceId=",
    e2eScale: this.baseUrl + "/services/scaleServices/",
    e2e_nsdata: this.baseUrl + "/getServiceInstanceById/customerId/",

    allottedResource: this.baseUrl + "/uui-sotn/getAllottedResources",
    pnfDetail: this.baseUrl + "/uui-sotn/getPnfInfo/",
    connectivity: this.baseUrl + "/uui-sotn/getConnectivityInfo/",
    vpnBinding: this.baseUrl + "/uui-sotn/getPinterfaceByVpnId/",
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
    return this.http.post<any>(this.url.createService + createParams, requestBody);
  }
  nsCreateInstance(requestBody) {
    // return this.http.get<any>(this.url.ns_createService);  //Local simulation
    return this.http.post<any>(this.url.ns_createService, requestBody);
  }
  nsCreateInstance2(params, requestBody) {
    // return this.http.get<any>(this.url.ns_createService2 + params);  //Local simulation
    return this.http.post<any>(this.url.ns_createService2 + params, requestBody);
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
    return this.http.get<any>(this.url.vnfInfo + id);
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
  getNsProgress(jobid,serviceId){
    let url = this.url.nsProgress.replace("*_*",jobid) + serviceId;
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
}
