import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KnowledgeBase } from '../knowledge-base.type';
import { MaasApi } from '@src/app/api/maas.api';

@Component({
  selector: 'app-edit-knowledge-base',
  templateUrl: './edit-knowledge-base.component.html',
  styleUrls: ['./edit-knowledge-base.component.less']
})
export class EditKnowledgeBaseComponent implements OnInit {
  title = 'Edit Knowledge Base';
  @Input() showModal: boolean;
  @Input() knowledgeBaseId: string;
  @Output() modalOpreation = new EventEmitter();
  validateForm: FormGroup;
  defalutKnowledgeBase: KnowledgeBase = {
    knowledgeBaseName: '',
    knowledgeBaseDescription: '',
    knowledgeBaseId: '',
    operatorName: '',
    maaSPlatformName: '',
    maaSPlatformId: '',
    updateTime: '',
    filesName: [],
    operatorId: ''
  }
  knowledgeBase: KnowledgeBase = this.defalutKnowledgeBase;

  constructor(
    private myhttp: MaasApi,
    private message: NzMessageService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [this.knowledgeBase.knowledgeBaseName, [Validators.required]],
      description: [this.knowledgeBase.knowledgeBaseDescription],
    });
    this.fetchKnowledgeBase();
  }

  checkForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  submitForm(): void {
    this.checkForm();
    this.create();
  }

  fetchKnowledgeBase(): void {
    this.myhttp.getKnowledgeBaseById(this.knowledgeBaseId)
      .subscribe(
        (response) => {
          if (response.result_header.result_code !== 200) {
            this.message.error('get Knowledge Base error');
            return;
          }
          this.knowledgeBase = response.result_body;
          this.validateForm.patchValue({
            name: this.knowledgeBase.knowledgeBaseName,
            description: this.knowledgeBase.knowledgeBaseDescription
          });
        },
        () => {
          this.message.error('Failed to obtain knowledge base data');
        }
      )
  }

  handleCancel(): void {
    this.showModal = false;
    this.modalOpreation.emit({ "cancel": true });
  }

  create() {
    const body = {
      knowledgeBaseId: this.knowledgeBase.knowledgeBaseId,
      knowledgeBaseName: this.validateForm.get('name').value,
      knowledgeBaseDescription: this.validateForm.get('description').value,
      operatorId: this.knowledgeBase.operatorId,
      operatorName: this.knowledgeBase.operatorName,
      maaSPlatformId: this.knowledgeBase.maaSPlatformId,
      maaSPlatformName: this.knowledgeBase.maaSPlatformName
    };
    this.myhttp.updateKnowledgeBase(body).subscribe(
      (response) => {
        if (response.result_header.result_code === 200) {
          this.message.success('update knowledge base successfully');
        } else {
          this.message.error(response.result_header.result_message);
        }
        this.modalOpreation.emit({ "cancel": false });
      },
      (error) => {
        console.log('Upload failed', error);
      }
    );
  }
}