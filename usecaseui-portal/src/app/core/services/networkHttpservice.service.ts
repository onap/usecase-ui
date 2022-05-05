/*
    Copyright (C) 2019 CMCC, Inc. and others. All rights reserved.
    Copyright (C) 2022 Huawei Canada Limited. All rights reserved.

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
import { baseUrl } from '../models/dataInterface';


@Injectable()
export class networkHttpservice {

    constructor(private http: HttpClient) { }

    baseUrl = baseUrl.baseUrl;//Online environment
    url = {
        "getNetworkD3Data": this.baseUrl+"/uui-sotn/getNetWorkResources",
        "getLogicalLinksData": this.baseUrl+"/uui-sotn/getLogicalLinks",
        "getPnfsData": this.baseUrl+"/uui-sotn/getPnfInfo",
        "deleteCloud": this.baseUrl+"/uui-sotn/deleteExtNetWork",
        "getPInterfacesData": this.baseUrl+"/uui-sotn/getPinterfaceByPnfName/",
        "createLink": this.baseUrl+"/uui-sotn/createLink/",
        "querySpecificLinkInfo": this.baseUrl+"/uui-sotn/getSpecificLogicalLink/",
        "queryCloudUrl": this.baseUrl+"/uui-sotn/getHostUrl/",
        "queryExtAAIIdVersion": this.baseUrl+"/uui-sotn/getExtAaiId/",
        "createNetwrok": this.baseUrl+"/uui-sotn/createTopoNetwork/",
        "createPnf": this.baseUrl+"/uui-sotn/createPnf/",
        "createTp": this.baseUrl+"/uui-sotn/pnf/",
        "createCloudLink": this.baseUrl+"/uui-sotn/createLink/",
        "createCloudUrl": this.baseUrl+"/uui-sotn/createHostUrl/",
        "deleteLink": this.baseUrl+"/uui-sotn/deleteLink/",
        "getConnectivities": this.baseUrl+"/uui-sotn/getConnectivityInfo",
        "getNetworkRoutes": this.baseUrl + "/uui-sotn/getNetworkRouteInfo",
        "getVpnBindings": this.baseUrl + "/uui-sotn/getVpnBindingInfo"
    };

    //The following APIs function are optimizable------------------------
    //d3data
    getNetworkD3Data() {
        return this.http.get<any>(this.url["getNetworkD3Data"]);
    }
    // GET AAI PNF(s) data
    getPnfsData() {
        return this.http.get<any>(this.url["getPnfsData"]);
    }
    //Initialize the connection logical-links
    getLogicalLinksData() {
        return this.http.get<any>(this.url["getLogicalLinksData"]);
    }
    deleteCloudLink(paramsObj) {
        let params = new HttpParams({ fromObject: paramsObj });
        return this.http.delete<any>(this.url["deleteCloud"],{params});
    }

    //The following APIs function are not optimizable------------------------
    //Query the tp data corresponding to the specified node
    getPInterfacesData(paramsObj) {
        return this.http.get<any>(this.url['getPInterfacesData'] + paramsObj["pnfName"]);
    }
    //Create a connection interface
    createLink(paramsObj) {
        return this.http.put<any>(this.url["createLink"] + paramsObj["link-name"], paramsObj);
    }
    //Query the specified single cable interface
    querySpecificLinkInfo(paramsObj) {
        return this.http.get<any>(this.url["querySpecificLinkInfo"] + paramsObj["link-name"]);
    }
    //Query external cloud host this.url address interface
    queryCloudUrl(aaiId) {
        return this.http.get<any>(this.url["queryCloudUrl"] + aaiId);
    }
    queryExtAAIIdVersion(aaiId) {
        return this.http.get<any>(this.url["queryExtAAIIdVersion"] + aaiId);
    }

    getConnectivities(){
        return this.http.get<any>(this.url["getConnectivities"]);
    }
    getNetworkRoutes(){
        return this.http.get<any>(this.url["getNetworkRoutes"]);
    }

    getVpnBindingsData(){
        return this.http.get<any>(this.url["getVpnBindings"]);
    }

    //Create an external cloud newwork interface
    createNetwrok(paramsObj) {
        return this.http.put<any>(this.url["createNetwrok"] + paramsObj["network-id"], paramsObj);
    }
    //Create an external cloud pnf interface
    createPnf(paramsObj) {
        return this.http.put<any>(this.url["createPnf"] + paramsObj["pnf-name"], paramsObj);
    }
    //Create an external cloud Tp interface
    createTp(paramsObj, cloudNodeName) {
        let str = cloudNodeName + "/p-interfaces/p-interface/" + paramsObj["interface-name"] + "/createTerminationPoint";
        return this.http.put<any>(this.url["createTp"] + str, paramsObj);
    }
    //Create an external cloud link interface
    createCloudLink(paramsObj) {
        return this.http.put<any>(this.url["createCloudLink"] + paramsObj["link-name"], paramsObj);
    }
    //Create an external cloud host url interface
    createCloudUrl(paramsObj) {
        return this.http.put<any>(this.url["createCloudUrl"] + paramsObj["aai-id"], paramsObj);
    }
    //Delete connection
    deleteLink(paramsObj) {
        let str = paramsObj["logical-link"] + "/" + paramsObj["resource-version"];
        return this.http.delete<any>((this.url["deleteLink"] + str));
    }
}
