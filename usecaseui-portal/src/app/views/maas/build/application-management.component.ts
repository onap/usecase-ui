import { Component, OnInit } from '@angular/core';
import { NzMessageService } from "ng-zorro-antd";
import { Router } from '@angular/router';
import { MaasService } from '@src/app/core/services/maas.service';
import { Application } from './application.type';

@Component({
  selector: 'app-application-management',
  templateUrl: './application-management.component.html',
  styleUrls: ['./application-management.component.less']
})
export class ApplicationManagementComponent implements OnInit {
  data: Application[] = [];
  createModalShow = false;
  applicationShow = false;
  applicationDetail: Object = {};

  constructor(
    private myhttp: MaasService,
    private message: NzMessageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getAllApplicationData()
  }

  getAllApplicationData(): void {
    this.myhttp.getAllApplication()
      .subscribe(
        (data) => {
          this.data = data.result_body
        },
        () => {
          this.message.error('Failed to obtain application data');
        }
      )
  }

  create(): void {
    this.createModalShow = true;
  }

  createModalClose($event: any): void {
    this.createModalShow = false;
    if ($event.cancel) {
      return;
    }
    this.getAllApplicationData()
  }

  delete(data): void {
    this.myhttp.deleteApplicationById(data.applicationId).subscribe((data) => {
      this.getAllApplicationData()
      if (data.result_header.result_code === 200) {
        this.message.success('Deleted successfully');
      } else {
        this.message.error(data.result_header.result_message);
      }
    }, () => {
      this.message.error('Deletion failed');
    });
  }

  navigateToDetail(data): void {
    this.router.navigate(['maas/use'], { queryParams: { id: data.applicationId, name: data.applicationName } });
  }

  applicationDetailClose(): void {
    this.applicationShow = false;
  }

  displayApplicationDetails(data): void {
    this.applicationShow = true;
    this.myhttp.getApplicationById(data.applicationId)
      .subscribe(
        (data) => {
          this.applicationDetail = data.result_body;
        },
        () => {
          this.message.error('Failed to obtain knowledge base data');
        }
      )
  }
}