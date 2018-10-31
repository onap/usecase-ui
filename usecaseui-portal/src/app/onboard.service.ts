import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { onboardTableData, onboardDataVNF, onboardDataPNF } from './dataInterface';

@Injectable()
export class onboardService {

  constructor(private http: HttpClient) { }
    
//   baseUrl = "./assets/json";
//   url = {
   
//     // 数据列表
//     onboardTableData: this.baseUrl + "/onboardTableData.json",
//     onboardDataVNF: this.baseUrl + "/onboardDataVNF.json",
//     onboardDataPNF: this.baseUrl + "/onboardDataPNF.json",

//     //创建nspackages
//     creatensData: this.baseUrl + "/creatensData.json",
    
//     deleteService: this.baseUrl + "/deleteService.json?",

//     // Delete ns package
//     deleteNspack: this.baseUrl + "/deleteNspack.json",
//     // download ns package
//     downloadNsData: this.baseUrl + "/downloadData.json",
//   }

  // baseUrl = 'http://172.19.44.223/api/usecaseui-server/v1';
 
  baseUrl = '/api/usecaseui/server/v1';
  url={
    // allhome:this.baseUrl + "/alarm/getAlarmDataByStatus/0",
    // homeLineData:this.baseUrl + "/...........",
    // serviceSelectList:this.baseUrl + "/xxxxxxxxxxxxx",
    // servicesTableData:this.baseUrl + "/xxxxxxxx.json",
    // onboardTableData:this.baseUrl + "/xxxxxxx.json",
    
    // 数据列表
    onboardTableData: this.baseUrl + "/uui-lcm/ns-packages",
    onboardDataVNF: this.baseUrl + "/uui-lcm/vnf-packages",
    onboardDataPNF: this.baseUrl + "/uui-lcm/pnf-packages",

    //创建nspackages
    // creatensData: this.baseUrl + "/creatensData.json",
    
    // deleteService: this.baseUrl + "/deleteService.json?",

    // Delete ns package
    deleteNspack: this.baseUrl + "/uui-lcm/deleteNsdPackage",
    // download ns package
    downloadNsData: this.baseUrl + "/downloadData.json/uui-lcm/downLoadNsPackage",
  }

//   创建ns数据
//   getCreatensData(paramsObj):Observable<HttpResponse<creatensData>>{
//     let params = new HttpParams({fromObject:paramsObj});
//     return this.http.get<creatensData>(this.url.creatensData,{observe:'response',params});
//     // return this.http.post<any>(this.url.createService,requestBody);
//   }

//   getCreatensData() {
//     return this.http.get(this.url.creatensData);
//   }
  // onboard NS Data
  getOnboardTableData(paramsObj): Observable<HttpResponse<onboardTableData>> {
    // let params = new HttpParams({ fromObject: paramsObj });
    // return this.http.get<onboardTableData>(this.url.onboardTableData, { observe: 'response', params });
    return this.http.get<any>(this.url["onboardTableData"]);
  }
  // Ns Id 
  getNsIdData(paramsObj): Observable<HttpResponse<onboardDataVNF>> {
    // let params = new HttpParams({ fromObject: paramsObj });
    // return this.http.get<onboardDataVNF>(this.url.onboardDataVNF, { observe: 'response', params });
    return this.http.post<any>(this.url["onboardDataVNF"],{});
  }

  // Delete ns package
  deleteNsIdData(paramsObj): Observable<HttpResponse<any>> {
    let params = new HttpParams({ fromObject: paramsObj });
    // return this.http.get<any>(this.url.deleteNspack, { observe: 'response', params });
    return this.http.delete<any>(this.url["deleteNspack"], { observe: 'response', params });
  }
  // download  
  downloadNsData(paramsObj): Observable<HttpResponse<any>> {
    console.log(66,paramsObj)
    let params = new HttpParams({ fromObject: paramsObj });
    return this.http.get<any>(this.url.downloadNsData, { observe: 'response', params });
  }
  // onboard VNF Data
  getOnboardTableVnfData(paramsObj): Observable<HttpResponse<onboardDataVNF>> {
    // let params = new HttpParams({ fromObject: paramsObj });
    return this.http.post<any>(this.url.onboardDataVNF, paramsObj);
  }

  // onboard PNF Data
  getOnboardTablePnfData(paramsObj): Observable<HttpResponse<onboardDataPNF>> {
    let params = new HttpParams({ fromObject: paramsObj });
    return this.http.post<any>(this.url.onboardDataPNF, paramsObj);
  }
  testObservable() {
    let myObservable = new Observable((observer) => {
      observer.next(1);
      observer.next((n) => {
        console.log(3 + n);
      })
      setTimeout(() => {
        observer.next(66666)
      }, 100)
      observer.next(() => {
        setTimeout((n) => {
          console.log("9999---" + n);
        }, 10)
      })
      // observer.error(2);
      // observer.complete();
    });

    myObservable.subscribe((e) => {
      if (typeof e == "function") {
        e(5)
      }
      console.log(e);
    }, (err) => {
      console.log(err);
    }, () => {
      console.log(555);
    })
  }

  //---------------------------------------------------------------------------------

  // // 服务详情数据 
  // getInstanceDetails(id){
  //   let url = this.baseUrl + "/detailsData.json?id=" + id;
  //   return this.http.get<instanceDetail>(url);
  // }

  // 删除接口
//   deleteInstance(obj) {
//     let httpOptions = {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//         'Authorization': 'Basic SW5mcmFQb3J0YWxDbGllbnQ6cGFzc3dvcmQxJA=='
//       }),
//       body: {
//         'globalSubscriberId': obj.globalSubscriberId,
//         'serviceType': obj.serviceType
//       }
//     };
//     return this.http.get<any>(this.url.deleteService);  //本地模拟
//     // return this.http.delete<any>(this.url.deleteService + obj.serviceInstanceId, httpOptions);
//   }

  // 时间格式化 毫秒转正常值
  dateformater(vmstime) {
    if (!vmstime) {
      return ''
    }
    let mstime = Number((vmstime + '').slice(0, 13));
    let time = new Date(mstime);
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let day = time.getDate();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    let formattime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    return formattime;
  }
}
