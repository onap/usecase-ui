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
import { baseUrl } from '../models/dataInterface';

@Injectable()
export class onboardService {
    constructor(private http: HttpClient) { }

    baseUrl = baseUrl.baseUrl + "/uui-lcm/";
    url = {
        //The following APIs are optimizable------------------------
        // list Data
        onboardTableData: this.baseUrl + "ns-packages",
        onboardDataVNF: this.baseUrl + "vnf-packages",
        onboardDataPNF: this.baseUrl + "pnf-packages",
        //ns sdc
        sdc_nsListData: this.baseUrl + "sdc-ns-packages", // GET
        // vnf sdc
        sdc_vnfListData: this.baseUrl + "sdc-vf-packages", // GET
        // onboard ns sdc data
        onboardNs: this.baseUrl + "ns-packages", //POST
        //onboard VNF sdc data
        onboardVNF: this.baseUrl + "vf-packages", //POST
        //Delete ns package
        deleteNspack: this.baseUrl + "deleteNsdPackage?nsdInfoId=",
        // Delete Vnf vfc package
        deleteVnfPack: this.baseUrl + "deleteVnfPackage?vnfPkgId=",
        // Delete Pnf package
        deletePnfPack: this.baseUrl + "deletePnfPackage?pnfdInfoId=",
        // The following APIs are not optimizable-------------------
        // createnspackages
        creatensData: this.baseUrl + "_jsonData", //POST
        //Progress interface
        progress: this.baseUrl + "jobs/" + "_jobId" + "?responseId="
    };

    //The following APIs function are optimizable------------------------

    /* Query data list */
    // NS Data
    getOnboardTableData() {
        return this.http.get<any>(this.url["onboardTableData"]);
    }
    // NS SDC Data
    getSDC_NSTableData() {
        return this.http.get<any>(this.url["sdc_nsListData"]);
    }
    // VNF Data
    getOnboardTableVnfData() {
        return this.http.get<any>(this.url.onboardDataVNF);
    }
    // onboard VNF sdc Data
    getSDC_VNFTableData() {
        return this.http.get<any>(this.url["sdc_vnfListData"]);
    }
    // PNF Data
    getOnboardTablePnfData() {
        return this.http.get<any>(this.url.onboardDataPNF);
    }
    //onboard sdc ns
    getNsonboard(requestBody) {
        return this.http.post<any>(this.url["onboardNs"], requestBody);
    }
    //onboard sdc vnf
    getVnfonboard(requestBody) {
        return this.http.post<any>(this.url["onboardVNF"], requestBody);
    }
    // Delete ns vfc package
    deleteNsIdData(paramsObj) {
        return this.http.delete<any>(this.url.deleteNspack + paramsObj);
    }
    // Delete Vnf vfc package
    deleteVnfIdData(paramsObj) {
        return this.http.delete<any>(this.url.deleteVnfPack + paramsObj);
    }
    // Delete Pnf package
    deletePnfIdData(paramsObj) {
        return this.http.delete<any>(this.url.deletePnfPack + paramsObj);
    }

    // The following APIs function are not optimizable-------------------

    //create--Get the id after dragging the file before uploading
    getCreatensData(url_upId, requestBody) {
        return this.http.post<any>(this.url.creatensData.replace("_jsonData", url_upId), requestBody);
    }
    //onboard progress
    getProgress(jobid, responseId) {
        let url = this.url.progress.replace("_jobId", jobid) + responseId;
        return this.http.get<any>(url);
    }

}
