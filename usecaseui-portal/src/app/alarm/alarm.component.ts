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
import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { MyhttpService } from '../myhttp.service';
import * as addDays from 'date-fns/add_days';
import { showHideAnimate, slideToRight } from '../animates';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.less'],
  animations: [
    showHideAnimate, slideToRight
  ]
})
export class AlarmComponent implements OnInit {
  size = 'day';
  @HostBinding('@routerAnimate') routerAnimateState; //Routing animation
  public pageNumber:number=1;
  public pageSize:number=5;
  public name:string='';
  public Priority:string ='';
  public Status:string ='';
  public Report:string ='';
  list: any;
  sourcenames:any;


  constructor(
    private myhttp:MyhttpService) { }
    ngOnInit() {
      this.getAlarmFormData();
      this.getSourceNames();
    }

  // Filter box
  sourceNameList = ['---auto---','shentao-test-1001','vnf_a_1','cccc','dddddDDDDDDD'];
  sourceNameSelected = this.sourceNameList[0];
  priorityList = ['---auto---','Critical','Major','Minor','Warning'];
  prioritySelected = this.priorityList[0];
  statusList = ['---auto---','active','Close'];
  statusSelected = this.statusList[0];
  choseSourceName(item){
    console.log(item,'item1');
    this.sourceNameSelected = item;
  }
  chosePriority(item){
    console.log(item);
    this.prioritySelected = item;
  }
  choseStatus(item){
    console.log(item);
    this.statusSelected = item;
  }

  // Date screening
  dateRange =  [ addDays(new Date(), -30), new Date() ];

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }
  sort(e){

  }
  // total
  alarmList = {
    all:22439,
    closed:37923,
    alarm: 12342
  }

  //Line chart
  alarmShow = false;
  alarmChartData:Object;
  alarmChartInit:Object = {
    height:380,
    option:{
      legend: {
        bottom: '0px',
        data: ['All', 'Active', 'Closed']
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          // xAxisIndex: [0],
          start: 1,
          height: 10,
          end: 40
        }
    ],
      series: [
        {
            name: 'All',
            type: 'line',
            smooth: true,
            showSymbol: false,
            areaStyle: {
              opacity: 0.8
            },
            //timeframe_one
            data: [40, 45, 38, 52, 64, 58, 69, 87, 76, 33, 64, 87, 45, 76, 88, 56, 33, 76, 45, 65,38, 52, 64, 58, 69, 87, 76, 33, 64, 87,40, 45, 38, 52, 64, 58, 69, 87, 76,40, 45, 38, 52, 64, 58, 69, 87, 76],
            itemStyle: {
              color: "#526b75"
            },
            lineStyle: {
              width: 1,
              opacity: 0.5
            }
        },
        {
            name: 'Active',
            type: 'line',
            smooth: true,//将图变得平缓
            showSymbol: false,
            areaStyle: {
              opacity: 0.8
            },
            //timeframe_two
            data: [32, 43, 23, 45, 63, 24, 54, 22, 32, 42, 42, 22, 23, 43, 32, 34, 42, 33, 42, 12,32, 43, 23, 45, 63, 24, 54, 22, 32, 42, 42, 22, 23, 43, 32, 34, 42, 33, 42, 12,32, 43, 23, 45, 63, 24, 54, 22],
            itemStyle: {
              color: "#fb6e6e"
            },
            lineStyle: {
              width: 1,
              opacity: 0.5
            }
        },
        {
            name: 'Closed',
            type: 'line',
            smooth: true,//
            showSymbol: false,
            areaStyle: {
              opacity: 0.8
            },
            //timeframe_two
            data: [12, 23, 13, 25, 33, 14, 34, 12, 12, 22, 12, 12, 13, 23, 12, 24, 22, 13, 22, 5,12, 23, 13, 25, 33, 14, 34, 12, 12, 22, 12, 12, 13, 23, 12, 24, 22, 13, 22, 5,12, 23, 13, 25, 33, 14, 34, 12, 125],
            itemStyle: {
              color: "#3fa8eb"
            },
            lineStyle: {
              width: 1,
              opacity: 0.5
            }
        }
      ]
    }
  };
  getAlarmChartData(){
    let paramsObj = {
      alarmSourceName:this.sourceNameSelected
    }
    this.myhttp.getHomePerformanceChartData(paramsObj)
      .subscribe((data)=>{
        this.alarmChartData = {
          series:[
            {data:data.CPU},
            {data:data.CPU},
            {data:data.Memory}
          ]
        }
      },(err)=>{
        console.log(err);
      })
  }
  //Detail page title display
  detailshow = false;
  // Show hidden animation
  state = "show";
  state2 = "hide";
  detailShow() {
    this.state = 'hide';
    this.state2 = 'show';
    this.detailshow = true;
  }
  detailHide() {
    this.state = 'show';
    this.state2 = 'hide';
    this.detailshow = false;
  }


  getSourceNames(){
    this.myhttp.getSourceNames().subscribe((data)=>{
      this.sourcenames=data;
    console.log(data,'datass');
  })
  }
  getSelects:Object = {
    countAll:0,
    countClose:0,
    countActive:0,
    eventNameList:[],
    sourceIdList:[],
    reportingEntityNameList:[],
    sourceNameList:[],
};
  getAlarmFormData(){
    this.myhttp.getAlarmFormData(this.pageNumber,this.pageSize,this.name,this.Priority,this.Status,this.Report).subscribe((data)=>{
        this.list = data.list;
      // console.log(data,'data');
    })
  }

}
