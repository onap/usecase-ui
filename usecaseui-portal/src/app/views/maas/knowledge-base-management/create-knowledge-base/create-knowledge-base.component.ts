import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Util } from '../../../../shared/utils/utils';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaasService } from '@src/app/core/services/maas.service';

@Component({
  selector: 'app-create-knowledge-base',
  templateUrl: './create-knowledge-base.component.html',
  styleUrls: ['./create-knowledge-base.component.less']
})
export class CreateKnowledgeBaseComponent implements OnInit {
  title = 'Add Knowledge Base';
  @Input() showModal: boolean;
  @Output() modalOpreation = new EventEmitter();

  apiUrl = '/api/usecaseui-llm-adaptation/v1/knowledgeBase/create';
  maasUrl = '/api/usecaseui-llm-adaptation/v1/operator/maas/getAll'
  fileList: UploadFile[] = [];
  operators: any[] = [];
  filteredPlatforms: any[] = [];
  validateForm: FormGroup;

  constructor(
    private myhttp: MaasService,
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
    this.http.get<any>(this.maasUrl).subscribe(
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
  handleOperatorChange(value: any): void {
    if (value) {
      this.filteredPlatforms = value.maaSPlatformList;
    } else {
      this.filteredPlatforms = [];
    }
    this.validateForm.get('selectedPlatform').setValue(null);
  }
  beforeUpload = (file: UploadFile): boolean => {
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
    this.fileList.forEach((file: any) => {
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
    this.http.post<any>(this.apiUrl, this.constructBody()).subscribe(
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