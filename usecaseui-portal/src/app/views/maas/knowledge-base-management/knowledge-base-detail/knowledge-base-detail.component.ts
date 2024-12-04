import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KnowledgeBase } from '../knowledge-base.type';
import { KnowledgeBaseService } from '../knowledge-base.service';
@Component({
  selector: 'app-knowledge-base-detail',
  templateUrl: './knowledge-base-detail.component.html',
  styleUrls: ['./knowledge-base-detail.component.less']
})
export class KnowledgeBaseDetailComponent implements OnInit {

  constructor(
    public knowledgeBaseService: KnowledgeBaseService
  ) { }
  @Input() showModal: boolean;
  @Input() knowledgeBaseDetail: KnowledgeBase;
  @Output() modalOpreation = new EventEmitter();

  ngOnInit() {
  }

  handleCancel(): void {
    this.showModal = false;
    this.modalOpreation.emit({ "cancel": true });
  }

  handleOk(): void {
    this.showModal = false;
    this.modalOpreation.emit({ "cancel": true });
  }
}