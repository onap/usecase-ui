import { Component, OnInit } from '@angular/core';
import { NzMessageService } from "ng-zorro-antd";
import { MaasService } from '@src/app/core/services/maas.service';
import { KnowledgeBase } from './knowledge-base.type';

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
    private myhttp: MaasService,
    private message: NzMessageService
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
  createModalClose($event: any): void {
    this.createModalShow = false;
    if ($event.cancel) {
      return;
    }
    this.getKnowledgeBaseData()
  }

  editKnowledgeBaseModuleClose($event: any): void {
    this.editKnowledgeBaseShow = false;
    if ($event.cancel) {
      return;
    }
    this.getKnowledgeBaseData()
  }

  knowledgeBaseDetailClose($event: any): void {
    this.knowledgeBaseShow = false;
  }

  deleteKnowledgeBase(data): void {
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
    this.knowledgeBaseShow = true;
    this.myhttp.getKnowledgeBaseById(data.knowledgeBaseId)
      .subscribe(
        (data) => {
          this.knowledgeBaseDetail = data.result_body;
        },
        () => {
          this.message.error('Failed to obtain knowledge base data');
        }
      )
  }

  editKnowedgeBase(data) {
    this.knowledgeBaseId = data.knowledgeBaseId;
    this.editKnowledgeBaseShow = true;
  }

}