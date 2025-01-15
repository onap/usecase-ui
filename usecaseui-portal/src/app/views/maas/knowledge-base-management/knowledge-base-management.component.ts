import { Component, OnDestroy, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { MaasApi } from '@src/app/api/maas.api';
import { KnowledgeBase, modalClose } from './knowledge-base.type';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-knowledge-base-management',
  templateUrl: './knowledge-base-management.component.html',
  styleUrls: ['./knowledge-base-management.component.less']
})
export class KnowledgeBaseManagementComponent implements OnInit {
  editKnowledgeBaseShow = false;
  knowledgeBaseId = '';
  data: KnowledgeBase[] = [];
  createModalShow: boolean = false;
  knowledgeBaseShow: boolean = false;
  knowledgeBaseDetail: Object = {};

  constructor(
    private myhttp: MaasApi,
    private message: NzMessageService,
    private modalService: NzModalService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.getKnowledgeBaseData()
  }

  getKnowledgeBaseData(): void {
    this.myhttp.getKnowledgeBaseRecord()
      .subscribe(
        (data) => {
          this.data = data.result_body
        },
        () => {
          this.message.error('Failed to obtain knowledgeBase data');
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
    this.getKnowledgeBaseData()
  }

  editKnowledgeBaseModuleClose($event: modalClose): void {
    this.editKnowledgeBaseShow = false;
    if ($event.cancel) {
      return;
    }
    this.getKnowledgeBaseData()
  }

  knowledgeBaseDetailClose(): void {
    this.knowledgeBaseShow = false;
  }

  deleteKnowledgeBase(data: KnowledgeBase): void {
    this.myhttp.deleteKnowledgeBaseData(data.knowledgeBaseId).subscribe((data) => {
      this.getKnowledgeBaseData()
      if (data.result_header.result_code === 200) {
        this.message.success('Deleted successfully');
      } else {
        this.message.error(data.result_header.result_message);
      }
    }, () => {
      this.message.error('Deletion failed');
    });
  }

  displayKnowledgeDetails(data): void {
    this.knowledgeBaseId = data.knowledgeBaseId;
    this.knowledgeBaseShow = true;
  }

  editKnowedgeBase(data: KnowledgeBase) {
    this.knowledgeBaseId = data.knowledgeBaseId;
    this.editKnowledgeBaseShow = true;
  }

  showDeleteConfirm(data: KnowledgeBase): void {
    this.modalService.confirm({
      nzTitle: this.translate.instant('maas.deleteTitle'),
      nzContent: this.translate.instant('maas.knowledgeBase.deleteKnowledgeBaseContent'),
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => this.deleteKnowledgeBase(data),
      nzCancelText: 'No',
      nzIconType: 'warning',
    });
  }

}