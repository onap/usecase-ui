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
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { homeData, homeVmLineData, servicesSelectData, servicesTableData, creatensData, onboardTableData, onboardDataVNF, onboardDataPNF, baseUrl } from '../models/dataInterface';

@Injectable()
export class ServiceListService {

  constructor(private http: HttpClient) { }
  baseUrl = baseUrl.baseUrl;
  url = {
    customers: this.baseUrl + "/uui-lcm/customers",
    serviceType: this.baseUrl + "/uui-lcm/customers/" + "*_*" + "/service-subscriptions",
    orchestrators: this.baseUrl + "/uui-lcm/orchestrators",
    servicesTableData: this.baseUrl + '/uui-lcm/service-instances',
    serviceTemplates: this.baseUrl + "/uui-lcm/service-templates",
    progress: this.baseUrl + "/uui-lcm/services/" + "*_*" + "/operations/",
    templateParameters: this.baseUrl + "/uui-lcm/fetchCCVPNTemplateData/*_*",
    e2etemplateParameters: this.baseUrl + "/uui-lcm/service-templates/*_*",//no mock Sample Data json
    nstemplateParameters: this.baseUrl + "/uui-lcm/fetchNsTemplateData",
    vimInfo: this.baseUrl + "/uui-lcm/locations",
    sdnControllers: this.baseUrl + "/uui-lcm/sdnc-controllers",
    createService: this.baseUrl + "/uui-lcm/services",
    ns_createService: this.baseUrl + "/uui-lcm/createNetworkServiceInstance",
    ns_createService2: this.baseUrl + "/uui-lcm/instantiateNetworkServiceInstance",
    deleteService: this.baseUrl + "/uui-lcm/services/",
    ns_stopService: this.baseUrl + "/uui-lcm/terminateNetworkServiceInstance",
    ns_deleteService: this.baseUrl + "/uui-lcm/deleteNetworkServiceInstance",
    ns_healService: this.baseUrl + "/uui-lcm/healNetworkServiceInstance",
    vnfInfo: this.baseUrl + "/uui-lcm/VnfInfo/",
    nsProgress: this.baseUrl + "/uui-lcm/jobs/getNsLcmJobStatus/*_*",
    e2eScale: this.baseUrl + "/services/scaleServices/",
    e2e_nsdata: this.baseUrl + "/getServiceInstanceById/customerId",
    allottedResource: this.baseUrl + "/uui-sotn/getAllottedResources",
    updateccvpn: this.baseUrl + "/uui-lcm/services/updateService/",
    pnfDetail: this.baseUrl + "/uui-sotn/getPnfInfo/",
    connectivity: this.baseUrl + "/uui-sotn/getConnectivityInfo/",
    vpnBinding: this.baseUrl + "/uui-sotn/getPinterfaceByVpnId/",
  };


  //The following APIs are optimizable

  // Get all customers
  getAllCustomers() {
    return this.http.get<any>(this.url.customers);
  }
  // Get all Orchestrators
  getAllOrchestrators() {
    return this.http.get<any>(this.url.orchestrators);
  }
  // serviceTable list
  getServicesTableData(paramsObj): Observable<HttpResponse<servicesTableData>> {
    let params = new HttpParams({ fromObject: paramsObj });
    return this.http.get<servicesTableData>(this.url.servicesTableData, { observe: 'response', params });
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
  // Get Vim Info
  getVimInfo() {
    return this.http.get<any>(this.url.vimInfo);
  };
  //Get SdnControllers
  getSdnControllers() {
    return this.http.get<any>(this.url.sdnControllers);
  }
  // Create interface
  createInstance(requestBody, createParams) {
    return this.http.post<any>(this.url.createService + createParams, requestBody);
  }
  // NS CreateInstance step one
  nsCreateInstance(requestBody) {
    return this.http.post<any>(this.url.ns_createService, requestBody);
  }
  // NS CreateInstance step two
  nsCreateInstance2(params, requestBody) {
    return this.http.post<any>(this.url.ns_createService2 + params, requestBody);
  }
  //Delete ns Service
  nsDeleteInstance(paramsObj) {
      let params = new HttpParams({ fromObject: paramsObj });
    return this.http.delete<any>(this.url.ns_deleteService,{params});
  }
  //stop ns Service
  stopNsService(paramsObj, requestBody) {  //You need to terminate before deleting
    let params = new HttpParams({ fromObject: paramsObj });
    return this.http.post<any>(this.url.ns_stopService, requestBody,{ params });
  }
  //heal ns Service
  healNsService(paramsObj, requestBody) {
    let params = new HttpParams({ fromObject: paramsObj });
    return this.http.post<any>(this.url.ns_healService, requestBody,{params});
  }
  //Get allotted-resource to get tp and pnf values
  getAllottedResource(obj) {
    let params = new HttpParams({ fromObject: obj });
    let url = this.url.allottedResource;
    return this.http.get<any>(url, { params });
  }

  //The following APIs are not optimizable ---------------------------------

  // Get relevant serviceType
  getServiceTypes(customer) {
    let url = this.url.serviceType.replace("*_*", customer.id);
    return this.http.get<any>(url);
  }
  //Get template input parameters
  getTemplateParameters(type, template) {
    if (type == "ns") {
      let body = {
        csarId: template.id,
        inputs: ""
      };
      return this.http.post<any>(this.url.nstemplateParameters, body);
    } else if (type == "e2e") {
      let params = new HttpParams({ fromObject: {"toscaModelPath":template.toscaModelURL} });
      let url = this.url.e2etemplateParameters.replace("*_*", template.uuid);
      return this.http.get<any>(url,{params});
    } else {
      let body = {
        csarId: template.uuid,
        packageType: "Service",
        inputs: ""
      };
      let url = this.url.templateParameters.replace("*_*", template.uuid);
      return this.http.post<any>(url, body);
    }
  }
  // ccvpn update
  updateccvpn(id, requestBody) {
    return this.http.put<any>(this.url.updateccvpn + id, requestBody);// online
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
        'serviceType': obj.serviceType.name
      }
    };
    return this.http.delete<any>(this.url.deleteService + obj.serviceInstanceId, httpOptions);
  }
  // Get Vnf Info
  getVnfInfo(id) {
    return this.http.get<any>(this.url.vnfInfo + id);
  }
  // scale
  scaleE2eService(id, requestBody) {
    return this.http.post<any>(this.url.e2eScale + id, requestBody);
  }
  getE2e_nsData(paramsObj) {
    let params = new HttpParams({ fromObject: paramsObj });
    return this.http.get<any>(this.url.e2e_nsdata, { params });
  }
  // Query progress interface
  getProgress(obj,operationTypeObj) {
    let params = new HttpParams({ fromObject: operationTypeObj });
    let url = this.url.progress.replace("*_*", obj.serviceId) + obj.operationId;
    return this.http.get<any>(url,{params});
  }
  getNsProgress(jobid,paramsObj) {
      let params = new HttpParams({ fromObject: paramsObj });
    let url = this.url.nsProgress.replace("*_*", jobid);
    return this.http.get<any>(url,{params});
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
}
