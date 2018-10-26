import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { homeData, homeVmLineData, servicesSelectData, servicesTableData, onboardTableData} from './dataInterface';



@Injectable()
export class MyhttpService {

  constructor(private http: HttpClient) { }
  
  // baseUrl = "./assets/json";
  // url={
  //   allhome:this.baseUrl + "/homeAllData.json",
  //   homeLineData:this.baseUrl + "/homePerformanceChartData.json",
  //   serviceSelectList:this.baseUrl + "/servicesList.json",   //customer、serviceType
  //   servicesTableData:this.baseUrl + "/servicesTableData.json",
  //   onboardTableData:this.baseUrl + "/onboardTableData.json",

  //   customers:this.baseUrl + "/customers.json?",
  //   serviceType:this.baseUrl + "/serviceTypes.json?*_*",
  //   servicesCategory:this.baseUrl + "/configuration_files/servicesCategory.json?",
  //   serviceInstanceList:this.baseUrl + "/instanceTableData4.json?",
  //   serviceTemplates:this.baseUrl + "/serviceTemplates2.json?",
  //   templateCategory:this.baseUrl + "/configuration_files/templateCategory.json?",
  //   templateParameters:this.baseUrl + "/*_*" + "ServiceTemplateParameters.json?",
  //   addressData: this.baseUrl + "/siteAddressData.json?",
  //   createService:this.baseUrl + "/createService.json?",
  //   inputNamesTransform: this.baseUrl + "/configuration_files/inputNamesTranslate.json?",
  //   deleteService: this.baseUrl + "/deleteService.json?",
  //   progress:this.baseUrl + "/progress.json?",

  //   allottedResource:this.baseUrl + "/allotted-resources2.json?",
  //   pnfDetail:this.baseUrl + "/pnfdetail-domain.json?",
  //   connectivity:this.baseUrl + "/sotn-connectivity2.json?",
  //   vpnBinding:this.baseUrl + "/vpnbinding.json?",
  //   alarmFormData:this.baseUrl + "/alarmFormData.json?",
  //   alarmFormDetailData:this.baseUrl + "/alarmFormDetailData.json?"
  // }

  // baseUrl = 'http://172.19.44.223/api/usecaseui-server/v1';
  baseUrl = '/api/usecaseui-server/v1';
  url={
    allhome:this.baseUrl + "/alarm/getAlarmDataByStatus/0",
    homeLineData:this.baseUrl + "/...........",
    serviceSelectList:this.baseUrl + "/xxxxxxxxxxxxx",
    servicesTableData:this.baseUrl + "/xxxxxxxx.json",
    onboardTableData:this.baseUrl + "/xxxxxxx.json",


    customers:this.baseUrl + "/uui-lcm/customers",
    serviceType:this.baseUrl + "/uui-lcm/customers/" + "*_*" + "/service-subscriptions",
    servicesCategory: "./assets/json/configuration_files/servicesCategory.json",
    serviceInstanceList:this.baseUrl + '/uui-sotn/getServiceInstanceList',
    serviceTemplates:this.baseUrl + "/uui-lcm/service-templates",
    templateCategory: "./assets/json/configuration_files/templateCategory.json",
    templateParameters:this.baseUrl + "/uui-lcm/service-templates/" + "*_*" +"?toscaModelPath=",
    addressData: this.baseUrl + "/uui-sotn/getOssInvenory",
    createService:this.baseUrl + "/uui-lcm/services",
    inputNamesTransform: "./assets/json/configuration_files/inputNamesTranslate.json?",
    deleteService: this.baseUrl + "/uui-lcm/services/",
    progress:this.baseUrl + "/uui-lcm/services/" + "*_*" + "/operations/",

    allottedResource:this.baseUrl + "/uui-sotn/getAllottedResources",
    pnfDetail:this.baseUrl + "/uui-sotn/getPnfInfo/",
    connectivity:this.baseUrl + "/uui-sotn/getConnectivityInfo/",
    vpnBinding:this.baseUrl + "/uui-sotn/getPinterfaceByVpnId/",
    alarmFormData:this.baseUrl + "/alarm/{currentPage}/{pageSize}/{sourceName}/{priority}/{startTime}/{endTime}/{vfStatus}",
    alarmFormDetailData:this.baseUrl + "/alarm/getAlarmsHeaderDetail/{id}",
    alarmsourcename:'/alarm/getSourceNames/'
  }

  // home
  getAllHomeData() {
    return this.http.get<homeData>(this.url.allhome);
  }
  //home lin
  getHomePerformanceChartData(paramsObj){
    let params = new HttpParams({fromObject:paramsObj});
    return this.http.get<homeVmLineData>(this.url.homeLineData,{params});
  }

  // servicesList data
  // getServicesSelectData():Observable<HttpResponse<servicesSelectData>>{
  //   return this.http.get<servicesSelectData>(this.url.serviceSelectList,{observe:'response'});
  // }
  getServicesTableData(paramsObj):Observable<HttpResponse<servicesTableData>>{
    let params = new HttpParams({fromObject:paramsObj});
    return this.http.get<servicesTableData>(this.url.servicesTableData,{observe:'response',params});
  }

  // onboard data
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

  // Get all customers
  getAllCustomers(){
    return this.http.get<any>(this.url.customers);
    // return this.http.jsonp<Object[]>('http://127.0.0.1:5500/customers.json',"callback");// 
  }

  // Get relevant serviceType
  getServiceTypes(customer){
    let url = this.url.serviceType.replace("*_*",customer.id);
    return this.http.get<any>(url);
  }
  // Get service classification information, local configuration file
  getServicesCategory(){
    return this.http.get<any>(this.url.servicesCategory);
  }
  // list Tabular data
  getInstanceTableData(paramsObj){
    let params = new HttpParams({fromObject:paramsObj});
    return this.http.get<any>(this.url.serviceInstanceList,{params});
  }

  // // Service details data
  // getInstanceDetails(id){
  //   let url = this.baseUrl + "/detailsData.json?id=" + id;
  //   return this.http.get<instanceDetail>(url);
  // }

  // Get all template types
  getAllServiceTemplates(){
    return this.http.get<any>(this.url.serviceTemplates);
  }

  // Get template classification information, local configuration file
  getTemplateCategory(){
    return this.http.get<any>(this.url.servicesCategory);
  }
  //Get template input parameters
  getTemplateParameters(type,template){
    let url = this.url.templateParameters.replace("*_*",type) + template.toscaModelURL;  //本地模拟
    // let url = this.url.templateParameters.replace("*_*",template.uuid) + template.toscaModelURL;
    return this.http.get<any>(url);
  }
  // siteAddress address
  getSiteAddress(){
    return this.http.get<any>(this.url.addressData);
  }

  // Create interface
  createInstance(requestBody){
    return this.http.get<any>(this.url.createService);  //本地模拟
    // return this.http.post<any>(this.url.createService,requestBody);
  }

  // Input parameter name conversion
  inputNamesTransform(){
    return this.http.get(this.url.inputNamesTransform);
  }

  // Delete interface
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
    return this.http.get<any>(this.url.deleteService);  //Local simulation
    // return this.http.delete<any>(this.url.deleteService + obj.serviceInstanceId, httpOptions);
  }

  // Query progress interface
  getProgress(obj){
    let url = this.url.progress.replace("*_*",obj.serviceId) + obj.operationId;
    return this.http.get<any>(url);
  }

  // Get allotted-resource to get tp and pnf values
  getAllottedResource(obj){
    let params = new HttpParams({fromObject:obj});
    let url = this.url.allottedResource;
    return this.http.get<any>(url,{params});
  }
  //Get the corresponding domain (network-resource) by pnf value
  getPnfDetail(name){
    let url = this.url.pnfDetail + name;
    return this.http.get<any>(url);
  }
  //Get connectivity by sotn, find vpn-id
  getSotnConnectivity(id){
    let url = this.url.connectivity + id;
    return this.http.get<any>(url);
  }
  //Find tp and pnf by vpn-id
  getVpnBinding(id){
    let url = this.url.vpnBinding + id;
    return this.http.get<any>(url);
  }
  // Time formatting milliseconds to normal
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

  // Alarm table data
  getAlarmFormData(pageNumber:number,pageSaze:number,name?:string,Priority?:string,Status?:string,Report?:string){
    return this.http.post<any>(this.url.alarmFormData,{
      pageNumber:pageNumber,
      pageSaze:pageSaze,
      name:name,
      Priority:Priority,
      Status:Status,
      Report:Report 
    });
  }

  getSourceNames(){
    return this.http.get<any>('/alarm/getSourceNames/');
  }  
  // getAlarmFormData(pageNumber:number,pageSaze:number,name?:string,Priority?:string,Status?:string,Report?:string){
  //   return this.http.get<any>(this.url.alarmFormData+'?pageNumber='+pageNumber+'?pageSaze'+pageSaze+'?name'+name+'?Priority'+Priority+'?Status'+Status+'?Report'+Report);
  // }

  // Alarm Detail page data
  getAlarmDetailData(id){
    let httpurl = this.baseUrl + "/alarmFormDetailData.json?id/" +id;
    console.log(httpurl)
    return this.http.get<any>(httpurl);
  }
}
