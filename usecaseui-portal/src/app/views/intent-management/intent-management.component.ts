import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-intent-management',
  templateUrl: './intent-management.component.html',
  styleUrls: ['./intent-management.component.less']
})
export class IntentManagementComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

  listOfData: any[] = [];
	pageSize: number = 10;
  intentModuleShow: boolean = false;
  editIntentTableList: Object={};
  currentIndex: number=-1;

  inputIntentModuleShow(): void {
    this.intentModuleShow = true;
  }
  inputIntentModuleClose($event: any): void {
    this.intentModuleShow = false;
    this.editIntentTableList={}
    if ($event.cancel) {
        return;
    }
    if(this.currentIndex>-1){
      this.listOfData[this.currentIndex]=$event.param
      this.currentIndex=-1
    }else{
      this.listOfData.push($event.param)
    }
  }
  editIntentList(data,i): void {
    this.editIntentTableList=JSON.parse(JSON.stringify(data))
    this.currentIndex=i
    this.intentModuleShow = true
  }
  deleteIntentList(i): void{
    this.listOfData.splice(i,1)
  }
}