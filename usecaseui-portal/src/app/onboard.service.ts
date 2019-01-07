import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { onboardTableData, onboardDataVNF, onboardDataPNF,baseUrl } from './dataInterface';

@Injectable()
export class onboardService {
  constructor(private http: HttpClient) { }
  /* location */
  // baseUrl = "./assets/json";
  // url = {
  //   // 数据列表
  //   onboardTableData: this.baseUrl + "/onboard-vnf-mf/onboardTableData.json",
  //   onboardDataVNF: this.baseUrl + "/onboard-vnf-mf/onboardDataVNF.json",
  //   onboardDataPNF: this.baseUrl + "/onboard-vnf-mf/onboardDataPNF.json",
  //   //ns sdc
  //   sdc_nsListData: this.baseUrl + "/onboard-vnf-mf/listData/SDC_NS.json",
  //   // vnf sdc
  //   sdc_vnfListData: this.baseUrl + "/onboard-vnf-mf/listData/SDC_VNF.json",


  //   //创建nspackages
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
  /* line up 线上*/
  baseUrl = baseUrl.baseUrl
  url = {
    // 数据列表Data
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

    //进度接口
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
  getSDC_NSTableData(){
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
  getCreatensData(url_upId,requestBody) {
    return this.http.post<any>(this.url.creatensData.replace("_jsonData",url_upId),requestBody);  //on-line
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
  deletePnfIdData(paramsObj){
    //Local test
    // return this.http.get<any>(this.url.deletePnfPack); 
    //online test
    return this.http.delete<any>(this.url.deletePnfPack + paramsObj);
  }

  //---------------------------------Function-end-------------------------------------------  

}
