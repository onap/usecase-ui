import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaasApi } from '@src/app/api/maas.api';
import { NzMessageService } from 'ng-zorro-antd';
import { Application } from '../application.type';

@Component({
  selector: 'app-edit-application',
  templateUrl: './edit-application.component.html',
  styleUrls: ['./edit-application.component.less']
})
export class EditApplicationComponent implements OnInit {
  title = 'Edit Application';
  @Input() showModal: boolean;
  @Input() applicationId: string;
  @Output() modalOpreation = new EventEmitter();
  validateForm: FormGroup;
  defalutApplication: Application = {
  'applicationId': '',
  'applicationName': '',
  'applicationDescription': '',
  'applicationType': '',
  'operatorId': '',
  'operatorName': '',
  'maaSPlatformId': '',
  'maaSPlatformName': '',
  'knowledgeBaseName': '',
  'knowledgeBaseId': '',
  'largeModelName': '',
  'largeModelId': '',
  'prompt': '',
  'temperature': 3,
  'top_p': 3,
  'openingRemarks': '',
  }
  application: Application = this.defalutApplication;
  constructor(
    private myhttp: MaasApi,
    private message: NzMessageService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [this.application.applicationName, [Validators.required]],
      description: [this.application.applicationDescription],
    });
    this.fetchApplication();
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

  fetchApplication(): void {
    this.myhttp.getApplicationById(this.applicationId)
      .subscribe(
        (response) => {
          if (response.result_header.result_code !== 200) {
            this.message.error('get application error');
            return;
          }
          this.application = response.result_body;
          this.validateForm.patchValue({
            name: this.application.applicationName,
            description: this.application.applicationDescription
          });
        },
        () => {
          this.message.error('Failed to obtain knowledge base data');
        }
      )
  }

  handleCancel(): void {
    this.showModal = false;
    this.modalOpreation.emit({ 'cancel': true });
  }

  create() {
    const metaData = {
      ...this.application,
      applicationName: this.validateForm.get('name').value,
      applicationDescription: this.validateForm.get('description').value,
    };
    this.myhttp.updateApplication(metaData).subscribe(
      (response) => {
        if (response.result_header.result_code === 200) {
          this.message.success('update knowledge base successfully');
        } else {
          this.message.error(response.result_header.result_message);
        }
        this.modalOpreation.emit({ 'cancel': false });
      },
      (error) => {
        console.log('Upload failed', error);
      }
    );
  }

}
