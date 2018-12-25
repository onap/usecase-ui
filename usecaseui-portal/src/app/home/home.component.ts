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
    this.getSourceNames();
    this.getHomeServiceData();
    this.getHomePerformanceData();
    this.getHomeAlarmData();
    this.getHomeAlarmChartData();
  }
  

  // services
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
  getHomeAlarmData(){
    this.myhttp.getHomeAlarmData()
      .subscribe((data)=>{
        this.alarmChartData ={
          series:[{
            data:[{name:"Active",value:data[0]},{name:"Closed",value:data[1]}]
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
        data: ['All','Active','Closed']
      },
      xAxis:{
        data:["2018-09-10 ","2018-09-11","2018-09-12","2018-09-13","2018-09-14",
        "2018-09-15","2018-09-16","2018-09-17","2018-09-18","2018-09-19",
        "2018-09-20","2018-09-21","2018-09-22"]
      },
      series : [
        {
            name: 'All',
            type: 'line',
            data:[30,45,34,35,43,56,36,53,42,45,44,35,32]
        },
        {
            name: 'Active',
            type: 'line',
            data:[10,23,24,22,14,15,32,12,12,32,14,23,23]
        },
        {
          name: 'Closed',
          type: 'line',
          data:[20,23,14,12,34,25,22,42,52,35,34,13,13]
        }
      ]
    }
  };
  // sourceName筛选框
  sourceNameList = ['performanceNameOne'];
  sourceNameSelected = null;
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
