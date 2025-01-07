import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { Router } from '@angular/router';
import { MaasApi } from '@src/app/api/maas.api';
import { Application } from './application.type';
import { modalClose } from '../knowledge-base-management/knowledge-base.type';
import { TranslateService } from '@ngx-translate/core';

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
  editModalShow = false;
  applicationId = '';
  existedNames = [];

  constructor(
    private myhttp: MaasApi,
    private message: NzMessageService,
    private router: Router,
    private modalService: NzModalService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.getAllApplicationData()
  }

  getAllApplicationData(): void {
    this.myhttp.getAllApplication()
      .subscribe(
        (data) => {
          this.data = data.result_body
          this.existedNames = this.data.map(item => item.applicationName);
        },
        () => {
          this.message.error('Failed to obtain application data');
        }
      )
  }

  create(): void {
    this.createModalShow = true;
  }

  createModalClose($event: modalClose): void {
    this.createModalShow = false;
    if ($event.cancel) {
      return;
    }
    this.getAllApplicationData()
  }

  delete(data: Application): void {
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

  navigateToDetail(data: Application): void {
    this.router.navigate(['maas/use'], { queryParams: { id: data.applicationId, name: data.applicationName } });
  }

  applicationDetailClose(): void {
    this.applicationShow = false;
  }

  displayApplicationDetails(data: Application): void {
    this.applicationShow = true;
    this.myhttp.getApplicationById(data.applicationId)
      .subscribe(
        (data) => {
          this.applicationDetail = data.result_body;
        },
        () => {
          this.message.error('Failed to obtain application data');
        }
      )
  }

  edit(data: Application) {
    this.applicationId = data.applicationId;
    this.editModalShow = true;
  }

  showDeleteConfirm(data: Application): void {
    this.modalService.confirm({
      nzTitle: this.translate.instant('maas.deleteTitle'),
      nzContent: this.translate.instant('maas.application.deleteApplicationContent'),
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => this.delete(data),
      nzCancelText: 'No',
      nzIconType: 'warning',
    });
  }

  editModalClose($event: modalClose): void {
    this.editModalShow = false;
    if ($event.cancel) {
      return;
    }
    this.getAllApplicationData()
  }

}