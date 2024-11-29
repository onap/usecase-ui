import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IntentManagementService } from '../../../../core/services/intentManagement.service';
import { Util } from '../../../../shared/utils/utils';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-input-knowledge-base',
  templateUrl: './input-knowledge-base.component.html',
  styleUrls: ['./input-knowledge-base.component.less']
})
export class InputKnowledgeBaseComponent implements OnInit {
  title = 'Add Knowledge Base';
  constructor(
    private myhttp: IntentManagementService,
    private Util: Util,
    private message: NzMessageService,
    private http: HttpClient,
    private fb: FormBuilder
  ) { }

  @Input() showModel: boolean;
  @Output() modalOpreation = new EventEmitter();

  apiUrl = '/api/usecaseui-llm-adaptation/v1/knowledgeBase/create';
  apiUrl1 = '/api/usecaseui-intent-analysis/v1/intents/upload';
  maasUrl = '/api/usecaseui-llm-adaptation/v1/operator/maas/getAll'
  url = "http://172.22.16.126:3000/api/core/dataset/create";
  knowledgeBase = {
    name: '',
    description: ''
  };
  fileList: UploadFile[] = [];
  operators: any[] = [];
  selectedOperator: any = null;
  filteredPlatforms: any[] = [];
  allPlatforms: any[] = [];
  selectedPlatform: any = null;
  validateForm: FormGroup;

  ngOnInit() {
    this.fetchOperators();
    this.validateForm = this.fb.group({
      name: [null],
      description: [null],
      selectedOperator: [null],
      selectedPlatform: [null],
    });
  }

  fetchOperators(): void {
    this.http.get<any>(this.maasUrl).subscribe(
      (response) => {
        console.log(response);
        this.operators = response.result_body;
      },
      (error) => {
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
    this.showModel = false;
    this.modalOpreation.emit({ "cancel": true });
  }
  handleOk(): void {
    const formData = new FormData();
    const metaData = {
      knowledgeBaseName: this.validateForm.controls.name.value,
      knowledgeBaseDescription: this.validateForm.controls.description.value,
      operatorId: this.validateForm.controls.selectedOperator.value.operatorId,
      operatorName: this.validateForm.controls.selectedOperator.value.operatorName,
      maaSPlatformId: this.validateForm.controls.selectedPlatform.value.maaSPlatformId,
      maaSPlatformName: this.validateForm.controls.selectedPlatform.value.maaSPlatformName
    };
    const metaDataJson = JSON.stringify(metaData);
    formData.append('metaData', metaDataJson);
    this.fileList.forEach((file: any) => {
      formData.append('files', file);
    });
    this.http.post<any>(this.apiUrl, formData).subscribe(
      (response) => {
        if (response.result_header.result_code === 200) {
          this.message.success('Created successfully');
        } else {
          this.message.error(response.result_header.result_message);
        }
        this.knowledgeBase = {
          name: '',
          description: ''
        };
        this.fileList = [];
        this.modalOpreation.emit({ "cancel": false });
      },
      (error) => {
        this.knowledgeBase = {
          name: '',
          description: ''
        };
        this.fileList = [];
        console.log('Upload failed', error);
      }
    );
  }
}