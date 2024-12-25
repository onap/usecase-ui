import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Util } from '../../../../shared/utils/utils';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaasApi } from '@src/app/api/maas.api';
import { Operator } from 'rxjs';
import { MaaSPlatform, Operators } from '../knowledge-base.type';

@Component({
  selector: 'app-create-knowledge-base',
  templateUrl: './create-knowledge-base.component.html',
  styleUrls: ['./create-knowledge-base.component.less']
})
export class CreateKnowledgeBaseComponent implements OnInit {
  title = 'Add Knowledge Base';
  @Input() showModal: boolean;
  @Output() modalOpreation = new EventEmitter();
  fileList: File[] = [];
  operators: Operators[] = [];
  filteredPlatforms: MaaSPlatform[] = [];
  validateForm: FormGroup;

  constructor(
    private myhttp: MaasApi,
    private Util: Util,
    private message: NzMessageService,
    private http: HttpClient,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.fetchOperators();
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [null],
      selectedOperator: [null, [Validators.required]],
      selectedPlatform: [null, [Validators.required]],
    });
  }
  fetchOperators(): void {
    this.myhttp.getOperators().subscribe(
      (response) => {
        this.operators = response.result_body;
      },
      () => {
        this.message.error('Failed to fetch operators');
      }
    );
  }
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }
  handleOperatorChange(value: Operators): void {
    if (value) {
      this.filteredPlatforms = value.maaSPlatformList;
    } else {
      this.filteredPlatforms = [];
    }
    this.validateForm.get('selectedPlatform').setValue(null);
  }
  beforeUpload = (file: File): boolean => {
    this.fileList.push(file);
    return false;
  }
  handleCancel(): void {
    this.showModal = false;
    this.modalOpreation.emit({ "cancel": true });
  }

  constructBody() {
    const formData = new FormData();
    const metaData = {
      knowledgeBaseName: this.validateForm.value.name,
      knowledgeBaseDescription: this.validateForm.value.description,
      operatorId: this.validateForm.value.selectedOperator.operatorId,
      operatorName: this.validateForm.value.selectedOperator.operatorName,
      maaSPlatformId: this.validateForm.value.selectedPlatform.maaSPlatformId,
      maaSPlatformName: this.validateForm.value.selectedPlatform.maaSPlatformName
    };
    const metaDataJson = JSON.stringify(metaData);
    formData.append('metaData', metaDataJson);
    this.fileList.forEach((file: File) => {
      formData.append('files', file);
    });
    return formData
  }

  handleOk(): void {
    this.submitForm();
    if (this.validateForm.invalid) {
      this.showModal = true;
      return;
    }
    this.myhttp.createKnowledgeBase(this.constructBody()).subscribe(
      (response) => {
        if (response.result_header.result_code === 200) {
          this.message.success('Created successfully');
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