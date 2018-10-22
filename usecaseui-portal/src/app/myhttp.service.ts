import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { homeData, homeVmLineData, servicesSelectData, servicesTableData, onboardTableData} from './dataInterface';



@Injectable()
export class MyhttpService {

  constructor(private http: HttpClient) { }
  
  baseUrl = "./assets/json";
  url={
    allhome:this.baseUrl + "/homeAllData.json",
    homeLineData:this.baseUrl + "/homePerformanceChartData.json",
    serviceSelectList:this.baseUrl + "/servicesList.json",   //customer、serviceType
    servicesTableData:this.baseUrl + "/servicesTableData.json",
    onboardTableData:this.baseUrl + "/onboardTableData.json",

    customers:this.baseUrl + "/customers.json?",
    serviceType:this.baseUrl + "/serviceTypes.json?*_*",
    servicesCategory:this.baseUrl + "/configuration_files/servicesCategory.json?",
    serviceInstanceList:this.baseUrl + "/instanceTableData4.json?",
    serviceTemplates:this.baseUrl + "/serviceTemplates2.json?",
    templateCategory:this.baseUrl + "/configuration_files/templateCategory.json?",
    templateParameters:this.baseUrl + "/*_*" + "ServiceTemplateParameters.json?",
    addressData: this.baseUrl + "/siteAddressData.json?",
    createService:this.baseUrl + "/createService.json?",
    inputNamesTransform: this.baseUrl + "/configuration_files/inputNamesTranslate.json?",
    deleteService: this.baseUrl + "/deleteService.json?",
    progress:this.baseUrl + "/progress.json?",

    allottedResource:this.baseUrl + "/allotted-resources2.json?",
    pnfDetail:this.baseUrl + "/pnfdetail-domain.json?",
    connectivity:this.baseUrl + "/sotn-connectivity2.json?",
    vpnBinding:this.baseUrl + "/vpnbinding.json?",
    alarmFormData:this.baseUrl + "/alarmFormData.json?"
  }

  // baseUrl = 'http://172.19.44.223/api/usecaseui-server/v1';
  // baseUrl = '/api/usecaseui-server/v1';
  // url={
  //   allhome:this.baseUrl + "/alarm/getAlarmDataByStatus/0",
  //   homeLineData:this.baseUrl + "/...........",
  //   serviceSelectList:this.baseUrl + "/xxxxxxxxxxxxx",
  //   servicesTableData:this.baseUrl + "/xxxxxxxx.json",
  //   onboardTableData:this.baseUrl + "/xxxxxxx.json",


  //   customers:this.baseUrl + "/uui-lcm/customers",
  //   serviceType:this.baseUrl + "/uui-lcm/customers/" + "*_*" + "/service-subscriptions",
  //   servicesCategory: "./assets/json/configuration_files/servicesCategory.json",
  //   serviceInstanceList:this.baseUrl + '/uui-sotn/getServiceInstanceList',
  //   serviceTemplates:this.baseUrl + "/uui-lcm/service-templates",
  //   templateCategory: "./assets/json/configuration_files/templateCategory.json",
  //   templateParameters:this.baseUrl + "/uui-lcm/service-templates/" + "*_*" +"?toscaModelPath=",
  //   addressData: this.baseUrl + "/uui-sotn/getOssInvenory",
  //   createService:this.baseUrl + "/uui-lcm/services",
  //   inputNamesTransform: "./assets/json/configuration_files/inputNamesTranslate.json?",
  //   deleteService: this.baseUrl + "/uui-lcm/services/",
  //   progress:this.baseUrl + "/uui-lcm/services/" + "*_*" + "/operations/",

  //   allottedResource:this.baseUrl + "/uui-sotn/getAllottedResources",
  //   pnfDetail:this.baseUrl + "/uui-sotn/getPnfInfo/",
  //   connectivity:this.baseUrl + "/uui-sotn/getConnectivityInfo/",
  //   vpnBinding:this.baseUrl + "/uui-sotn/getPinterfaceByVpnId/"
  // }

  // home页数据
  getAllHomeData() {
    return this.http.get<homeData>(this.url.allhome);
  }
  //home页折线图数据
  getHomePerformanceChartData(paramsObj){
    let params = new HttpParams({fromObject:paramsObj});
    return this.http.get<homeVmLineData>(this.url.homeLineData,{params});
  }

  // servicesList数据
  // getServicesSelectData():Observable<HttpResponse<servicesSelectData>>{
  //   return this.http.get<servicesSelectData>(this.url.serviceSelectList,{observe:'response'});
  // }
  getServicesTableData(paramsObj):Observable<HttpResponse<servicesTableData>>{
    let params = new HttpParams({fromObject:paramsObj});
    return this.http.get<servicesTableData>(this.url.servicesTableData,{observe:'response',params});
  }

  // onboard数据
  getOnboardTableData(paramsObj):Observable<HttpResponse<onboardTableData>>{
    let params = new HttpParams({fromObject:paramsObj});
    return this.http.get<onboardTableData>(this.url.onboardTableData,{observe:'response',params});
  }





  testObservable(){
    let myObservable = new Observable((observer)=>{
      observer.next(1);
      observer.next((n)=>{
        console.log(3+n);
      })
      setTimeout(()=>{
        observer.next(66666)
      },100)
      observer.next(()=>{
        setTimeout((n)=>{
          console.log("9999---" + n);
        },10)        
      })
      // observer.error(2);
      // observer.complete();
    });

    myObservable.subscribe((e)=>{
      if(typeof e == "function"){
        e(5)
      }
      console.log(e);
    },(err)=>{
      console.log(err);
    },()=>{
      console.log(555);
    })
  }

  //---------------------------------------------------------------------------------

  // 获取所有customers
  getAllCustomers(){
    return this.http.get<any>(this.url.customers);
    // return this.http.jsonp<Object[]>('http://127.0.0.1:5500/customers.json',"callback");// 测试用 ：请求数据需要用回调函数包裹
  }

  // 获取相应的serviceType
  getServiceTypes(customer){
    let url = this.url.serviceType.replace("*_*",customer.id);
    return this.http.get<any>(url);
  }
  // 获取服务分类信息，本地配置文件
  getServicesCategory(){
    return this.http.get<any>(this.url.servicesCategory);
  }
  // list表格数据
  getInstanceTableData(paramsObj){
    let params = new HttpParams({fromObject:paramsObj});
    return this.http.get<any>(this.url.serviceInstanceList,{params});
  }

  // // 服务详情数据 
  // getInstanceDetails(id){
  //   let url = this.baseUrl + "/detailsData.json?id=" + id;
  //   return this.http.get<instanceDetail>(url);
  // }

  // 获取所有模板类型
  getAllServiceTemplates(){
    return this.http.get<any>(this.url.serviceTemplates);
  }

  // 获取模板分类信息，本地配置文件
  getTemplateCategory(){
    return this.http.get<any>(this.url.servicesCategory);
  }
  // 获取模板输入项参数
  getTemplateParameters(type,template){
    let url = this.url.templateParameters.replace("*_*",type) + template.toscaModelURL;  //本地模拟
    // let url = this.url.templateParameters.replace("*_*",template.uuid) + template.toscaModelURL;
    return this.http.get<any>(url);
  }
  // siteAddress 地址
  getSiteAddress(){
    return this.http.get<any>(this.url.addressData);
  }

  // 创建接口
  createInstance(requestBody){
    return this.http.get<any>(this.url.createService);  //本地模拟
    // return this.http.post<any>(this.url.createService,requestBody);
  }

  // 输入参数名字转换
  inputNamesTransform(){
    return this.http.get(this.url.inputNamesTransform);
  }

  // 删除接口
  deleteInstance(obj){
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept':'application/json',
        'Authorization':'Basic SW5mcmFQb3J0YWxDbGllbnQ6cGFzc3dvcmQxJA=='
      }),
      body:{
        'globalSubscriberId': obj.globalSubscriberId,
        'serviceType': obj.serviceType
      }
    };
    return this.http.get<any>(this.url.deleteService);  //本地模拟
    // return this.http.delete<any>(this.url.deleteService + obj.serviceInstanceId, httpOptions);
  }

  // 查询进度接口
  getProgress(obj){
    let url = this.url.progress.replace("*_*",obj.serviceId) + obj.operationId;
    return this.http.get<any>(url);
  }

  // 获取allotted-resource  能获取tp和pnf值
  getAllottedResource(obj){
    let params = new HttpParams({fromObject:obj});
    let url = this.url.allottedResource;
    return this.http.get<any>(url,{params});
  }
  //通过pnf值获取对应的domain （network-resource）
  getPnfDetail(name){
    let url = this.url.pnfDetail + name;
    return this.http.get<any>(url);
  }
  //通过sotn 获取connectivity ，查找vpn-id
  getSotnConnectivity(id){
    let url = this.url.connectivity + id;
    return this.http.get<any>(url);
  }
  //通过vpn-id 查找tp和pnf
  getVpnBinding(id){
    let url = this.url.vpnBinding + id;
    return this.http.get<any>(url);
  }
  // 时间格式化 毫秒转正常值
  dateformater(vmstime){
    if(!vmstime){
        return ''
    }
    let mstime = Number((vmstime + '').slice(0,13));  
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

  // alarm表格数据
  // getAlarmFormData(pageNumber:number,pageSaze:number,name?:string,Priority?:string,Status?:string,Report?:string){
  //   return this.http.post<any>(this.url.alarmFormData,{
  //     pageNumber:pageNumber,
  //     pageSaze:pageSaze,
  //     name:name,
  //     Priority:Priority,
  //     Status:Status,
  //     Report:Report 
  //   });
  // }


  getAlarmFormData(pageNumber:number,pageSaze:number,name?:string,Priority?:string,Status?:string,Report?:string){
    return this.http.get<any>(this.url.alarmFormData+'?pageNumber='+pageNumber+'?pageSaze'+pageSaze+'?name'+name+'?Priority'+Priority+'?Status'+Status+'?Report'+Report);
  }
}
