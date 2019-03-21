import { Component, OnInit, Input } from '@angular/core';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.less']
})
export class PieComponent implements OnInit {
  // 图形数据
  @Input() chartData;
  // 初始化数据
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
      series : [
          {
              name: this.initData.option.series[0].name,
              type: 'pie',
              radius : this.initData.option.series[0].radius,
              center:this.initData.option.series[0].center,
              legendHoverLink: false,
              hoverOffset: 3,
              avoidLabelOverlap: false,
              label: this.initData.option.series[0].label,
              data:[
                  {value:5, name:'11'},
                  {value:8, name:'22'},
                  {value:10, name:'33'},
                  {value:20, name:'44'},
                  {value:60, name:'55'},

              ],
              itemStyle: this.initData.option.series[0].itemStyle
          }
      ]
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
  // alarm饼图
  pieOption:any;
  // 实例对象
  chartIntance:any;
  // 数据变化
  updateOption:any;
  chartDataChange(){
    this.updateOption = this.chartData;
    // 要等到updateOption渲染完再执行
    this.chartIntance.on('finished',()=>{
      this.chartIntance.dispatchAction({
        type:'highlight',
        seriesIndex: 0,
        dataIndex:0        
      })
      // 由于所有视图变化渲染都会执行，更新完注销此事件
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
