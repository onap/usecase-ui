import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ServiceListService } from '../../../../core/services/serviceList.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-mdons-detail',
  templateUrl: './mdons-detail.component.html',
  styleUrls: ['./mdons-detail.component.less']
})
export class MdonsDetailComponent implements OnInit {

  constructor(private myhttp: ServiceListService) { }

  @Input() detailParams;
  @Output() closeDetail = new EventEmitter();
  serviceInstanceName: any;
  serviceType: any;
  input_parameters: any;
  e2e_requestInputs: any;
  domainService =[];

  service = {
    name: "",
    description: "",
  };

  roote2e = {
    "name": "e2e",
    "type": "e2e",
    "children": []
  };

  imgmap = {
    '1': '../../../../assets/images/create-e2e.png',
    '2': '../../../../assets/images/create-ns.png',
    '3': '../../../../assets/images/create-vnf.png',
  };

  getKeys(item) {
    return Object.keys(item);
  }

  ngOnInit() {

    this.serviceInstanceName = this.detailParams['serviceDomain'] || this.detailParams["nsName"];
    this.input_parameters = JSON.parse(this.detailParams['input-parameters']);
    this.domainService = this.detailParams["childServiceInstances"];
    this.service = {
      name: this.input_parameters.service.name,
      description: this.input_parameters.service.description,
    };
    if (this.input_parameters.service.parameters.requestInputs != undefined && Object.keys(this.input_parameters.service.parameters.requestInputs).length > 0) {
      this.e2e_requestInputs = this.input_parameters.service.parameters.requestInputs;
    }
    if (this.e2e_requestInputs != undefined) {
      for (let item of this.e2e_requestInputs) {
        if (item.includes("_id") {
          let nsIndex = {
            "name": "ns",
            "type": "ns",
            "children": []
          };

          this.roote2e.children.push(nsIndex);
        }


      }
    }

    this.drawImage(this.roote2e, this.imgmap);
  }

  goback() {
    this.closeDetail.emit();
  }

  drawImage(data, imgmap) {
    var width = document.getElementById("createChart").clientWidth,
      height = document.getElementById("createChart").clientHeight;
    var cluster = d3.layout.tree()
      .size([width, height]);
    var diagonal = d3.svg.diagonal()
      .projection(function (d) {
        return [d.x - 18, d.y + 40];
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
      d.y = d.depth * 200 + 100;
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
        if (d.type == "e2e") {
          return imgmap[1];
        } else if (d.type == "ns") {
          return imgmap[2];
        } else if (d.type == "vnf") {
          return imgmap[3];
        }

      })
      .style('width', '12%')
      .style("cursor", "pointer")
      .attr("x", 0)
      .attr("y", 0)
      .attr("rx", 3);


  }

}
