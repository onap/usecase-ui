import { Component, OnInit } from '@angular/core';
import { IntentManagementService } from '../../../core/services/intentManagement.service'
import { NzMessageService } from "ng-zorro-antd";
import { Router } from '@angular/router';

@Component({
  selector: 'app-knowledge-base-management',
  templateUrl: './knowledge-base-management.component.html',
  styleUrls: ['./knowledge-base-management.component.less']
})
export class KnowledgeBaseManagementComponent implements OnInit {
  editKnowledgeBaseShow = false;
  editKnowledgeBaseId = '';
  constructor(
    private myhttp: IntentManagementService,
    private message: NzMessageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getKnowledgeBaseData()
  }

  listOfData: any[] = [];

  intentModuleShow: boolean = false;
  knowledgeBaseShow: boolean = false;
  editIntentTableList: Object = {};
  currentIndex: number = -1;
  getKnowledgeBaseData(): void {
    this.myhttp.getKnowledgeBaseRecord()
      .subscribe(
        (data) => {
          this.listOfData = data.result_body
        },
        () => {
          this.message.error('Failed to obtain knowledgeBase data');
        }
      )
  }

  inputKnowledgeBaseModuleShow(): void {
    this.intentModuleShow = true;
  }
  inputKnowledgeBaseModuleClose($event: any): void {
    console.log($event);
    this.intentModuleShow = false;
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
    }, (err) => {
      this.message.error('Deletion failed');
    });
  }

  knowledgeBaseDetail: Object = {};
  displayKnowledgeDetails(data): void {
    this.knowledgeBaseShow = true;
    this.myhttp.getKnowledgeBaseById(data.knowledgeBaseId)
      .subscribe(
        (data) => {
          this.knowledgeBaseDetail = data.result_body;
        },
        (err) => {
          this.message.error('Failed to obtain knowledge base data');
        }
      )
  }

  editKnowedgeBase(data) {
    this.editKnowledgeBaseId = data.knowledgeBaseId;
    this.editKnowledgeBaseShow = true;
  }

}