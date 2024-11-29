import { Component, OnInit } from '@angular/core';
import { IntentManagementService } from '../../../core/services/intentManagement.service'
import {NzMessageService} from "ng-zorro-antd";
import { Router } from '@angular/router';

@Component({
  selector: 'app-application-management',
  templateUrl: './application-management.component.html',
  styleUrls: ['./application-management.component.less']
})
export class ApplicationManagementComponent implements OnInit {

  constructor(
    private myhttp: IntentManagementService,
    private message: NzMessageService,
    private router: Router
    ) { }

  ngOnInit() {
    this.getAllApplicationData()
  }

  listOfData: any[] = [];

  intentModuleShow: boolean = false;
  applicationShow: boolean = false;
  editIntentTableList: Object={};
  currentIndex: number=-1;
  getAllApplicationData():void{
     this.myhttp.getAllApplication()
    .subscribe(
      (data) => {
        this.listOfData=data.result_body
      },
      (err) => {
        this.message.error('Failed to obtain application data');
      }
    )
  }

  inputIntentModuleShow(): void {
    this.intentModuleShow = true;
  }
  inputIntentModuleClose($event: any): void {
    this.intentModuleShow = false;

    if ($event.cancel) {
        return;
    }
    this.getAllApplicationData()
  }
 editIntentList(): void {
    this.intentModuleShow = true
  }
  deleteIntentList(data): void{
    this.myhttp.deleteApplicationById(data.applicationId).subscribe((data) => {
      this.getAllApplicationData()
      if(data.result_header.result_code===200){
        this.message.success('Deleted successfully');
      }else{
        this.message.error(data.result_header.result_message);
      }
    }, (err) => {
      this.message.error('Deletion failed');
    }); 
  }

  navigateToDetail(data):void {
    this.router.navigate(['maas/use'], { queryParams: { id: data.applicationId, name: data.applicationName } });
  }

   applicationDetailClose(): void {
    this.applicationShow = false;
  }

  applicationDetail: Object={};
   displayApplicationDetails(data): void {
       this.applicationShow = true;
        this.myhttp.getApplicationById(data.applicationId)
        .subscribe(
          (data) => {
            this.applicationDetail=data.result_body;
            console.log(data.result_body);
          },
          (err) => {
            this.message.error('Failed to obtain knowledge base data');
          }
        )
  }
}