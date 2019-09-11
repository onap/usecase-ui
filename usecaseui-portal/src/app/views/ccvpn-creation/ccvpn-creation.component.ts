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
import * as d3 from 'd3';
import { MyhttpService } from '../../core/services/myhttp.service';

@Component({
    selector: 'app-ccvpn-creation',
    templateUrl: './ccvpn-creation.component.html',
    styleUrls: ['./ccvpn-creation.component.css']
})
export class CcvpnCreationComponent implements OnInit {

    constructor(private myhttp: MyhttpService) { }
    @Input() createParams;
    @Input() ccvpn_temParametersContent;
    @Output() closeCreate = new EventEmitter();

    ngOnInit() {
        this.getccvpnTemParameters(this.ccvpn_temParametersContent);
    }

    //tabBarStyle
    tabBarStyle = {
        "height": "58px",
        "width": "694px",
        "box-shadow": "none",
        "margin": "0",
        "border-radius": "4px 4px 0px 0px"
    };
    templateParameters = {
        service: {},
        sotnvpn: {
            info: {},
            sdwanvpnresource_list: [],
            sdwansitelan_list: []
        },
        site: {
            info: {},
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
    tabInputShowSdwansitelan = [];//sdwansitelan Table input&span The status identifier of the label switching display
    // Site List
    siteTableData = [];
    siteBaseData = {}; //sitemodel one sdwansiteresource_list
    // cpe
    siteSdwanDevice = []; //sitemodel  SdwanDevice port Table data
    siteCpeData = {}; //sitemodel two sdwandevice_list
    tabInputShowDevice = [];//Device port Table input和span The status identifier of the label switching display
    // Wan Port
    siteWanData = [];  //sitemodel three wan port Table data
    siteWanParams = {}; //wan port Table Detailed parameters of each line of data
    tabInputShowWanPort = [];//wan port Table input和span The status identifier of the label switching display
    getKeys(item) {
        return Object.keys(item);
    }

    getccvpnTemParameters(data) { //Get template parameters
        if (data.hasOwnProperty("model") && typeof data["model"] == 'string') {
            data = JSON.parse(data["model"]);
        }
        let inputss = data["inputs"];
        let inputs = {};
        this.templateParameters.service = {
            name: data.metadata["name"],
            description: data.metadata.description,
            serviceInvariantUuid: data.metadata.invariantUUID,
            serviceUuid: data.metadata.UUID
        };

        //Screening separation sotnvpn data
        Object.keys(inputss).map((items) => {
            if (items.search("vpn") != -1) {
                this.bodyTemplateParameter[items] = [];
                inputss[items].map((item, index) => {
                    if (item["required"] != undefined) {
                        this.templateParameters["sotnvpn"]["sdwanvpnresource_list"].push(item);
                    }
                    if (item["required"] == undefined && Object.keys(item).length == 1 && Object.keys(item)[0].search("site") != -1 && item[Object.keys(item)[0]] instanceof Array === true) {
                        this.templateParameters["sotnvpn"]["sdwansitelan_list"] = item[Object.keys(item)[0]]
                        let sitelanKey = {};
                        sitelanKey[Object.keys(item)[0]] = [];
                        this.bodyTemplateParameter[items].push(sitelanKey);
                    }
                });
            }
            if (items.search("site") != -1) {
                this.bodyTemplateParameter[items] = [];
                inputss[items].map((item, index) => {
                    if (item["required"] != undefined) {
                        this.templateParameters["site"]["sdwansiteresource_list"].push(item);
                    }
                    if (item["required"] == undefined && Object.keys(item).length == 1 && Object.keys(item)[0].search("device") != -1 && item[Object.keys(item)[0]] instanceof Array === true) {
                        this.templateParameters["site"]["sdwandevice_list"] = item[Object.keys(item)[0]];
                        let sitelanKey = {};
                        sitelanKey[Object.keys(item)[0]] = [];
                        this.bodyTemplateParameter[items].push(sitelanKey);
                    }
                    if (item["required"] == undefined && Object.keys(item).length == 1 && Object.keys(item)[0].search("site") != -1 && Object.keys(item)[0].search("device") == -1 && item[Object.keys(item)[0]] instanceof Array === true) {
                        this.templateParameters["site"]["sdwansitewan_list"] = item[Object.keys(item)[0]];
                        let sitelanKey = {};
                        sitelanKey[Object.keys(item)[0]] = [];
                        this.bodyTemplateParameter[items].push(sitelanKey);
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
        this.sotnSdwansitelanData.map((item, index) => {
            this.tabInputShowSdwansitelan[index] = true;
        });
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
        this.templateParameters.site.sdwandevice_list.map((item, index) => {
            if (this.getKeys(item).indexOf("lable") == -1) {
                this.templateParameters.site.sdwandevice_list.splice(index, 1)
            }
        });
        this.templateParameters.site.sdwansitewan_list.push(
            {
                ipMode: "",
                description: ""
            },
            {
                publicIP: "",
                description: ""
            }
        );

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
        this.siteSdwanDevice.push(this.siteCpeData);
        this.siteWanData.push(this.siteWanParams);
        this.siteWanData.map((item, index) => {
            this.tabInputShowDevice[index] = true;
        });
        this.siteWanData.map((item, index) => {
            this.tabInputShowWanPort[index] = true;
        });

    }

    //add,edit,delete sotnSdwansitelan
    addSotnSdwansitelan() {
        if (this.tabInputShowSdwansitelan.indexOf(true) > -1) {//Adding new rows is not allowed when there is a row of data being edited
            return false;
        }
        let addNum = this.sotnSdwansitelanData.length;
        let inputsData = Object.assign({}, this.sotnSdwansitelanParams);
        Object.keys(inputsData).forEach((item) => {//Add a new line of empty data
            if (item != "description") {
                inputsData[item] = null;
            }
        });
        this.sotnSdwansitelanData[addNum] = inputsData;
        this.tabInputShowSdwansitelan[addNum] = true;
        this.sotnSdwansitelanData = [...this.sotnSdwansitelanData]; //Table refresh
    }
    editSotnSdwansitelan(num, item, sotnSdwansitelanData) {
        if (this.tabInputShowSdwansitelan[num - 1] == false) {
            this.tabInputShowSdwansitelan[num - 1] = true;
        } else {
            this.tabInputShowSdwansitelan[num - 1] = false;
        }
    }
    deleteSotnSdwansitelan(num, item, sotnSdwansitelanData) {
        if (this.sotnSdwansitelanData.length <= 1) {
            return false;
        } else {

        }
        this.sotnSdwansitelanData = this.sotnSdwansitelanData.filter((d, i) => i !== num - 1);
    }

    //add,edit,delete SdwanDevice
    addSdwanDevice() {
        if (this.tabInputShowDevice.indexOf(true) > -1) {//当有正在编辑的一行数据时，不允许添加新的行
            return false;
        }
        let addNum = this.siteSdwanDevice.length;
        let inputsData = Object.assign({}, this.siteCpeData);
        Object.keys(inputsData).forEach((item) => {//新增一行空数据
            if (item != "description") {
                inputsData[item] = null;
            }
        });
        this.siteSdwanDevice[addNum] = inputsData;
        this.tabInputShowDevice[addNum] = true;
        this.siteSdwanDevice = [...this.siteSdwanDevice]; //表格刷新
    }

    editDevicePort(num, item, siteSdwanDevice) {
        if (this.tabInputShowDevice[num - 1] == false) {
            this.tabInputShowDevice[num - 1] = true;
        } else {
            this.tabInputShowDevice[num - 1] = false;
        }
    }

    deleteDevicePort(num, item, siteSdwanDevice) {
        if (this.siteSdwanDevice.length <= 1) {
            return false;
        }
        this.siteSdwanDevice = this.siteSdwanDevice.filter((d, i) => i !== num - 1);
    }

    //add,edit,delete siteWanPort
    addSiteWan() {
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
    editWanPort(num, item, siteWanData) {
        if (this.tabInputShowWanPort[num - 1] == false) {
            this.tabInputShowWanPort[num - 1] = true;
        } else {
            this.tabInputShowWanPort[num - 1] = false;
        }
    }
    deleteWanPort(num, item, siteWanData) {
        if (this.siteWanData.length <= 1) {
            return false;
        }
        this.siteWanData = this.siteWanData.filter((d, i) => i !== num - 1);
    }

    //siteModel,sotnVpnModel Display sign
    siteModelShow = false;
    sotnVpnModelShow = false;
    addSotnvpn() {
        this.sotnVpnModelShow = true;
        this.isEditSotnVpn = 0;
    }
    addSite() {
        this.siteModelShow = true;
        this.isEditSite = 0;
    }

    //add sotnVpn model
    isEditSotnVpn = 0;//Edit serial number, No value, 0 means increase
    addSotnVpn_OK() {
        let inputs = {
            "sdwansitelan_list": []
        };
        inputs = Object.assign(inputs, this.sotnInfo);
        inputs["sdwansitelan_list"] = this.sotnSdwansitelanData.map((item) => {
            return Object.assign({}, item);
        });
        if (this.isEditSotnVpn) {
            // Edit status does not increase
            this.sotnVpnTableData[this.isEditSotnVpn - 1] = inputs;
            this.sotnVpnTableData = [...this.sotnVpnTableData]; //Table refresh
        } else {
            this.sotnVpnTableData = [...this.sotnVpnTableData, inputs];
        }
        Object.keys(this.sotnInfo).forEach((item) => { //Clear modal box
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
        this.sotnVpnModelShow = false;
    }

    addSotnVpn_cancel() {
        Object.keys(this.sotnInfo).forEach((item) => { //Clear modal box
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
        this.sotnVpnModelShow = false;
    }

    editSotnVpn(num) {
        this.sotnVpnModelShow = true;
        this.isEditSotnVpn = num;
        Object.keys(this.sotnInfo).forEach((item) => { //Clear modal box
            this.sotnInfo[item] = this.sotnVpnTableData[num - 1][item];
        });
        this.sotnSdwansitelanData = this.sotnVpnTableData[num - 1].sdwansitelan_list.map((item) => {
            return Object.assign({}, {}, item)
        });
        this.sotnSdwansitelanData.forEach((item, index) => {
            this.tabInputShowSdwansitelan[index] = false;
        });
    }

    deleteSotnVpn(num) {
        this.sotnVpnTableData = this.sotnVpnTableData.filter((d, i) => i !== num - 1);
    }

    // addsite model
    isEditSite = 0; //Edit serial number, No value, 0 means increase
    addsite_OK() {
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
            this.siteTableData = [...this.siteTableData, inputs];
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
        this.drawImage(this.siteTableData);
        this.siteModelShow = false;
    }

    addsite_cancel() {
        Object.keys(this.siteBaseData).forEach((item) => { //Clear modal box
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
        this.siteModelShow = false;
    }

    editSite(num) { //Edit and modify the selected site information
        this.siteModelShow = true;
        this.isEditSite = num;
        Object.keys(this.siteBaseData).forEach((item) => { //Clear modal box
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

    deleteSite(num) {
        this.siteTableData = this.siteTableData.filter((d, i) => i !== num - 1);
        this.drawImage(this.siteTableData);
    }

    // Site node graphic depiction
    lines = [];
    siteImage = [];
    tpImage = [];
    imgmap = {
        '1': '../../../assets/images/domain1.png',
        '2': '../../../assets/images/site.png'
    };

    drawImage(sitelist) {
        let cx = 550;
        let cy = 40;
        let innerx1 = 720; //Left site pattern coordinate position
        let innery1 = 40;
        let ox = 950;
        let oy = 50;
        let innerx2 = 780;//Right site pattern coordinate position
        let innery2 = 50;
        let lateX1 = Math.random() * 30 + 55;
        let lateX2 = 10;
        let lateY1 = 15;
        this.lines = sitelist.map((item, index) => {
            let step = index + 1;
            let x = cx;
            let y = cy;
            let innerX = innerx1;
            let innerY = innery1;
            if (step % 2 != 0) { //Left site pattern coordinate position
                x = cx;
                y = cy;
                innerX = innerx1;
                innerY = innery1;
                if (step == 1) {
                    innerX = innerx1;
                    innerY = innery1;
                } else {
                    x = cx - lateX1 * Math.ceil((step / 2)) >= 0 ? cx - lateX1 * Math.ceil((step / 2)) : -(cx - lateX1 * Math.ceil((step / 2)));
                    y = cy + lateY1 * Math.floor((step / 2));
                    innerX = this.lines[step - 3].innerX - lateX2;
                    innerY = y;
                }
            } else { //Right site pattern coordinate position
                x = ox;
                y = oy;
                innerX = innerx2;
                innerY = innery2;
                if (step / 2 == 1) {
                    innerX = innerx2;
                    innerY = innery2;
                } else {
                    x = ox + lateX1 * (step / 2) >= 0 ? ox + lateX1 * (step / 2) : -(ox + lateX1 * (step / 2));
                    y = oy + lateY1 * (step / 2 - 1);
                    innerX = this.lines[step - 3].innerX - lateX2;
                    innerY = y;
                }
            }
            return {
                img: "line",
                site: item.sdwandevice_list[0].name,
                x1: x,
                y1: y,
                x2: innerX,
                y2: innerY,
                innerX: innerX,
                innerY: innerY
            }
        });
        this.render(this.imgmap, this.lines);
    }

    render(imgmap, lines) {

        //enter
        var svg = d3.select("svg"),
            _g_lines = svg.selectAll('line.line')
                .data(lines)
                .enter()
                .append('line')
                .style('stroke', '#3fa8eb'
                )
                .style('stroke-width', 2)
                .attr('class', 'line')
                .attr("x1", function (d) {
                    return d.x1;
                })
                .attr("y1", function (d) {
                    return d.y1;
                })
                .attr("x2", function (d) {
                    return d.x2;
                })
                .attr("y2", function (d) {
                    return d.y2;
                }),
            _g_site = svg.selectAll('g.g-site')
                .data(lines)
                .enter()
                .append('g')
                .style('cursor', 'pointer')
                .attr('class', 'g-site');
        _g_site.append('image')
            .style("width", "50px")
            .attr('xlink:href', function (d) {
                return imgmap[2];
            })
            .attr("x", function (d) {
                return d.x1 - 25;
            })
            .attr("y", function (d) {
                return d.y1 - 25;
            })

        //quit
        svg.selectAll("g.g-site")
            .data(lines)
            .exit() //Select a picture without bound data
            .remove();
        svg.selectAll("line.line")
            .data(lines)
            .exit() //Select the connection without binding data
            .remove();

    }

    modifyJosnKey(json, oddkey, newkey) {

        let val = json[oddkey];
        delete json[oddkey];
        json[newkey] = val;
    }

    // submit createData
    submit() {
        let globalCustomerId = this.createParams.commonParams.customer.id;
        let globalServiceType = this.createParams.commonParams.serviceType.name;
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
                    requestInputs: {}
                },
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
                if (items.search("site") != -1 && Object.keys(item)[0].search("device") == -1 && item[items] instanceof Array === true) {
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

        this.closeCreate.emit(servicebody);

    }

    goback() {
        this.closeCreate.emit();
    }
}
