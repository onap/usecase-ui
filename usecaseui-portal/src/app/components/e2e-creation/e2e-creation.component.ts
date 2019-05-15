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
import * as d3 from 'd3';

@Component({
  selector: 'app-e2e-creation',
  templateUrl: './e2e-creation.component.html',
  styleUrls: ['./e2e-creation.component.less']
})
export class E2eCreationComponent implements OnInit {

  constructor( private myhttp:MyhttpService ) { }

  ngOnInit() {
        this.gete2eTemParameters(this.e2e_ns_temParametersContent);
    this.getVimInfo();
    this.getSdnControllers();
    console.log(this.createParams);
  }

  @Output() e2eCloseCreate = new EventEmitter();
  @Output() nsCloseCreate = new EventEmitter();
  @Input() createParams;
    @Input() e2e_ns_temParametersContent;


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
    roote2e = {
        "name": "e2e",
        "type": "e2e",
        "children": []
    };

    rootns = {
        "name": "ns",
        "type": "ns",
        "children": []
    };

    imgmap = {
        '1': './assets/images/create-e2e.png',
        '2': './assets/images/create-ns.png',
        '3': './assets/images/create-vnf.png',
    };
    gete2eTemParameters(data) { //Get template parameters
    let type = this.createParams.commonParams.templateType == "E2E Service" ? "e2e" : "ns";
        console.log(this.createParams);
        console.log(data);
      if(type == "e2e"){
        this.templateParameters = data;
        this.templateParameters.nestedTemplates.forEach((item)=>{
          item.inputs = item.inputs.filter((input)=>{return input.type !== "sdn_controller"});
        })
                    this.templateParameters.nestedTemplates.map((item,index) => {
                        let nsIndex={
                            "name": "ns",
                            "type": "ns",
                            "children": []
                        };
                        nsIndex.children=item.nestedTemplates.map((item,index) => {
                            return {
                                "name": "vnf",
                                "type": "vnf",
                            }
                        });
                        this.roote2e.children.push(nsIndex);
                    });
                    console.log(this.templateParameters);
                    console.log(this.roote2e)
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
   	this.rootns.children=this.nsTemplateParameters.vnfs.map((item,index) => {
                            return {
                                "name": "vnf",
                                "type": "vnf",
                            }
                        });
        console.log(this.nsTemplateParameters);
      }

      this.drawImage(type)

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
                                cloudOwner: input.value.name,
                                cloudRegionId:input.value.id
              }
            }
            nsService.parameters.locationConstraints.push(location);
          }else{
            nsService.parameters.requestInputs[input.name] = input.value == undefined ? input.defaultValue : input.value;
          }
        })
        this.service.parameters.resources.push(nsService);
      })
	    console.log(this.service)
      this.service.parameters.requestInputs['orchestrator'] = this.createParams.orchestrator.name;
      if(this.createParams.isSol005Interface){
          this.service.parameters.requestInputs['isSol005Interface'] = this.createParams.isSol005Interface;
      }
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
                        cloudOwner: vnf.value.name,
                        cloudRegionId:vnf.value.id
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

    

    drawImage(type) {
        if (type == "e2e") {
            this.render(this.roote2e, this.imgmap)
        } else if (type == "ns") {
            this.render(this.rootns, this.imgmap)
        }


    }

    render(data, imgmap) {
        var width = document.getElementById("createChart").clientWidth,
            height = document.getElementById("createChart").clientHeight;
        var cluster = d3.layout.tree()
            .size([width, height]);
        var diagonal = d3.svg.diagonal()
            .projection(function (d) {
                return [d.x-18, d.y+40];
            });
        var svg = d3.select("svg");

        //marker
        var marker =
            svg.append("marker")
                .attr("id", "resolved")
                .attr("markerUnits", "strokeWidth")
                .attr("markerUnits", "userSpaceOnUse")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 22)
                .attr("refY", 0)
                .attr("markerWidth", 20)
                .attr("markerHeight", 20)
                .attr("orient", "auto")
                .attr("stroke-width", 1)
                .append("circle")
                .attr("cx", 5)
                .attr("cy", 0)
                .attr("r", 2)
                .attr("stroke-width", 1)
                .style("stroke", "#2F8BF7")
                .attr('fill', 'white');
        var i = 0;
        var nodes = cluster.nodes(data).reverse();
        nodes.forEach(function (d) {
            d.y = d.depth * 200+100;

        });

        var links = cluster.links(nodes);

        var linkEnter = svg.selectAll("path.link")
            .data(links);

        linkEnter.enter().append("path")
            .attr("class", "link")
            .attr("d", diagonal)
            .style("stroke", "#2F8BF7")
            .style('stroke-width', '1px')
            .attr("marker-end", "url(#resolved)")
            .style("fill", "none")
            // .style("fill-opacity", 1)
            .attr("id", function (d, i) {
                return "mypath" + i;
            });

        var node = svg.selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + (d.x + -50) + "," + (d.y) + ")";
            });

        node.append('image')
            .attr('xlink:href', function (d) {
                if(d.type=="e2e"){
                    return imgmap[1];
                }else if(d.type=="ns"){
                    return imgmap[2];
                }else if(d.type=="vnf"){
                    return imgmap[3];
                }

            })
            .style('width', '12%')
            .style("cursor","pointer")
            .attr("x", 0)
            .attr("y", 0)
            .attr("rx", 3);


    }

}
