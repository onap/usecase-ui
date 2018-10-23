import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';

@Component({
  selector: 'app-graphiclist',
  templateUrl: './graphiclist.component.html',
  styleUrls: ['./graphiclist.component.less']
})
export class GraphiclistComponent implements OnInit {

  constructor() { }
  isVisibleMiddle = false;

  showModalMiddle(): void {
    this.isVisibleMiddle = true;
  }
  handleOkMiddle(): void {
    console.log('click ok');
    this.isVisibleMiddle = false;
  }
  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
  }

  ngOnInit() {
  }

  // 筛选框（下拉框）
  MeasurementList = ['aaaa','bbbb','cccc','dddddDDDD'];
  MeasurementSelected = "Measurement";
  ReportTimeList = ['aaaa','bbbb','cccc','ddddd'];
  ReportTimeSelected = "ReportTime";  
  choseMeasurement(item){
    console.log(item);
    this.MeasurementSelected = item;
  }
  choseReportTime(item){
    console.log(item);
    this.ReportTimeSelected = item;
  }

  sort(e){

  }
  // 数量统计
  alarmList = {
    all:22439,
    closed:37923,
    alarm: 12342
  }

   //折线图
   alarmChartData:Object;
   alarmChartInit:Object = {
    height:100,
    width:290,
     option:{
      tooltip : {
        show : false,
      },
      legend: {
        show :false,
      },
       series: [
         {
             name: 'Memory',
             type: 'bar',
             legendHoverLink: true,
             barWidth: "25%",
             //timeframe_one
             data: [40, 45, 38, 52, 64, 58, 69, 87, 76, 33, 64, 87, 45],
             itemStyle: {
               color: "#3fa8eb"
             },
         }
       ]
     }
   };
   //折线图
   alarmChartDataBig:Object;
   alarmChartInitBig:Object = {
    height:240,
    width:500,
     option:{
       tooltip : {
          show : true,
          trigger: 'axis',
        },
       legend: {
         bottom: 'bottom',
         data: ['Memory']
       },
       series: [
         {
             name: 'Memory',
             type: 'bar',
             legendHoverLink: true,
             barWidth: "25%",
             //timeframe_one
             data: [40, 45, 38, 52, 64, 58, 69, 87, 76, 33, 64, 87, 45],
             itemStyle: {
               color: "#3fa8eb"
             },
         }
       ]
     }
   };

  //表格数据
  dataSet = [
    {
      name       : 'John Brown',
      age        : 32,
      expand     : false,
      address    : 'New York No. 1',
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
    },
    {
      name       : 'Aim Green',
      age        : 42,
      expand     : false,
      address    : 'London No. 1',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
    },
    {
      name       : 'Bim Green',
      age        : 42,
      expand     : false,
      address    : 'London No. 1',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
    },
    {
      name       : 'Cim Green',
      age        : 42,
      expand     : false,
      address    : 'London No. 1',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
    },
    {
      name       : 'Jim Green',
      age        : 42,
      expand     : false,
      address    : 'London No. 1',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
    },
    {
      name       : 'Xim Green',
      age        : 42,
      expand     : false,
      address    : 'London No. 1',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
    },
    {
      name       : 'Jim Green',
      age        : 42,
      expand     : false,
      address    : 'London No. 1',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
    },
    {
      name       : 'Jim Green',
      age        : 42,
      expand     : false,
      address    : 'London No. 1',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
    },
    {
      name       : 'Jim Green',
      age        : 42,
      expand     : false,
      address    : 'London No. 1',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
    },
    {
      name       : 'Jim Green',
      age        : 42,
      expand     : false,
      address    : 'London No. 1',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
    },
    {
      name       : 'cim Green',
      age        : 42,
      expand     : false,
      address    : 'London No. 1',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
    },
    {
      name       : 'bim Green',
      age        : 42,
      expand     : false,
      address    : 'London No. 1',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
    },
    {
      name       : 'aoe Black',
      age        : 32,
      expand     : false,
      address    : 'Sidney No. 1',
      description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.'
    }
  ];

  @Output() detailData = new EventEmitter();
  detailShow(id){
    let prems = {
      id:id,
      detailShow: true
    }
    this.detailData.emit(prems);

  }

}
