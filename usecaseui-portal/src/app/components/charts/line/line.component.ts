import { Component, OnInit, Input } from '@angular/core';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.less']
})
export class LineComponent implements OnInit {
  // 图形数据
  @Input() chartData;
  // 初始化数据
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
      grid: {
          left: '1%',
          right: '3%',
          top: '10%',
          bottom: '10%',
          containLabel: true
      },
      xAxis: {
        axisTick: {
          show: false,
        },
        axisLine:{
          show: false
        },
          data: ['01','02','04','06','08','10','12','14','16','18','20','22','24']
      },
      yAxis: {
        axisTick: {
          show: false,
        },
        axisLine:{
          show: false
        }
      },
      series : this.initData.option.series
    }
  }

  ngOnChanges(changes:SimpleChanges){

    // 当有实例的时候再执行，相当于第一次不执行下面方法
    if(this.chartIntance){
      this.chartDataChange()
    }
  }
  // 初始化图形高度
  initOpts:any;
  // 折线图配置
  lineOption:any;
  // 实例对象
  chartIntance:any;
  // 数据变化
  updateOption:any;
  chartDataChange(){
    this.updateOption = this.chartData;
  }
  chartInit(chart){
    this.chartIntance = chart;
  }



}
