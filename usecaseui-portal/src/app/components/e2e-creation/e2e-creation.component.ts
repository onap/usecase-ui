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
import { MyhttpService } from '../../myhttp.service';

@Component({
  selector: 'app-e2e-creation',
  templateUrl: './e2e-creation.component.html',
  styleUrls: ['./e2e-creation.component.less']
})
export class E2eCreationComponent implements OnInit {

  constructor( private myhttp:MyhttpService ) { }

  ngOnInit() {
    this.getTemParameters();
    this.getVimInfo();
    this.getSdnControllers();
    console.log(this.createParams);
  }

  @Output() e2eCloseCreate = new EventEmitter();
  @Output() nsCloseCreate = new EventEmitter();
  @Input() createParams;


  // e2e serviceTemplateParameters
  templateParameters = {
    invariantUUID: "",
    uuid: "",
    name: "",
    type: "",
    version: "",
    description: "",
    category: "",
    subcategory: "",
    customizationUuid: "",
    inputs:[],
    nestedTemplates:[]
  };
  // ns serviceTemplateParameters
  nsTemplateParameters = {
    inputs:{},
    inputs2:[],
    vnfs:[]
  }
  getTemParameters(){ //Get template parameters
    let type = this.createParams.commonParams.templateType == "E2E Service" ? "e2e" : "ns";
    this.myhttp.getTemplateParameters(type,this.createParams.template)
    .subscribe((data)=>{
      // console.log(this.createParams);
      // console.log(data);
      if(type == "e2e"){
        this.templateParameters = data;
        this.templateParameters.nestedTemplates.forEach((item)=>{
          item.inputs = item.inputs.filter((input)=>{return input.type !== "sdn_controller"});
        })
      }else if(type == "ns"){
        if(typeof data["model"]=='string'){
          this.nsTemplateParameters = JSON.parse(data["model"]);
        }else{
          this.nsTemplateParameters = data;
        }
        this.nsTemplateParameters["inputs2"] = [];
        let inputs = this.nsTemplateParameters.inputs;
        for(let key in inputs){
          this.nsTemplateParameters["inputs2"].push({name:key,type:inputs[key].type,value:inputs[key].value})
        }
        console.log(this.nsTemplateParameters);
      }


    })
  }
  vimInfos=[];
  getVimInfo() {
    this.myhttp.getVimInfo()
    .subscribe((data)=>{
      this.vimInfos = data.map((item)=>{return {name:item['cloud-owner'],id:item['cloud-region-id']}});
    })
  };
  sdnControllers=[];
  getSdnControllers(){
    this.myhttp.getSdnControllers()
    .subscribe((data)=>{
      this.sdnControllers = data.map((item)=>{return {name:item['thirdparty-sdnc-id'],id:item['thirdparty-sdnc-id']}});
    })
  }

  // e2e requstbody
  service = {
    name: "",
    description: "",
    COS:"",
    EBS:"",
    serviceInvariantUuid: "",
    serviceUuid: "", // uuid ??
    globalSubscriberId: "",   // "customer.id",
    serviceType: "",    // "serviceType.value",
    parameters: {
      locationConstraints:[

      ],
      resources: [],
      requestInputs: {},
    }

  }

  // ns requstbody
  ns_service = {
    csarId: "",
    nsName: "",
    description: "",
    context: {
      globalCustomerId: "",
      serviceType: ""
    }
  }
  ns_service2 = {
    locationConstraints: [

    ],
    additionalParamForNs: {
    }
  }
  submit(){
    let type = this.createParams.commonParams.templateType == "E2E Service" ? "e2e" : "ns";
    if(type == "e2e"){
      this.service.serviceInvariantUuid = this.templateParameters.invariantUUID;
      this.service.serviceUuid = this.templateParameters.uuid;
      this.service.globalSubscriberId = this.createParams.commonParams.customer.id;
      this.service.serviceType = this.createParams.commonParams.serviceType.name;
  
      this.templateParameters.inputs.forEach((ipnut)=>{
        this.service.parameters.requestInputs[ipnut.name] = ipnut.value == undefined ? ipnut.defaultValue : ipnut.value; 
      })
  
      this.templateParameters.nestedTemplates.forEach((item)=>{
        let nsService = {
          resourceName: item.name,
          resourceInvariantUuid: item.invariantUUID,
          resourceUuid: item.uuid,
          resourceCustomizationUuid: item.customizationUuid,
          parameters: {
            locationConstraints:[],
            resources:[],
            requestInputs:{}
          }
        }
        item.inputs.forEach((input)=>{
          if(input.type == "vf_location"){
            let location = {
              vnfProfileId: input.name,
              locationConstraints:{
                vimId: input.value.name + "_" + input.value.id,
              }
            }
            nsService.parameters.locationConstraints.push(location);
          }else{
            nsService.parameters.requestInputs[input.name] = input.value == undefined ? input.defaultValue : input.value;
          }
        })
        this.service.parameters.resources.push(nsService);
      })

      this.e2eCloseCreate.emit({service:this.service}); 

    }else if(type == "ns"){
      //create ns instance
      this.ns_service.csarId = this.createParams.template.id;
      this.ns_service.context.globalCustomerId = this.createParams.commonParams.customer.id;
      this.ns_service.context.serviceType = this.createParams.commonParams.serviceType.name;

      this.nsTemplateParameters.inputs2.forEach((input)=>{
        this.ns_service2.additionalParamForNs[input.name] = input.value == undefined ? input.defaultValue : input.value; 
      })
      this.nsTemplateParameters.vnfs.forEach((vnf)=>{
        let vnfparams = {
          vnfProfileId: vnf.properties.id,
          locationConstraints: {
            vimId: vnf.value.name + "_" + vnf.value.id,
          }
        }
        this.ns_service2.locationConstraints.push(vnfparams);
      })
      console.log(this.ns_service2);

      let requstbody = {
        step1:this.ns_service,
        step2:this.ns_service2
      }
      this.nsCloseCreate.emit(requstbody); 
    }

  }
  goback(){
    this.e2eCloseCreate.emit(); 
  }

}
