import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { onboardTableData, onboardDataVNF, onboardDataPNF } from './dataInterface';

@Injectable()
export class onboardService {
  constructor(private http: HttpClient) { }
  /* location */
  baseUrl = "./assets/json";
  url = {
    // 数据列表
    onboardTableData: this.baseUrl + "/onboard-vnf-mf/onboardTableData.json",
    onboardDataVNF: this.baseUrl + "/onboard-vnf-mf/onboardDataVNF.json",
    onboardDataPNF: this.baseUrl + "/onboard-vnf-mf/onboardDataPNF.json",
    //ns sdc
    sdc_nsListData: this.baseUrl + "/onboard-vnf-mf/listData/SDC_NS.json",
    // vnf sdc
    sdc_vnfListData: this.baseUrl + "/onboard-vnf-mf/listData/SDC_VNF.json",

    //创建nspackages
    creatensData: this.baseUrl + "/onboard-vnf-mf/_jsonData.json",
       
    //onboard ns sdc data 
    onboardNs: this.baseUrl + "/onboard-vnf-mf//listData/onboardNs.json",
    //onboard VNF sdc data 
    onboardVNF: this.baseUrl + "/onboard-vnf-mf/listData/onboardVNF.json",
 
    // Delete ns package
    deleteNspack: this.baseUrl + "/onboard-vnf-mf/deleteNspack.json",
    // Delete Vnf vfc package
    deleteVnfPack: this.baseUrl + "/deleteVnfPack.json",
    // Delete Pnf package
    deletePnfPack: this.baseUrl + "/deletePnfPack.json",

    // // download ns package
    // downloadNsData: this.baseUrl + "/downloadData.json",
    // //download vnf package 
    // downloadVnfData: this.baseUrl + "/listData/downloadVnfData.json"
    
  }

//---------------------------------------------------------------------------------------
  /* line up 线上*/
  // baseUrl = "/api/usecaseui/server/v1/uui-lcm/";
  // baseUrlUp = "/api/usecaseui/server/v1/";
  // url = {
  //   // 数据列表Data
  //   onboardTableData: this.baseUrl + "ns-packages",
  //   onboardDataVNF: this.baseUrl + "vnf-packages",
  //   onboardDataPNF: this.baseUrl + "pnf-packages",
  //   //ns sdc
  //   sdc_nsListData: this.baseUrl + "sdc-ns-packages",
  //   //vnf sdc
  //   sdc_vnfListData: this.baseUrl + "sdc-vf-packages",

  //   //创建 creatensData
  //   creatensData: this.baseUrl + "_jsonData",  //本地

  //   //onboard
  //   //onboard ns sdc data 
  //   onboardNs: this.baseUrl + "ns-packages",
  //   //onboard VNF sdc data 
  //   onboardVNF: this.baseUrl + "vf-packages",

  //   // Delete ns package
  //   deleteNspack: this.baseUrl + "deleteNsdPackage?nsdInfoId=XXXXX",
  //   // Delete Vnf vfc package
  //   deleteVnfPack: this.baseUrl + "deleteVnfPackage?vnfPkgId=XXXXX",
  //   // Delete Pnf package
  //   deletePnfPack: this.baseUrl + "",

  //   // // download ns package
  //   // downloadNsData: this.baseUrl + "downLoadNsPackage?nsdInfoId=XXXXX",
  //   // //download vnf package 
  //   // downloadVnfData: this.baseUrl + "downLoadVnfPackage?vnfPkgId=XXXXX"
    
  // }

  //-------------------------------------------------------------------------------------
  // baseUrl = 'http://172.19.44.223/api/usecaseui-server/v1';
 
  // baseUrl = '/api/usecaseui/server/v1';
  // url={
  //   // allhome:this.baseUrl + "/alarm/getAlarmDataByStatus/0",
  //   // homeLineData:this.baseUrl + "/...........",
  //   // serviceSelectList:this.baseUrl + "/xxxxxxxxxxxxx",
  //   // servicesTableData:this.baseUrl + "/xxxxxxxx.json",
  //   // onboardTableData:this.baseUrl + "/xxxxxxx.json",
    
  //   // 数据列表
  //   onboardTableData: this.baseUrl + "/uui-lcm/ns-packages",
  //   onboardDataVNF: this.baseUrl + "/uui-lcm/vnf-packages",
  //   onboardDataPNF: this.baseUrl + "/uui-lcm/pnf-packages",

  //   //创建nspackages
  //   // creatensData: this.baseUrl + "/creatensData.json",
    
  //   // deleteService: this.baseUrl + "/deleteService.json?",

  //   // Delete ns package
  //   deleteNspack: this.baseUrl + "/uui-lcm/deleteNsdPackage",
  //   // download ns package
  //   downloadNsData: this.baseUrl + "/downloadData.json/uui-lcm/downLoadNsPackage",
  // }

//-----------------------------------Function-start------------------------------------------------------
  /* 查询数据列表 */
  // NS Data
  getOnboardTableData(paramsObj): Observable<HttpResponse<any>> {
    let params = new HttpParams({ fromObject: paramsObj });
    return this.http.get<any>(this.url.onboardTableData, { observe: 'response', params });
    // return this.http.get<any>(this.url["onboardTableData"]);
  }

  // NS SDC Data
  getSDC_NSTableData(paramsObj): Observable<HttpResponse<onboardTableData>> {
    let params = new HttpParams({ fromObject: paramsObj });
    return this.http.get<onboardTableData>(this.url.sdc_nsListData, { observe: 'response', params });
    // return this.http.get<any>(this.url["onboardTableData"]);
  }
  
 // VNF Data
  getOnboardTableVnfData(paramsObj): Observable<HttpResponse<onboardDataVNF>> {
    let params = new HttpParams({ fromObject: paramsObj });
    return this.http.get<any>(this.url.onboardDataVNF, { observe: 'response', params });
  }
 // onboard VNF sdc Data
  getSDC_VNFTableData(){
    return this.http.get<any>(this.url["sdc_vnfListData"]);
  }

  // PNF Data
  getOnboardTablePnfData(paramsObj): Observable<HttpResponse<onboardDataPNF>> {
    let params = new HttpParams({ fromObject: paramsObj });
    return this.http.get<any>(this.url.onboardDataPNF, { observe: 'response', params });
  }
//-------------------------------------------------------------------------------------

  //创建--上传前拖拽文件后，获取到id  //线上接口 post
  // getCreatensData(url_upId,requestBody) {
  //   return this.http.post<any>(this.url.creatensData.replace("_jsonData",url_upId),requestBody);  //线上
  // }

   //创建--上传前拖拽文件后，获取到id //本地json get
   getCreatensData(url_upId) {
    return this.http.get<any>(this.url.creatensData.replace("_jsonData",url_upId)); 
  }

  //------------------------------------------------------------------------------
  //onboard sdc ns 
  getNsonboard(requestBody) {
    return this.http.post<any>(this.url["onboardNs"], requestBody);
  }
  //onboard sdc vnf
  getVnfonboard(requestBody) {
    return this.http.post<any>(this.url["onboardVNF"], requestBody);
  }

  //--------------------------------------------------------------------------
  // Delete ns vfc package
  deleteNsIdData(paramsObj): Observable<HttpResponse<any>> {
    let params = new HttpParams({ fromObject: paramsObj });
    console.log(11111,params)
    return this.http.get<any>(this.url.deleteNspack, { observe: 'response', params });
    // return this.http.delete<any>(this.url["deleteNspack"], { observe: 'response', params });
  }

  // Delete Vnf vfc package
  deleteVnfIdData(paramsObj): Observable<HttpResponse<any>> {
    let params = new HttpParams({ fromObject: paramsObj });
    console.log(11111,params)
    return this.http.get<any>(this.url.deleteVnfPack, { observe: 'response', params });
    // return this.http.delete<any>(this.url["deleteNspack"], { observe: 'response', params });
  }

  // Delete Pnf package
  deletePnfIdData(paramsObj): Observable<HttpResponse<any>> {
    let params = new HttpParams({ fromObject: paramsObj });
    console.log(11111,params)
    return this.http.get<any>(this.url.deletePnfPack, { observe: 'response', params });
    // return this.http.delete<any>(this.url["deleteNspack"], { observe: 'response', params });
  }
//------------------------------------------------------------------------------
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
//---------------------------------Function-end-------------------------------------------  

}
