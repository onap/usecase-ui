import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { MyhttpService } from '../myhttp.service';
import { slideToRight } from '../animates';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  animations: [ slideToRight ]
})
export class HomeComponent implements OnInit {
  @HostBinding('@routerAnimate') routerAnimateState;

  constructor(private myhttp: MyhttpService) { }

  ngOnInit() {
    this.getHomeAllData();
  }
  
  // alarm饼图
  alarmChartData:Object;
  alarmChartInit:Object = {
    height: 164,
    option:{
      legend: {
        orient: 'vertical',
        left: '0px',
        bottom: '0px',
        data: ['Active','Closed']
      },
      color:["#fb6e6e","#526b75"],
      series:[{
        name:"告警信息",
        radius : '55%',
        label:{
          normal:{
            show: false,
          },
          emphasis: {
            show: true,
            formatter:'{b}\n{c},{d}%',
          }
        }
      }]
    }
  };

  // services饼图
  serviceNumber:number = 0;
  serviceChartData:Object;
  serviceChartInit:Object = {
    height: 300,
    option:{
      legend: {
        orient: 'vertical',
        left: '0px',
        bottom: '0px',
        data: ['Active','Closed']
      },
      color:["#3fa8eb","#1abb9b","#a4ead7"],
      series:[{
        name:"服务信息",
        radius : ['45%','65%'],
        avoidLabelOverlap: false,
        label:{
          normal:{
            show: false,
            position: 'center'
          },
          emphasis: {
            show: true,
            formatter:'{b}\n{c}',
            textStyle: {
                fontSize: '20',
                fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
              show: false
          }
        },        
      }]
    }
  };

  // Performance线图
  performanceChartData:Object;
  performanceChartInit:Object = {
    height:320,
    option:{
      legend: {
        bottom: '0px',
        data: ['CPU','Memory']
      },
      series : [
        {
            name: 'CPU',
            type: 'line',
            data:[20,23,14,12,34,25,22,42,52,35,34,13,13]
        },
        {
            name: 'Memory',
            type: 'line',
            data:[10,23,24,22,14,15,32,12,12,32,14,23,23]
        }
      ]
    }
  };
  getPerformanceChartData(){
    let paramsObj = {
      vmPerformanceName:this.vmPerformanceNameSelected
    }
    this.myhttp.getHomePerformanceChartData(paramsObj)
      .subscribe((data)=>{
        this.performanceChartData = {
          series:[
            {data:data.CPU},
            {data:data.Memory}
          ]
        }
      },(err)=>{
        console.log(err);
      })
  }

  // vm筛选框
  vmPerformanceNames = ['performanceNameOne'];
  vmPerformanceNameSelected = this.vmPerformanceNames[0];
  vmPerformanceNameSelect(item){
    if(this.vmPerformanceNameSelected != item){
      console.log(item);
      this.vmPerformanceNameSelected = item;
      this.getPerformanceChartData()
    } 
  }

  // 获取数据
  getHomeAllData(){
    this.myhttp.getAllHomeData()
    .subscribe(
      (data)=>{
        console.log(data);
        this.alarmChartData ={
          series:[{
            data:data.alarm.chartdata
          }]
        };
        this.serviceNumber = data.services.number;
        this.serviceChartData ={
          series:[{
            data:data.services.chartdata
          }]
        };
        this.vmPerformanceNames = data.Vm_performance.names;
        this.vmPerformanceNameSelected = this.vmPerformanceNames[0];
        this.getPerformanceChartData();
      },
      (err)=>{
        console.log(err);
      }
    )
  }

}
