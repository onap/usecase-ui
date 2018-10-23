import { Component, OnInit, HostBinding } from '@angular/core';
import { slideToRight, showHideAnimate } from '../../animates';

@Component({
  selector: 'app-performance-vnf',
  templateUrl: './performance-vnf.component.html',
  styleUrls: ['./performance-vnf.component.less'],
  animations: [ slideToRight, showHideAnimate ]
})
export class PerformanceVnfComponent implements OnInit {
  @HostBinding('@routerAnimate') routerAnimateState;
  constructor() { }

  ngOnInit() {
    let _this = this;
    setTimeout(function(){
      // 在路由切换时加载图片造成动画卡顿，先完成动画再加载图片
      _this.vnfsData = [    
        {name:"aaa",text:"oahgieango"},
        {name:"aaa",text:"oahgieango"},
        {name:"aaa",text:"oahgieango"},
        {name:"aaa",text:"oahgieango"},
        {name:"aaa",text:"oahgieango"},
        {name:"aaa",text:"oahgieango"},
        {name:"aaa",text:"oahgieango"},
        {name:"aaa",text:"oahgieango"},
        {name:"aaa",text:"oahgieango"},
        {name:"aaa",text:"oahgieango"},
        {name:"aaa",text:"oahgieango"}
      ];
      _this.emptys = new Array(15-_this.vnfsData.length);
    },300)
  }

  // 筛选框（下拉框）
  sourceNameList = ['aaaa','bbbb','cccc','dddddDDDDDDDDDDDDDDD'];
  sourceNameSelected = this.sourceNameList[0];
  ReportingEntityNameList = ['aaaa','bbbb','cccc','ddddd'];
  ReportingEntityNameSelected = this.ReportingEntityNameList[0];  
  choseSourceName(item){
    console.log(item);
    this.sourceNameSelected = item;
  }
  choseReportingEntityName(item){
    console.log(item);
    this.ReportingEntityNameSelected = item;
  }

  submit(){
    
  }
  // vnfs数据
  vnfsData = [];
  emptys = []; //补空盒子用
  // 分页 
  current = 1;  //当前页码

  //详情页标题显示
  graphicshow = false;
  detailshow = false;
  // 显示隐藏动画
  state = "show";
  state2 = "hide";
  state3 = "hide";
  performanceShow() {
    this.state = 'show';
    this.state2 = 'hide';
    this.state3 = 'hide';
    this.graphicshow = false;
    this.detailshow = false;
  }
  graphicShow() {
    this.state = 'hide';
    this.state2 = 'show';
    this.state3 = 'hide';
    this.graphicshow = true;
    this.detailshow = false;
  }
  // 选中id
  detailId:number;
  detailShow(prems) {
    this.state = 'hide';
    this.state2 = 'hide';
    this.state3 = 'show';
    this.graphicshow = true;
    this.detailshow = true;
    console.log(prems);
    this.detailId = prems.id;
  }


}
