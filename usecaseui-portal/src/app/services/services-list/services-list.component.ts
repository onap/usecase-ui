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
import {Component, OnInit, HostBinding,TemplateRef } from '@angular/core';
import {MyhttpService} from '../../myhttp.service';
import {slideToRight} from '../../animates';
import {NzModalService} from 'ng-zorro-antd';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.less'],
  animations: [ slideToRight ]
})
export class ServicesListComponent implements OnInit {
  @HostBinding('@routerAnimate') routerAnimateState;
    constructor(private myhttp: MyhttpService, private modalService: NzModalService, private notification: NzNotificationService) {
    }

  ngOnInit() {
    this.getallCustomers();
  }
  // customer servicetype
  isSol005Interface = false;
  orchestratorList = [];
  customerList = [];
  customerList2 = [];
  customerSelected = {name:null,id:null};
  customerSelected2 = {name: null, id: null};
  serviceTypeList = [];
  serviceTypeList2 = [];
  serviceTypeSelected = {name:''};
  serviceTypeSelected2 = {name: ''};
    serviceTypeSelectedName = "";
    templateTypeSelected ="CCVPN";
  orchestratorSelected = {name:null,id:null};
  listSortMasters=JSON.parse(sessionStorage.getItem('listSortMasters'));
    language = sessionStorage.getItem("DefaultLang");
    iconMore=false;
    loadingAnimateShow = false;
    serviceMunber = [
        {
            "serviceDomain": "E2E",
            "Success": 0,
            "failed": 0,
            "InProgress": 0,
            "detailName":"i18nTextDefine_End_To_End_Service"
        },
        {
            "serviceDomain": "NS",
            "Success": 0,
            "failed": 0,
            "InProgress": 0,
            "detailName":"i18nTextDefine_Network_Service"
        },
        {
            "serviceDomain": "CCVPN",
            "Success": 0,
            "failed": 0,
            "InProgress": 0,
            "detailName":"i18nTextDefine_Cross_Domain_and_Cross_Layer_VPN"
        }
    ];

    //The icon behind each row of data in the table expands
    iconMoreShow(data,tableData){
        tableData.map((its) => {
            if(its["service-instance-id"]==data["service-instance-id"]){
                if(its["iconMore"]==false){
                    data.iconMore=true;
                }else if(its["iconMore"]==true) {
                    data.iconMore=false;
                }
            }else{
                its["iconMore"]=false;
            }
        })
    }
  getallCustomers(){
    console.log(this.listSortMasters);
    this.myhttp.getAllCustomers()
      .subscribe((data)=>{
        this.customerList = data.map((item)=>{return {name:item["subscriber-name"],id:item["global-customer-id"]}});
        if(this.customerList.length==0){
          console.log("customerList.length == 0",this.customerList);
          return false;
        }
                this.customerList2 = data.map((item) => {
                    return {name: item["subscriber-name"], id: item["global-customer-id"]}
                });
                if (this.customerList2.length == 0) {
                    console.log("customerList2.length == 0", this.customerList2);
                    return false;
                }
                this.customerSelected = this.customerList[0];
                this.choseCustomer(this.customerSelected);
            })
    }

  getallOrchestrators(){
    this.myhttp.getAllOrchestrators()
      .subscribe((data)=>{
        this.orchestratorList = data.map((item)=>{return {name:item["name"],id:item["name"]}});
        if(this.orchestratorList.length==0){
          console.log("orchestratorList.length == 0",this.orchestratorList);
          return false;
        }
        this.orchestratorSelected = this.orchestratorList[0];
      })
  }

  choseCustomer(item){
    this.customerSelected = item;
    this.myhttp.getServiceTypes(this.customerSelected)
      .subscribe((data)=>{
        this.serviceTypeList = data.map((item)=>{return {name:item["service-type"]}});
              
        if(this.serviceTypeList.length==0){
          console.log("serviceTypeList.length == 0",this.serviceTypeList);
          return false;
        }
          
        this.serviceTypeSelected = this.serviceTypeList[0];

        this.choseServiceType(this.serviceTypeSelected);
        // console.log(this.listServiceTypes);
      })
  }

  choseServiceType(item){
    this.serviceTypeSelected = item;
    this.getTableData();
  }


  // Create modal box 2 (dialog box) create -------------------------------
  isVisible = false;
    customerChange(): void {
        console.log(this.customerSelected2)
        this.getServiceType(this.customerSelected2);
    }
    getServiceType(customerSelected2) {
        this.myhttp.getServiceTypes(customerSelected2)
            .subscribe((data) => {
                this.serviceTypeList2 = data.map((item) => {
                    return {name: item["service-type"]}
                });
                if (this.serviceTypeList2.length == 0) {
                    console.log("serviceTypeList.length == 0", this.serviceTypeList2);
                    return false;
                }
                this.getAlltemplates();
            })
    }
    serviceTypeChange(): void {
        this.serviceTypeSelected2.name = this.serviceTypeSelectedName
        console.log(this.serviceTypeSelectedName)
    }
  createModal(): void {
    this.isVisible = true;
     this.getallOrchestrators();
        this.customerSelected2 = this.customerSelected;
        this.serviceTypeSelectedName = this.serviceTypeSelected.name;
        this.serviceTypeSelected2 = Object.assign({},this.serviceTypeSelected);
        this.getServiceType(this.customerSelected2);
  }
  //

  choseTemplateType(){
    this.getallOrchestrators();
    this.getAlltemplates();
  }
  //
  templates = [];
    template1 = {name: null};
    // template2 = {name: null};
    // template3 = {name: null};
    // template4 = {name: null};

  getAlltemplates(){  //
    this.myhttp.getAllServiceTemplates(this.templateTypeSelected)
      .subscribe((data)=>{
        // console.log(data)
        this.templates = data;
        if(this.templateTypeSelected=="Network Service"){
          this.templates = data.filter((d)=>{
            return typeof d.packageInfo.csarName== "string";
          }).map((item)=>{
              let cName = item.packageInfo.csarName.split("/").reverse()[0];
              return {name:cName,id:item.csarId,packageInfo:item.packageInfo}
          });
        }
        console.log(this.templates);
        this.template1 = this.templates[0];
             
            }, (err) => {

      })
  }


  //
  createshow = false;
  createshow2 = false;
    listDisplay = false;
  createData:Object={};
  handleOk(): void {
    // console.log('Button ok clicked!');

    if(this.templateTypeSelected=="SOTN"||this.templateTypeSelected=="CCVPN"){
     this.createData = {commonParams:{customer:this.customerSelected, serviceType:this.serviceTypeSelected2, templateType:this.templateTypeSelected},template:this.template1};
    }else if(this.templateTypeSelected=="E2E Service"||this.templateTypeSelected=="Network Service"){
      this.createData = {commonParams:{customer:this.customerSelected, serviceType:this.serviceTypeSelected2, templateType:this.templateTypeSelected},template:this.template1, orchestrator:this.orchestratorSelected, isSol005Interface:this.isSol005Interface};
    }
    this.getTemParameters();
  }
  handleCancel(): void {
    // console.log('Button cancel clicked!');
    this.isVisible = false;
    this.loadingAnimateShow = false;
  }


    temParametersTips=false;
    ccvpn_temParametersContent :any;
    e2e_ns_temParametersContent :any;
    getTemParameters(){
        let chosedtemplates = this.createData["template"];
        let types = this.createData["commonParams"].templateType;
        if(types == "E2E Service"){
            types = "e2e";
        }else if(types == "Network Service"){
            types = "ns";
        }
        this.loadingAnimateShow = true;
        this.myhttp.getTemplateParameters(types, chosedtemplates)
            .subscribe((data) => {
                this.loadingAnimateShow = false;
                if (data.status == "FAILED") {
                    this.temParametersTips = true;
                    this.isVisible = true;
                    console.log("Template parsing Failed");
                }else {
                    this.isVisible = false;
                    this.temParametersTips = false;
                    if (this.templateTypeSelected == "SOTN" || this.templateTypeSelected == "CCVPN") {
                        this.ccvpn_temParametersContent = data;
                        this.createshow = true;
                        this.listDisplay = true;
                    } else if (this.templateTypeSelected == "E2E Service" || this.templateTypeSelected == "Network Service") {
                        this.e2e_ns_temParametersContent = data;
                        this.createshow2 = true;
                        this.listDisplay = true;
                    }
                }
            })
    }

  //tableData
  tableData = [];
  pageIndex = 1;
  pageSize = 10;
  total = 100;
  loading = false;


    getTableData(){
    // Query parameter: customer serviceType Current page number, number of pages per page
    let paramsObj = {
      customerId:this.customerSelected.id,
      serviceType:this.serviceTypeSelected.name,
      currentPage:this.pageIndex,
      pageSize:this.pageSize
    }
    this.myhttp.getServicesTableData(paramsObj)
      .subscribe((data)=>{
        console.log(data);
        this.total = data.body.total;
        this.tableData = data.body.tableList.map((item)=>{
          if(typeof item == "string"){
            item = JSON.parse(item);
          }
          if(typeof item["childServiceInstances"] == "string"){
            item["childServiceInstances"] = JSON.parse(item["childServiceInstances"]);
          }

          item["childServiceInstances"] = item["childServiceInstances"].map((child)=>{
            if(typeof child == "string"){
              return JSON.parse(child);
            }else{
              return child;
            }
          })
                    item["iconMore"]=this.iconMore;
          if(item["serviceDomain"]=="Network Service"){
            if(item["vnfInfo"]){
              item["childServiceInstances"] = item["vnfInfo"].map((vnf)=>{
                vnf["serviceDomain"] = "vnf";
                return vnf;
              });
            }else if(item["relationship-list"] && item["relationship-list"]["relationship"]){
              item["childServiceInstances"] = item["relationship-list"]["relationship"].filter((relate)=>{
                return relate["related-to"]=="generic-vnf";
              }).map((vnf)=>{
                let vnfInfo = {vnfNsInstanceId:"",vnfInstanceId:"",vnfInstanceName:"",serviceDomain:"vnf"};
                vnfInfo.vnfNsInstanceId = item["nsInstanceId"] || item["service-instance-id"];
                vnfInfo.vnfInstanceId = vnf["relationship-data"].find((vnfid)=>{ return vnfid["relationship-key"]=="generic-vnf.vnf-id"})["relationship-value"];
                vnfInfo.vnfInstanceName = vnf["related-to-property"].find((vnfname)=>{ return vnfname["property-key"]=="generic-vnf.vnf-name"})["property-value"];
                return vnfInfo;
              })
            }
          }

          //
          if(item["operationResult"]=="2001"){ //operationResult==2001
            item["status"] = "Available";
            item["tips"] = "Available";
            item["statusClass"] = item["operationResult"];
          }
  // 2018.12.13
          else if(item["operationResult"]=="2002"){ //operationResult==2002
            if(item["operationType"]=="1001"||item["operationType"]=="1002"){
                // item["status"] = this.accordingState["operationResult"][item["operationResult"]];
              item["status"] = this.listSortMasters["operationResults"].find((its)=>{ return its["sortCode"]==item["operationResult"] && its["language"]==this.language})["sortValue"];
                item["tips"] = "Unavailable";
                item["statusClass"] = item["operationType"];
            }else if(item["operationType"]!="1001" && item["operationType"]!="1002"){
                // item["status"] = this.accordingState["operationResult"][item["operationResult"]];
              item["status"] = this.listSortMasters["operationResults"].find((its)=>{ return its["sortCode"]==item["operationResult"] && its["language"]==this.language})["sortValue"];
                item["tips"] = "Available";
                item["statusClass"] = item["operationType"];
            }

          }
          else if(item["operationResult"]=="2003"){ //operationResult==2003
              // item["status"] = this.accordingState["operationResult"][item["operationResult"]];
            item["status"] = this.listSortMasters["operationResults"].find((its)=>{ return its["sortCode"]==item["operationResult"] && its["language"]==this.language})["sortValue"];
              item["statusClass"] = item["operationType"];
            if(item["serviceDomain"]=="Network Service"){
              let updata = (prodata)=>{
                item["rate"] = prodata.progress;
                item["tips"] =this.listSortMasters["operationTypes"].find((its)=>{ return its["sortCode"]==item["operationType"] && its["language"]==this.language})["sortValue"]+'\xa0\xa0\xa0'+prodata.progress+"%";
                if(item["rate"] > 100){
                  item["status"]=prodata.status;
                  item["tips"] = this.listSortMasters["operationTypes"].find((its)=>{ return its["sortCode"]==item["operationType"] && its["language"]==this.language})["sortValue"]+'\xa0\xa0\xa0'+item["status"];
                }
              }
              let id = item["nsInstanceId"] || item["service-instance-id"];
              let jobid = item["jobId"] || item["operationId"];
              let operationType = item["operationType"];
              this.queryNsProgress(jobid,id,updata,operationType).then(()=>{
                item["rate"] = 100;
                item["status"] = this.listSortMasters["operationResults"].find((its) => {
                    return its["sortCode"] == 2001 && its["language"] == this.language
                })["sortValue"];
                item["tips"] = this.listSortMasters["operationTypes"].find((its)=>{ return its["sortCode"]==item["operationType"] && its["language"]==this.language})["sortValue"]+'\xa0\xa0\xa0'+item["status"];
              })
            }else{
              let updata = (prodata)=>{
                item["rate"] = prodata.progress || item["rate"];
                  item["tips"] = this.listSortMasters["operationTypes"].find((its)=>{ return its["sortCode"]==item["operationType"] && its["language"]==this.language})["sortValue"]+'\xa0\xa0\xa0'+prodata.progress+"%";
                if(item["rate"] > 100){
                  item["status"]=prodata.status;
                  item["tips"] = this.listSortMasters["operationTypes"].find((its)=>{ return its["sortCode"]==item["operationType"] && its["language"]==this.language})["sortValue"]+'\xa0\xa0\xa0'+item["status"];
                }
              }
              let obj = {
                serviceId:item["service-instance-id"],
                operationId:item["operationId"],
                operationType:item["operationType"]
              }
              this.queryProgress(obj,updata).then(()=>{
                item["rate"] = 100;
                item["status"] = this.listSortMasters["operationResults"].find((its) => {
                    return its["sortCode"] == 2001 && its["language"] == this.language
                })["sortValue"];
                item["tips"] = this.listSortMasters["operationTypes"].find((its)=>{ return its["sortCode"]==item["operationType"] && its["language"]==this.language})["sortValue"]+'\xa0\xa0\xa0'+item["status"];
              })
            }
          }
          return item;
        })
        console.log(this.tableData)
                this.tableData.map((item,index) => {
                    if(item.serviceDomain == 'E2E Service'){
                        if(item.operationResult == 2001){
                            this.serviceMunber[0]["Success"]+=1;
                        }else if(item.operationResult == 2002){
                            this.serviceMunber[0]["failed"]+=1;
                        }else if(item.operationResult == 2003){
                            this.serviceMunber[0]["InProgress"]+=1;
                        }
                    }
                    else if(item.serviceDomain == 'Network Service'){
                        if(item.operationResult == 2001){
                            this.serviceMunber[1]["Success"]+=1;
                        }else if(item.operationResult == 2002){
                            this.serviceMunber[1]["failed"]+=1;
                        }else if(item.operationResult == 2003){
                            this.serviceMunber[1]["InProgress"]+=1;
                        }
                    }
                    else if(item.serviceDomain == 'CCVPN'){
                        if(item.operationResult == 2001){
                            this.serviceMunber[2]["Success"]+=1;
                        }else if(item.operationResult == 2002){
                            this.serviceMunber[2]["failed"]+=1;
                        }else if(item.operationResult == 2003){
                            this.serviceMunber[2]["InProgress"]+=1;
                        }
                    }
                })
                console.log(this.serviceMunber)
      },(err)=>{
        console.log(err);
      })
  }

  searchData(reset:boolean = false){
    // console.log(reset)
    this.getTableData();
  }

  thisService = {};  //The current service of the operation
  e2e_nsData:Object[];
  scaleModelVisible = false;
  scaleService(service){
    this.thisService = service;
    this.scaleModelVisible = true;
    let paramsObj = {
      customerId:this.customerSelected.id,
      serviceType:this.serviceTypeSelected.name,
      serviceId:service["service-instance-id"]
    }
    this.myhttp.getE2e_nsData(paramsObj)
      .subscribe((data)=>{
        this.e2e_nsData = data;
      })
  }

    scaleOk(templatescalestarting,templateScaleSuccessFaild) {
    this.scaleModelVisible = false;
    let requestBody = {
      "service": {
        "serviceInstanceName": this.thisService["service-instance-name"],
        "serviceType": this.serviceTypeSelected.name,
        "globalSubscriberId": this.customerSelected.id,
        "resources": this.e2e_nsData.map((item)=>{
          return {
            "resourceInstanceId": item["netWorkServiceId"],
            "scaleType": item["scaleType"],
            "scaleNsData": {
              "scaleNsByStepsData": {
                "aspectId": item["aspectId"],
                "numberOfSteps": item["numberOfSteps"],
                "scalingDirection": item["scalingDirection"]
              }
            }
          }
        })
      }
    }
        this.scaleE2eService(this.thisService, requestBody,templateScaleSuccessFaild);
        this.scaleNotification(templatescalestarting);
  }
  scaleCancel(){
    this.scaleModelVisible = false;
  }

    scaleNotification(template: TemplateRef<{}>): void {
        console.log(template,"scaleNotification show");
        this.notification.template(template);
        // this.notification.template(template,{ nzDuration: 0 });
    }
    scaleSuccessNotification(template: TemplateRef<{}>): void {
        console.log(template,"scaleNotification show");
        this.notification.template(template);
        // this.notification.template(template,{ nzDuration: 0 });
    }
  updataService(){
    console.log("updataService!");
  }

  //heal
  healModelVisible = false;
  healActions = [];
  nsAdditional = [];
  nsParams = {
    degreeHealing:"HEAL_RESTORE",
    actionsHealing: [

    ],
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
  }
  addActionsHealing(){
    this.healActions.push({value:""})
  }
  minusActionsHealing(index){
    this.healActions.splice(index,1);
  }
  addNsAdditional(){
    this.nsAdditional.push({key:"",value:""})
  }
  minusNsAdditional(index){
    this.nsAdditional.splice(index,1);
  }
  healService(service){
    // console.log(service);
    this.thisService = service;
    this.healModelVisible = true;
    if(service.serviceDomain == "vnf"){
      this.vnfParams.vnfInstanceId = service.vnfInstanceId;
      this.myhttp.getVnfInfo(service.vnfInstanceId)
        .subscribe((data)=>{
          // console.log(data);
          this.vnfVms = data.vnfVms;
          this.vmSelected = this.vnfVms[0];
        })
    }
  }
  healOk(templatehealstarting,templatehealSuccessFaild){
    this.healModelVisible = false;
    // nsParams
    this.nsParams.actionsHealing = this.healActions.map((item)=>{return item.value});
    let additional = {};
    this.nsAdditional.forEach((item)=>{
      additional[item.key] = item.value;
    });
    this.nsParams.additionalParamsforNs = JSON.stringify(additional);
    // vnfParams
    this.vnfParams.additionalParams.actionvminfo.vmid = this.vmSelected["vmId"];
    this.vnfParams.additionalParams.actionvminfo.vmname = this.vmSelected["vmName"];

    let requestBody = this.thisService["serviceDomain"] == "Network Service" ? {healNsData:this.nsParams} : {healVnfData:this.vnfParams};
    console.log(requestBody);
        this.healNsVnfService(this.thisService, requestBody,templatehealSuccessFaild);
        this.healNotification(templatehealstarting);
  }
    healCancel() {
        this.healModelVisible = false;
    }

    healNotification(template: TemplateRef<{}>): void {
        console.log(template,"healNotification show");
        this.notification.template(template);
        // this.notification.template(template,{ nzDuration: 0 });
    }
    healSuccessNotification(template: TemplateRef<{}>): void {
        console.log(template,"healNotification show");
        this.notification.template(template);
        // this.notification.template(template,{ nzDuration: 0 });
    }
  // show detail
  detailshow = false;
    detailshow2 = false;
    upDateShow = false;
  detailData:Object;
  serviceDetail(service,typeNum){
    service["siteSer"]=[];
    service["sdwanSer"]=[];
    service["customer"]=this.customerSelected;
    service["serviceType"] = this.serviceTypeSelected;

    service.childServiceInstances.forEach((item)=>{
      if(item.serviceDomain=="SITE"){
        service.siteSer.push(item);
      }else if(item.serviceDomain=="SDWAN"){
        service.sdwanSer.push(item);
      }
    })
        if(service["serviceDomain"]=='CCVPN' ||service["serviceDomain"]=='SOTN' ){
            this.detailshow = true;
            if(typeNum == 1){
                this.upDateShow = false;
            }else {
                this.upDateShow = true;
            }
        }else if(service["serviceDomain"]=='E2E Service' || service["serviceDomain"]=='Network Service'){
            this.detailshow2 = true;
        }
        this.listDisplay = true;
    this.detailData = service;
    console.log(service);
  }

  deleteModelVisible = false;
  terminationType = "graceful";
  gracefulTerminationTimeout = 120;
  // delete Model show
  deleteModel(service){
    this.thisService = service;
    this.deleteModelVisible = true;
  }
deleteOk(templatedeletestarting,templateDeleteSuccessFaild) {
        this.deleteModelVisible = false;
        if (this.thisService["serviceDomain"] == "Network Service") {
            this.deleteNsService(this.thisService,templateDeleteSuccessFaild);
        } else {
            this.deleteService(this.thisService,templateDeleteSuccessFaild);
        }
        this.deleteNotification(templatedeletestarting);
    }

    deleteCancel() {
        this.deleteModelVisible = false;
    }

    deleteNotification(template: TemplateRef<{}>): void {
        console.log(template,"deleteNotification show");
        this.notification.template(template);
        // this.notification.template(template,{ nzDuration: 0 });
    }
    deleteSuccessNotification(template: TemplateRef<{}>): void {
        console.log(template,"deleteSuccessNotification show");
        this.notification.template(template);
        // this.notification.template(template,{ nzDuration: 0 });
    }

    createNotification(template: TemplateRef<{}>): void {
        console.log(template,"deleteNotification show");
        this.notification.template(template);
        // this.notification.template(template,{ nzDuration: 0 });
    }
    createSuccessNotification(template: TemplateRef<{}>): void {
        console.log(template,"deleteSuccessNotification show");
        this.notification.template(template);
        // this.notification.template(template,{ nzDuration: 0 });
    }
  //ccvpn sotn createservice
  parentServiceInstanceId="";
    thisCreateService = {};
  closeCreate(obj,templateCreatestarting,templateCreateSuccessFaild) {
    if(!obj){
      this.createshow = false; //close
      this.listDisplay = false; //close
      return false;
    }
    this.createshow = false;
        this.listDisplay = false;
    console.log(obj);
    let newData; //Newly created service data for the main table

        let createParams = "?customerId=" + this.customerSelected2.id +
            "&serviceType=" + this.serviceTypeSelected2.name +
            "&serviceDomain=" + this.templateTypeSelected;
        this.createService(obj, createParams,templateCreatestarting,templateCreateSuccessFaild).then((data) => {
            console.log(data)
            newData = {  //Newly created service data in the main form
                'service-instance-id': data["serviceId"],
                'service-instance-name': obj.service.name,
                serviceDomain: this.templateTypeSelected,
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
                }
            };
            let queryParams = {serviceId: data["serviceId"], operationId: data["operationId"]};
            return this.queryProgress(queryParams, updata);
        }).then((data) => {
            console.log(data);
            newData.rate = 100;
            newData.status = "Successful";
            this.createSuccessNotification(templateCreateSuccessFaild);
            newData.tips = this.listSortMasters["operationTypes"].find((its) => {
                return its["sortCode"] == newData["statusClass"] && its["language"] == this.language
            })["sortValue"] + '\xa0\xa0\xa0' +this.listSortMasters["operationResults"].find((its) => {
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

e2eCloseCreate(obj,templateCreatestarting,templateCreateSuccessFaild) {
    if(!obj){
      this.createshow2 = false; //
      this.listDisplay = false; //
      return false;
    }
    this.createshow2 = false; //
    this.listDisplay = false; //
    console.log(obj);
    let newData; //
    let   createParams = "?customerId="+this.customerSelected.id +
                        "&serviceType="+this.serviceTypeSelected2.name +
                        "&serviceDomain="+this.templateTypeSelected +
                        "&parentServiceInstanceId="+
                        "&uuid="+obj.service.serviceUuid+
                        "&invariantUuuid="+obj.service.serviceInvariantUuid;
        this.createService(obj, createParams,templateCreatestarting,templateCreateSuccessFaild).then((data) => {
      console.log(data);
      newData = {  //
        'service-instance-id':data["serviceId"],
        'service-instance-name':obj.service.name,
        serviceDomain:this.templateTypeSelected,
        childServiceInstances:[],
        status:"In Progress",
                statusClass: 1001,
        rate:0,
        tips:""
      }
            this.thisCreateService = newData;
      this.tableData = [newData,...this.tableData];
            this.createNotification(templateCreatestarting);
      let updata = (prodata)=>{
        newData.rate = prodata.progress;
        newData.tips = this.listSortMasters["operationTypes"].find((its) => {
            return its["sortCode"] == newData["statusClass"] && its["language"] == this.language
        })["sortValue"] + newData.rate + "%";
          if(newData["rate"] > 100){
          newData["status"]= prodata.status;
          newData.tips = this.listSortMasters["operationTypes"].find((its)=>{ return its["sortCode"]==newData["statusClass"] && its["language"]==this.language})["sortValue"]+'\xa0\xa0\xa0'+newData["status"];
        }
      }
      let queryParams = {serviceId:data["serviceId"],operationId:data["operationId"],operationType:"1001"};
      return this.queryProgress(queryParams,updata);
    }).then((data)=>{
      console.log(data);
      newData.rate = 100;
      newData.status = "Successful";
       this.createSuccessNotification(templateCreateSuccessFaild);
            newData.tips = this.listSortMasters["operationTypes"].find((its) => {
                return its["sortCode"] == newData["statusClass"] && its["language"] == this.language
            })["sortValue"] + '\xa0\xa0\xa0' + this.listSortMasters["operationResults"].find((its) => {
                return its["sortCode"] == 2001 && its["language"] == this.language
            })["sortValue"];
      let hasUndone = this.tableData.some((item)=>{
        return item.rate < 100;
      })
      if(!hasUndone){
        setTimeout(()=>{
          this.getTableData();
        },1000)
      }
    })

  }

    nsCloseCreate(obj,templateCreatestarting,templateCreateSuccessFaild) {
    if(!obj){
      this.createshow2 = false; //
      this.listDisplay = false; //
      return false;
    }
    this.createshow2 = false; //
    this.listDisplay = false; //
    console.log(obj);
    let newData; //
    // step1
    this.myhttp.nsCreateInstance(obj.step1)
    .subscribe((data)=>{
      // console.log(data);
      newData = {  //
        'service-instance-id':data.nsInstanceId,
        'service-instance-name':obj.step1.nsName,
        serviceDomain:this.templateTypeSelected,
        childServiceInstances:[],
        status:"In Progress",
        statusClass: 1001,
        rate:0,
        tips:""
      }
        this.thisCreateService = newData;
      this.tableData = [newData,...this.tableData];
        this.createNotification(templateCreatestarting);
      if(data.status == "FAILED"){
        console.log("create ns service Failed :" + JSON.stringify(data));
        newData.status = "Failed";
        this.createSuccessNotification(templateCreateSuccessFaild);
        return false;
      }
      let createParams = "?ns_instance_id=" + data.nsInstanceId +
                    "&customerId=" + this.customerSelected2.id +
                        "&serviceType="+this.serviceTypeSelected2.name +
                        "&serviceDomain="+ this.templateTypeSelected +
                        "&parentServiceInstanceId=";
      // step2
      this.createNsService(createParams,obj.step2).then((jobid)=>{
        if(jobid == "Failed"){
          newData.status = "Failed";
          console.log(jobid,"ns two jobid")
            this.thisCreateService = newData;
          console.log(this.thisCreateService)
        this.createSuccessNotification(templateCreateSuccessFaild);
        newData.tips = this.listSortMasters["operationTypes"].find((its) => {
            return its["sortCode"] == newData["statusClass"] && its["language"] == this.language
        })["sortValue"] + '\xa0\xa0\xa0' + this.listSortMasters["operationResults"].find((its) => {
            return its["sortCode"] == 2002 && its["language"] == this.language
        })["sortValue"];
          return false;
        }
        let operationType="1001";
        let updata = (prodata)=>{
          newData.rate = prodata.progress;
          newData.tips = this.listSortMasters["operationTypes"].find((its) => {
              return its["sortCode"] == newData["statusClass"] && its["language"] == this.language
          })["sortValue"] + newData.rate + "%";
          if(newData["rate"] > 100){
            newData["status"]=prodata.status;
            newData.tips = this.listSortMasters["operationTypes"].find((its)=>{ return its["sortCode"]==newData["statusClass"] && its["language"]==this.language})["sortValue"]+'\xa0\xa0\xa0'+newData["status"];
          }
        }

        return this.queryNsProgress(jobid,newData["service-instance-id"],updata,operationType);
      }).then((data)=>{
        console.log(data);
        newData.rate = 100;
        newData.status = "Successful";
        this.thisCreateService = newData;
        console.log(this.thisCreateService)
	    this.createSuccessNotification(templateCreateSuccessFaild);
                    newData.tips = this.listSortMasters["operationTypes"].find((its) => {
                        return its["sortCode"] == newData["statusClass"] && its["language"] == this.language
                    })["sortValue"] + '\xa0\xa0\xa0' + this.listSortMasters["operationResults"].find((its) => {
                        return its["sortCode"] == 2001 && its["language"] == this.language
                    })["sortValue"];
        let hasUndone = this.tableData.some((item)=>{
          return item.rate < 100;
        })
        if(!hasUndone){
          setTimeout(()=>{
            this.getTableData();
          },1000)
        }
      })
    })
  }

    createService(requestBody, createParams,templateCreatestarting,templateCreateSuccessFaild) {
    let mypromise = new Promise((res,rej)=>{
      this.myhttp.createInstance(requestBody,createParams)
        .subscribe((data)=>{
          if(data.status == "FAILED"){
            res("Failed");
            console.log("create e2e service Failed :" + JSON.stringify(data));
            return false;
          }
          res(data.service);
        })
    })
    return mypromise;
  }
  createNsService(id,obj){
    let mypromise = new Promise((res,rej)=>{
      this.myhttp.nsCreateInstance2(id,obj)
        .subscribe((data)=>{
          if(data.status == "FAILED"){
            console.log("instantiate ns service Failed :" + JSON.stringify(data));
            res("Failed");
            return false;
          }
          res(data.jobId);
        })
    })
    return mypromise;
  }

    scaleE2eService(service, requestBody,templateScaleSuccessFaild) {
    let id = service["service-instance-id"];
    service.rate = 0;
    service.status = "In Progress";
    service.statusClass = "1003";
        service.tips = "";
    this.myhttp.scaleE2eService(id,requestBody)
      .subscribe((data)=>{
        if(data.status == "FAILED"){
          console.log("scale E2e service Failed :" + JSON.stringify(data));
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
          serviceId:id,
          operationId:data.operationId,
          operationType:"1003"
        }
        let updata = (prodata)=>{
          service.rate = prodata.progress;
                    service.tips = this.listSortMasters["operationTypes"].find((its) => {
                        return its["sortCode"] == service.statusClass && its["language"] == this.language
                    })["sortValue"]  + '\xa0\xa0\xa0' +service["rate"]+"%";
          if(service["rate"] > 100){
            service["status"]=prodata.status;
                        service.tips = this.listSortMasters["operationTypes"].find((its) => {
                            return its["sortCode"] == service["statusClass"] && its["language"] == this.language
                        })["sortValue"]+ '\xa0\xa0\xa0' + service["status"];
          }
        }
        this.queryProgress(obj,updata).then(()=>{
          service.rate = 100;
          service.status = "Successful";
                    service.tips = this.listSortMasters["operationTypes"].find((its) => {
                        return its["sortCode"] == service["statusClass"] && its["language"] == this.language
                    })["sortValue"]+ '\xa0\xa0\xa0' + this.listSortMasters["operationResults"].find((its) => {
                        return its["sortCode"] == 2001 && its["language"] == this.language
                    })["sortValue"];
                    this.scaleSuccessNotification(templateScaleSuccessFaild);
        })
      })
  }

    healNsVnfService(service, requestBody,templatehealSuccessFaild) {
    console.log(service);
    service.rate = 0;
    service.status = "In Progress";
        service.tips = "";
    service.statusClass = "1004";
    let id = service.nsInstanceId || service["service-instance-id"] || service["vnfNsInstanceId"];
    this.myhttp.healNsService(id,requestBody)
      .subscribe((data)=>{
        if(data.status == "FAILED"){
          console.log("heal nsvnf service Failed :" + JSON.stringify(data));
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
        let updata = (prodata)=>{
          service.rate = prodata.progress;
                    service.tips = this.listSortMasters["operationTypes"].find((its) => {
                        return its["sortCode"] == service.statusClass && its["language"] == this.language
                    })["sortValue"] + '\xa0\xa0\xa0' +service.rate+"%";
                    console.log(service.rate)
          if(service["rate"] > 100){
            service["status"]=prodata.status;
                        service.tips = this.listSortMasters["operationTypes"].find((its) => {
                            return its["sortCode"] == service.statusClass && its["language"] == this.language
                        })["sortValue"] + '\xa0\xa0\xa0' + service["status"];
          }
        }
        this.queryNsProgress(jobid,null,updata,operationType).then((data1)=>{
          console.log(data1);
          service.rate = 100;
          service.status = "Successful";
                    service.tips = this.listSortMasters["operationTypes"].find((its) => {
                        return its["sortCode"] == service.statusClass && its["language"] == this.language
                    })["sortValue"]  + this.listSortMasters["operationResults"].find((its) => {
                        return its["sortCode"] == 2001 && its["language"] == this.language
                    })["sortValue"];
                    this.healSuccessNotification(templatehealSuccessFaild);
        });
      })
  }

    updateCcvpnNotification(template: TemplateRef<{}>): void {
        console.log(template,"updateCcvpnNotification show");
        this.notification.template(template);
        // this.notification.template(template,{ nzDuration: 0 });
    }
    updateCcvpnSuccessNotification(template: TemplateRef<{}>): void {
        console.log(template,"updateCcvpnSuccessNotification show");
        this.notification.template(template);
        // this.notification.template(template,{ nzDuration: 0 });
    }

    closeCCVPNUpdate(obj,templateUpdateSuccessFaild){
        console.log(obj);
        this.detailshow = false;
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
                    console.log("scale E2e service Failed :" + JSON.stringify(data));
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
                    })["sortValue"]  + '\xa0\xa0\xa0' +this.detailData["rate"]+"%";
                    if (this.detailData["rate"] > 100) {
                        this.detailData["status"] = prodata.status;
                        this.detailData["tips"] = this.listSortMasters["operationTypes"].find((its) => {
                            return its["sortCode"] == this.detailData["statusClass"] && its["language"] == this.language
                        })["sortValue"]+ '\xa0\xa0\xa0' + this.detailData["status"];
                    }
                };
                this.queryProgress(obj, updata).then(() => {
                    this.detailData["rate"] = 100;
                    this.detailData["status"] = "Successful";
                    this.detailData["tips"] = this.listSortMasters["operationTypes"].find((its) => {
                        return its["sortCode"] == this.detailData["statusClass"] && its["language"] == this.language
                    })["sortValue"]+ '\xa0\xa0\xa0' + this.listSortMasters["operationResults"].find((its) => {
                        return its["sortCode"] == 2001 && its["language"] == this.language
                    })["sortValue"];
                    this.updateCcvpnSuccessNotification(templateUpdateSuccessFaild);
                })
            })
    }

    deleteService(service,templateDeleteSuccessFaild) {
    let allprogress = {};  //
    let querypros = [];  //
    service.rate = 0;
    service.status = "In Progress";
        service.tips = "";
    service.statusClass = "1002";
    service["childServiceInstances"].push({"service-instance-id":service["service-instance-id"]});
    let deletePros = service["childServiceInstances"].map((item)=>{
      let params = {
        globalSubscriberId:this.customerSelected.id,
        serviceType:this.serviceTypeSelected,
        serviceInstanceId:item["service-instance-id"]
      }
      return new Promise((res,rej)=>{
        this.myhttp.deleteInstance(params)
        .subscribe((data)=>{
          if(data.status == "FAILED"){
            console.log("delete service Failed :" + JSON.stringify(data));
            service.status = "Failed";
                            service.tips = this.listSortMasters["operationTypes"].find((its)=>{ return its["sortCode"]==service.statusClass && its["language"]==this.language})["sortValue"]+'\xa0\xa0\xa0'+ this.listSortMasters["operationResults"].find((its) => {
                                return its["sortCode"] == 2002 && its["language"] == this.language
                            })["sortValue"];
            return false;
          }
          let obj = {serviceId:params.serviceInstanceId,operationId:data.operationId,operationType:"1002"}
          let updata = (prodata)=>{
            allprogress[prodata.operationId] = prodata.progress;
            let average = ((arr)=>{return eval(arr.join("+"))/arr.length})(Object.values(allprogress));
            service["rate"]=average;
                            service.tips = this.listSortMasters["operationTypes"].find((its)=>{ return its["sortCode"]==service.statusClass && its["language"]==this.language})["sortValue"] + '\xa0\xa0\xa0' +service["rate"]+"%";
            if(service["rate"] > 100){
              service["status"]=prodata.status;
                                service.tips = this.listSortMasters["operationTypes"].find((its)=>{ return its["sortCode"]==service.statusClass && its["language"]==this.language})["sortValue"] + '\xa0\xa0\xa0' + service["status"];
            }
          }
          querypros.push(this.queryProgress(obj,updata));
          res();
        })
      })
    })
    // console.log(deletePros)
    Promise.all(deletePros).then(()=>{
      Promise.all(querypros).then((data)=>{
        console.log(data);
        service.rate = 100;
        service.status = "Successful";
                service.tips = this.listSortMasters["operationTypes"].find((its)=>{ return its["sortCode"]==service.statusClass && its["language"]==this.language})["sortValue"] + this.listSortMasters["operationResults"].find((its) => {
                    return its["sortCode"] == 2001 && its["language"] == this.language
                })["sortValue"];
                this.deleteSuccessNotification(templateDeleteSuccessFaild);
        let hasUndone = this.tableData.some((item)=>{
          return item.rate < 100;
        })
        if(!hasUndone){
          setTimeout(()=>{
            this.getTableData();
          },1000)
        }
      })
    })
  }
    deleteNsService(service,templateDeleteSuccessFaild) {
    service.rate = 0;
    service.status = "In Progress";
        service.tips = "";
    service.statusClass = "1002";
    let id = service.nsInstanceId || service["service-instance-id"];
    let operationType ="1002";
    let requestBody = {
      terminationType : this.terminationType,
      gracefulTerminationTimeout : this.gracefulTerminationTimeout
    }
    this.stopNsService(id,requestBody).then((jobid)=>{
      if(jobid == "Failed"){
        service.status = "Failed";
          this.deleteSuccessNotification(templateDeleteSuccessFaild);
                service.tips = this.listSortMasters["operationTypes"].find((its)=>{ return its["sortCode"]==service.statusClass && its["language"]==this.language})["sortValue"] + this.listSortMasters["operationResults"].find((its) => {
                    return its["sortCode"] == 2002 && its["language"] == this.language
                })["sortValue"];
        return false;
      }
      let updata = (prodata)=>{
        service.rate = prodata.progress;
                service.tips = this.listSortMasters["operationTypes"].find((its)=>{ return its["sortCode"]==service.statusClass && its["language"]==this.language})["sortValue"] + '\xa0\xa0\xa0' +service.rate+"%";
        if(service["rate"] > 100){
          service["status"]=prodata.status;
                    service.tips = this.listSortMasters["operationTypes"].find((its)=>{ return its["sortCode"]==service.statusClass && its["language"]==this.language})["sortValue"] + service["status"];
        }
      }
      return this.queryNsProgress(jobid,null,updata,operationType);
    }).then(()=>{
      this.myhttp.nsDeleteInstance(id)
        .subscribe((data)=>{
          console.log(data);
          service.rate = 100;
          service.status = "Successful";
                    service.tips = this.listSortMasters["operationTypes"].find((its)=>{ return its["sortCode"]==service.statusClass && its["language"]==this.language})["sortValue"] + this.listSortMasters["operationResults"].find((its) => {
                        return its["sortCode"] == 2001 && its["language"] == this.language
                    })["sortValue"];
                    this.deleteSuccessNotification(templateDeleteSuccessFaild);
          if(data.status == "FAILED"){
            console.log("delete ns service Failed :" + JSON.stringify(data));
            service.status = "Failed";
                        service.tips = this.listSortMasters["operationTypes"].find((its)=>{ return its["sortCode"]==service.statusClass && its["language"]==this.language})["sortValue"] + this.listSortMasters["operationResults"].find((its) => {
                            return its["sortCode"] == 2002 && its["language"] == this.language
                        })["sortValue"];
                        this.deleteSuccessNotification(templateDeleteSuccessFaild);
            return false;
          }
                    console.log(service,"deleteservice");
                    console.log(this.thisService,"thisService");
          let hasUndone = this.tableData.some((item)=>{
            return item.rate < 100;
          })
          if(!hasUndone){
            setTimeout(()=>{
              this.getTableData();
            },1000)
          }
        })
    })
  }

  stopNsService(id,obj){
    let mypromise = new Promise((res,rej)=>{
      this.myhttp.stopNsService(id,obj)
        .subscribe((data)=>{
          if(data.status == "FAILED"){
            console.log("stop ns service Failed :" + JSON.stringify(data));
            res("Failed");
            return false;
          }
          res(data.jobId);
        })
    })
    return mypromise;
  }
  queryProgress(obj,callback){
    let mypromise = new Promise((res,rej)=>{
      // let data = {
      //   operationStatus:{
      //     "operationId": "XXXXXX",
      //     "operation": "create|delete|update|scale",
      //     "result": "finished|error|processing",
      //     "reason": "",
      //     "userId": "",
      //     "operationContent": "Be creating pop.",
      //     "progress": 0,
      //     "operateAt": "",
      //     "finishedAt": ""
      //   }
      // }
      let errorNums = 180;
      let requery = ()=>{
        this.myhttp.getProgress(obj)
          .subscribe((data)=>{
            if(data.status == "FAILED"){
              callback({progress:255,status:"Failed"});
              return false;
            }
            if(data.operationStatus == null || data.operationStatus.progress==undefined){
              // console.log(data);
              errorNums--;
              if(errorNums==0){
                 callback({progress:255,status:"time over"});
                 return false;
              }
              setTimeout(()=>{
                requery();
              },10000)
              return false;
            }
            if(data.operationStatus.progress > 100){
              callback({progress:255,status:"time over"});
              return false;
            }
            if(data.operationStatus.progress < 100){
              callback(data.operationStatus);
              setTimeout(()=>{
                requery();
              },5000)
            }else {
              res(data.operationStatus);
            }
          })
        // setTimeout(()=>{
        //   console.log(data.operationStatus.progress)
        //   data.operationStatus.progress++;
        //   if(data.operationStatus.progress<100){
        //     callback(data.operationStatus);
        //     requery()
        //   }else{
        //     callback(data.operationStatus);
        //     res(data.operationStatus)
        //   }
        // },100)
      }
      requery();
    })
    return mypromise;
  }
  queryNsProgress(jobid,id,callback,operationType){
    let mypromise = new Promise((res,rej)=>{
      // let data = {
      //   "jobId": "string",
      //   "responseDescriptor": {
      //     "status": "string",
      //     "progress": 0,
      //     "statusDescription": "string",
      //     "errorCode": "string",
      //     "responseId": "string",
      //     "responseHistoryList": [
      //       {
      //         "status": "string",
      //         "progress": "string",
      //         "statusDescription": "string",
      //         "errorCode": "string",
      //         "responseId": "string"
      //       }
      //     ]
      //   }
      // }
      let errorNums = 180;
      let requery = ()=>{
        this.myhttp.getNsProgress(jobid,id,operationType)
          .subscribe((data)=>{
            if(data.status == "FAILED"){
              callback({progress:255,status:"Failed"});
              return false;
            }
            if(data.responseDescriptor == null || data.responseDescriptor.progress==undefined){
              // console.log(data);
              errorNums--;
              if(errorNums==0){
                callback({progress:255,status:"time over"});
                return false;
              }
              setTimeout(()=>{
                requery();
              },10000)
              return false;
            }
            if(data.responseDescriptor.progress > 100 && data.responseDescriptor.status == "error"){
              callback({progress:255,status:data.responseDescriptor.statusDescription});
              return false;
            }
            if(data.responseDescriptor.progress < 100){
              callback(data.responseDescriptor);
              setTimeout(()=>{
                requery();
              },5000)
            }else {
              res(data);
            }
          })
        // setTimeout(()=>{
        //   console.log(data.responseDescriptor.progress)
        //   data.responseDescriptor.progress++;
        //   if(data.responseDescriptor.progress<100){
        //     callback(data.responseDescriptor);
        //     requery()
        //   }else{
        //     callback(data);
        //     res(data)
        //   }
        // },100)
      }
      requery();
    })
    return mypromise;
  }

}
