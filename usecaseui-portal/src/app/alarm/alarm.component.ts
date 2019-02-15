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
import { Component, OnInit, Input, Output, EventEmitter, HostBinding, Pipe, PipeTransform } from '@angular/core';
import { HomesService } from '../homes.service';
import { showHideAnimate, slideToRight } from '../animates';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.less'],
  animations: [
    showHideAnimate, slideToRight
  ],
  providers: [DatePipe]
})
export class AlarmComponent implements OnInit {
  size = 'day';
  @HostBinding('@routerAnimate') routerAnimateState; //Routing animation
  public currentPage: number = 1;
  public pageSize: number = 10;
  public sourceName: string = '';
  public priority: string = '';
  public startTime: string = this.myhttp.dateformater(Date.now() - 30 * 24 * 60 * 60 * 1000);
  public endTime: string = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  public vfStatus: string = '';
  public sourceNameList: Array<any> = ['---auto---'];
  list: any;
  sourcenames: any;
  constructor(
    private datePipe: DatePipe,
    private myhttp: HomesService) { }
  ngOnInit() {
    this.getAlarmFormData();
    this.getSourceNames();

    // this.getstatuscount();
  }

  // Filter box
  sourceNameSelected = this.sourceNameList[0];

  priorityList = ['---auto---', 'Critical', 'Major', 'Minor', 'Warning'];
  prioritySelected = this.priorityList[0];


  statusList = ['---auto---', 'active', 'Close'];
  statusSelected = this.statusList[0];

  choseSourceName(item) {
    if (item == "---auto---") {
      this.sourceName = '';
    } else {
      this.sourceName = item;
    }
    this.sourceNameSelected = item;

  }
  chosePriority(item) {
    this.prioritySelected = item;
    if (item == "---auto---") {
      this.priority = '';
    } else {
      this.priority = item;
    }
  }
  choseStatus(item) {
    this.statusSelected = item;
    if (item == "---auto---") {
      this.vfStatus = '';
    } else {
      this.vfStatus = item;
    }
  }
  getSourceNames() {
    this.myhttp.getSourceNames().subscribe((data) => {
      for (let i = 0; i < data.length; i++) {
        this.sourceNameList.push(data[i]);
      }
      this.sourceNameSelected = this.sourceNameList[0];
    })
  }

  // Date screening
  dateRange = [(new Date(), -30), new Date()];
  onChange(result: Date): void {
    this.startTime = this.datePipe.transform(result[0], 'yyyy-MM-dd');
    this.endTime = this.datePipe.transform(result[1], 'yyyy-MM-dd');
  }
  dateRange2 = [(new Date(), -30), new Date()];
  onChange2(result: Date): void {
    this.startTime = this.datePipe.transform(result[0], 'yyyy-MM-dd');
    this.endTime = this.datePipe.transform(result[1], 'yyyy-MM-dd');
  }

  // total
  alarmList = {
    all: 0,
    closed: 0,
    activeNum: 0
  }
  // total data
  // getstatuscount() {
  //   this.myhttp.getstatuscount().subscribe((data) => {
  //     this.alarmList.activeNum = data[0];
  //     this.alarmList.closed = data[1];
  //     this.alarmList.all = (data[0] - 0) + (data[1] - 0);

  //   })
  // }
  getAlarmFormData() {
    this.myhttp.getAlarmFormData(this.currentPage, this.pageSize, this.sourceName, this.priority, this.startTime, this.endTime, this.vfStatus).subscribe((data) => {
      this.list = data.alarms;
    })
    // this.getAlarmChartData(event);
  }
  getAlarmChartData() {
    let paramsObj = {
      // sourceName: this.sourceName,
      // startTime: this.startTime,
      // endTime: this.endTime,
      // format: 'day'
    }
    this.myhttp.getHomeAlarmChartData(paramsObj)
      .subscribe((data) => {
        this.alarmChartData = {
          xAxis: {
            data: data.dateList
          },
          series: [
            { data: data.allList },
            { data: data.ActiveList },
          ]
        }
      }, (err) => {
        console.log(err);
      })
  }
  // day alarmchartdata
  // day() {
  //   let paramsObj = {
  //     sourceName: this.sourceName,
  //     startTime: this.startTime,
  //     endTime: this.endTime,
  //     format: "day"
  //   }
  //   this.myhttp.getHomeAlarmChartData(paramsObj)
  //     .subscribe((data) => {
  //       this.alarmChartData = {
  //         xAxis: {
  //           data: data.dateList
  //         },
  //         series: [
  //           { data: data.allList },
  //           { data: data.ActiveList },
  //           { data: data.closedList }
  //         ]
  //       }
  //     }, (err) => {
  //       console.log(err);
  //     })
  // }
  // month() {
  //   let paramsObj = {
  //     sourceName: this.sourceName,
  //     startTime: this.startTime,
  //     endTime: this.endTime,
  //     format: "month"
  //   }
  //   this.myhttp.getHomeAlarmChartData(paramsObj)
  //     .subscribe((data) => {
  //       this.alarmChartData = {
  //         xAxis: {
  //           data: data.dateList
  //         },
  //         series: [
  //           { data: data.allList },
  //           { data: data.ActiveList },
  //           { data: data.closedList }
  //         ]
  //       }
  //     }, (err) => {
  //       console.log(err);
  //     })
  // }
  //Line chart
  alarmShow = false;
  alarmChartData: Object;
  alarmChartInit: Object = {
    height:  200,
    option: {
      legend: {
        icon: "circle", 
        itemWidth:10,
        itemHeight:10,
        bottom: '-5px',
        data: ['Active', 'Fixed']
      },
      tooltip: {
        trigger: 'axis',
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          start: 1,
          height: 10,
          end: 60,
          bottom:'9%'
        }
      ],
      xAxis: {
        data: []
      },
      series: [
        {
          name: 'Active',
          type: 'bar',
          data: [],
          barWidth: 10,
          barGap: 1,
          itemStyle: {
            normal: {
              barBorderRadius: [5],
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#FB7788' // 0% 处的颜色
                }, {
                  offset: 1, color: '#FB93C2' // 100% 处的颜色
                }],
              },
              opacity: 1,
            }
          }
        },
        {
          name: 'Fixed',
          type: 'bar',
          data: [],
          barWidth: 10,
          barGap: 1,
          itemStyle: {
            normal: {
              barBorderRadius: [5],
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#7A8BAE' // 0% 处的颜色
                }, {
                  offset: 1, color: '#A6BFE4' // 100% 处的颜色
                }],
              },
              opacity: 1,
            }
          }
        },
      ]
    }
  };
  sort(e){

  }
  //Detail page title display
  detailshow = false;
  // Show hidden animation
  state = "show";
  state2 = "hide";
  detailId: string;
  detailShow(item) {
    this.state = 'hide';
    this.state2 = 'show';
    this.detailshow = true;
    this.detailId = item.id;
  }
  detailHide() {
    this.state = 'show';
    this.state2 = 'hide';
    this.detailshow = false;
  }
}
