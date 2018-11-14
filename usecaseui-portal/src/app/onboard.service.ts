import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { onboardTableData, onboardDataVNF, onboardDataPNF } from './dataInterface';

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
  baseUrl = "/api/usecaseui-server/v1/uui-lcm/";
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
  creatensData: this.baseUrl + "createNetworkServiceData",  //POST

  // onboard ns sdc data 
  onboardNs: this.baseUrl + "ns-packages", //POST
  //onboard VNF sdc data 
  onboardVNF: this.baseUrl + "vf-packages", //POST

  //Delete ns package
  deleteNspack: this.baseUrl + "deleteNsdPackage?nsdInfoId=",  
  // Delete Vnf vfc package 
  deleteVnfPack: this.baseUrl + "deleteVnfPackage?vnfPkgId=",  
  // Delete Pnf package
  deletePnfPack: this.baseUrl + "deletePnfPackage?pnfPkgId=",
  
    // // download ns package
    // downloadNsData: this.baseUrl + "downLoadNsPackage?nsdInfoId=XXXXX",
    // //download vnf package 
    // downloadVnfData: this.baseUrl + "downLoadVnfPackage?vnfPkgId=XXXXX"

  }

  //-----------------------------------Function-local-start------------------------------------------------------
  /* Query data list */
  // NS Data
  getOnboardTableData() {
  return this.http.get<any>(this.url.onboardTableData);
  // return this.http.get<any>(this.url["onboardTableData"]);
  }
  // NS SDC Data
  getSDC_NSTableData(){
  return this.http.get<any>(this.url.sdc_nsListData);
  // return this.http.get<any>(this.url["onboardTableData"]);
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
    return this.http.post<any>(this.url.creatensData.replace("_jsonData",url_upId),requestBody);  //线上
  }

  //create--Get the id after dragging the file before uploading  //local json get
  // getCreatensData(url_upId) {
  //   return this.http.get<any>(this.url.creatensData.replace("_jsonData", url_upId));
  // }

  //------------------------------------------------------------------------------
  //onboard sdc ns 
  getNsonboard(requestBody) {
    return this.http.get<any>(this.url["onboardNs"], requestBody);
  }
  //onboard sdc vnf
  getVnfonboard(requestBody) {
    return this.http.get<any>(this.url["onboardVNF"], requestBody);
  }

  //--------------------------------------------------------------------------
  // Delete ns vfc package
  deleteNsIdData(paramsObj): Observable<HttpResponse<any>> {
    // local test 
    let params = new HttpParams({ fromObject: paramsObj });
    console.log(11111, params)
    return this.http.get<any>(this.url.deleteNspack, { observe: 'response', params });

    // Online test
    // return this.http.delete<any>(this.url["deleteNspack"] + paramsObj);
  }
  // delete ns sdc package
  // deleteNssdcData(){
  //   return this.http.get<any>(this.url.deleteNssdcData);  //Local simulation
  //   // return this.http.delete<any>(this.url.deleteNssdcData + id);
  // }

  // Delete Vnf vfc package
  deleteVnfIdData(paramsObj): Observable<HttpResponse<any>> {
    let params = new HttpParams({ fromObject: paramsObj });
    console.log(11111, params)
    return this.http.get<any>(this.url.deleteVnfPack, { observe: 'response', params });
    //online test
    // return this.http.delete<any>(this.url["deleteVnfpack"] + paramsObj);
  }

  // Delete Vnf sdc package
  // deleteVnfsdcData(){
  //   return this.http.get<any>(this.url.deleteVnfsdcData);
  // }

  // Delete Pnf package
  deletePnfIdData(paramsObj): Observable<HttpResponse<any>> {
    let params = new HttpParams({ fromObject: paramsObj });
    console.log(11111, params)
    return this.http.get<any>(this.url.deletePnfPack, { observe: 'response', params });
    //online test
    // return this.http.delete<any>(this.url["deletePnfpack"] + paramsObj);
  }
  //-----------------------------------------Function-local-end-------------------------------------


  // download  nspak
  // downloadNsData(paramsObj): Observable<HttpResponse<any>> {
  //   console.log(66,paramsObj)
  //   let params = new HttpParams({ fromObject: paramsObj });
  //   return this.http.get<any>(this.url.downloadNsData, { observe: 'response', params });
  // }
  //  // download  Vnfpak
  // downloadVnfData(){
  //   return this.http.get<any>(this.url.downloadVnfData)
  // }

  // testObservable() {
  //   let myObservable = new Observable((observer) => {
  //     observer.next(1);
  //     observer.next((n) => {
  //       console.log(3 + n);
  //     })
  //     setTimeout(() => {
  //       observer.next(66666)
  //     }, 100)
  //     observer.next(() => {
  //       setTimeout((n) => {
  //         console.log("9999---" + n);
  //       }, 10)
  //     })
  //     // observer.error(2);
  //     // observer.complete();
  //   });

  //   myObservable.subscribe((e) => {
  //     if (typeof e == "function") {
  //       e(5)
  //     }
  //     console.log(e);
  //   }, (err) => {
  //     console.log(err);
  //   }, () => {
  //     console.log(555);
  //   })
  // }

  //---------------------------------Function-end-------------------------------------------  

}
