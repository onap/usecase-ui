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
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.less']
})
export class PieComponent implements OnInit {
  // chart Data
  @Input() chartData;
  // init Data
  @Input() initData;

  constructor() { }

  ngOnInit() {
    this.initOpts = {
      renderer: 'canvas',
      height: this.initData.height
    };
    this.pieOption = {
      backgroundColor:this.initData.option.backgroundColor,
      legend: this.initData.option.legend,
      color:this.initData.option.color,
      tooltip: this.initData.option.tooltip || '',
      series : [
          {
              name: this.initData.option.series[0].name,
              type: 'pie',
              radius : this.initData.option.series[0].radius,
              center:this.initData.option.series[0].center,
              legendHoverLink: false,
              hoverOffset: 3,
              avoidLabelOverlap: false,
              // minAngle:1,
              label: this.initData.option.series[0].label,
              data:[],
              itemStyle: this.initData.option.series[0].itemStyle
          }
      ]
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
  // Alarm pie chart
  pieOption:any;
  // Instance object
  chartIntance:any;
  // Data change
  updateOption:any;
  chartDataChange(){
    this.updateOption = this.chartData;
    // Wait until the updateOption is finished and then execute
    this.chartIntance.on('finished',()=>{
      this.chartIntance.dispatchAction({
        type:'highlight',
        seriesIndex: 0,
        dataIndex:0        
      })
      //Since all view changes are rendered, this event is logged out after the update
      this.chartIntance.off('finished')
    })
  }

  chartInit(chart){
    this.chartIntance = chart;
  }
  
  pieMouseOver(e){
    this.chartIntance.dispatchAction({
      type:'downplay'
    })
    this.chartIntance.dispatchAction({
      type:'highlight',
      seriesIndex: 0,
      dataIndex:e.dataIndex
    })
  }

  pieMouseOut(e){
    this.chartIntance.dispatchAction({
      type:'highlight',
      seriesIndex: 0,
      dataIndex:e.dataIndex
    })
  }


}
