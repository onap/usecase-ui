import { Component, OnInit, Input } from '@angular/core';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.less']
})
export class BarComponent implements OnInit {

  // 图形数据
  @Input() chartData;
  // 初始化数据
  @Input() initData;

  constructor() { }

  ngOnInit() {
    this.initOpts = {
      renderer: 'canvas',
      height: 40,
      width: 160,

    };
    this.barOption = {
      xAxis: this.initData.option.xAxis,
      yAxis: {
        type: 'category',
        show: false,
        axisTick: {
          show: false
        }
      },
      series: this.initData.option.series
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // 当有实例的时候再执行，相当于第一次不执行下面方法
    if (this.chartIntance) {
      this.chartDataChange()
    }
  }
  // 初始化图形高度
  initOpts: any;
  // 折线图配置
  barOption: any;
  // 实例对象
  chartIntance: any;
  // 数据变化
  updateOption: any;
  chartDataChange() {
    this.updateOption = this.chartData;
  }
  chartInit(chart) {
    this.chartIntance = chart;
  }

}
