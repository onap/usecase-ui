import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

interface tablelist {
  total:number,
  list:Object[]
}
interface d3list {
  total:number,
  list:Object[]
}

@Injectable()
export class networkHttpservice {

  constructor(private http:HttpClient) { }

  baseUrl = "./assets/json/";
  // list表格数据
  getInstanceTableData(paramsObj){
    let url = this.baseUrl + "instanceTableData.json";
    let params = new HttpParams({fromObject:paramsObj});
    return this.http.get<tablelist>(url,{params});
  }
  //d3数据
  getNetworkD3Data(){
    let url = this.baseUrl + "netWorkD3Data.json";
    // let params = new HttpParams({fromObject:paramsObj});
    return this.http.get<any>(url);
  }
  //初始化连线 logical-links
  getLogicalLinksData(){
    let url = this.baseUrl + "LogicalLinksData.json";
    // let params = new HttpParams({fromObject:paramsObj});
    return this.http.get<any>(url);
  }
  //查询指定的node对应的tp数据
  getPInterfacesData1(paramsObj){
    let url = this.baseUrl + "p_interfaces1.json";
    let params = new HttpParams({fromObject:paramsObj});
    return this.http.get<any>(url,{params});
  }
  getPInterfacesData2(paramsObj){
    let url = this.baseUrl + "p_interfaces2.json";
    let params = new HttpParams({fromObject:paramsObj});
    return this.http.get<any>(url,{params});
  }
  //创建连线接口
  createLink(paramsObj){
    let url = this.baseUrl+ "status.json";
    let params = new HttpParams({fromObject:paramsObj});
    return this.http.get<any>(url,{params});
  }
  //查询指定的单个连接线 接口
  querySpecificLinkInfo(paramsObj){
    let url = this.baseUrl+ "specific_link _nfo.json";
    let params = new HttpParams({fromObject:paramsObj});
    return this.http.get<any>(url,{params});
  }

  //查询 外部云host this.url地址 接口
  queryCloudUrl(paramsObj){
    let url = this.baseUrl+ "url.json";
    let params = new HttpParams({fromObject:paramsObj});
    return this.http.get<any>(url,{params});
  }

  //创建外部云newwork接口
  createNetwrok(paramsObj){
    let url = this.baseUrl+ "status.json";
    let params = new HttpParams({fromObject:paramsObj});
    return this.http.get<any>(url,{params});
  }
  //创建外部云pnf接口
  createPnf(paramsObj){
    let url = this.baseUrl+ "status.json";
    let params = new HttpParams({fromObject:paramsObj});
    return this.http.get<any>(url,{params});
  }
  //创建外部云Tp接口
  createTp(paramsObj,cloudNodeName){
    console.log(cloudNodeName)
    let url = this.baseUrl+ "status.json";
    let params = new HttpParams({fromObject:paramsObj});
    return this.http.get<any>(url,{params});
  }
  //创建外部云link接口
  createCloudLink(paramsObj){
    let url = this.baseUrl+ "status.json";
    let params = new HttpParams({fromObject:paramsObj});
    return this.http.get<any>(url,{params});
  }
  //删除连线
  deleteLink(paramsObj){
    let url = this.baseUrl+ "status.json";
    let params = new HttpParams({fromObject:paramsObj});
    return this.http.get<any>(url,{params});
  }
}
