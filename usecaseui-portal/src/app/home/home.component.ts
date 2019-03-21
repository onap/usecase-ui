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
import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { HomesService } from '../homes.service';
import { slideToRight } from '../animates';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  animations: [ slideToRight ]
})
export class HomeComponent implements OnInit {
  @HostBinding('@routerAnimate') routerAnimateState;

  constructor(private myhttp: HomesService) { }

  ngOnInit() {
    this.getListSortMasters();
    this.getSourceNames();
    this.getHomeServiceData();
    this.getHomePerformanceData();
    this.getHomeAlarmData();
    this.getHomeAlarmChartData();
    this.getHomeServiceBarData();
  }
  

  // services
  serviceNumber:number = 0;
  serviceChartData:Object;
  serviceChartInit:Object = {
  backgroundColor: '#fff',
    height: 300,
    option:{
      legend: {
        orient: 'vertical',
        left: '0px',
        bottom: '0px',
        data: ['Active','Closed']
      },
      color: ["#7AC0EF", "#6A86D8", "#748CDC", "#7277D4", "#7067CE", "#B9B0F7", "#7DCFF5"],
      series: [
        {
          name: "服务信息",
          radius: ['50%', '70%'],
          center:['50%', '45%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              formatter: '{b}\n{c}',
              textStyle: {
                fontSize: '18',
                fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              borderWidth: 4,
              borderColor: "#fff"
            },
            emphasis: {
              borderWidth: 0
            }
          },
        }
      ]
    }
  };
  // gethomeServiceData
  getHomeServiceData(){
    this.myhttp.getHomeServiceData()
    .subscribe(
      (data)=>{
        // console.log(data);
        this.serviceNumber = data.serviceTotalNum;
        this.serviceChartData = {
          series:[{data:data.customerServiceList}]
        };
        // console.log(this.serviceChartData);
      },
      (err)=>{
        console.log(err);
      }
    )
  }

  // performance
  performanceVnfNum = 0;
  performanceVmNum = 0;
  getHomePerformanceData(){
    this.myhttp.getHomePerformanceData()
      .subscribe((data)=>{
        this.performanceVnfNum = data.length;
      })
  }

  // alarm饼图
  alarmChartData:Object;
  alarmChartInit:Object = {
    height: 180,
    option:{
      legend: {
        orient: 'vertical',
        left: '0px',
        bottom: '0px',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          color: "#3C4F8C"
        },
        data: ['Active', 'Fixed']
      },
      color: [
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#FB93C2' // 0% 处的颜色
          }, {
            offset: 1, color: '#FB7788' // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        }, {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#A6BFE4' // 0% 处的颜色
          }, {
            offset: 1, color: '#7A8BAE' // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        }],
      series: [{
        name: "告警信息",
        radius: '55%',
        center:['50%', '45%'],
        label: {
          normal: {
            show: false,
          },
          emphasis: {
            show: true,
            formatter: '{b}\n{c},{d}%',
            color: "#3C4F8C"
          }
        }
      }]
    }
  };
  getHomeAlarmData(){
    this.myhttp.getHomeAlarmData()
      .subscribe((data)=>{
        this.alarmChartData ={
          series:[{
            data: [{ name: "Active", value: data[0] }, { name: "Fixed", value: data[1] }]
          }]
        };
      })
  }

  // alarm线图
  alarmLineChartData:Object;
  alarmLineChartInit:Object = {
    height:320,
    option:{
      legend: {
        bottom: '0px',
        data: ['CPU', 'Memory', 'Disk']
      },
      xAxis:{
        data:["2018-09-10 ","2018-09-11","2018-09-12","2018-09-13","2018-09-14",
        "2018-09-15","2018-09-16","2018-09-17","2018-09-18","2018-09-19",
        "2018-09-20","2018-09-21","2018-09-22"]
      },
      series : [
        {
          name: 'CPU',
          type: 'line',
          itemStyle: {
            color: "#70ACEC"
          },
          data: [30, 45, 34, 35, 43, 56, 36, 53, 42, 45, 44, 35, 32]
        },
        {
          name: 'Memory',
          type: 'line',
          itemStyle: {
            color: "#3BCD79"
          },
          data: [10, 23, 24, 22, 14, 15, 32, 12, 12, 32, 14, 23, 23]
        },
        {
          name: 'Disk',
          type: 'line',
          itemStyle: {
            color: "#FDC288"
          },
          data: [20, 23, 14, 12, 34, 25, 22, 42, 52, 35, 34, 13, 13]
        }
      ]
    }
  };
  
   // services进度条
  servicesBarChartData: Object;
  serviceBarChartInit: Object = {
    option: {
      xAxis: {
        // data: [],
        type: 'value',
        show: false,
        min: 0,
        max: 80,
        axisTick: {
          show: false
        },
      },
      series: [{
        type: 'bar',
        name: 'a',
        silent: true,
        animation: false,
        data: [80],
        stack: 'income',
        barWidth: 12,
        itemStyle: {
          normal: {
            color: '#7AC0EF',
            barBorderRadius: [10, 10, 10, 10]
          }
        },
      }, {
        type: 'bar',
        name: '',
        animation: false,
        silent: true,
        data: [60],
        tooltip: {
          show: false
        },
        stack: 'income',
        barWidth: 12,
        itemStyle: {
          normal: {
            color: '#fff',
            barBorderRadius: [10, 10, 10, 10]
          }
        },
        label: {
          normal: {
            show: false,
          }
        },
      }
      ]
    }
  }
  userdata;
  getHomeServiceBarData() {
    this.myhttp.getHomeServiceBarData()
      .subscribe((data) => {
        this.userdata = data.customerServiceList;
        let Val1;
        let Val2;
        let MIN: number = 0;
        let MAX: number = Val1;
        Val1 = data.customerServiceList[1].value1;
        Val2 = data.customerServiceList[1].value2;
        if (Val1 > Val2) {
          MIN = 0;
          MAX = Val1;
        } else {
          MIN = Val1 - Val2;
          MAX = Val2;
        }
        this.servicesBarChartData = {
          xAxis: {
            min: MIN,
            max: MAX,
          },
          series: [
            { data: [Val1] },
            { data: [Val1 - Val2] },
          ]
        }
      }, (err) => {
        console.log(err);
      })
  }
  // sourceName筛选框
  sourceNameList = ['performanceNameOne'];
  sourceNameSelected = null;

  //2019.1.2 add listSortMasters
  listSortMasters=null;

  getListSortMasters(){
      this.myhttp.getListSortMasters()
          .subscribe((data)=>{
              this.listSortMasters = JSON.stringify(data);
              console.log(this.listSortMasters);
              sessionStorage.setItem('listSortMasters',this.listSortMasters)
          })
  }

  getSourceNames(){
    this.myhttp.getSourceNames()
      .subscribe((data)=>{
        this.sourceNameList = data;
      })
  }
  sourceNameSelect(item){
    if(this.sourceNameSelected != item){
      // console.log(item);
      this.sourceNameSelected = item;
      this.getHomeAlarmChartData()
    } 
  }
  getHomeAlarmChartData(){
    let nowTime = this.myhttp.dateformater( Date.now());
    let startTime = this.myhttp.dateformater( Date.now()-30*24*60*60*1000 );
    let obj = {
      sourceName:this.sourceNameSelected,
      startTime: startTime,
      endTime:nowTime,
      format:"day"
    }
    console.log(obj);
    this.myhttp.getHomeAlarmChartData(obj)
      .subscribe((data)=>{
        this.alarmLineChartData = {
          xAxis:{
            data:data.dataList
          },
          series:[
            {data:data.allList},
            {data:data.ActiveList},
            {data:data.closedList}
          ]
        }
      },(err)=>{
        console.log(err);
      })
  }


}
