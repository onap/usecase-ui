import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/materialize';
import 'rxjs/add/operator/dematerialize';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() { }
    loopcnt: any = 0;
    bodyData = [];
    statusCnt:any =10;

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // array in local storage for registered users
        let sites: any[] = JSON.parse(localStorage.getItem('sites')) || [];

        // wrap in delayed observable to simulate server api call
        return Observable.of(null).mergeMap(() => {

            // create site
            if (request.url.endsWith('order/newSiteData') && request.method === 'POST') {
                // get new user object from post body
                let newSite = request.body;
                sites.push(newSite);
                localStorage.setItem('sites', JSON.stringify(sites));
                console.log(sites);
              
                // respond 200 OK
                return Observable.of(new HttpResponse({ status: 200 }));
            }
            // get data manage service data
            if (request.url.endsWith('/uui-lcm/Sotnservices/servicesubscription/SOTN/serviceinstance/ISAAC-IS02') || request.url.endsWith('/uui-lcm/Sotnservices/servicesubscription/SOTN/serviceinstance/ISAAC-IS03') && request.method === 'GET') {
                let body = {
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
                                "l2vpn":[
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
                    
                    };
                return Observable.of(new HttpResponse({ status: 200, body: body }));

            }
            // get monotor service data
            if (request.url.endsWith('/uui-lcm/Sotnservices/resourceTopology/service/service-subscriptions/service-subscription/sotn/service-instances/service-instance/ISAAC-IS02') || request.url.endsWith('/uui-lcm/Sotnservices/resourceTopology/service/service-subscriptions/service-subscription/sotn/service-instances/service-instance/ISAAC-IS03') && request.method === 'GET') {
                let body = {
                    "nodes": [
                      {
                        "id": "1",
                        "shape": "circularImage",
                        "image": "./assets/images/tpoint.png",
                        "label": "Termination Point",
                        "color": "Green",
                        "dataNode": {}
                      },
                      {
                        "id": "2",
                        "shape": "circularImage",
                        "image": "./assets/images/edge.png",
                        "label": "Node",
                        "color": "Green",
                        "dataNode": {
                          "ethtSvcName": "sotn-021-VS-monitored",
                          "colorAware": "true",
                          "cbs": "100",
                          "couplingFlag": "true",
                          "ebs": "evpl",
                          "cir": "200000",
                          "eir": "0"
                        }
                      },
                      {
                        "id": "3",
                        "shape": "circularImage",
                        "image": "./assets/images/logicallink.png",
                        "label": "Logical Link",
                        "color": "Green",
                        "dataNode": {
                          "ethtSvcName": "sotn-021-VS-monitored",
                          "colorAware": "true",
                          "cbs": "100",
                          "couplingFlag": "true",
                          "ebs": "evpl",
                          "cir": "200000",
                          "eir": "0"
                        }
                      },
                      {
                        "id": "4",
                        "shape": "circularImage",
                        "image": "./assets/images/edge.png",
                        "label": "Node",
                        "color": "Green",
                        "dataNode": {
                          "zipcode": "100095",
                          "siteName": "hubtravel",
                          "description": "desc",
                          "location": "laptop-5",
                          "cvlan": "100"
                        }
                      },
                      {
                        "id": "5",
                        "shape": "circularImage",
                        "image": "./assets/images/tpoint.png",
                        "label": "Termination Point",
                        "color": "Green",
                        "dataNode": {
                          "accessltpid": "155",
                          "siteName": "hubtravel",
                          "description": "desc",
                          "accessnodeid": "10.10.10.10",
                          "cvlan": "100"
                        }
                      }
                    ],
                    "edges": [
                      {
                        "from": "1",
                        "to": "2"
                      },
                      {
                        "from": "2",
                        "to": "3"
                      },
                      {
                        "from": "3",
                        "to": "4"
                      },
                      {
                        "from": "4",
                        "to": "5"
                      }
                    ]
                  };

                return Observable.of(new HttpResponse({ status: 200, body: body }));

            }
         
            if (request.url.endsWith('/uui-lcm/customers/service-subscriptions') && request.method === 'GET') {
                let body = {
                    "subscriptions": [
                      {
                        "serviceType": "SOTN"
                      }]
                   };

                return Observable.of(new HttpResponse({ status: 200, body: body }));

            }
            if (request.url.endsWith('/uui-lcm/Sotnservices/ServiceInstances/SOTN') && request.method === 'GET') {
                let body = {
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
                };

                return Observable.of(new HttpResponse({ status: 200, body: body }));

            }
            // pass through any requests not handled above
            return next.handle(request);

        })

            // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .materialize()
            .delay(500)
            .dematerialize();
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};