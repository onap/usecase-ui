import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Util } from '../../../../shared/utils/utils';
import {NzMessageService} from "ng-zorro-antd";
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-input-application-management',
  templateUrl: './input-application-management.component.html',
  styleUrls: ['./input-application-management.component.less']
})
export class InputApplicationManagementComponent implements OnInit {
  title = 'Add Application';
  constructor(
    private Util: Util,
    private message: NzMessageService,
    private http: HttpClient
  ) { }

  @Input() showModel: boolean;
  @Output() modalOpreation = new EventEmitter();

  maasUrl = '/api/usecaseui-llm-adaptation/v1/operator/maas/getAll';
  knowBaseUrl = "/api/usecaseui-llm-adaptation/v1/knowledgeBase/queryByMaaSId/";
  createApplicationUrl = "/api/usecaseui-llm-adaptation/v1/application/create";

  applicationName = "";
  applicationDescription = "";
  applicationType = "Knowledge Assistant";
    operators: any[] = [];
    selectedOperator: any = null;
    filteredPlatforms: any[] = [];
    selectedPlatform: any = null;
    filteredModels: any[] = [];
    selectedModel: any = null;
    knowledgeBases: any[] =[];
    selectKnowledgeBase: any = null;
  modelDefaultValue = "";
  temperature = 3;
  top_p = 3;
  prompt ="";
  openingRemarks = "";
  ngOnInit() {
     this.fetchOperators();
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

   handleOperatorChange(value: any): void {
    if (value) {
      this.filteredPlatforms = value.maaSPlatformList;
    } else {
      this.filteredPlatforms = [];
    }
    this.selectedPlatform = null;
    this.selectedModel = null;
    this.selectKnowledgeBase = null;
  }

   handleMaasChange(value: any): void {
    if (value) {
      this.filteredModels = value.modelList;
      console.log(this.filteredModels);
      this.fetchKnowledgeBase(value);
    } else {
      this.filteredModels = [];
    }
    this.selectedModel = null;
    this.selectKnowledgeBase = null;
  }

  fetchKnowledgeBase(value): void {
     this.http.get<any>(this.knowBaseUrl+value.maaSPlatformId).subscribe(
      (response) => {
        this.knowledgeBases = response.result_body;
      },
      (error) => {
        this.message.error('Failed to fetch knowledge base');
      }
    );
  }

  handleCancel(): void {
    this.showModel = false;
    this.modalOpreation.emit({ "cancel": true });
  }
  handleOk(): void {
    this.createApplication();
  }

  createApplication(){
      const requestBody = {
          applicationName: this.applicationName,
          applicationDescription: this.applicationDescription,
          applicationType: this.applicationType,
          operatorName: this.selectedOperator.operatorName,
          operatorId: this.selectedOperator.operatorId,
          maaSPlatformId: this.selectedPlatform.maaSPlatformId,
          maaSPlatformName: this.selectedPlatform.maaSPlatformName,
          knowledgeBaseId: this.selectKnowledgeBase.knowledgeBaseId,
          knowledgeBaseName: this.selectKnowledgeBase.knowledgeBaseName,
          largeModelId: this.selectedModel.modelId,
          largeModelName: this.selectedModel.modelName,
          prompt: this.prompt,
          temperature: this.temperature,
          top_p: this.top_p,
          openingRemarks: this.openingRemarks
        };
        console.log(requestBody);
     this.http.post<any>(this.createApplicationUrl, requestBody).subscribe(
      (response) => {
        this.showModel = false;
        this.modalOpreation.emit({ "cancel": false });
        const resultHeader = {};
        if(response.result_header.result_code===200){
          this.message.success('Created successfully');
        }else{
          this.message.error(response.result_header.result_message);
        }
      },
      (err) => {
        this.showModel = false;
        this.message.error('Created failed');
      }
    )
  }
}