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
    // this.getDetails();
    this.dataInit();
    this.drawImage("E2E Service");
  }

  @Input() detailParams;
  @Input() namesTranslate;
  @Output() closeDetail = new EventEmitter();
  templateParameters: any;
  serviceInstanceName: any;
  serviceType: any;

  dataInit() {
    console.log(this.detailParams);
    this.serviceInstanceName = this.detailParams['service-instance-name'];
  }

  goback() {
    this.closeDetail.emit();
  }


  roote2e = {
    "name": "e2e",
    "type": "e2e",
    "children":
      [
        {
          "name": "ns",
          "type": "ns",
          "children":
            [
              {
                "name": "vnf",
                "type": "vnf",
              },
              {
                "name": "vnf",
                "type": "vnf",
              }
            ]
        },
        {
          "name": "ns",
          "type": "ns",
          "children":
            [
              {
                "name": "vnf",
                "type": "vnf",
              },
              {
                "name": "vnf",
                "type": "vnf",
              }
            ]
        }]
  }

  rootns = {
    "name": "ns",
    "type": "ns",
    "children":
      [
        {
          "name": "vnf",
          "type": "vnf",
        },
        {
          "name": "vnf",
          "type": "vnf",
        }
      ]
  }

  imgmap = {
    '1': './assets/images/create-e2e.png',
    '2': './assets/images/create-ns.png',
    '3': './assets/images/create-vnf.png',
  };

  drawImage(type) {
    if (type == "E2E Service") {
      this.render(this.roote2e, this.imgmap)
    } else if (type == "Network Service") {
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
    console.log(diagonal)
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
