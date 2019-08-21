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

import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {MyhttpService} from '../../myhttp.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-e2e-detail',
  templateUrl: './e2e-detail.component.html',
  styleUrls: ['./e2e-detail.component.less']
})
export class E2eDetailComponent implements OnInit {

  constructor(private myhttp: MyhttpService) {
  }

    ngOnInit() {
        this.dataInit();
    }

    @Input() detailParams;

    @Output() closeDetail = new EventEmitter();
    serviceInstanceName: any;
    serviceType: any;
    input_parameters: any;

    // e2e
    service = {
        name: "",
        description: "",
    };
    e2e_nestedTemplates = [];
    e2e_requestInputs: any;

    ns_service = {
        name:"",
        description:""
    };
    ns_nestedTemplates = [];
    ns_requestInputs = {};
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

    getKeys(item) {
        return Object.keys(item);
    }

    dataInit() {
        console.log(this.detailParams);
        this.serviceInstanceName = this.detailParams['service-instance-name'] || this.detailParams["nsName"];
        if (this.detailParams.serviceDomain == 'E2E Service'){
            this.input_parameters = JSON.stringify(this.detailParams['input-parameters']);
            this.input_parameters = JSON.parse(this.input_parameters);
            console.log(this.input_parameters);
            this.service = {
                name:this.input_parameters.service.name,
                description: this.input_parameters.service.description,
            };
            if(this.input_parameters.service.parameters.requestInputs!=undefined && Object.keys(this.input_parameters.service.parameters.requestInputs).length>0){
              this.e2e_requestInputs = this.input_parameters.service.parameters.requestInputs;
            }
            if(this.input_parameters.service.parameters.resources!=undefined && this.input_parameters.service.parameters.resources.length>0){
                this.input_parameters.service.parameters.resources.map((item,i) => {
                    let nestedTemplates={
                        name:null,
                        vnfs:[]
                    };
                    nestedTemplates.name= item.resourceName;
                    item.parameters.locationConstraints.map((its,k) => {
                        nestedTemplates.vnfs.push({
                            "vf_location":its.locationConstraints.cloudOwner
                        })
                    });
                    this.e2e_nestedTemplates.push(nestedTemplates);

                    let nsIndex={
                        "name": "ns",
                        "type": "ns",
                        "children": []
                    };
                    nsIndex.children=item.parameters.locationConstraints.map((itemits,index) => {
                        return {
                            "name": "vnf",
                            "type": "vnf",
                        }
                    });
                    this.roote2e.children.push(nsIndex);
                });
                console.log(this.e2e_nestedTemplates);
                console.log(this.e2e_requestInputs);
            }
        }else if(this.detailParams.serviceDomain == 'Network Service'){
            this.ns_service = {
                name:this.detailParams.name || this.detailParams['service-instance-name'],
                description: this.detailParams.description || null
            };
            if(this.detailParams.requestInputs!=undefined && Object.keys(this.detailParams.requestInputs).length>0){
                this.ns_requestInputs = this.detailParams.requestInputs;
            }
            this.ns_nestedTemplates = this.detailParams.childServiceInstances;
            this.rootns.children=this.ns_nestedTemplates.map((item,index) => {
                return {
                    "name": "vnf",
                    "type": "vnf"
                }
            });
            console.log(this.ns_nestedTemplates);
            console.log(this.ns_requestInputs);
        }
        this.drawImage(this.detailParams.serviceDomain)
    }

    goback() {
        this.closeDetail.emit();
    }

  drawImage(type) {
    if (type == "E2E Service") {
      this.render(this.roote2e, this.imgmap)
    } else if (type == "Network Service") {
      this.render(this.rootns, this.imgmap)
    }


  }

  // draw d3 charts
  render(data, imgmap) {
    let width = document.getElementById("createChart").clientWidth,
      height = document.getElementById("createChart").clientHeight;
    let cluster = d3.layout.tree()
      .size([width, height]);
    let diagonal = d3.svg.diagonal()
      .projection(function (d) {
        return [d.x-18, d.y+40];
      });
    let svg = d3.select("svg");

    //marker
    let marker =
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
    let i = 0;
    let nodes = cluster.nodes(data).reverse();
    nodes.forEach(function (d) {
      d.y = d.depth * 200+100;

    });

    let links = cluster.links(nodes);

    let linkEnter = svg.selectAll("path.link")
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

    let node = svg.selectAll(".node")
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
