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
import { Component, OnInit, Input } from '@angular/core';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.less']
})
export class LineComponent implements OnInit {
  // chart Data
  @Input() chartData;
  // init Data
  @Input() initData;

  constructor() { }

  ngOnInit() {
    this.initOpts = {
      renderer: 'canvas',
      height: this.initData.height,
      width: this.initData.width
    };
    this.lineOption ={
      tooltip : this.initData.option.tooltip,
      icon:'circle',
      legend: this.initData.option.legend,
      dataZoom: this.initData.option.dataZoom,
      grid: {
          left: '0%',
          right: '3%',
          top: '10%',
          bottom: '18%',
          containLabel: true
      },
      xAxis: {
        axisTick: {
          show: false,
        },
        axisLine:{
          show: false
        },
        axisLabel:{
          color:"#3C4F8C"
        },
        data: this.initData.option.xAxis.data
      },
      yAxis: {
        axisTick: {
          show: false,
        },
        axisLine:{
          show: false
        },
        axisLabel:{
          color:"#3C4F8C"
        },
        splitLine:{
          lineStyle:{
            type:"dashed",
          }
        }
      },
      series : this.initData.option.series
    }
  }

  ngOnChanges(changes:SimpleChanges){
    // Execute when there is an instance, which is equivalent to not executing the following method for the first time.
    if(this.chartIntance){
      this.chartDataChange()
    }
  }
  // Initialize the height of the graphic
  initOpts:any;
  // Line chart configuration
  lineOption:any;
  // Instance object
  chartIntance:any;
  // Data change
  updateOption:any;
  chartDataChange(){
    this.updateOption = this.chartData;
  }
  chartInit(chart){
    this.chartIntance = chart;
  }



}
