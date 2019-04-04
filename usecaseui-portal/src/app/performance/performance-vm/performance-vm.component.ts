import { Component, OnInit, HostBinding } from '@angular/core';
import { slideToRight, showHideAnimate } from '../../animates';

@Component({
  selector: 'app-performance-vm',
  templateUrl: './performance-vm.component.html',
  styleUrls: ['./performance-vm.component.less'],
  animations: [ slideToRight, showHideAnimate ]
})
export class PerformanceVmComponent implements OnInit {
  @HostBinding('@routerAnimate') routerAnimateState;
  constructor() { }

  ngOnInit() {
  }

  // Filter box (drop-down box)
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

  //Tabular data
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
  
  //Detail page title display
  graphicshow = false;
  detailshow = false;
  // Show hidden animation
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
  // Selected id
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
