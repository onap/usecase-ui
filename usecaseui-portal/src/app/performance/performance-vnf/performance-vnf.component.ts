/*
    Copyright (C) 2018 CMCC, Inc. and others. All rights reserved.

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
import { Component, OnInit, HostBinding } from '@angular/core';
import { slideToRight, showHideAnimate } from '../../animates';
import { MyhttpService } from '../../myhttp.service';

@Component({
  selector: 'app-performance-vnf',
  templateUrl: './performance-vnf.component.html',
  styleUrls: ['./performance-vnf.component.less'],
  animations: [slideToRight, showHideAnimate],
})
export class PerformanceVnfComponent implements OnInit {
  @HostBinding('@routerAnimate') routerAnimateState;
  public sourceNameList: Array<any> = ['---auto---'];
  public sourceName: string = '';
  public vnfsdataTotal: number;
  public startTime: string = '';
  public endTime: string = '';
  public currentPage: number = 1;
  public pageSize: number = 10;
  list: any;

  constructor(
    private myhttp: MyhttpService) { }

  ngOnInit() {
    this.getqueryAllSourceNames();
    this.getperformanceSsourceNames();
  }


  sourceNameSelected = this.sourceNameList[0];
  getqueryAllSourceNames() {
    this.myhttp.getqueryAllSourceNames().subscribe((data) => {
      for (let i = 0; i < data.length; i++) {
        this.sourceNameList.push(data[i]);
      }
      this.sourceNameSelected = this.sourceNameList[0];
    })
  }
  choseSourceName(item) {
    this.sourceNameSelected = item;
    if (item == "---auto---") {
      this.sourceName = '';
    } else {
      this.sourceName = item;
    }
  }
  // vnfs data
  totalRecords = [];
  //Fill the box
  emptys = []; 

  getperformanceSsourceNames() {
    this.myhttp.getperformanceSourceNames(this.currentPage, this.pageSize, this.sourceName).subscribe((data) => {
      this.totalRecords = data.totalRecords;
      this.vnfsdataTotal = data.names;
      if (Number.isInteger(this.totalRecords.length / 5)) {
        this.emptys = new Array(0);
      } else {
        this.emptys = new Array(5 - this.totalRecords.length % 5);
      }
    })
  }
  //Detail page title display
  graphicshow = false;
  detailshow = false;
  // Show hidden animation
  state = "show";
  state2 = "hide";
  state3 = "hide";
  performanceShow() {
    this.state = 'show';
    this.state2 = 'hide';
    this.state3 = 'hide';
    this.graphicshow = false;
    this.detailshow = false;
  }
  // Selected name

  graphicShow() {
    this.state = 'hide';
    this.state2 = 'show';
    this.state3 = 'hide';
    this.graphicshow = true;
    this.detailshow = false;
  }
  vnfname: string;
  graphicShow2(item) {
    this.state = 'hide';
    this.state2 = 'show';
    this.state3 = 'hide';
    this.graphicshow = true;
    this.detailshow = false;
    this.vnfname = item;
  }
  // Selected id
  detailId: string;
  detailShow(item) {
    this.state = 'hide';
    this.state2 = 'hide';
    this.state3 = 'show';
    this.graphicshow = true;
    this.detailshow = true;
    this.detailId = item.id.id;
  }
}
