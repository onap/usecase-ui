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
  ngOnDestroy(){
    window.clearInterval(this.timer)
  }

  listOfData: any[] = [];
  reportData: any[] = [];
  intentInfo: Object={
    intentId:'',
    intentName:'',
    reportTime: ''
  };
  timer: any;
  intentModuleShow: boolean = false;
  intentReportDetailShow: boolean = false;
  editIntentTableList: Object={};
  currentIndex: number=-1;

  getIntentManagementData():void{
    this.myhttp.getIntentManagementData()
    .subscribe(
      (data) => {
        this.listOfData=data.result_body
        this.getIntentReportData(this.listOfData)
        this.timer=setInterval(()=>{
        this.getIntentReportData(this.listOfData)
        },5000)
      },
      (err) => {
        this.message.error('Failed to obtain intent data');
      }
    )
  }
  getIntentReportData(data): void{
    data.forEach(item => {
      this.myhttp.getIntentReportData(item.intentId).subscribe(
        (data) => {
          item.intentStatus=data.result_body.fulfillmentInfos[0].fulfillmentStatus
        },
        (err) => {
          this.message.error('Failed to obtain Report data');
        }
      )
    });
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
  intentReportModuleClose($event: any): void {
    this.intentReportDetailShow = false 
    if ($event.cancel) {
      return;
    }
  }
  viewReport(data,i): void{
    this.reportData=[]
    this.intentInfo={
      intentId:'',
      intentName:'',
      reportTime: ''
    };
    this.intentInfo['intentId']=data['intentId']
    this.intentInfo['intentName']=data['intentName']
    this.myhttp.getIntentReportData(data.intentId).subscribe(
        (data) => {
          this.reportData=data.result_body.fulfillmentInfos
          this.intentInfo['reportTime']=data.result_body.reportTime
          this.intentReportDetailShow = true 
        },
        (err) => {
          this.message.error('Failed to obtain Report data');
        }
      )
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