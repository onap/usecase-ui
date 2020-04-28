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
import { Component, OnInit, HostBinding, TemplateRef, ViewChild } from '@angular/core';
import { ServiceListService } from '../../../core/services/serviceList.service';
import { slideToRight } from '../../../shared/utils/animates';
import { NzModalService } from 'ng-zorro-antd';
import { NzNotificationService, NzMessageService } from 'ng-zorro-antd';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'app-services-list',
    templateUrl: './services-list.component.html',
    styleUrls: ['./services-list.component.less'],
    animations: [slideToRight]
})
export class ServicesListComponent implements OnInit {
    @HostBinding('@routerAnimate') routerAnimateState;
    @ViewChild('notification') notification1: any;

    public width: number = document.documentElement.clientWidth;

    constructor(
        private myhttp: ServiceListService,
        private modalService: NzModalService,
        private notification: NzNotificationService,
        private msg: NzMessageService) {
    }

    ngOnInit() {
        this.getallCustomers();

        Observable.fromEvent(window, 'resize').subscribe((event) => {
            this.width = document.documentElement.clientWidth
        });
    }
    ngOnDestroy() {
        clearInterval(this.progressCcvpnOutTimer);
        clearInterval(this.progressingCcvpnTimer);
        clearInterval(this.progressNsOutTimer);
        clearInterval(this.progressingNsTimer);
    }
    // customer servicetype
    isSol005Interface = false;
    orchestratorList = [];
    customerList = [];
    customerSelected = { name: null, id: null };
    serviceTypeList = [];
    serviceTypeSelected = { name: '' };
    templateTypeSelected = "CCVPN";
    orchestratorSelected = { name: null, id: null };
    listSortMasters = JSON.parse(sessionStorage.getItem('listSortMasters'));
    language = sessionStorage.getItem("DefaultLang");
    iconMore = false;
    loadingAnimateShow = false;
    serviceNunber = [ // top: E2E/NS/CCVPN/MDONS data
        {
            "serviceDomain": "E2E",
            "Success": 0,
            "failed": 0,
            "InProgress": 0,
            "detailName": "i18nTextDefine_End_To_End_Service"
        },
        {
            "serviceDomain": "NS",
            "Success": 0,
            "failed": 0,
            "InProgress": 0,
            "detailName": "i18nTextDefine_Network_Service"
        },
        {
            "serviceDomain": "CCVPN",
            "Success": 0,
            "failed": 0,
            "InProgress": 0,
            "detailName": "i18nTextDefine_Cross_Domain_and_Cross_Layer_VPN"
        },
        {
            "serviceDomain": "MDONS",
            "Success": 0,
            "failed": 0,
            "InProgress": 0,
            "detailName": "i18nTextDefine_MDONS"
        }
    ];

    progressCcvpnOutTimer: any; // ccvpn NS progress Timer
    progressingCcvpnTimer: any;
    progressNsOutTimer: any;
    progressingNsTimer: any;

    //The icon behind each row of data in the table expands
    iconMoreShow(data, tableData) {
        tableData.map((its) => {
            if (its["service-instance-id"] == data["service-instance-id"]) {
                if (its["iconMore"] == false) {
                    data.iconMore = true;
                } else if (its["iconMore"] == true) {
                    data.iconMore = false;
                }
            } else {
                its["iconMore"] = false;
            }
        })
    }

    //Get all the customers
    getallCustomers() {
        this.myhttp.getAllCustomers()
            .subscribe((data) => {
                this.customerList = data.map(item => ({ name: item["subscriber-name"], id: item["global-customer-id"] }));
                if (data.length !== 0) {
                    this.customerSelected = this.customerList[0];
                    this.choseCustomer();
                }
            })

    }

    getallOrchestrators() {
        this.myhttp.getAllOrchestrators()
            .subscribe((data) => {
                if (data.length > 0) {
                    this.orchestratorList = data.map((item) => {
                        return { name: item["name"], id: item["name"] }
                    });
                    this.orchestratorSelected = this.orchestratorList[0];
                }
            })
    }

    choseCustomer(item = this.customerSelected) {
        if (this.customerSelected !== item) this.customerSelected = item;
        this.myhttp.getServiceTypes(this.customerSelected)
            .subscribe((data) => {
                this.serviceTypeList = data.map(item => ({ name: item["service-type"] }));
                if (data.length !== 0) {
                    this.serviceTypeSelected = this.serviceTypeList[0];
                    this.choseServiceType();
                }
            })
    }

    choseServiceType(item = this.serviceTypeSelected) {
        if (this.serviceTypeSelected !== item) this.serviceTypeSelected = item;
        this.getTableData();
    }


    // Create modal box 2 (dialog box) create -------------------------------
    isVisible = false;

    createModal(): void {
        this.isVisible = true;
    }

    createshow: boolean = false;
    createshow2: boolean = false;
    showCreateMDONS: boolean = false;
    listDisplay: boolean = false;
    createData: Object = {};
    ccvpn_temParametersContent: any;
    e2e_ns_temParametersContent: any;
    mdons_temParametersContent: any;

    createdModalShow(obj: any): void {
        this.createData = obj.createData;
        if (obj.templateType === "SOTN" || obj.templateType === "CCVPN") {
            this.ccvpn_temParametersContent = obj.data;
            this.createshow = true;
        } else if (obj.templateType === "E2E Service" || obj.templateType === "Network Service") {
            this.e2e_ns_temParametersContent = obj.data;
            this.createshow2 = true;
        } else if (obj.templateType === "MDONS") {
            this.mdons_temParametersContent = obj.data;
            this.showCreateMDONS = true;
        }
        this.listDisplay = true;
    }

    //tableData
    tableData = [];
    pageIndex = 1;
    pageSize = 10;
    total = 100;
    loading = false;

    getTableData() {
        this.loading = true;
        // Query parameter: customer serviceType Current page number, number of pages per page
        let paramsObj = {
            customerId: this.customerSelected.id,
            serviceType: this.serviceTypeSelected.name,
            currentPage: this.pageIndex,
            pageSize: this.pageSize
        }
        this.myhttp.getServicesTableData(paramsObj)
            .subscribe((data) => {
                this.total = data.body.total;
                this.tableData = data.body.tableList.map((item) => {
                    if (typeof item == "string") {
                        item = JSON.parse(item);
                    }
                    item["iconMore"] = this.iconMore;
                    if (item["serviceDomain"] === "Network Service") {
                        if (item["vnfInfo"]) {
                            item["childServiceInstances"] = item["vnfInfo"].map((vnf) => {
                                vnf["serviceDomain"] = "vnf";
                                return vnf;
                            });
                        } else if (item["relationship-list"] && item["relationship-list"]["relationship"]) {
                            item["childServiceInstances"] = item["relationship-list"]["relationship"].filter((relate) => {
                                return relate["related-to"] == "generic-vnf";
                            }).map((vnf) => {
                                let vnfInfo = {
                                    vnfNsInstanceId: "",
                                    vnfInstanceId: "",
                                    vnfInstanceName: "",
                                    serviceDomain: "vnf"
                                };
                                vnfInfo.vnfNsInstanceId = item["nsInstanceId"] || item["service-instance-id"];
                                vnfInfo.vnfInstanceId = vnf["relationship-data"].find((vnfid) => {
                                    return vnfid["relationship-key"] === "generic-vnf.vnf-id"
                                })["relationship-value"];
                                vnfInfo.vnfInstanceName = vnf["related-to-property"].find((vnfname) => {
                                    return vnfname["property-key"] === "generic-vnf.vnf-name"
                                })["property-value"];
                                return vnfInfo;
                            })
                        }
			} else if(item["serviceDomain"] === "MDONS") {
                        if (item["relationship-list"] && item["relationship-list"]["relationship"]) {
                            let domainServiceList = [];
                            
                            for(let i = 0; i < item["relationship-list"]["relationship"].length; i++){
                                let domainServiceInfo = {
                                    domainServiceRealtedTo:"",
                                    domainServiceId:"",
                                    domainServiceName:"",
                                    logicalLinkName:""
                                }
                                
                                if(item["relationship-list"]["relationship"][i]["related-to"] === 'service-instance') {
                                    domainServiceInfo.domainServiceRealtedTo = "Domain Service Instance";
                                    domainServiceInfo.domainServiceName = item["relationship-list"]["relationship"][i]["related-to-property"][0]["property-value"];
                                } else if(item["relationship-list"]["relationship"][i]["related-to"] === 'logical-link'){
                                    domainServiceInfo.domainServiceRealtedTo = "Logical Link";
                                }
                                let relationshipdata = item["relationship-list"]["relationship"][i]["relationship-data"];
                                for (let j=0;j< relationshipdata.length;j++ ) {
                                    if(relationshipdata[j]["relationship-key"] === "service-instance.service-instance-id"){
                                        domainServiceInfo.domainServiceId = relationshipdata[j]["relationship-value"];
                                    }
                                    if(relationshipdata[j]["relationship-key"] === "logical-link.link-name"){
                                        domainServiceInfo.logicalLinkName = relationshipdata[j]["relationship-value"];
                                    }
                                }
                                
                                domainServiceList.splice(i,0,domainServiceInfo);    
                            }
                            item["childServiceInstances"]= domainServiceList;
                        } else {
                            item["childServiceInstances"] = [];
                        }
			} else{
                        item["childServiceInstances"] = [];
                    }

                    //
                    item["serviceStatusInfo"] = item["orchestration-status"]
                    if (item["operationResult"] === "2001") {
                        item["status"] = "Available";
                        item["tips"] = "Available";
                        item["statusClass"] = item["operationResult"];
                    }
                    // 2018.12.13
                    else if (item["operationResult"] === "2002") {
                        if (item["operationType"] === "1001" || item["operationType"] === "1002") {
                            // item["status"] = this.accordingState["operationResult"][item["operationResult"]];
                            item["status"] = this.listSortMasters["operationResults"].find((its) => {
                                return its["sortCode"] === item["operationResult"] && its["language"] === this.language
                            })["sortValue"];
                            item["tips"] = "Unavailable";
                            item["statusClass"] = item["operationType"];
                        } else {
                            item["status"] = this.listSortMasters["operationResults"].find((its) => {
                                return its["sortCode"] === item["operationResult"] && its["language"] === this.language
                            })["sortValue"];
                            item["tips"] = "Available";
                            item["statusClass"] = item["operationType"];
                        }

                    }
                    else if (item["operationResult"] === "2003") {
                        item["status"] = this.listSortMasters["operationResults"].find((its) => {
                            return its["sortCode"] == item["operationResult"] && its["language"] == this.language
                        })["sortValue"];
                        item["statusClass"] = item["operationType"];
                        if (item["serviceDomain"] == "Network Service") {
                            let updata = (prodata) => {
                                item["rate"] = prodata.progress;
                                item["tips"] = this.listSortMasters["operationTypes"].find((its) => {
                                    return its["sortCode"] == item["operationType"] && its["language"] == this.language
                                })["sortValue"] + '\xa0\xa0\xa0' + prodata.progress + "%";
                                if (item["rate"] > 100) {
                                    item["status"] = prodata.status;
                                    item["tips"] = this.listSortMasters["operationTypes"].find((its) => {
                                        return its["sortCode"] == item["operationType"] && its["language"] == this.language
                                    })["sortValue"] + '\xa0\xa0\xa0' + item["status"];
                                    this.getTableData();
                                }
                            }
                            let id = item["nsInstanceId"] || item["service-instance-id"];
                            let jobid = item["jobId"] || item["operationId"];
                            let operationType = item["operationType"];
                            this.queryNsProgress(jobid, id, updata, operationType).then(() => {
                                item["rate"] = 100;
                                item["status"] = this.listSortMasters["operationResults"].find((its) => {
                                    return its["sortCode"] == 2001 && its["language"] == this.language
                                })["sortValue"];
                                item["tips"] = this.listSortMasters["operationTypes"].find((its) => {
                                    return its["sortCode"] == item["operationType"] && its["language"] == this.language
                                })["sortValue"] + '\xa0\xa0\xa0' + item["status"];
                                this.getTableData();
                            })
                        } else {
                            let updata = (prodata) => {
                                item["rate"] = prodata.progress || 0;
                                if (item["rate"] > 100) {
                                    item["status"] = prodata.status;
                                    this.getTableData();
                                }
                                item["tips"] = this.listSortMasters["operationTypes"].find((its) => {
                                    return its["sortCode"] === item["operationType"] && its["language"] === this.language
                                })["sortValue"] + '\xa0\xa0\xa0' + (item["rate"] > 100 ? item["status"] : prodata.progress + '%');
                            }
                            let obj = {
                                serviceId: item["service-instance-id"],
                                operationId: item["operationId"],
                                operationType: item["operationType"]
                            }
                            this.queryProgress(obj, updata).then(() => {
                                item["rate"] = 100;
                                item["status"] = this.listSortMasters["operationResults"].find((its) => {
                                    return its["sortCode"] == 2001 && its["language"] == this.language
                                })["sortValue"];
                                item["tips"] = this.listSortMasters["operationTypes"].find((its) => {
                                    return its["sortCode"] == item["operationType"] && its["language"] == this.language
                                })["sortValue"] + '\xa0\xa0\xa0' + item["status"];
                                this.getTableData();
                            })
                        }
                    }
                    return item;
                })
                this.tableData.forEach(item => {
                    if (item.serviceDomain === 'E2E Service') {
                        if (Number(item.operationResult) === 2001) {
                            this.serviceNunber[0]["Success"] += 1;
                        } else if (Number(item.operationResult) === 2002) {
                            this.serviceNunber[0]["failed"] += 1;
                        } else if (Number(item.operationResult) === 2003) {
                            this.serviceNunber[0]["InProgress"] += 1;
                        }
                    }
                    else if (item.serviceDomain === 'Network Service') {
                        if (Number(item.operationResult) === 2001) {
                            this.serviceNunber[1]["Success"] += 1;
                        } else if (Number(item.operationResult) === 2002) {
                            this.serviceNunber[1]["failed"] += 1;
                        } else if (Number(item.operationResult) === 2003) {
                            this.serviceNunber[1]["InProgress"] += 1;
                        }
                    }
                    else if (item.serviceDomain === 'CCVPN') {
                        if (Number(item.operationResult) === 2001) {
                            this.serviceNunber[2]["Success"] += 1;
                        } else if (Number(item.operationResult) === 2002) {
                            this.serviceNunber[2]["failed"] += 1;
                        } else if (Number(item.operationResult) === 2003) {
                            this.serviceNunber[2]["InProgress"] += 1;
                        }
                    }
                    else if (item.serviceDomain === 'MDONS') {
                        if (Number(item.operationResult) === 2001) {
                            this.serviceNunber[3]["Success"] += 1;
                        } else if (Number(item.operationResult) === 2002) {
                            this.serviceNunber[3]["failed"] += 1;
                        } else if (Number(item.operationResult) === 2003) {
                            this.serviceNunber[3]["InProgress"] += 1;
                        }
                    }
                })
                this.loading = false;
            }, () => {
                this.msg.error('Network exception, please try again');
                this.loading = false;
            })
    }

    searchData(reset: boolean = false) {
        this.getTableData();
    }

    thisService = {};  //The current service of the operation
    e2e_nsData: Object[];
    scaleModelVisible = false;

    scaleService(service) {
        this.thisService = service;
        this.scaleModelVisible = true;
        let paramsObj = {
            customerId: this.customerSelected.id,
            serviceType: this.serviceTypeSelected.name,
            serviceId: service["service-instance-id"]
        };
        this.myhttp.getE2e_nsData(paramsObj)
            .subscribe((data) => {
                if(data.length!==0){
                    this.e2e_nsData = data;
                }
            })
    }

    scaleModalOK(obj: any, templatescalestarting, templateScaleSuccessFaild): void {
        this.scaleE2eService(this.thisService, obj, templateScaleSuccessFaild);
        this.scaleNotification(templatescalestarting);
    }

    scaleNotification(template: TemplateRef<{}>): void {
        this.notification.template(template);
    }

    scaleSuccessNotification(template: TemplateRef<{}>): void {
        this.notification.template(template);
    }

    //heal
    healModelVisible = false;
    healActions = [];
    nsAdditional = [];
    nsParams = {
        degreeHealing: "HEAL_RESTORE",
        actionsHealing: [],
        healScript: "",
        additionalParamsforNs: ""
    }
    vnfVms = [];
    vmSelected = {};
    vnfParams = {
        vnfInstanceId: "",
        cause: "",
        additionalParams: {
            action: "",
            actionvminfo: {
                vmid: "",
                vduid: "",
                vmname: ""
            }
        }
    };

    healService(service) {
        this.thisService = service;
        this.healModelVisible = true;
        if (service.serviceDomain == "vnf") {
            this.vnfParams.vnfInstanceId = service.vnfInstanceId;
            this.myhttp.getVnfInfo(service.vnfInstanceId)
                .subscribe((data) => {
                    if(data.vnfVms && data.vnfVms.length!==0){
                        this.vnfVms = data.vnfVms;
                        this.vmSelected = this.vnfVms[0];
                    }
                })
        }
    }

    healModalOK(obj: any, templatehealstarting, templatehealSuccessFaild): void {
        this.healNsVnfService(this.thisService, obj, templatehealSuccessFaild);
        this.healNotification(templatehealstarting);
    }

    healNotification(template: TemplateRef<{}>): void {
        this.notification.template(template);
    }

    healSuccessNotification(template: TemplateRef<{}>): void {
        this.notification.template(template);
    }

    // show detail
    detailCCVPNShow = false;
    detailNSShow = false;
    detailshowMDONS = false;
    upDateShow = false;
    detailData: Object;

    serviceDetail(service, typeNum) {
        service["siteSer"] = [];
        service["sdwanSer"] = [];
        service["customer"] = this.customerSelected;
        service["serviceType"] = this.serviceTypeSelected;

        if(service.childServiceInstances !== undefined){
            service.childServiceInstances.forEach((item) => {
                if (item.serviceDomain === "SITE") {
                    service.siteSer.push(item);
                } else if (item.serviceDomain === "SDWAN") {
                    service.sdwanSer.push(item);
                }
            })
        }
        if (service["serviceDomain"] === 'CCVPN' || service["serviceDomain"] === 'SOTN') {
            this.detailCCVPNShow = true;
            if (typeNum === 1) {
                this.upDateShow = false;
            } else {
                this.upDateShow = true;
            }
        } else if (service["serviceDomain"] === 'E2E Service' || service["serviceDomain"] === 'Network Service') {
            this.detailNSShow = true;
        } else if (service["serviceDomain"] === 'MDONS') {
            this.detailshowMDONS = false;
        }
        this.listDisplay = true;
        this.detailData = service;
    }

    deleteModalVisible = false;
    terminationType = "graceful";
    gracefulTerminationTimeout = 120;

    // delete Model show
    deleteModel(service) {
        this.thisService = service;
        this.deleteModalVisible = true;
    }

    deleteModalOK(obj: any, templateDeleteSuccessFaild): void {
        this.deleteModalVisible = false;
        this.loadingAnimateShow = true;
        if (this.thisService["serviceDomain"] === "Network Service") {
            this.deleteNsService(obj, this.thisService);
        } else {
            this.deleteService(this.thisService, templateDeleteSuccessFaild);
        }
        this.notification1.notificationStart(this.thisService['serviceDomain'], 'deleteStarting', this.thisService["service-instance-name"] || this.thisService["nsInstanceName"])
    }

    deleteSuccessNotification(template: TemplateRef<{}>): void {
        this.notification.template(template);
    }

    createNotification(template: TemplateRef<{}>): void {
        this.notification.template(template);
    }

    createSuccessNotification(template: TemplateRef<{}>): void {
        this.notification.template(template);
    }

    //ccvpn sotn createservice
    parentServiceInstanceId = "";
    thisCreateService = {};

    closeCreate(obj, templateCreatestarting, templateCreateSuccessFaild) {
        if (!obj) {
            this.createshow = false; //close
            this.listDisplay = false; //close
            return false;
        }
        this.createshow = false;
        this.listDisplay = false;
        this.loadingAnimateShow = true;
        let newData; //Newly created service data for the main table

        let createParams = "?customerId=" + this.createData['commonParams'].customer.id +
            "&serviceType=" + this.createData['commonParams'].serviceType.name +
            "&serviceDomain=" + this.createData['commonParams'].templateType;
        this.createService(obj, createParams, templateCreatestarting, templateCreateSuccessFaild).then((data) => {
            this.loadingAnimateShow = false;
            newData = {  //Newly created service data in the main form
                'service-instance-id': data["serviceId"],
                'service-instance-name': obj.service.name,
                serviceDomain: this.createData['commonParams'].templateType,
                childServiceInstances: [],
                status: "In Progress",
                rate: 0,
                statusClass: 1001,
                tips: ""
            };
            this.thisCreateService = newData;
            this.tableData = [newData, ...this.tableData];
            this.createNotification(templateCreatestarting);
            let updata = (prodata) => {
                newData.rate = prodata.progress;
                newData.tips = this.listSortMasters["operationTypes"].find((its) => {
                    return its["sortCode"] == newData["statusClass"] && its["language"] == this.language
                })["sortValue"] + newData.rate + "%";
                if (newData["rate"] > 100) {
                    newData["status"] = prodata.status;
                    newData.tips = this.listSortMasters["operationTypes"].find((its) => {
                        return its["sortCode"] == newData["statusClass"] && its["language"] == this.language
                    })["sortValue"] + '\xa0\xa0\xa0' + newData["status"];
                    this.getTableData();
                }
            };
            let queryParams = { serviceId: data["serviceId"], operationId: data["operationId"], operationType: "1001" };
            return this.queryProgress(queryParams, updata);
        }).then((data) => {

            newData.rate = 100;
            newData.status = "Successful";
            this.createSuccessNotification(templateCreateSuccessFaild);
            newData.tips = this.listSortMasters["operationTypes"].find((its) => {
                return its["sortCode"] == newData["statusClass"] && its["language"] == this.language
            })["sortValue"] + '\xa0\xa0\xa0' + this.listSortMasters["operationResults"].find((its) => {
                return its["sortCode"] == 2001 && its["language"] == this.language
            })["sortValue"];
            let hasUndone = this.tableData.some((item) => {
                return item.rate < 100;
            });
            if (!hasUndone) {
                setTimeout(() => {
                    this.getTableData();
                }, 1000)
            }
        })
    }

    mdonsCloseCreate(obj, templateCreatestarting, templateCreateSuccessFaild) {
        if (!obj) {
            this.showCreateMDONS = false; //
            this.listDisplay = false; //
            return false;
        }
        this.showCreateMDONS = false; //
        this.listDisplay = false; //
        this.loadingAnimateShow = true;
        let newData; //
        let createParams = "?customerId=" + this.customerSelected.id +
            "&serviceType=" + obj.service.serviceType +
            "&serviceDomain=" + "MDONS" +
            "&parentServiceInstanceId=" +
            "&uuid=" + obj.service.serviceUuid +
            "&invariantUuuid=" + obj.service.serviceInvariantUuid;
        this.createService(obj, createParams, templateCreatestarting, templateCreateSuccessFaild).then((data) => {
            this.loadingAnimateShow = false;
            newData = {
                'service-instance-id': data["serviceId"],
                'service-instance-name': obj.service.name,
                serviceDomain: "MDONS",
                childServiceInstances: [],
                status: "In Progress",
                statusClass: 1001,
                rate: 0,
                tips: ""
            }
            if (data == "FAILED") {
                newData.status = "Failed";
                newData.tips = "Unavailable";
                this.thisCreateService = newData;
                this.tableData = [newData, ...this.tableData];
                this.createNotification(templateCreateSuccessFaild);
                return false;
            }

            this.thisCreateService = newData;
            this.tableData = [newData, ...this.tableData];
            this.createNotification(templateCreatestarting);
            let updata = (prodata) => {
                newData.rate = prodata.progress;
                newData.tips = this.listSortMasters["operationTypes"].find((its) => {
                    return its["sortCode"] == newData["statusClass"] && its["language"] == this.language
                })["sortValue"] + newData.rate + "%";
                if (newData["rate"] > 100) {
                    newData["status"] = prodata.status;
                    newData.tips = this.listSortMasters["operationTypes"].find((its) => {
                        return its["sortCode"] == newData["statusClass"] && its["language"] == this.language
                    })["sortValue"] + '\xa0\xa0\xa0' + newData["status"];
                    this.getTableData();
                }
            }
            let queryParams = { serviceId: data["serviceId"], operationId: data["operationId"], operationType: "1001" };
            return this.queryProgress(queryParams, updata);
        }).then((data) => {
            if (data == false) {
                return false;
            }
            newData.rate = 100;
            newData.status = "Successful";
            this.createSuccessNotification(templateCreateSuccessFaild);
            newData.tips = this.listSortMasters["operationTypes"].find((its) => {
                return its["sortCode"] == newData["statusClass"] && its["language"] == this.language
            })["sortValue"] + '\xa0\xa0\xa0' + this.listSortMasters["operationResults"].find((its) => {
                return its["sortCode"] == 2001 && its["language"] == this.language
            })["sortValue"];
            let hasUndone = this.tableData.some((item) => {
                return item.rate < 100;
            })
            if (!hasUndone) {
                setTimeout(() => {
                    this.getTableData();
                }, 1000)
            }
        })

    }

    e2eCloseCreate(obj, templateCreatestarting, templateCreateSuccessFaild) {
        if (!obj) {
            this.createshow2 = false; //
            this.listDisplay = false; //
            return false;
        }
        this.createshow2 = false; //
        this.listDisplay = false; //
        this.loadingAnimateShow = true;
        let newData; //
        let createParams = "?customerId=" + this.customerSelected.id +
            "&serviceType=" + this.createData['commonParams'].serviceType.name +
            "&serviceDomain=" + this.createData['commonParams'].templateType +
            "&parentServiceInstanceId=" +
            "&uuid=" + obj.service.serviceUuid +
            "&invariantUuuid=" + obj.service.serviceInvariantUuid;
        this.createService(obj, createParams, templateCreatestarting, templateCreateSuccessFaild).then((data) => {
            this.loadingAnimateShow = false;
            newData = {  //
                'service-instance-id': data["serviceId"],
                'service-instance-name': obj.service.name,
                serviceDomain: this.createData['commonParams'].templateType,
                childServiceInstances: [],
                status: "In Progress",
                statusClass: 1001,
                rate: 0,
                tips: ""
            }
            this.thisCreateService = newData;
            this.tableData = [newData, ...this.tableData];
            this.createNotification(templateCreatestarting);
            let updata = (prodata) => {
                newData.rate = prodata.progress;
                newData.tips = this.listSortMasters["operationTypes"].find((its) => {
                    return its["sortCode"] == newData["statusClass"] && its["language"] == this.language
                })["sortValue"] + newData.rate + "%";
                if (newData["rate"] > 100) {
                    newData["status"] = prodata.status;
                    newData.tips = this.listSortMasters["operationTypes"].find((its) => {
                        return its["sortCode"] == newData["statusClass"] && its["language"] == this.language
                    })["sortValue"] + '\xa0\xa0\xa0' + newData["status"];
                    this.getTableData();
                }
            }
            let queryParams = { serviceId: data["serviceId"], operationId: data["operationId"], operationType: "1001" };
            return this.queryProgress(queryParams, updata);
        }).then((data) => {
            newData.rate = 100;
            newData.status = "Successful";
            this.createSuccessNotification(templateCreateSuccessFaild);
            newData.tips = this.listSortMasters["operationTypes"].find((its) => {
                return its["sortCode"] == newData["statusClass"] && its["language"] == this.language
            })["sortValue"] + '\xa0\xa0\xa0' + this.listSortMasters["operationResults"].find((its) => {
                return its["sortCode"] == 2001 && its["language"] == this.language
            })["sortValue"];
            let hasUndone = this.tableData.some((item) => {
                return item.rate < 100;
            })
            if (!hasUndone) {
                setTimeout(() => {
                    this.getTableData();
                }, 1000)
            }
        })

    }

    nsCloseCreate(obj, templateCreatestarting, templateCreateSuccessFaild) {
        if (!obj) {
            this.createshow2 = false; //
            this.listDisplay = false; //
            return false;
        }
        this.createshow2 = false; //
        this.listDisplay = false; //
        this.loadingAnimateShow = true;
        let newData; //
        // step1
        this.myhttp.nsCreateInstance(obj.step1)
            .subscribe((data) => {
                this.loadingAnimateShow = false;
                newData = {  //
                    'service-instance-id': data.nsInstanceId,
                    'service-instance-name': obj.step1.nsName,
                    serviceDomain: this.createData['commonParams'].templateType,
                    childServiceInstances: [],
                    status: "In Progress",
                    statusClass: 1001,
                    rate: 0,
                    tips: ""
                }
                this.thisCreateService = newData;
                this.tableData = [newData, ...this.tableData];
                this.createNotification(templateCreatestarting);
                if (data.status == "FAILED") {
                    newData.status = "Failed";
                    this.createSuccessNotification(templateCreateSuccessFaild);
                    return false;
                }
                let createParams = "?ns_instance_id=" + data.nsInstanceId +
                    "&customerId=" + this.createData['commonParams'].customer.id +
                    "&serviceType=" + this.createData['commonParams'].serviceType.name +
                    "&serviceDomain=" + this.createData['commonParams'].templateType +
                    "&parentServiceInstanceId=";
                // step2
                this.createNsService(createParams, obj.step2).then((jobid) => {
                    if (jobid == "Failed") {
                        newData.status = "Failed";
                        this.thisCreateService = newData;
                        this.createSuccessNotification(templateCreateSuccessFaild);
                        newData.tips = this.listSortMasters["operationTypes"].find((its) => {
                            return its["sortCode"] == newData["statusClass"] && its["language"] == this.language
                        })["sortValue"] + '\xa0\xa0\xa0' + this.listSortMasters["operationResults"].find((its) => {
                            return its["sortCode"] == 2002 && its["language"] == this.language
                        })["sortValue"];
                        return false;
                    }
                    let operationType = "1001";
                    let updata = (prodata) => {
                        newData.rate = prodata.progress;
                        newData.tips = this.listSortMasters["operationTypes"].find((its) => {
                            return its["sortCode"] == newData["statusClass"] && its["language"] == this.language
                        })["sortValue"] + newData.rate + "%";
                        if (newData["rate"] > 100) {
                            newData["status"] = prodata.status;
                            newData.tips = this.listSortMasters["operationTypes"].find((its) => {
                                return its["sortCode"] == newData["statusClass"] && its["language"] == this.language
                            })["sortValue"] + '\xa0\xa0\xa0' + newData["status"];
                            this.getTableData();
                        }
                    }

                    return this.queryNsProgress(jobid, newData["service-instance-id"], updata, operationType);
                }).then((data) => {
                    newData.rate = 100;
                    newData.status = "Successful";
                    this.thisCreateService = newData;
                    this.createSuccessNotification(templateCreateSuccessFaild);
                    newData.tips = this.listSortMasters["operationTypes"].find((its) => {
                        return its["sortCode"] == newData["statusClass"] && its["language"] == this.language
                    })["sortValue"] + '\xa0\xa0\xa0' + this.listSortMasters["operationResults"].find((its) => {
                        return its["sortCode"] == 2001 && its["language"] == this.language
                    })["sortValue"];
                    let hasUndone = this.tableData.some((item) => {
                        return item.rate < 100;
                    })
                    if (!hasUndone) {
                        setTimeout(() => {
                            this.getTableData();
                        }, 1000)
                    }
                })
            })
    }

    createService(requestBody, createParams, templateCreatestarting, templateCreateSuccessFaild) {
        let mypromise = new Promise((res, rej) => {
            this.myhttp.createInstance(requestBody, createParams)
                .subscribe((data) => {
                    if (data.status == "FAILED") {
                        this.loadingAnimateShow = false;
                        res("Failed");
                        return false;
                    }
                    res(data.service);
                },
                    (error) => {
                        this.loadingAnimateShow = false;
                        res("FAILED");
                        return false;
                    })
        })
        return mypromise;
    }

    createNsService(id, obj) {
        let mypromise = new Promise((res, rej) => {
            this.myhttp.nsCreateInstance2(id, obj)
                .subscribe((data) => {
                    if (data.status == "FAILED") {
                        this.loadingAnimateShow = false;
                        res("Failed");
                        return false;
                    }
                    res(data.jobId);
                })
        })
        return mypromise;
    }

    scaleE2eService(service, requestBody, templateScaleSuccessFaild) {
        let id = service["service-instance-id"];
        service.rate = 0;
        service.status = "In Progress";
        service.statusClass = "1003";
        service.tips = "";
        this.myhttp.scaleE2eService(id, requestBody)
            .subscribe((data) => {
                if (data.status == "FAILED") {
                    service.status = "Failed";
                    service.tips = this.listSortMasters["operationTypes"].find((its) => {
                        return its["sortCode"] == service.statusClass && its["language"] == this.language
                    })["sortValue"] + '\xa0\xa0\xa0' + this.listSortMasters["operationResults"].find((its) => {
                        return its["sortCode"] == 2002 && its["language"] == this.language
                    })["sortValue"];
                    this.scaleSuccessNotification(templateScaleSuccessFaild);
                    return false;
                }
                let obj = {
                    serviceId: id,
                    operationId: data.operationId,
                    operationType: "1003"
                }
                let updata = (prodata) => {
                    service.rate = prodata.progress;
                    service.tips = this.listSortMasters["operationTypes"].find((its) => {
                        return its["sortCode"] == service.statusClass && its["language"] == this.language
                    })["sortValue"] + '\xa0\xa0\xa0' + service["rate"] + "%";
                    if (service["rate"] > 100) {
                        service["status"] = prodata.status;
                        service.tips = this.listSortMasters["operationTypes"].find((its) => {
                            return its["sortCode"] == service["statusClass"] && its["language"] == this.language
                        })["sortValue"] + '\xa0\xa0\xa0' + service["status"];
                    }
                }
                this.queryProgress(obj, updata).then(() => {
                    service.rate = 100;
                    service.status = "Successful";
                    service.tips = this.listSortMasters["operationTypes"].find((its) => {
                        return its["sortCode"] == service["statusClass"] && its["language"] == this.language
                    })["sortValue"] + '\xa0\xa0\xa0' + this.listSortMasters["operationResults"].find((its) => {
                        return its["sortCode"] == 2001 && its["language"] == this.language
                    })["sortValue"];
                    this.scaleSuccessNotification(templateScaleSuccessFaild);
                })
            })
    }

    healNsVnfService(service, requestBody, templatehealSuccessFaild) {
        service.rate = 0;
        service.status = "In Progress";
        service.tips = "";
        service.statusClass = "1004";
        let id = service.nsInstanceId || service["service-instance-id"] || service["vnfNsInstanceId"];
        let paramsObj = {
            "ns_instance_id": id
        };
        this.myhttp.healNsService(paramsObj, requestBody)
            .subscribe((data) => {
                if (data.status == "FAILED") {
                    service.status = "Failed";
                    service.tips = this.listSortMasters["operationTypes"].find((its) => {
                        return its["sortCode"] == service.statusClass && its["language"] == this.language
                    })["sortValue"] + '\xa0\xa0\xa0' + this.listSortMasters["operationResults"].find((its) => {
                        return its["sortCode"] == 2002 && its["language"] == this.language
                    })["sortValue"];
                    this.healSuccessNotification(templatehealSuccessFaild);
                    return false;
                }
                let jobid = data.jobId;
                let operationType = "1004";
                let updata = (prodata) => {
                    service.rate = prodata.progress;
                    service.tips = this.listSortMasters["operationTypes"].find((its) => {
                        return its["sortCode"] == service.statusClass && its["language"] == this.language
                    })["sortValue"] + '\xa0\xa0\xa0' + service.rate + "%";
                    if (service["rate"] > 100) {
                        service["status"] = prodata.status;
                        service.tips = this.listSortMasters["operationTypes"].find((its) => {
                            return its["sortCode"] == service.statusClass && its["language"] == this.language
                        })["sortValue"] + '\xa0\xa0\xa0' + service["status"];
                    }
                }
                this.queryNsProgress(jobid, null, updata, operationType).then((data1) => {
                    service.rate = 100;
                    service.status = "Successful";
                    service.tips = this.listSortMasters["operationTypes"].find((its) => {
                        return its["sortCode"] == service.statusClass && its["language"] == this.language
                    })["sortValue"] + this.listSortMasters["operationResults"].find((its) => {
                        return its["sortCode"] == 2001 && its["language"] == this.language
                    })["sortValue"];
                    this.healSuccessNotification(templatehealSuccessFaild);
                });
            })
    }

    updateCcvpnNotification(template: TemplateRef<{}>): void {
        this.notification.template(template);
    }

    updateCcvpnSuccessNotification(template: TemplateRef<{}>): void {
        this.notification.template(template);
    }

    closeCCVPNUpdate(obj, templateUpdateSuccessFaild) {
        this.detailCCVPNShow = false;
        this.listDisplay = false;
        this.upDateShow = false;
        this.detailData["rate"] = 0;
        this.detailData["status"] = "In Progress";
        this.detailData['tips'] = "";
        this.detailData["statusClass"] = "1005";
        let id = this.detailData["service-instance-id"];
        this.myhttp.updateccvpn(id, obj)
            .subscribe((data) => {
                if (data.status == "FAILED") {
                    this.detailData["status"] = "Failed";
                    this.detailData["tips"] = this.listSortMasters["operationTypes"].find((its) => {
                        return its["sortCode"] == this.detailData["statusClass"] && its["language"] == this.language
                    })["sortValue"] + '\xa0\xa0\xa0' + this.listSortMasters["operationResults"].find((its) => {
                        return its["sortCode"] == 2002 && its["language"] == this.language
                    })["sortValue"];
                    this.updateCcvpnSuccessNotification(templateUpdateSuccessFaild);
                    return false;
                }
                let obj = {
                    serviceId: id,
                    operationId: data.operationId
                }
                let updata = (prodata) => {
                    this.detailData["rate"] = prodata.progress;
                    this.detailData["tips"] = this.listSortMasters["operationTypes"].find((its) => {
                        return its["sortCode"] == this.detailData["statusClass"] && its["language"] == this.language
                    })["sortValue"] + '\xa0\xa0\xa0' + this.detailData["rate"] + "%";
                    if (this.detailData["rate"] > 100) {
                        this.detailData["status"] = prodata.status;
                        this.detailData["tips"] = this.listSortMasters["operationTypes"].find((its) => {
                            return its["sortCode"] == this.detailData["statusClass"] && its["language"] == this.language
                        })["sortValue"] + '\xa0\xa0\xa0' + this.detailData["status"];
                    }
                };
                this.queryProgress(obj, updata).then(() => {
                    this.detailData["rate"] = 100;
                    this.detailData["status"] = "Successful";
                    this.detailData["tips"] = this.listSortMasters["operationTypes"].find((its) => {
                        return its["sortCode"] == this.detailData["statusClass"] && its["language"] == this.language
                    })["sortValue"] + '\xa0\xa0\xa0' + this.listSortMasters["operationResults"].find((its) => {
                        return its["sortCode"] == 2001 && its["language"] == this.language
                    })["sortValue"];
                    this.updateCcvpnSuccessNotification(templateUpdateSuccessFaild);
                })
            })
    }

    deleteService(service: any, templateDeleteSuccessFaild) {
        let allprogress = {};
        let querypros = [];
        service.rate = 0;
        service.status = "In Progress";
        service.tips = "";
        service.statusClass = "1002";
        service["childServiceInstances"].push({ "service-instance-id": service["service-instance-id"] });
        let deletePros = service["childServiceInstances"].map((item) => {
            let params = {
                globalSubscriberId: this.customerSelected.id,
                serviceType: this.serviceTypeSelected,
                serviceInstanceId: item["service-instance-id"]
            }
            return new Promise((res, rej) => {
                this.myhttp.deleteInstance(params)
                    .subscribe((data) => {
                        this.loadingAnimateShow = false;
                        if (data.status == "FAILED") {
                            service.status = "Failed";
                            service.tips = this.listSortMasters["operationTypes"].find((its) => {
                                return its["sortCode"] == service.statusClass && its["language"] == this.language
                            })["sortValue"] + '\xa0\xa0\xa0' + this.listSortMasters["operationResults"].find((its) => {
                                return its["sortCode"] == 2002 && its["language"] == this.language
                            })["sortValue"];
                            return false;
                        }
                        let obj = {
                            serviceId: params.serviceInstanceId,
                            operationId: data.operationId,
                            operationType: "1002"
                        }
                        let updata = (prodata) => {
                            allprogress[prodata.operationId] = prodata.progress;
                            let average = ((arr) => {
                                return eval(arr.join("+")) / arr.length
                            })(Object.values(allprogress));
                            service["rate"] = average;
                            service.tips = this.listSortMasters["operationTypes"].find((its) => {
                                return its["sortCode"] == service.statusClass && its["language"] == this.language
                            })["sortValue"] + '\xa0\xa0\xa0' + service["rate"] + "%";
                            if (service["rate"] > 100) {
                                service["status"] = prodata.status;
                                service.tips = this.listSortMasters["operationTypes"].find((its) => {
                                    return its["sortCode"] == service.statusClass && its["language"] == this.language
                                })["sortValue"] + '\xa0\xa0\xa0' + service["status"];
                            }
                        };
                        querypros.push(this.queryProgress(obj, updata));
                        res();
                    })
            })
        });
        Promise.all(deletePros).then(() => {
            Promise.all(querypros).then((data) => {
                service.rate = 100;
                service.status = "Successful";
                service.tips = this.listSortMasters["operationTypes"].find((its) => {
                    return its["sortCode"] == service.statusClass && its["language"] == this.language
                })["sortValue"] + this.listSortMasters["operationResults"].find((its) => {
                    return its["sortCode"] == 2001 && its["language"] == this.language
                })["sortValue"];
                this.deleteSuccessNotification(templateDeleteSuccessFaild);
                let hasUndone = this.tableData.some((item) => {
                    return item.rate < 100;
                })
                if (!hasUndone) {
                    setTimeout(() => {
                        this.getTableData();
                    }, 1000)
                }
            })
        })
    }

    deleteNsService(obj: any, service: any) {
        service.rate = 0;
        service.status = "In Progress";
        service.tips = "";
        service.statusClass = "1002";
        let id = service.nsInstanceId || service["service-instance-id"];
        let operationType = "1002";
        this.stopNsService(id, obj).then((jobid) => {
            if (jobid === "Failed") {
                service.status = "Failed";
                this.notification1.notificationFailed(service.serviceDomain, 'deleteStarting', service["service-instance-name"] || service["nsInstanceName"])
                service.tips = this.listSortMasters["operationTypes"].find((its) => {
                    return its["sortCode"] == service.statusClass && its["language"] == this.language
                })["sortValue"] + this.listSortMasters["operationResults"].find((its) => {
                    return its["sortCode"] == 2002 && its["language"] == this.language
                })["sortValue"];
                return false;
            }
            let updata = (prodata) => {
                service.rate = prodata.progress || 0;
                if (service['rate'] > 100) service["status"] = prodata.status;
                service.tips = this.listSortMasters["operationTypes"].find((its) => {
                    return its["sortCode"] == service.statusClass && its["language"] == this.language
                })["sortValue"] + (service["rate"] > 100 ? service["status"] : ('\xa0\xa0\xa0' + service.rate + "%"));
            }
            this.queryNsProgress(jobid, null, updata, operationType).then(() => {
                let paramsObj = {
                    "ns_instance_id": id
                };
                this.myhttp.nsDeleteInstance(paramsObj)
                    .subscribe((data) => {
                        if (data.status == "SUCCESS") {
                            service.rate = 100;
                            service.status = "Successful";
                            service.tips = this.listSortMasters["operationTypes"].find((its) => {
                                return its["sortCode"] == service.statusClass && its["language"] == this.language
                            })["sortValue"] + this.listSortMasters["operationResults"].find((its) => {
                                return its["sortCode"] == 2001 && its["language"] == this.language
                            })["sortValue"];
                            this.notification1.notificationSuccess(service.serviceDomain, 'deleteStarting', service["service-instance-name"] || service["nsInstanceName"])
                        } else {
                            service.status = "Failed";
                            service.tips = this.listSortMasters["operationTypes"].find((its) => {
                                return its["sortCode"] == service.statusClass && its["language"] == this.language
                            })["sortValue"] + this.listSortMasters["operationResults"].find((its) => {
                                return its["sortCode"] == 2002 && its["language"] == this.language
                            })["sortValue"];
                            this.notification1.notificationFailed(service.serviceDomain, 'deleteStarting', service["service-instance-name"] || service["nsInstanceName"])
                            return false;
                        }
                        let hasUndone = this.tableData.some((item) => {
                            return item.rate < 100;
                        })
                        if (!hasUndone) {
                            setTimeout(() => {
                                this.getTableData();
                            }, 1000)
                        }
                    })
            })
        })
    }

    stopNsService(id, obj) {
        let paramsObj = {
            "ns_instance_id": id
        }
        return new Promise((res, rej) => {
            this.myhttp.stopNsService(paramsObj, obj)
                .subscribe((data) => {
                    this.loadingAnimateShow = false;
                    if (data.status == "FAILED") {
                        res("Failed");
                        return false;
                    }
                    res(data.jobId);
                })
        })
    }

    queryProgress(obj, callback) {
        return new Promise(res => {
            let operationTypeObj = { operationType: obj.operationType };
            let errorNums = 180;
            let requeryCcvpn = () => {
                this.myhttp.getProgress(obj, operationTypeObj)
                    .subscribe((data) => {
                        if (data.status === "FAILED") {
                            callback({ progress: 255, status: "Failed" });
                        } else if (data.operationStatus === null || data.operationStatus.progress === undefined) {
                            errorNums--;
                            if (errorNums === 0) {
                                callback({ progress: 255, status: "time over" });
                                return false;
                            }
                            this.progressCcvpnOutTimer = setTimeout(() => {
                                requeryCcvpn();
                            }, 10000);
                        } else if (data.operationStatus.progress > 100) {
                            callback({ progress: 255, status: "time over" });
                        } else if (data.operationStatus.progress < 100) {
                            callback(data.operationStatus);
                            this.progressingCcvpnTimer = setTimeout(() => {
                                requeryCcvpn();
                            }, 5000);
                        } else {
                            res(data.operationStatus);
                        }
                    })
            }
            requeryCcvpn();
        })
    }

    queryNsProgress(jobid, id, callback, operationType) {
        return new Promise((res, rej) => {
            let errorNums = 180;
            let paramsObj = {
                "responseId": 0,
                "serviceInstanceId": id,
                "operationType": operationType
            }
            let requeryNs = () => {
                this.myhttp.getNsProgress(jobid, paramsObj)
                    .subscribe((data) => {
                        if (data.status == "FAILED") {
                            callback({ progress: 255, status: "Failed" });
                        } else if (data.responseDescriptor === null || data.responseDescriptor.progress === undefined) {
                            errorNums--;
                            if (errorNums === 0) {
                                callback({ progress: 255, status: "time over" });
                                return false;
                            }
                            this.progressNsOutTimer = setTimeout(() => {
                                requeryNs();
                            }, 10000);
                        } else if (data.responseDescriptor.progress > 100 && data.responseDescriptor.status === "error") {
                            callback({ progress: 255, status: data.responseDescriptor.statusDescription });
                        } else if (data.responseDescriptor.progress < 100) {
                            callback(data.responseDescriptor);
                            this.progressingNsTimer = setTimeout(() => {
                                requeryNs();
                            }, 5000);
                        } else {
                            res(data);
                        }
                    })
            };
            requeryNs();
        });
    }
}
