import { Component, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-manage-service',
  templateUrl: './manage-service.component.html',
  styleUrls: ['./manage-service.component.less']
})
export class ManageServiceComponent implements OnInit {

  selectedSubscriptionType:string = "SOTN";
  serviceSubscriptionList:any = [{
    serviceType:"SOTN"
  }];
  selectedServiceInstance:string = "";
  serviceInstanceList:any = [
    {
      serviceInstance: "SiteService-5011",
      serviceInstancename: "SiteService-5011"
    },
    {
      serviceInstance: "ISAAC-IS0333",
      serviceInstancename: "ISAAC-IS0333"
    }
  ];
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
  baseUrl:string = '/api/usecaseui-server/v1'
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getSubscribeTypes();
  }

   //Get SubscriptionType
   getSubscribeTypes() {
    let url = this.baseUrl + "/uui-lcm/customers/service-subscriptions";
    // this.http.get<any>(url, {}).subscribe((data) => {
    //   this.serviceSubscriptionList = data.subscriptions;
    //   this.selectedSubscriptionType = this.serviceSubscriptionList[0].serviceType;
    //   this.getServiceInstanceList(this.selectedSubscriptionType);
    // }, (err) => {
    //   console.log(err);
    // });
    let data = {
      "subscriptions": [
        {
          "serviceType": "SOTN",
        }]
     }
     this.serviceSubscriptionList = data.subscriptions;
     this.selectedSubscriptionType = this.serviceSubscriptionList[0].serviceType;
     this.getServiceInstanceList(this.selectedSubscriptionType);
  }

  //Get subscription instanceID by calling With Subscription Type
  getServiceInstanceList(subscriptionType) {
    this.serviceInstanceList = [];
    this.selectedServiceInstance="";
    let url = this.baseUrl + "/uui-lcm/Sotnservices/ServiceInstances/"+subscriptionType;
    // this.http.get<any>(url,{}).subscribe((data) => {
    //   this.serviceInstanceList = data.serviceInstanceList; 
    //   this.selectedServiceInstance = data.serviceInstanceList[0].serviceInstance;
    //   this.getSubscribedSites(data.serviceInstanceList[0]);
    // }, (err) => {
    //   console.log(err);
    // });    
    let data = {
        "serviceInstanceList": [
            {
                "serviceInstance": "ISAAC-IS02",
                "serviceInstancename":"SiteService-5011"
            },
            {
                "serviceInstance": "ISAAC-IS03",
                "serviceInstancename":"ISAAC-IS0333"
            }
        ]
    }
    this.serviceInstanceList = data.serviceInstanceList;
    this.selectedServiceInstance = data.serviceInstanceList[0].serviceInstance;
    this.getSubscribedSites(data.serviceInstanceList[0]);
    var datas = {
      "service":{
        "name":"CCVPNServiceV2-36",
        "description":"CCVPNServiceV2",
        "serviceInvariantUuid":"57c8a933-1364-4f85-b7a9-666d80ecc5b6",
        "serviceUuid":"0734e398-a427-49f2-9abe-de8eb02542ad",
        "globalSubscriberId": "{{customer}}",
        "serviceType": "{{service-subscription}}",
        "parameters":{
          "locationConstraints":[],
          "resources":[],
          "requestInputs":{                
            "sotnUnderlay":[
              {
                l2vpn:[
                  {
                    "l2vpn_COS": "123",         
                    "l2vpn_dualLink": "Yes",
                    "l2vpn_description": "VPN Description",                 
                    "l2vpn_name": "VPN2",
                    "l2vpn_tenantId": "989933",                  
                    "l2vpn_vpnType": "SOTN",         
                    "l2vpn_cbs": "123",                 
                    "l2vpn_ebs": "23",         
                    "l2vpn_colorAware": "true",         
                    "l2vpn_reroute": "Yes",        
                    "l2vpn_couplingFlag": "true",                 
                    "l2vpn_cir": "100",
                    "l2vpn_startTime": "28-02-2020",
                    "l2vpn_endTime": "21-02-2020",         
                    "l2vpn_eir": "1000",         
                    "l2vpn_SLS": "1234"
                  }
                ],
                "sotnUni":[
                  {
                    "sotnuni_cVLAN": "Huawei",						
                    "sotnuni_tpId": "Huawei-112233"
                  },
                  {
                    "sotnuni_cVLAN": "Huawei-1",						
                    "sotnuni_tpId": "Huawei1-554433"
                  }
                ]					  						                 
              }
            ]
          }
        }
      }
    }
    this.assignData(datas, false);
  }

  getSubscribedSites(selectedServiceInstance) {}

  deleteSelectedService()
  {

    let url = this.baseUrl + "/uui-lcm/Sotnservices/servicesubscription/"+this.selectedSubscriptionType+'/serviceinstance/'+this.selectedServiceInstance;
    
    // this.http.delete<any>(url,{}).subscribe((data) => {
    //   this.serviceInstanceList = [];
    //   this.selectedServiceInstance = "";
    //   this.getServiceInstanceList(this.selectedSubscriptionType);
    // }, (err) => {
    //   console.log(err);
    // });
  }


  ngOnChanges(changes: SimpleChanges) {  
    console.log("on change");
    if (this.selectedServiceInstance) {
      // let url = this.baseUrl + "/uui-lcm/Sotnservices/servicesubscription/"+this.selectedSubscriptionType+'/serviceinstance/'+this.selectedServiceInstance;
      // this.http.get<any>(url, {}).subscribe((data) => {
      //   this.assignData(data, false);
      // }, (err) => {
      //   console.log(err);
      // });
      var datas = {
        "service":{
          "name":"CCVPNServiceV2-36",
          "description":"CCVPNServiceV2",
          "serviceInvariantUuid":"57c8a933-1364-4f85-b7a9-666d80ecc5b6",
          "serviceUuid":"0734e398-a427-49f2-9abe-de8eb02542ad",
          "globalSubscriberId": "{{customer}}",
          "serviceType": "{{service-subscription}}",
          "parameters":{
            "locationConstraints":[],
            "resources":[],
            "requestInputs":{                
              "sotnUnderlay":[
                {
                  l2vpn:[
                    {
                      "l2vpn_COS": "123",         
                      "l2vpn_dualLink": "Yes",
                      "l2vpn_description": "VPN Description",                 
                      "l2vpn_name": "VPN2",
                      "l2vpn_tenantId": "989933",                  
                      "l2vpn_vpnType": "SOTN",         
                      "l2vpn_cbs": "123",                 
                      "l2vpn_ebs": "23",         
                      "l2vpn_colorAware": "true",         
                      "l2vpn_reroute": "Yes",        
                      "l2vpn_couplingFlag": "true",                 
                      "l2vpn_cir": "100",
                      "l2vpn_startTime": "28-02-2020",
                      "l2vpn_endTime": "21-02-2020",         
                      "l2vpn_eir": "1000",         
                      "l2vpn_SLS": "1234"
                    }
                  ],
                  "sotnUni":[
                    {
                      "sotnuni_cVLAN": "Huawei",						
                      "sotnuni_tpId": "Huawei-112233"
                    },
                    {
                      "sotnuni_cVLAN": "Huawei-1",						
                      "sotnuni_tpId": "Huawei1-554433"
                    }
                  ]					  						                 
                }
              ]
            }
          }
        }
      }
      this.assignData(datas, false);
    }
    else {
    //   const httpOptions = {
    //     headers: new HttpHeaders({
    //      'Content-Type': 'application/json',
    //     })
    //   };
    //   let body = JSON.stringify({}); //this.orderServiceData
    //   let url = this.baseUrl + "/uui-lcm/Sotnservices/cost";
    // return this.http.post<any>(url,body,httpOptions).subscribe((data) => {
    //     this.assignData(data, true);
    //   }, (err) => {
    //     console.log(err);
    //   });
    }
  }

  assignData(data,isCost) {
    this.summaryInfo = data.service;
    this.mapped = JSON.parse(JSON.stringify(this.summaryInfo));
    // delete this.mapped.vpninformations;
    // delete this.mapped.vpnInformations;
    // if(isCost)
    // {
    //   delete this.mapped.cost;
    //   this.expandDataSet[0].cost = this.summaryInfo["cost"]["serviceCost"];
    //   this.expandDataSet[1].cost = this.summaryInfo["cost"]["vpnCost"];
    // }  
    this.myKeys = Object.keys(this.mapped);
    this.vpnInfo = this.summaryInfo["parameters"]["requestInputs"]["sotnUnderlay"][0].l2vpn[0];
    this.uniInfo = this.summaryInfo["parameters"]["requestInputs"]["sotnUnderlay"][0].sotnUni;
  }
}
