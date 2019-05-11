/*
    Copyright (C) 2019 CMCC, Inc. and others. All rights reserved.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MyhttpService } from '../myhttp.service';
import * as d3 from 'd3';

@Component({
    selector: 'app-ccvpn-detail',
    templateUrl: './ccvpn-detail.component.html',
    styleUrls: ['./ccvpn-detail.component.css']
})
export class CcvpnDetailComponent implements OnInit {

    constructor(private myhttp:MyhttpService) { }

    ngOnInit() {
        // this.getDetails();
        this.dataInit();
        this.drawImages();
    }

    @Input() detailParams;
    @Input() namesTranslate;
    @Output() closeDetail = new EventEmitter();

    tabBarStyle = {
        "height": "58px",
        "width": "694px",
        "box-shadow": "none",
        "margin": "0",
        "border-radius": "4px 4px 0px 0px"
    };
    input_parameters: any;
    templateParameters = {
        service: {},
        sotnvpn: {
            // info: {},
            sdwanvpnresource_list: [],
            sdwansitelan_list: []
        },
        site: {
            // info: {},
            sdwansiteresource_list: [],
            sdwandevice_list: [],
            sdwansitewan_list: []
        }
    };
    // SOTN VPN List
    sotnVpnTableData = [];
    sotnInfo = {};//sotnmodel  The first part of sotnInfo
    sotnSdwansitelanData = [];//sotnmodel The second part of the data  sdwansitelan Table
    sotnSdwansitelanParams = {};//sdwansitelan Table  Detailed parameters of each line of data

    // Site List
    siteTableData = [];
    siteBaseData = {}; //sitemodel one sdwansiteresource_list
    // cpe
    siteCpeData = {}; //sitemodel two sdwandevice_list
    // Wan Port
    siteWanData = [];  //sitemodel three wan port Table data
    siteWanParams = {}; //wan port Table Detailed parameters of each line of data
    getKeys(item) {
        return Object.keys(item);
    }
    //tabBarStyle
    dataInit() {
        console.log(this.detailParams)
        this.input_parameters = JSON.stringify(this.detailParams['input-parameters'])
        this.input_parameters = JSON.parse(this.input_parameters);
        console.log(this.input_parameters);
        this.templateParameters.service = {
            name:  this.input_parameters.service.name,
            description:  this.input_parameters.service.description
        };
        let inputs = this.input_parameters.service.parameters.requestInputs;
        //筛选 分离 sotnvpn数据
        inputs["sdwanvpnresource_list"].map((item, index) => {
            this.sotnVpnTableData.push(item);
        });

        let sdwanvpnresource_list = inputs["sdwanvpnresource_list"][0];
        Object.keys(sdwanvpnresource_list).forEach((its) => {
            let input = {};
            if(its =="sdwansitelan_list"){
                this.templateParameters["sotnvpn"]["sdwansitelan_list"] = sdwanvpnresource_list[its]
            }else if(its !="sdwansitelan_list"){
                input[its] = sdwanvpnresource_list[its];
                this.templateParameters["sotnvpn"]["sdwanvpnresource_list"].push(input);
            }
        });

        console.log( this.templateParameters.sotnvpn);
        console.log(this.sotnVpnTableData);

        //筛选 分离 site数据
        inputs["sdwansiteresource_list"].map((item, index) => {
            this.siteTableData.push(item);
        });

        let sdwansiteresource_list = inputs["sdwansiteresource_list"][0];
        Object.keys(sdwansiteresource_list).forEach((its) => {
            let input2 = {};
            if(its =="sdwandevice_list"){
                Object.keys(sdwansiteresource_list[its][0]).forEach((i) => {
                    let input1 = {};
                    input1[i] = sdwansiteresource_list[its][i];
                    this.templateParameters["site"]["sdwandevice_list"].push(input1);
                })
            }else if(its =="sdwansitewan_list"){
                this.templateParameters["site"]["sdwansitewan_list"] = sdwansiteresource_list[its]
            }else if(its !="sdwandevice_list" && its !="sdwansitewan_list"){
                input2[its] = sdwansiteresource_list[its];
                this.templateParameters["site"]["sdwansiteresource_list"].push(input2);
            }
        });
        console.log( this.templateParameters.site);
        console.log(this.siteTableData);

        this.showTemParametersSotnVpn();
        this.showTemParametersSite();

    }

    //sotnVpn data, after combining the structure, rendering the template data to the page
    showTemParametersSotnVpn(){
        //sotn Data analysis, structure assembly
        this.templateParameters.sotnvpn.sdwanvpnresource_list.map((item, index) => {
            let input = {};
            for (var keys in item) {
                if (keys != "required" && keys != "type" && keys != "description") {
                    input[keys] = item[keys];
                    item["lable"] = keys;
                    item["lableShow"] = keys.split("_")[1];
                    this.sotnInfo = Object.assign(this.sotnInfo, input);
                }
            }
        });

        this.templateParameters.sotnvpn.sdwansitelan_list.map((item, index) => {
            let input = {};
            for (var keys in item) {
                if (keys != "required" && keys != "type" && keys != "description") {
                    input[keys] = item[keys];
                    item["lable"] = keys;
                    this.sotnSdwansitelanParams = Object.assign(this.sotnSdwansitelanParams, this.sotnSdwansitelanParams, input);
                }
            }
        });
        this.sotnSdwansitelanData.push(this.sotnSdwansitelanParams);
    }

    //Site data, after combining the structure, rendering the template to the page
    showTemParametersSite() {
        //site Data analysis, structure assembly
        this.templateParameters.site.sdwansiteresource_list.map((item, index) => {
            let input = {};
            for (var keys in item) {
                if (keys != "required" && keys != "type" && keys != "description") {
                    input[keys] = item[keys];
                    item["lable"] = keys;
                    item["lableShow"] = keys.split("_")[1];
                    this.siteBaseData = Object.assign(this.siteBaseData, input);
                }
            }
        });

        this.templateParameters.site.sdwandevice_list.map((item, index) => {
            let input = {};
            for (var keys in item) {
                if (keys != "required" && keys != "type" && keys != "description") {
                    input[keys] = item[keys];
                    item["lable"] = keys;
                    this.siteCpeData = Object.assign(this.siteCpeData, input);
                }
            }
        });
        this.templateParameters.site.sdwansitewan_list.map((item, index) => {
            let input = {};
            for (var keys in item) {
                if (keys != "required" && keys != "type" && keys != "description") {
                    input[keys] = item[keys];
                    item["lable"] = keys;
                    this.siteWanParams = Object.assign(this.siteWanParams, this.siteWanParams, input);
                }
            }
        });
        this.siteWanData.push(this.siteWanParams);
    }

    //sotnVpn detail show
    sotnVpnDetailShow = false;
    isEditSotnVpn = 0;
    showstonVpnDetail(num){
        this.sotnVpnDetailShow = true;
        this.isEditSotnVpn = num;
        Object.keys(this.sotnInfo).forEach((item) => {
            this.sotnInfo[item] = this.sotnVpnTableData[num - 1][item];
        });
        this.sotnSdwansitelanData = this.sotnVpnTableData[num - 1].sdwansitelan_list.map((item) => {
            return Object.assign({}, {},item)
        });
    }
    detailSotnVpn_cancel(){
        this.sotnVpnDetailShow = false;
    }

    // site detail show
    siteDetail = false;
    isEditSite = 0;
    showSiteDetail(num) {
        this.siteDetail = true;
        this.isEditSite = num;
        console.log(this.siteTableData[num - 1]);
        console.log(this.siteCpeData);
        console.log(this.templateParameters.site.sdwandevice_list);
        Object.keys(this.siteBaseData).forEach((item) => {
            this.siteBaseData[item] = this.siteTableData[num - 1][item];
        });
        this.siteCpeData = Object.assign({}, this.siteTableData[num - 1].sdwandevice_list[0]);
        console.log(this.siteCpeData);
        this.siteWanData = this.siteTableData[num - 1].sdwansitewan_list.map((item) => {
            return Object.assign({}, {},item)
        });
    }
    detailsite_cancel(){
        this.siteDetail = false;
    }
    deleteSite(num){
        this.siteTableData = this.siteTableData.filter((d, i) => i !== num - 1);
        console.log(this.siteTableData)
    }

    addSite(){

    }




    localSite = [];
    outerSite = [];

    getSiteAResource(){
        return new Promise((res,rej)=>{
            this.detailParams.siteSer.forEach((site)=>{
                site["relationship-list"]["relationship"].find((item)=>{return item["related-to"]=="site-resource"})?this.localSite.push(site):this.outerSite.push(site);
            });

            if(this.localSite[0] && this.localSite[0]["service-instance-name"].startsWith("Dc")){
                this.localSite.reverse();
            }

            if(this.outerSite[0] && this.outerSite[0]["service-instance-name"].startsWith("Dc")){
                this.outerSite.reverse();
            }
            console.log(this.localSite);
            console.log(this.outerSite);

            this.localSite.forEach((site)=>{
                let obj = {
                    customerId: this.detailParams.customer.id,
                    serviceType: this.detailParams.serviceType,
                    serviceId: site["service-instance-id"]
                };
                this.myhttp.getAllottedResource(obj)
                    .subscribe((data)=>{
                        let resource = data["allotted-resource"].find((item)=>{ return item["allotted-resource-name"]=="sotn ar"});
                        let tps_pnfs = resource["relationship-list"]["relationship"].find((item)=>{ return item["related-to"]=="p-interface"})["relationship-data"];
                        site.tpsitename = tps_pnfs.find((item)=>{return item["relationship-key"]=="p-interface.interface-name"})["relationship-value"];
                        res("sites-domain");
                    })
            })
        })
    }


    vpns = [{name: "", tps: [], domain: "", sitetpname: "", othertpname: ""}];


    getSotnAresource() {
        return new Promise((res, rej) => {
            let connectivityId = this.detailParams["relationship-list"]["relationship"]
                .find((item) => {
                    return item["related-to"] == "connectivity"
                })["relationship-data"]
                .find((item2) => {
                    return item2["relationship-key"] == "connectivity.connectivity-id"
                })["relationship-value"];
            this.myhttp.getSotnConnectivity(connectivityId)
                .subscribe((data) => {
                    // console.log(data);  //By default, a connectivityId can only find a connectivity.
                    let vpns = data.connectivity[0]["relationship-list"]["relationship"]
                        .filter((item) => {
                            return item["related-to"] == "vpn-binding"
                        })
                        .map((item2) => {
                            return item2["relationship-data"].find((item3) => {
                                return item3["relationship-key"] == "vpn-binding.vpn-id"
                            })["relationship-value"]
                        });
                    console.log(vpns);
                    this.detailParams.vpns = vpns.map((item) => {
                        return {name: item}
                    });
                    this.detailParams.vpns.forEach((vpn, index) => {
                        this.myhttp.getVpnBinding(vpn.name)
                            .subscribe((data2) => {
                                // console.log(data2); //By default, a vpnid can only find a vpnbinding
                                let tps_pnfs = data2["vpn-binding"][0]["relationship-list"]["relationship"]
                                    .filter((item) => {
                                        return item["related-to"] == "p-interface"
                                    })
                                    .map((item2) => {
                                        return item2["relationship-data"]
                                    });
                                let pnfname = tps_pnfs.map((item) => {
                                    return item.find((item2) => {
                                        return item2["relationship-key"] == "pnf.pnf-name"
                                    })["relationship-value"]
                                });
                                let tpnames = tps_pnfs.map((item) => {
                                    return item.find((item2) => {
                                        return item2["relationship-key"] == "p-interface.interface-name"
                                    })["relationship-value"]
                                });
                                // console.log(pnfname)
                                // console.log(tpnames)
                                vpn.tps = tpnames;
                                // let thissite = this.localSite.find((item)=>{return item.pnfname == pnfname[0]}); //Find the same item on the site pnfname, that is, the same domain
                                // console.log(thissite);
                                // thissite.tpsotnname = tpsotnnames.find((item)=>{return item!=thissite.tpsitename});
                                // Get domain（network-resource） by pnfname;
                                this.myhttp.getPnfDetail(pnfname[0])
                                    .subscribe((data2) => {
                                        // console.log(data2);
                                        let networkRelation = data2["relationship-list"]["relationship"].find((item) => {
                                            return item["related-to"] == "network-resource"
                                        })["relationship-data"];
                                        vpn.domain = networkRelation.find((item) => {
                                            return item["relationship-key"] == "network-resource.network-id"
                                        })["relationship-value"];
                                        if (this.localSite[index]) {
                                            vpn.sitetpname = this.localSite.find((site) => {
                                                return tpnames.includes(site.tpsitename)
                                            }).tpsitename;
                                            console.log(tpnames)
                                            console.log(vpn.sitetpname)
                                            vpn.othertpname = tpnames.find((name) => {
                                                return name != vpn.sitetpname
                                            });
                                        } else {
                                            vpn.sitetpname = this.localSite[0].tpsitename;
                                            vpn.othertpname = tpnames.find((name) => {
                                                return name != vpn.sitetpname
                                            });
                                        }

                                        this.vpns = this.detailParams.vpns;
                                        console.log(this.vpns)
                                        res(this.detailParams.vpns)
                                    })
                                console.log(this.detailParams.vpns)
                            })
                    })
                })
        })
    }


    drawImages() {

        this.getSiteAResource().then((data) => {
            console.log(data);
            return this.getSotnAresource()
        }).then((data) => {
            console.log(data);
            console.log(this.localSite);
            this.detailSites = this.detailParams.serviceDomain == "CCVPN" ? false : true;
            // When there is only one vpn
            if (this.detailParams.serviceDomain == "CCVPN" && this.vpns.length == 1) {
                this.detailLines.length = this.detailLines.length - 3;
                // this.detailLines.push(line);
                // when local site have 2
                if (this.localSite.length == 2) {
                    let line =  {
                        "x1": "30%", "y1": "55%", "x2": "42%", "y2": "55%"//tp2--tp3
                    }
                    this.detailLines.push(line);
                }
                // when cloud site have 2
                if (this.outerSite.length == 2) {
                    let line = {
                        "x1": "81%", "y1": "21%", "x2": "90%", "y2": "21%"//out-domain--site3
                    };
                    this.detailLines.push(line);
                }
            }
        })
        let allnodes = [this.getSiteAResource(),this.getSotnAresource()];
        Promise.all(allnodes).then((data)=>{
          console.log(data)
          console.log(this.localSite);


        })
    }

    detailSites = false;
    detailLines = [ //Details of the topology map connection coordinates
        {
            "x1": "9%", "y1": "40%", "x2": "21%", "y2": "40%"//site1--tp1
        },

        {
            "x1": "83%", "y1": "51%", "x2": "91%", "y2": "51%"//out-domain--site4
        },

        {
            "x1": "52%", "y1": "81%", "x2": "63%", "y2": "81%"//site2--tp4
        },
        {
            "x1": "81%", "y1": "21%", "x2": "90%", "y2": "21%"//out-domain--site3
        },
        {
            "x1": "30%", "y1": "55%", "x2": "44%", "y2": "55%"//tp2--tp3
        }
    ];

    goback(){
        this.closeDetail.emit();
    }

    hiddenModel(){
        this.sotnVpnDetailShow = false;
        this.siteDetail = false;
    }

}
