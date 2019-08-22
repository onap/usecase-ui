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
import { onboardTableData, onboardDataVNF, onboardDataPNF, baseUrl } from '../models/dataInterface';

@Injectable()
export class onboardService {
  constructor(private http: HttpClient) { }
  /* location */
  // baseUrl = "./assets/json";
  // url = {
  //   // list data
  //   onboardTableData: this.baseUrl + "/onboard-vnf-mf/onboardTableData.json",
  //   onboardDataVNF: this.baseUrl + "/onboard-vnf-mf/onboardDataVNF.json",
  //   onboardDataPNF: this.baseUrl + "/onboard-vnf-mf/onboardDataPNF.json",
  //   //ns sdc
  //   sdc_nsListData: this.baseUrl + "/onboard-vnf-mf/listData/SDC_NS.json",
  //   // vnf sdc
  //   sdc_vnfListData: this.baseUrl + "/onboard-vnf-mf/listData/SDC_VNF.json",


  //   //create nspackages
  //   creatensData: this.baseUrl + "/onboard-vnf-mf/_jsonData.json",

  //   //onboard ns sdc data 
  //   onboardNs: this.baseUrl + "/onboard-vnf-mf/listData/onboardNs.json",
  //   //onboard VNF sdc data 
  //   onboardVNF: this.baseUrl + "/onboard-vnf-mf/listData/onboardVNF.json",

  //   // Delete ns package
  //   deleteNspack: this.baseUrl + "/onboard-vnf-mf/listData/deleteNspack.json",
  //   // Delete ns sdc package
  //   // deleteNssdcData: this.baseUrl + "/onboard-vnf-mf/listData/deleteNssdcData.json",

  //   // Delete Vnf vfc package 
  //   deleteVnfPack: this.baseUrl + "/onboard-vnf-mf/listData/deleteVnfPack.json",
  //   // Delete Vnf sdc package
  //   // deleteVnfsdcData: this.baseUrl + "/onboard-vnf-mf/listData/deleteVnfsdcData.json",

  //   // Delete Pnf package
  //   deletePnfPack: this.baseUrl + "/onboard-vnf-mf/listData/deletePnfPack.json",

  //   // // download ns package
  //   // downloadNsData: this.baseUrl + "/downloadData.json",
  //   // //download vnf package 
  //   // downloadVnfData: this.baseUrl + "/listData/downloadVnfData.json"

  // }

  //---------------------------------------------------------------------------------------
  /* line up*/
  baseUrl = baseUrl.baseUrl + "/uui-lcm/";
  url = {
    // list Data
    onboardTableData: this.baseUrl + "ns-packages",
    onboardDataVNF: this.baseUrl + "vnf-packages",
    onboardDataPNF: this.baseUrl + "pnf-packages",
    //ns sdc
    sdc_nsListData: this.baseUrl + "sdc-ns-packages", // GET
    // vnf sdc
    sdc_vnfListData: this.baseUrl + "sdc-vf-packages", // GET

    // createnspackages ? TODO
    creatensData: this.baseUrl + "_jsonData", //POST

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

    //Progress interface
    progress: this.baseUrl + "jobs/" + "_jobId" + "?responseId="


    // // download ns package
    // downloadNsData: this.baseUrl + "downLoadNsPackage?nsdInfoId=XXXXX",
    // //download vnf package 
    // downloadVnfData: this.baseUrl + "downLoadVnfPackage?vnfPkgId=XXXXX"

  }

  //-----------------------------------Function-local-start------------------------------------------------------
  /* Query data list */
  // NS Data
  getOnboardTableData() {
    // return this.http.get<any>(this.url.onboardTableData);
    return this.http.get<any>(this.url["onboardTableData"]);
  }
  // NS SDC Data
  getSDC_NSTableData() {
    // return this.http.get<any>(this.url.sdc_nsListData);
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
  //-------------------------------------------------------------------------------------

  //create--Get the id after dragging the file before uploading   //on-line post
  getCreatensData(url_upId, requestBody) {
    return this.http.post<any>(this.url.creatensData.replace("_jsonData", url_upId), requestBody);  //on-line
  }

  //create--Get the id after dragging the file before uploading  //local json get
  // getCreatensData(url_upId) {
  //   return this.http.get<any>(this.url.creatensData.replace("_jsonData", url_upId));
  // }

  //------------------------------------------------------------------------------
  //onboard sdc ns 
  getNsonboard(requestBody) {
    return this.http.post<any>(this.url["onboardNs"], requestBody);
  }
  //onboard sdc vnf
  getVnfonboard(requestBody) {
    return this.http.post<any>(this.url["onboardVNF"], requestBody);
  }

  //onboard progress
  getProgress(jobid, responseId) {
    let url = this.url.progress.replace("_jobId", jobid) + responseId;
    return this.http.get<any>(url);
  }
  //--------------------------------------------------------------------------
  // Delete ns vfc package
  deleteNsIdData(paramsObj) {
    // local test 
    // return this.http.get<any>(this.url.deleteNspack);
    // Online test
    return this.http.delete<any>(this.url.deleteNspack + paramsObj);
  }

  // Delete Vnf vfc package
  deleteVnfIdData(paramsObj) {
    // return this.http.get<any>(this.url.deleteVnfPack);
    //online test
    return this.http.delete<any>(this.url.deleteVnfPack + paramsObj);
  }

  // Delete Pnf package
  deletePnfIdData(paramsObj) {
    //Local test
    // return this.http.get<any>(this.url.deletePnfPack); 
    //online test
    return this.http.delete<any>(this.url.deletePnfPack + paramsObj);
  }

  //---------------------------------Function-end-------------------------------------------  

}
