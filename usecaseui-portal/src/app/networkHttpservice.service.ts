import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';


@Injectable()
export class networkHttpservice {

  constructor(private http:HttpClient) { }

  // baseUrl = "./assets/json/";//Local environment
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
  // baseUrl = "http://10.73.242.244:8082/uui-sotn/";//Online environment
  // baseUrl = "http://172.19.44.223/api/usecaseui-server/v1/uui-sotn/";//Online environment
  baseUrl = "/api/usecaseui-server/v1/uui-sotn/";//Online environment
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
    "deleteCloud":this.baseUrl+"deleteExtNetWork"
  };
  //d3data
  getNetworkD3Data(){
    return this.http.get<any>(this.url["getNetworkD3Data"]);
  }
  //Initialize the connection logical-links
  getLogicalLinksData(){
    return this.http.get<any>(this.url["getLogicalLinksData"]);
  }
  //Query the tp data corresponding to the specified node
  getPInterfacesData1(paramsObj){
    return this.http.get<any>(this.url['getPInterfacesData1']+paramsObj["pnfName"]);
  }
  getPInterfacesData2(paramsObj){
    return this.http.get<any>(this.url["getPInterfacesData2"]+paramsObj["pnfName"]);
  }
  //Create a connection interface
  createLink(paramsObj){
    return this.http.put<any>(this.url["createLink"]+paramsObj["link-name"],paramsObj);
  }
  //Query the specified single cable interface
  querySpecificLinkInfo(paramsObj){
    return this.http.get<any>(this.url["querySpecificLinkInfo"]+paramsObj["link-name"]);
  }
  //Query external cloud host this.url address interface
  queryCloudUrl(aaiId){
    return this.http.get<any>(this.url["queryCloudUrl"]+aaiId);
  }
  //Create an external cloud newwork interface
  createNetwrok(paramsObj){
    return this.http.put<any>(this.url["createNetwrok"]+paramsObj["network-resource"][0]["network-id"],paramsObj);
  }
  //Create an external cloud pnf interface
  createPnf(paramsObj){
    return this.http.put<any>(this.url["createPnf"]+paramsObj["pnf-name"],paramsObj);
  }
  //Create an external cloud Tp interface
  createTp(paramsObj,cloudNodeName){
    let str=cloudNodeName+"/p-interfaces/p-interface/"+paramsObj["interface-name"]+"/createTerminationPoint";
    return this.http.put<any>(this.url["createTp"]+str,paramsObj);
  }
  //Create an external cloud link interface
  createCloudLink(paramsObj){
    return this.http.put<any>(this.url["createCloudLink"]+paramsObj["link-name"],paramsObj);
  }
  //Create an external cloud host url interface
  createCloudUrl(paramsObj){
    return this.http.put<any>(this.url["createCloudUrl"]+paramsObj["aai-id"],paramsObj);
  }
  //Delete connection
  deleteLink(paramsObj){
    let str=paramsObj["logical-link"]+"/"+paramsObj["resource-version"];
    return this.http.delete<any>((this.url["deleteLink"]+str));
  }
  deleteCloudLink(paramsObj){
    let str="?extNetworkId="+paramsObj["aaiId"]+"&resourceVersion="+paramsObj["version"];
    return this.http.delete<any>((this.url["deleteCloud"]+str));
  }
}
