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
            if (request.url.endsWith('/uui-lcm/Sotnservices/resourceTopology/service/service-subscriptions/service-subscription/sotn/service-instances/service-instance/ISAAC-IS02/vpn-informations/vpn-information/vpn-bind-1') && request.method === 'GET') {
              let body =  {
                "nodes":[
                   {
                      "id":"vpn-bind-1",
                      "shape":"circularImage",
                      "image":"./assets/images/vpnbinding.png",
                      "label":"VPN Binding",
                      "color":"Green",
                      "dataNode":{
                         "vpn-name":"sotn-l2-vpn",
                         "vpn-type":"l2-eth"
                      }
                   },
                   {
                      "id":"p-interface-81",
                      "shape":"circularImage",
                      "image":"./assets/images/tpoint.png",
                      "label":"Termination Point",
                      "color":"Green",
                      "dataNode":{
                         "interface-name":"p-interface-8",
                         "speed-value":"example-speed-value-val-33014",
                         "speed-units":"example-speed-units-val-75695",
                         "port-description":"p-interafce-desc"
                      }
                   },
                   {
                      "id":"p-interface-8",
                      "shape":"circularImage",
                      "image":"./assets/images/tpoint.png",
                      "label":"Termination Point",
                      "color":"Green",
                      "dataNode":{
                         "interface-name":"p-interface-8",
                         "speed-value":"example-speed-value-val-33014",
                         "speed-units":"example-speed-units-val-75695",
                         "port-description":"p-interafce-desc"
                      }
                   }
                ],
                "edges":[
                   {
                      "from":"null",
                      "to":"vpn-bind-1"
                   },
                   {
                      "from":"vpn-bind-1",
                      "to":"p-interface-81"
                   },
                   {
                      "from":"",
                      "to":"p-interface-81"
                   },
                   {
                      "from":"vpn-bind-1",
                      "to":"p-interface-8"
                   },
                   {
                      "from":"",
                      "to":"p-interface-8"
                   }
                ]
             };

              return Observable.of(new HttpResponse({ status: 200, body: body }));

          }

          // resource topo

          if  (request.url.endsWith('/uui-lcm/Sotnservices/serviceTopology/service/service-subscriptions/service-subscription/sotn/service-instances/service-instance/ISAAC-IS02')&& request.method === 'GET') {
            let body =  {
              "nodes":[
                 {
                    "id":"NNI-001",
                    "shape":"circularImage",
                    "image":"./assets/images/service.png",
                    "label":"Service",
                    "color":"Green",
                    "dataNode":null
                 },
                 {
                    "id":"vnf-instance",
                    "shape":"circularImage",
                    "image":"./assets/images/VNF.png",
                    "label":"Vnf",
                    "color":"Green",
                    "dataNode":null
                 },
                 {
                    "id":"eth-conn-1",
                    "shape":"circularImage",
                    "image":"./assets/images/connectivity.png",
                    "label":"Connectivity",
                    "color":"Green",
                    "dataNode":null
                 },
                 {
                    "id":"uni-1",
                    "shape":"circularImage",
                    "image":"./assets/images/edge.png",
                    "label":"uni-1",
                    "color":"Green",
                    "dataNode":null
                 },
                 {
                    "id":"10.10.10.10",
                    "shape":"circularImage",
                    "image":"./assets/images/tpoint.png",
                    "label":"Termination Point",
                    "color":"Green",
                    "dataNode":{
                       "interface-name":"10.10.10.10",
                       "speed-value":"example-speed-value-val-33014",
                       "speed-units":"example-speed-units-val-75695",
                       "port-description":"p-interafce-desc"
                    }
                 },
                 {
                    "id":"uni-2",
                    "shape":"circularImage",
                    "image":"./assets/images/edge.png",
                    "label":"uni-2",
                    "color":"Green",
                    "dataNode":null
                 },
                 {
                    "id":"22.22.22.22",
                    "shape":"circularImage",
                    "image":"./assets/images/tpoint.png",
                    "label":"Termination Point",
                    "color":"Green",
                    "dataNode":{
                       "interface-name":"22.22.22.22",
                       "speed-value":"example-speed-value-val-33014",
                       "speed-units":"example-speed-units-val-75695",
                       "port-description":"p-interafce-desc"
                    }
                 },
                 {
                    "id":"vpn-bind-1",
                    "shape":"circularImage",
                    "image":"./assets/images/vpnbinding.png",
                    "label":"VPN Binding",
                    "color":"Green",
                    "dataNode":{
                       "vpn-name":"sotn-l2-vpn",
                       "vpn-type":"l2-eth"
                    }
                 }
              ],
              "edges":[
                 {
                    "from":"NNI-001",
                    "to":"vnf-instance"
                 },
                 {
                    "from":"vnf-instance",
                    "to":"eth-conn-1"
                 },
                 {
                    "from":"vnf-instance",
                    "to":"uni-1"
                 },
                 {
                    "from":"uni-1",
                    "to":"10.10.10.10"
                 },
                 {
                    "from":"vnf-instance",
                    "to":"uni-2"
                 },
                 {
                    "from":"uni-2",
                    "to":"22.22.22.22"
                 },
                 {
                    "from":"eth-conn-1",
                    "to":"vpn-bind-1"
                 },
                 {
                    "from":"vpn-bind-1",
                    "to":"10.10.10.10"
                 },
                 {
                    "from":"vpn-bind-1",
                    "to":"22.22.22.22"
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