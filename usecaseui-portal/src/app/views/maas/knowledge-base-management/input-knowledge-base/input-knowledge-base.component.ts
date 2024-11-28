import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IntentManagementService } from '../../../../core/services/intentManagement.service';
import { Util } from '../../../../shared/utils/utils';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  ) { }

  @Input() showModel: boolean;
  @Input() isEdit = false;
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
  ngOnInit() {
    this.fetchOperators();
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

  handleOperatorChange(value: any): void {
    if (value) {
      this.filteredPlatforms = value.maaSPlatformList;
    } else {
      this.filteredPlatforms = [];
    }
    this.selectedPlatform = null;
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
    console.log(this.operators);
    console.log(this.selectedOperator);
    const metaData = {
      knowledgeBaseName: this.knowledgeBase.name,
      knowledgeBaseDescription: this.knowledgeBase.description,
      operatorId: this.selectedOperator.operatorId,
      operatorName: this.selectedOperator.operatorName,
      maaSPlatformId: this.selectedPlatform.maaSPlatformId,
      maaSPlatformName: this.selectedPlatform.maaSPlatformName
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