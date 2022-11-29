import { Component, OnInit } from '@angular/core';
import { IntentManagementService } from '../../core/services/intentManagement.service'
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-intent-management',
  templateUrl: './intent-management.component.html',
  styleUrls: ['./intent-management.component.less']
})
export class IntentManagementComponent implements OnInit {

  constructor(
    private myhttp: IntentManagementService,
    private message: NzMessageService,
    ) { }

  ngOnInit() {
    this.getIntentManagementData()
  }

  listOfData: any[] = [];
  intentModuleShow: boolean = false;
  editIntentTableList: Object={};
  currentIndex: number=-1;

  getIntentManagementData():void{
    this.myhttp.getIntentManagementData()
    .subscribe(
      (data) => {
        this.listOfData=data.result_body
      },
      (err) => {
        this.message.error('Failed to obtain intent data');
      }
    )
  }
  inputIntentModuleShow(): void {
    this.intentModuleShow = true;
  }
  inputIntentModuleClose($event: any): void {
    this.intentModuleShow = false;
    this.editIntentTableList={}
    if ($event.cancel) {
        return;
    }
    this.getIntentManagementData()
  }
  editIntentList(data,i): void {
    this.editIntentTableList=JSON.parse(JSON.stringify(data))
    this.currentIndex=i
    this.intentModuleShow = true
  }
  deleteIntentList(data): void{
    this.myhttp.deleteIntentManagementData(data.intentId).subscribe((data) => {
      this.getIntentManagementData()
      if(data.result_header.result_code===200){
        this.message.success('Deleted successfully');
      }else{
        this.message.error(data.result_header.result_message);
      }
    }, (err) => {
      this.message.error('Deletion failed');
    }); 
  }
}