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
import { ServiceListService } from '../../../../core/services/serviceList.service';
import * as d3 from 'd3';

@Component({
    selector: 'app-ccvpn-detail',
    templateUrl: './ccvpn-detail.component.html',
    styleUrls: ['./ccvpn-detail.component.css']
})
export class CcvpnDetailComponent implements OnInit {

    constructor(private myhttp: ServiceListService) { }

    ngOnInit() {
        this.dataInit();
        this.drawImages();
    }

    @Input() detailParams;
    @Input() upDateShow;
    @Output() closeDetail = new EventEmitter();
    @Output() closeUpdate = new EventEmitter();

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
    bodyTemplateParameter = {};

    // SOTN VPN List
    sotnVpnTableData = [];
    sotnInfo = {};//sotnmodel  The first part of sotnInfo
    sotnSdwansitelanData = [];//sotnmodel The second part of the data  sdwansitelan Table
    sotnSdwansitelanParams = {};//sdwansitelan Table  Detailed parameters of each line of data
    tabInputShowSdwansitelan = [];//sdwansitelan table input and span 
    // Site List
    siteTableData = [];
    siteBaseData = {}; //sitemodel one sdwansiteresource_list
    // cpe
    siteSdwanDevice = []; //sitemodel  SdwanDevice port Table data
    siteCpeData = {}; //sitemodel two sdwandevice_list
    tabInputShowDevice = [];//Device port input and span
    // Wan Port
    siteWanData = [];  //sitemodel three wan port Table data
    siteWanParams = {}; //wan port Table Detailed parameters of each line of data
    tabInputShowWanPort = [];//wan port table input and span
    sitenum = [];
    sotnvpnnum = [];

    getKeys(item) {
        return Object.keys(item);
    }
    //tabBarStyle
    dataInit() {
        // this.input_parameters = JSON.stringify(this.detailParams['input-parameters'])
        if (this.detailParams['input-parameters']) {
            this.input_parameters = JSON.parse(this.detailParams['input-parameters']);
        } else {
            return false;
        }
        this.templateParameters.service = {
            name: this.input_parameters.service.name,
            description: this.input_parameters.service.description,
            serviceInvariantUuid: this.input_parameters.service["serviceInvariantUuid"],
            serviceUuid: this.input_parameters.service["serviceUuid"]
        };
        let inputs = this.input_parameters.service.parameters.requestInputs;

        Object.keys(inputs).map((items) => {
            if (items.search("vpn") != -1) {
                this.bodyTemplateParameter[items] = [];
                inputs[items].map((item, index) => {
                    this.sotnVpnTableData.push(item);
                    this.sotnvpnnum.push(false);
                });
                let sdwanvpnresource_list = inputs[items][0];
                Object.keys(sdwanvpnresource_list).forEach((its) => {
                    let input = {};
                    if (its.search("site") != -1 && sdwanvpnresource_list[its] instanceof Array === true) {
                        Object.keys(sdwanvpnresource_list[its][0]).forEach((i) => {
                            let input1 = {};
                            input1[i] = sdwanvpnresource_list[its][i];
                            this.templateParameters["sotnvpn"]["sdwansitelan_list"].push(input1);
                        })
                        let sitelanKey = {};
                        sitelanKey[its] = [];
                        this.bodyTemplateParameter[items].push(sitelanKey);
                    }
                    if (its.search("sitelan") == -1 && sdwanvpnresource_list[its] instanceof Array === false) {
                        input[its] = sdwanvpnresource_list[its];
                        this.templateParameters["sotnvpn"]["sdwanvpnresource_list"].push(input);
                    }
                });
            }
            if (items.search("site") != -1) {
                this.bodyTemplateParameter[items] = [];
                inputs[items].map((item, index) => {
                    this.siteTableData.push(item);
                    this.sitenum.push(false);
                });
                let sdwansiteresource_list = inputs[items][0];
                Object.keys(sdwansiteresource_list).forEach((its) => {
                    let input2 = {};
                    if (its.search("device") != -1 && sdwansiteresource_list[its] instanceof Array === true) {
                        this.templateParameters["site"]["sdwandevice_list"][0] = sdwansiteresource_list[its][0];
                        let sitelanKey = {};
                        sitelanKey[its] = [];
                        this.bodyTemplateParameter[items].push(sitelanKey);
                    }
                    if (its.search("site") != -1 && its.search("device") == -1 && sdwansiteresource_list[its] instanceof Array === true) {
                        this.templateParameters["site"]["sdwansitewan_list"][0] = sdwansiteresource_list[its][0];
                        let sitelanKey = {};
                        sitelanKey[its] = [];
                        this.bodyTemplateParameter[items].push(sitelanKey);
                    }
                    if (its.search("device") == -1 && sdwansiteresource_list[its] instanceof Array === false) {
                        input2[its] = sdwansiteresource_list[its];
                        this.templateParameters["site"]["sdwansiteresource_list"].push(input2);
                    }
                });

            }
        });

        this.showTemParametersSotnVpn();
        this.showTemParametersSite();

    }

    //sotnVpn data, after combining the structure, rendering the template data to the page
    showTemParametersSotnVpn() {
        //sotn Data analysis, structure assembly
        this.templateParameters.sotnvpn.sdwanvpnresource_list.map((item, index) => {
            let input = {};
            for (let keys in item) {
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
            for (let keys in item) {
                if (keys != "required" && keys != "type" && keys != "description") {
                    input[keys] = item[keys];
                    item["lable"] = keys;
                    this.sotnSdwansitelanParams = Object.assign(this.sotnSdwansitelanParams, this.sotnSdwansitelanParams, input);
                }
            }
        });
        this.sotnSdwansitelanData.push(this.sotnSdwansitelanParams);
        this.sotnSdwansitelanData.map((item, index) => {
            this.tabInputShowSdwansitelan[index] = true;
        });
    }

    //Site data, after combining the structure, rendering the template to the page
    showTemParametersSite() {
        //site Data analysis, structure assembly
        this.templateParameters.site.sdwansiteresource_list.map((item, index) => {
            let input = {};
            for (let keys in item) {
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
            for (let keys in item) {
                if (keys != "required" && keys != "type" && keys != "description") {
                    input[keys] = item[keys];
                    item["lable"] = keys;
                    this.siteCpeData = Object.assign(this.siteCpeData, input);
                }
            }
        });
        this.templateParameters.site.sdwandevice_list.map((item, index) => {
            if (this.getKeys(item).indexOf("lable") == -1) {
                this.templateParameters.site.sdwandevice_list.splice(index, 1)
            }
        });
        this.templateParameters.site.sdwansitewan_list.map((item, index) => {
            let input = {};
            for (let keys in item) {
                if (keys != "required" && keys != "type" && keys != "description") {
                    input[keys] = item[keys];
                    item["lable"] = keys;
                    this.siteWanParams = Object.assign(this.siteWanParams, this.siteWanParams, input);
                }
            }
        });
        this.siteSdwanDevice.push(this.siteCpeData);
        this.siteSdwanDevice.map((item, index) => {
            this.tabInputShowDevice[index] = true;
        });
        this.siteWanData.push(this.siteWanParams);
        this.siteWanData.map((item, index) => {
            this.tabInputShowWanPort[index] = true;
        });
    }

    //sotnVpn detail show
    sotnVpnDetailShow = false;
    isEditSotnVpn = 0;
    showstonVpnDetail(num) {
        this.sotnVpnDetailShow = true;
        this.isEditSotnVpn = num;
        Object.keys(this.sotnInfo).forEach((item) => {
            this.sotnInfo[item] = this.sotnVpnTableData[num - 1][item];
        });
        this.sotnSdwansitelanData = this.sotnVpnTableData[num - 1].sdwansitelan_list.map((item) => {
            return Object.assign({}, {}, item)
        });
    }
    detailSotnVpn_cancel() {
        this.sotnVpnDetailShow = false;
    }

    // site detail show
    siteDetail = false;
    isEditSite = 0;
    showSiteDetail(num) {
        this.siteDetail = true;
        this.isEditSite = num;
        Object.keys(this.siteBaseData).forEach((item) => {
            this.siteBaseData[item] = this.siteTableData[num - 1][item];
        });
        this.siteSdwanDevice = this.siteTableData[num - 1].sdwandevice_list.map((item) => {
            return Object.assign({}, {}, item)
        });
        this.siteWanData = this.siteTableData[num - 1].sdwansitewan_list.map((item) => {
            return Object.assign({}, {}, item)
        });
    }
    detailsite_cancel() {
        this.siteDetail = false;
    }
    deleteUpdateSite(num) {
        this.siteTableData = this.siteTableData.filter((d, i) => i !== num - 1);
        this.sitenum.splice(num - 1, 1);
    }

    //sotnVpn addModel
    sotnVpnAddModelShow = false;

    updateSotnVpn_OK() {
        let inputs = {
            "sdwansitelan_list": []
        };
        inputs = Object.assign(inputs, this.sotnInfo);
        inputs["sdwansitelan_list"] = this.sotnSdwansitelanData.map((item) => {
            return Object.assign({}, item);
        });
        if (this.isEditSotnVpn) {

            this.sotnVpnTableData[this.isEditSotnVpn - 1] = inputs;
            this.sotnVpnTableData = [...this.sotnVpnTableData];
        } else {
            // this.siteTableData.push(inputs);
            this.sotnVpnTableData = [...this.sotnVpnTableData, inputs];
            this.sotnvpnnum = [...this.sotnvpnnum, true];
        }
        Object.keys(this.sotnInfo).forEach((item) => {
            this.sotnInfo[item] = null;
        });
        this.sotnSdwansitelanData.forEach((item, index) => {
            if (index > 0) {
                this.sotnSdwansitelanData.splice(index, 1);
                this.tabInputShowSdwansitelan.splice(index, 1);
            } else {
                Object.keys(item).forEach((item2) => {
                    item[item2] = null;
                });
                this.tabInputShowSdwansitelan[index] = true;
            }

        });
        this.sotnVpnAddModelShow = false;
    }

    updateSotnVpn_cancel() {
        Object.keys(this.sotnInfo).forEach((item) => {
            this.sotnInfo[item] = null;
        });
        this.sotnSdwansitelanData.forEach((item, index) => {
            if (index > 0) {
                this.sotnSdwansitelanData.splice(index, 1);
            } else {
                Object.keys(item).forEach((item2) => {
                    item[item2] = null;
                });
                this.tabInputShowSdwansitelan[index] = true;
            }

        });
        this.sotnVpnAddModelShow = false;
    }

    editUpdateSotnVpn(num) {
        this.sotnVpnAddModelShow = true;
        this.isEditSotnVpn = num;
        Object.keys(this.sotnInfo).forEach((item) => {
            this.sotnInfo[item] = this.sotnVpnTableData[num - 1][item];
        });
        this.sotnSdwansitelanData = this.sotnVpnTableData[num - 1].sdwansitelan_list.map((item) => {
            return Object.assign({}, {}, item)
        });
        this.sotnSdwansitelanData.forEach((item, index) => {
            this.tabInputShowSdwansitelan[index] = false;
        });
    }

    deleteUpdateSotnVpn(num) {
        this.sotnVpnTableData = this.sotnVpnTableData.filter((d, i) => i !== num - 1);
        this.sotnvpnnum.splice(num - 1, 1);
    }
    updateSotnSdwansitelan() {
        if (this.tabInputShowSdwansitelan.indexOf(true) > -1) {
            return false;
        }
        let addNum = this.sotnSdwansitelanData.length;
        let inputsData = Object.assign({}, this.sotnSdwansitelanParams);
        Object.keys(inputsData).forEach((item) => {
            if (item != "description") {
                inputsData[item] = null;
            }
        });
        this.sotnSdwansitelanData[addNum] = inputsData;
        this.tabInputShowSdwansitelan[addNum] = true;
        this.sotnSdwansitelanData = [...this.sotnSdwansitelanData];
    }
    editUpdateSotnSdwansitelan(num, item, sotnSdwansitelanData) {
        if (this.tabInputShowSdwansitelan[num - 1] == false) {
            this.tabInputShowSdwansitelan[num - 1] = true;
        } else {
            this.tabInputShowSdwansitelan[num - 1] = false;
        }
    }
    deleteUpdateSotnSdwansitelan(num, item, sotnSdwansitelanData) {
        if (this.sotnSdwansitelanData.length <= 1) {
            return false;
        } else {

        }
        this.sotnSdwansitelanData = this.sotnSdwansitelanData.filter((d, i) => i !== num - 1);
    }

    // site addModel
    siteAddModelShow = false;

    updateSotnvpn() {
        this.sotnVpnAddModelShow = true;
        this.isEditSotnVpn = 0;
    }

    updateSite() {
        this.siteAddModelShow = true;
        this.isEditSite = 0;
    }

    editUpdateSite(num) {
        this.siteAddModelShow = true;
        this.isEditSite = num;
        Object.keys(this.siteBaseData).forEach((item) => {
            this.siteBaseData[item] = this.siteTableData[num - 1][item];
        });
        this.siteSdwanDevice = this.siteTableData[num - 1].sdwandevice_list.map((item) => {
            return Object.assign({}, item)
        });
        this.siteSdwanDevice.forEach((item, index) => {
            this.tabInputShowDevice[index] = false;
        });
        this.siteWanData = this.siteTableData[num - 1].sdwansitewan_list.map((item) => {
            return Object.assign({}, item)
        });
        this.siteWanData.forEach((item, index) => {
            this.tabInputShowWanPort[index] = false;
        });
    }

    updatesite_cancel() {
        Object.keys(this.siteBaseData).forEach((item) => {
            this.siteBaseData[item] = null;
        })
        this.siteSdwanDevice.forEach((item, index) => {
            if (index > 0) {
                this.siteSdwanDevice.splice(index, 1);
            } else {
                Object.keys(item).forEach((item2) => {
                    item[item2] = null;
                });
                this.tabInputShowDevice[index] = true;
            }

        });
        this.siteWanData.forEach((item, index) => {
            if (index > 0) {
                this.siteWanData.splice(index, 1);
            } else {
                Object.keys(item).forEach((item2) => {
                    item[item2] = null;
                });
                this.tabInputShowWanPort[index] = true;
            }

        });
        this.siteAddModelShow = false;
    }

    updatesite_OK() {
        let inputs = {
            "sdwandevice_list": [],
            "sdwansitewan_list": []
        };
        inputs = Object.assign(inputs, this.siteBaseData);
        inputs["sdwandevice_list"] = this.siteSdwanDevice.map((item) => {
            return Object.assign({}, item);
        });
        inputs["sdwansitewan_list"] = this.siteWanData.map((item) => {
            return Object.assign({}, item);
        });
        if (this.isEditSite) {
            // Edit status does not increase
            this.siteTableData[this.isEditSite - 1] = inputs;
            this.siteTableData = [...this.siteTableData]; //Table refresh
        } else {
            // this.siteTableData.push(inputs);
            this.siteTableData = [...this.siteTableData, inputs];
            this.sitenum = [...this.sitenum, true];
        }

        Object.keys(this.siteBaseData).forEach((item) => { //Clear modal box
            this.siteBaseData[item] = null;
        });
        this.siteSdwanDevice.forEach((item, index) => {
            if (index > 0) {
                this.siteSdwanDevice.splice(index, 1);
                this.tabInputShowDevice.splice(index, 1);
            } else {
                Object.keys(item).forEach((item2) => {
                    item[item2] = null;
                });
                this.tabInputShowDevice[index] = true;
            }

        });
        this.siteWanData.forEach((item, index) => {
            if (index > 0) {
                this.siteWanData.splice(index, 1);
                this.tabInputShowWanPort.splice(index, 1);
            } else {
                Object.keys(item).forEach((item2) => {
                    item[item2] = null;
                });
                this.tabInputShowWanPort[index] = true;
            }

        });
        this.siteAddModelShow = false;
    }

    //add.edit，detele siteWanPort
    updateSiteWan() {
        if (this.tabInputShowWanPort.indexOf(true) > -1) {//Adding new rows is not allowed when there is a row of data being edited
            return false;
        }
        let addNum = this.siteWanData.length;
        let inputsData = Object.assign({}, this.siteWanParams);
        Object.keys(inputsData).forEach((item) => {//Add a new line of empty data
            if (item != "description") {
                inputsData[item] = null;
            }
        });
        this.siteWanData[addNum] = inputsData;
        this.tabInputShowWanPort[addNum] = true;
        this.siteWanData = [...this.siteWanData]; //Table refresh
    }

    editUpdateWanPort(num, item, siteWanData) {
        if (this.tabInputShowWanPort[num - 1] == false) {
            this.tabInputShowWanPort[num - 1] = true;
        } else {
            this.tabInputShowWanPort[num - 1] = false;
        }
    }

    deleteUpdateWanPort(num, item, siteWanData) {
        if (this.siteWanData.length <= 1) {
            return false;
        }
        this.siteWanData = this.siteWanData.filter((d, i) => i !== num - 1);
    }

    // site node graphic depiction
    // site sort，Check tp add pnf according to site  --> allotted-resource
    localSite = [];//local site
    outerSite = [];//outer site

    getSiteAResource() {
        return new Promise((res, rej) => {
            this.detailParams.siteSer.forEach((site) => {
                site["relationship-list"]["relationship"].find((item) => { return item["related-to"] == "site-resource" }) ? this.localSite.push(site) : this.outerSite.push(site);
            });

            if (this.localSite[0] && this.localSite[0]["service-instance-name"].startsWith("Dc")) {
                this.localSite.reverse();
            }

            if (this.outerSite[0] && this.outerSite[0]["service-instance-name"].startsWith("Dc")) {
                this.outerSite.reverse();
            }
            if (this.localSite.length > 0) {
                this.detailLines = [].concat(this.detailLiness);
                this.localSite.forEach((site) => {
                    let obj = {
                        customerId: this.detailParams.customer.id,
                        serviceType: this.detailParams.serviceType,
                        serviceId: site["service-instance-id"]
                    };
                    this.myhttp.getAllottedResource(obj)
                        .subscribe((data) => {
                            let resource = data["allotted-resource"].find((item) => { return item["allotted-resource-name"] == "sotn ar" });
                            let tps_pnfs = resource["relationship-list"]["relationship"].find((item) => { return item["related-to"] == "p-interface" })["relationship-data"];
                            site.tpsitename = tps_pnfs.find((item) => { return item["relationship-key"] == "p-interface.interface-name" })["relationship-value"];
                            res("sites-domain");
                        })
                })
            } else {
                return false;
            }
        })
    }


    vpns = [{ name: "", tps: [], domain: "", sitetpname: "", othertpname: "" }];


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
                    let vpns = data.connectivity[0]["relationship-list"]["relationship"]
                        .filter((item) => {
                            return item["related-to"] == "vpn-binding"
                        })
                        .map((item2) => {
                            return item2["relationship-data"].find((item3) => {
                                return item3["relationship-key"] == "vpn-binding.vpn-id"
                            })["relationship-value"]
                        });
                    this.detailParams.vpns = vpns.map((item) => {
                        return { name: item }
                    });
                    this.detailParams.vpns.forEach((vpn, index) => {
                        this.myhttp.getVpnBinding(vpn.name)
                            .subscribe((data2) => {
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
                                vpn.tps = tpnames;
                                this.myhttp.getPnfDetail(pnfname[0])
                                    .subscribe((data2) => {
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
                                        res(this.detailParams.vpns)
                                    });
                            })
                    })
                })
        })
    }


    drawImages() {

        this.getSiteAResource().then((data) => {
            return this.getSotnAresource()
        }).then((data) => {
            this.detailSites = this.detailParams.serviceDomain == "CCVPN" ? false : true;
            // When there is only one vpn
            if (this.detailParams.serviceDomain == "CCVPN" && this.vpns.length == 1) {
                this.detailLines.length = this.detailLines.length - 3;
                // this.detailLines.push(line);
                // when local site have 2
                if (this.localSite.length == 2) {
                    let line = {
                        "x1": "30%", "y1": "55%", "x2": "42%", "y2": "55%"//tp2--tp3
                    };
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
        });
        let allnodes = [this.getSiteAResource(), this.getSotnAresource()];
        Promise.all(allnodes).then((data) => {
        })
    }

    detailSites = false;
    detailLines = [];
    detailLiness = [ //Details of the topology map connection coordinates
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

    modifyJosnKey(json, oddkey, newkey) {

        let val = json[oddkey];
        delete json[oddkey];
        json[newkey] = val;
    }

    // ccvpn update
    submitUpdate() {
        let globalCustomerId = this.detailParams.customer.id;
        let globalServiceType = this.detailParams.serviceType.name;
        let servicebody = {
            service: {
                name: this.templateParameters.service["name"],
                description: this.templateParameters.service["description"],
                serviceInvariantUuid: this.templateParameters.service["serviceInvariantUuid"],
                serviceUuid: this.templateParameters.service["serviceUuid"],
                globalSubscriberId: globalCustomerId,  //customer.id
                serviceType: globalServiceType,  //serviceType.value
                parameters: {
                    locationConstraints: [],
                    resources: [],
                    requestInputs: {
                        sdwanvpnresource_list: [],
                        sdwansiteresource_list: []
                    }
                }
            }
        };
        let siteresource = null, sitewan = null, device = null, vpnresource = null, sitelan = null;
        Object.keys(this.bodyTemplateParameter).map((item, index) => {
            if (item.search("site") != -1) {
                siteresource = item;
                this.bodyTemplateParameter[item].map((items, index) => {
                    if (Object.keys(items)[0].search("site") != -1 && Object.keys(items)[0].search("device") == -1) {
                        sitewan = Object.keys(items)[0]
                    }
                    if (Object.keys(items)[0].search("device") != -1) {
                        device = Object.keys(items)[0]
                    }
                });
            }
            if (item.search("vpn") != -1) {
                vpnresource = item;
                this.bodyTemplateParameter[item].map((items, index) => {
                    if (Object.keys(items)[0].search("site") != -1) {
                        sitelan = Object.keys(items)[0]
                    }
                });
            }
        });
        this.sotnVpnTableData.forEach((item, index) => {
            Object.keys(item).map((items, index) => {
                if (items.search("site") != -1 && item[items] instanceof Array === true) {
                    this.modifyJosnKey(item, items, sitelan)
                }
            });
        });
        this.siteTableData.forEach((item, index) => {
            Object.keys(item).map((items, index) => {
                if (items.search("site") != -1 && items.search("device") == -1 && item[items] instanceof Array === true) {
                    this.modifyJosnKey(item, items, sitewan)
                }
                if (items.search("device") != -1) {
                    this.modifyJosnKey(item, items, device)
                }
            });
        });
        Object.keys(this.bodyTemplateParameter).map((item, index) => {
            if (item.search("site") != -1) {
                servicebody.service.parameters.requestInputs[item] = [].concat(this.siteTableData);
            }
            if (item.search("vpn") != -1) {
                servicebody.service.parameters.requestInputs[item] = [].concat(this.sotnVpnTableData);
            }
        });
        this.closeUpdate.emit(servicebody);
    }

    goback() {
        this.closeDetail.emit();
    }

    hiddenModel() {
        this.sotnVpnDetailShow = false;
        this.siteDetail = false;
    }

}
