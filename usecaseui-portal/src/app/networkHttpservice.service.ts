import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';


@Injectable()
export class networkHttpservice {

  constructor(private http:HttpClient) { }

  // baseUrl = "./assets/json/";//本地环境
  // url={
  //   "getNetworkD3Data":this.baseUrl + "netWorkD3Data.json",
  //   "getLogicalLinksData":this.baseUrl + "LogicalLinksData.json",
  //   "getPInterfacesData1":this.baseUrl + "netWorkD3Data.json",
  //   "getPInterfacesData2":this.baseUrl + "p_interfaces1.json",
  //   "createLink":this.baseUrl + "status.json",
  //   "querySpecificLinkInfo":this.baseUrl + "specific_link _nfo.json",
  //   "queryCloudUrl":this.baseUrl + "url.json",
  //   "createNetwrok":this.baseUrl + "status.json",
  //   "createPnf":this.baseUrl + "status.json",
  //   "createTp":this.baseUrl + "status.json",
  //   "createCloudLink":this.baseUrl + "status.json",
  //   "createCloudUrl":this.baseUrl + "status.json",
  //   "deleteLink":this.baseUrl + "status.json",
  // };
  // baseUrl = "http://10.73.242.244:8082/uui-sotn/";//线上环境
  // baseUrl = "http://172.19.44.223/api/usecaseui-server/v1/uui-sotn/";//线上环境
  baseUrl = "/api/usecaseui-server/v1/uui-sotn/";//线上环境
  url={
    "getNetworkD3Data":this.baseUrl + "getNetWorkResources",
    "getLogicalLinksData":this.baseUrl + "getLogicalLinks",
    "getPInterfacesData1":this.baseUrl + "getPinterfaceByPnfName/",
    "getPInterfacesData2":this.baseUrl + "getPinterfaceByPnfName/",
    "createLink":this.baseUrl + "createLink/",
    "querySpecificLinkInfo":this.baseUrl + "getSpecificLogicalLink/",
    "queryCloudUrl":this.baseUrl + "getHostUrl/",
    "createNetwrok":this.baseUrl + "createTopoNetwork/",
    "createPnf":this.baseUrl + "createPnf/",
    "createTp":this.baseUrl + "pnf/",
    "createCloudLink":this.baseUrl + "createLink/",
    "createCloudUrl":this.baseUrl + "createHostUrl/",
    "deleteLink":this.baseUrl + "deleteLink/",
  };
  //d3数据
  getNetworkD3Data(){
    return this.http.get<any>(this.url["getNetworkD3Data"]);
  }
  //初始化连线 logical-links
  getLogicalLinksData(){
    return this.http.get<any>(this.url["getLogicalLinksData"]);
  }
  //查询指定的node对应的tp数据
  getPInterfacesData1(paramsObj){
    return this.http.get<any>(this.url['getPInterfacesData1']+paramsObj["pnfName"]);
  }
  getPInterfacesData2(paramsObj){
    return this.http.get<any>(this.url["getPInterfacesData2"]+paramsObj["pnfName"]);
  }
  //创建连线接口
  createLink(paramsObj){
    return this.http.put<any>(this.url["createLink"]+paramsObj["link-name"],paramsObj);
  }
  //查询指定的单个连接线 接口
  querySpecificLinkInfo(paramsObj){
    return this.http.get<any>(this.url["querySpecificLinkInfo"]+paramsObj["link-name"]);
  }
  //查询 外部云host this.url地址 接口
  queryCloudUrl(aaiId){
    return this.http.get<any>(this.url["queryCloudUrl"]+aaiId);
  }
  //创建外部云newwork接口
  createNetwrok(paramsObj){
    return this.http.put<any>(this.url["createNetwrok"]+paramsObj["network-resource"][0]["network-id"],paramsObj);
  }
  //创建外部云pnf接口
  createPnf(paramsObj){
    return this.http.put<any>(this.url["createPnf"]+paramsObj["pnf-name"],paramsObj);
  }
  //创建外部云Tp接口
  createTp(paramsObj,cloudNodeName){
    let str=cloudNodeName+"/p-interfaces/p-interface/"+paramsObj["interface-name"]+"/createTerminationPoint";
    return this.http.put<any>(this.url["createTp"]+str,paramsObj);
  }
  //创建外部云link接口
  createCloudLink(paramsObj){
    return this.http.put<any>(this.url["createCloudLink"]+paramsObj["link-name"],paramsObj);
  }
  //创建外部云host url接口
  createCloudUrl(paramsObj){
    return this.http.put<any>(this.url["createCloudUrl"]+paramsObj["aai-id"],paramsObj);
  }
  //删除连线
  deleteLink(paramsObj){
    let str=paramsObj["logical-link"]+"/"+paramsObj["resource-version"];
    return this.http.delete<any>((this.url["deleteLink"]+str));
  }
}
