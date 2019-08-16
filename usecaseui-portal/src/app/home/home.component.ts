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
import { TranslateService } from "@ngx-translate/core";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  animations: [slideToRight]
})
export class HomeComponent implements OnInit {
  @HostBinding('@routerAnimate') routerAnimateState;

  constructor(private myhttp: HomesService, private router: Router) { }

  ngOnInit() {
    this.getListSortMasters();
    this.getSourceNames();
    this.getHomeServiceData();
    this.getHomeAlarmData();
    this.getHomeAlarmChartData();
    this.getHomeServiceBarNsData();
    this.getHomeServiceBarVnfData();
    this.getHomeServiceBarPnfData();
  }


  // services
  serviceNumber: number = 0;
  serviceChartData: Object;
  serviceChartInit: Object = {
    backgroundColor: '#fff',
    height: 200,
    option: {
      legend: {
        orient: 'vertical',
        left: '0px',
        bottom: '0px',
        data: ['Active', 'Closed']
      },
      color: ["#7AC0EF", "#6A86D8", "#748CDC", "#7277D4", "#7067CE", "#B9B0F7", "#7DCFF5"],
      series: [
        {
          name: "服务信息",
          radius: ['50%', '70%'],
          center: ['50%', '45%'],
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
  serviceChart = true;
  getHomeServiceData() {
    this.myhttp.getHomeServiceData()
      .subscribe(
        (data) => {          
          this.serviceNumber = data.serviceTotalNum;
          if (this.serviceNumber > 0) {
            this.serviceChart = true;
          } else {
            this.serviceChart = false;
          }
          this.serviceChartData = {
            series: [{ data: data.customerServiceList }]
          };         
        },
        (err) => {
          console.log(err);
        }
      )
  }

  // VM alarm
  VMAlarmChartData: Object;
  VMAlarmChartInit: Object = {
    height: 180,
    option: {
      color: [
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#FB93C2'
          }, {
            offset: 1, color: '#FB7788'
          }],
          globalCoord: false  
        }, {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#A6BFE4'
          }, {
            offset: 1, color: '#7A8BAE'
          }],
          globalCoord: false
        }],
      series: [{
        name: "",
        radius: ['50%', '70%'],
        center: ['50%', '45%'],
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

  // alarm bar
  alarmChartData: Object;
  alarmChartInit: Object = {
    height: 180,
    option: {
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
            offset: 0, color: '#FB93C2'
          }, {
            offset: 1, color: '#FB7788'
          }],
          globalCoord: false
        }, {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#A6BFE4'
          }, {
            offset: 1, color: '#7A8BAE'
          }],
          globalCoord: false
        }],
      series: [{
        name: " ",
        radius: '55%',
        center: ['50%', '45%'],
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
  getHomeAlarmData() {
    this.myhttp.getHomeAlarmData()
      .subscribe((data) => {
        this.alarmChartData = {
          series: [{
            data: [{ name: "Active", value: data[0] }, { name: "Fixed", value: data[1] }]
          }]
        };
        this.VMAlarmChartData = {
          series: [{
            data: [{ name: "Active", value: data[0] }, { name: "Fixed", value: data[1] }]
          }]
        };
      })
  }

  // alarm line
  alarmLineChartData: Object;
  alarmLineChartInit: Object = {
    height: 320,
    option: {
      legend: {
        bottom: '0px',
        data: ['CPU', 'Memory', 'Disk']
      },
      xAxis: {
        data: []
      },
      series: [
        {
          name: 'CPU',
          type: 'line',
          itemStyle: {
            color: "#70ACEC"
          },
          data: []
        },
        {
          name: 'Memory',
          type: 'line',
          itemStyle: {
            color: "#3BCD79"
          },
          data: []
        },
        {
          name: 'Disk',
          type: 'line',
          itemStyle: {
            color: "#FDC288"
          },
          data: []
        }
      ]
    }
  };

  // services 
  servicesBarChartData: Object;
  servicesBarChartData1: Object;
  servicesBarChartData2: Object;
  serviceBarChartInit: Object = {
    height: 40,
    width: 160,
    option: {
      tooltip: {

      },
      grid: {

      },
      xAxis: {
        type: 'value',
        show: false,
        min: 0,
        max: 100,
        axisTick: {
          show: false
        },
      },
      yAxis: {
        type: 'category',
        show: false,
        axisTick: {
          show: false
        }
      },
      series: [{
        type: 'bar',
        name: 'a',
        silent: true,
        animation: false,
        data: [],
        stack: 'income',
        barWidth: 12,
        itemStyle: {
          normal: {}
        },
      }, {
        type: 'bar',
        name: '',
        animation: false,
        silent: true,
        data: [100],
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


  NSdata: number;
  Vnfdata: number;
  PnfData: number;
  getHomeServiceBarNsData() {
    this.myhttp.getHomeServiceBarNsData()
      .subscribe((data) => {
        this.NSdata = data.length;
        this.servicesBarChartData = {
          series: [
            {
              data: [this.NSdata],
              itemStyle: {
                normal: {
                  color: {
                    type: 'bar',
                    colorStops: [{
                      offset: 0,
                      color: '#FDAC63'
                    }, {
                      offset: 1,
                      color: '#FECE72'
                    }],
                    globalCoord: false,
                  },
                  barBorderRadius: [10, 10, 10, 10]
                }
              },
            },
            { data: [100] },

          ]
        }
      }, (err) => {
        console.log(err);
      })
  }

  getHomeServiceBarVnfData() {
    this.myhttp.getHomeServiceBarVnfData()
      .subscribe((data) => {
        this.Vnfdata = data.length;
        this.servicesBarChartData1 = {
          series: [
            {
              data: [this.Vnfdata],
              itemStyle: {
                normal: {
                  color: {
                    type: 'bar',
                    colorStops: [{
                      offset: 0,
                      color: '#9AD09F'
                    }, {
                      offset: 1,
                      color: '#BCECB8'
                    }],
                    globalCoord: false,

                  },
                  barBorderRadius: [10, 10, 10, 10]
                }
              },
            },
            { data: [100] },
          ]
        }
      }, (err) => {
        console.log(err);
      })
  }

  getHomeServiceBarPnfData() {
    this.myhttp.getHomeServiceBarPnfData()
      .subscribe((data) => {
        this.PnfData = data.length;
        this.servicesBarChartData2 = {
          series: [
            {
              data: [this.PnfData],
              itemStyle: {
                normal: {
                  color: {
                    type: 'bar',
                    colorStops: [{
                      offset: 0,
                      color: '#71ADEF'
                    }, {
                      offset: 1,
                      color: '#ACCAF4'
                    }],
                    globalCoord: false,

                  },
                  barBorderRadius: [10, 10, 10, 10]
                }
              },
            },
            { data: [100] },
          ]
        }
      }, (err) => {
        console.log(err);
      })
  }
  // sourceName 
  sourceNameList = ['performanceNameOne'];
  sourceNameSelected = null;

  
  listSortMasters = null;

  getListSortMasters() {
    if (sessionStorage.getItem("DefaultLang") == undefined) {
      sessionStorage.setItem("DefaultLang", "en");
    }
    this.myhttp.getListSortMasters()
      .subscribe((data) => {
        this.listSortMasters = JSON.stringify(data);        
        sessionStorage.setItem('listSortMasters', this.listSortMasters)
      })
  }

  getSourceNames() {
    this.myhttp.getSourceNames()
      .subscribe((data) => {
        this.sourceNameList = data;
      })
  }
  sourceNameSelect(item) {
    if (this.sourceNameSelected != item) {      
      this.sourceNameSelected = item;
      this.getHomeAlarmChartData()
    }
  }
  getHomeAlarmChartData() {
    let nowTime = this.myhttp.dateformater(Date.now());
    let startTime = this.myhttp.dateformater(Date.now() - 30 * 24 * 60 * 60 * 1000);
    let obj = {
      sourceName: this.sourceNameSelected,
      startTime: startTime,
      endTime: nowTime,
      format: "day"
    }
   
    this.myhttp.getHomeAlarmChartData(obj)
      .subscribe((data) => {
        this.alarmLineChartData = {
          xAxis: {
            data: data.dataList
          },
          series: [
            { data: data.allList },
            { data: data.ActiveList },
            { data: data.closedList }
          ]
        }
      }, (err) => {
        console.log(err);
      })
  }

  goback_services() {
    this.router.navigateByUrl('/services/services-list');
  }
  goback_onboard() {
    this.router.navigateByUrl('/services/onboard-vnf-vm');
  }

}
