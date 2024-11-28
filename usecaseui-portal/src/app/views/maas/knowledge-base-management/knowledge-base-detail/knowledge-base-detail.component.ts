import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { knowledgeBase } from '../knowledge-base.type';
import { KnowledgeBaseService } from '../knowledge-base.service';
@Component({
  selector: 'app-knowledge-base-detail',
  templateUrl: './knowledge-base-detail.component.html',
  styleUrls: ['./knowledge-base-detail.component.less']
})
export class KnowledgeBaseDetailComponent implements OnInit {

  constructor(
    private knowledgeBaseService: KnowledgeBaseService
  ) { }
  @Input() showModel: boolean;
  _knowledgeBase: knowledgeBase;
  data: Array<{ label: string, value: string }> = [];
  @Input()

  set knowledgeBaseDetail(v: any) {
    if (!v) {
      return;
    }
    this.data = [
      {
        label: 'Knowledge Base Name', value: v.knowledgeBaseName
      },
      {
        label: 'Knowledge Base Description', value: v.knowledgeBaseDescription
      },
      {
        label: 'Operator Name', value: v.operatorName
      },
      {
        label: 'MaaS Platform Name', value: v.maaSPlatformName
      },
      {
        label: 'Update Time', value: v.updateTime
      },
      {
        label: 'Files Name', value: this.knowledgeBaseService.getFiles(v)
      }
    ]
    this._knowledgeBase = v;
  }

  get knowledgeBaseDetail() {
    return this._knowledgeBase;
  };
  @Output() modalOpreation = new EventEmitter();
  files = '';

  ngOnInit() {
  }

  handleCancel(): void {
    this.showModel = false;
    this.modalOpreation.emit({ "cancel": true });
  }

  handleOk(): void {
    this.showModel = false;
    this.modalOpreation.emit({ "cancel": true });
  }
}