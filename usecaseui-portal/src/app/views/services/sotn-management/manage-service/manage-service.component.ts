import { Component, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { baseUrl } from '../../../../datainterface';
@Component({
  selector: 'app-manage-service',
  templateUrl: './manage-service.component.html',
  styleUrls: ['./manage-service.component.less']
})
export class ManageServiceComponent implements OnInit {

  selectedSubscriptionType: string = "";
  serviceSubscriptionList = [] as Array<any>;
  selectedServiceInstance: string = "" ;
  serviceInstanceList = [] as Array<any>;

  expandDataSet = [
    { rowIdx: 1, name: 'i18nTextDefine_serviceInformation', expand: true },
    { rowIdx: 2, name: 'i18nTextDefine_vpnInformation', expand: true },
    { rowIdx: 3, name: 'i18nTextDefine_uniInformation', expand: true }
  ];

  summaryInfo:object = {};
  serviceList:object = {};
  vpnInfo = [];
  uniInfo = [];
  mapped: any;
  myKeys = [] as Array<any>;
  baseUrl = baseUrl.baseUrl
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getSubscribeTypes();
  }

   //Get SubscriptionType
   getSubscribeTypes() {
     let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    let url = this.baseUrl + "/uui-lcm/customers/service-subscriptions";
    this.http.get<any>(url, httpOptions).subscribe((data) => {
      this.serviceSubscriptionList = data.subscriptions;
    }, (err) => {
      console.log(err);
    });
  }

  //Get subscription instanceID by calling With Subscription Type
  getServiceInstanceList(subscriptionType) {
     let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    this.serviceInstanceList = [];
    this.selectedServiceInstance="";
    let url = this.baseUrl + "/uui-lcm/Sotnservices/ServiceInstances/"+subscriptionType;
    this.http.get<any>(url,httpOptions).subscribe((data) => {
      this.serviceInstanceList = data.serviceInstanceList; 
    }, (err) => {
      console.log(err);
    });    
  }

  deleteSelectedService() {
    let url = this.baseUrl + "/uui-lcm/Sotnservices/servicesubscription/"+this.selectedSubscriptionType+'/serviceinstance/'+this.selectedServiceInstance;
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    this.http.delete<any>(url,httpOptions).subscribe((data) => {
      this.serviceInstanceList = [];
      this.selectedServiceInstance = "";
      this.getServiceInstanceList(this.selectedSubscriptionType);
    }, (err) => {
      console.log(err);
    });
  }


  
  getSubscribedSites() {  
    console.log("on change");
     let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    if (this.selectedServiceInstance) {
      let url = this.baseUrl + "/uui-lcm/Sotnservices/servicesubscription/"+this.selectedSubscriptionType+'/serviceinstance/'+this.selectedServiceInstance;
      this.http.get<any>(url, httpOptions).subscribe((data) => {
        this.assignData(data, false);
      }, (err) => {
        console.log(err);
      });
    }
    else {
      const httpOptions = {
        headers: new HttpHeaders({
         'Content-Type': 'application/json',
        })
      };
      let body = JSON.stringify({}); //this.orderServiceData

      let url = this.baseUrl + "/uui-lcm/Sotnservices/cost";
    return this.http.post<any>(url,body,httpOptions).subscribe((data) => {
        this.assignData(data, true);
      }, (err) => {
        console.log(err);
      });
    }
  }

  assignData(data,isCost) {
    this.summaryInfo = data.service;
    this.mapped = JSON.parse(JSON.stringify(this.summaryInfo));
    delete this.mapped.vpninformations;
    delete this.mapped.vpnInformations;
    this.myKeys = Object.keys(this.mapped);
    this.vpnInfo = this.summaryInfo["parameters"]["requestInputs"]["sotnUnderlay"][0].l2vpn[0];
    this.uniInfo = this.summaryInfo["parameters"]["requestInputs"]["sotnUnderlay"][0].sotnUni;
  }
}
