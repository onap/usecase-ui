import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from "ng-zorro-antd";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaasService } from '@src/app/core/services/maas.service';

@Component({
  selector: 'app-create-application-management',
  templateUrl: './create-application-management.component.html',
  styleUrls: ['./create-application-management.component.less']
})
export class CreateApplicationManagementComponent implements OnInit {
  title = 'Add Application';
  validateForm: FormGroup;
  @Input() showModal: boolean;
  @Output() modalOpreation = new EventEmitter();
  operators: any[] = [];
  filteredPlatforms: any[] = [];
  filteredModels: any[] = [];
  knowledgeBases: any[] = [];
  temperature = 3;
  top_p = 3;

  constructor(
    private myhttp: MaasService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.fetchOperators();
    this.initFormData();
  }

  initFormData() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [null],
      applicationType: [null, [Validators.required]],
      selectedOperator: [null, [Validators.required]],
      selectedPlatform: [null, [Validators.required]],
      selectedModel: [null, [Validators.required]],
      selectKnowledgeBase: [null, [Validators.required]],
      prompt: [null],
      openingRemarks: [null],
      temperature: [3, [Validators.required]],
      temperatureSlider: [3],
      top_p: [3, [Validators.required]],
      top_pSlider: [3]
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

  handleOperatorChange(value: any): void {
    if (value) {
      this.filteredPlatforms = value.maaSPlatformList;
    } else {
      this.filteredPlatforms = [];
    }
    this.validateForm.get('selectedPlatform').setValue(null);
    this.validateForm.get('selectedModel').setValue(null);
    this.validateForm.get('selectKnowledgeBase').setValue(null);
  }

  handleMaasChange(value: any): void {
    if (value) {
      this.filteredModels = value.modelList;
      this.fetchKnowledgeBase(value);
    } else {
      this.filteredModels = [];
    }
    this.validateForm.get('selectedModel').setValue(null);
    this.validateForm.get('selectKnowledgeBase').setValue(null);
  }

  fetchKnowledgeBase(value): void {
    this.myhttp.fetchKnowledgeBaseByMaasId(value.maaSPlatformId).subscribe(
      (response) => {
        this.knowledgeBases = response.result_body;
      },
      () => {
        this.message.error('Failed to fetch knowledge base');
      }
    );
  }

  handleCancel(): void {
    this.showModal = false;
    this.modalOpreation.emit({ "cancel": true });
  }

  handleOk() {
    this.submitForm();
    if (this.validateForm.invalid) {
      this.showModal = true;
      return;
    }
    this.myhttp.createApplication(this.constructBody()).subscribe(
      (response) => {
        this.showModal = false;
        this.modalOpreation.emit({ "cancel": false });
        if (response.result_header.result_code === 200) {
          this.message.success('Created successfully');
        } else {
          this.message.error(response.result_header.result_message);
        }
      },
      () => {
        this.showModal = false;
        this.message.error('Created failed');
      }
    )
  }
  constructBody() {
    const requestBody = {
      applicationName: this.validateForm.value.name,
      applicationDescription: this.validateForm.value.description,
      applicationType: this.validateForm.value.applicationType,
      operatorName: this.validateForm.value.selectedOperator.operatorName,
      operatorId: this.validateForm.value.selectedOperator.operatorId,
      maasPlatformId: this.validateForm.value.selectedPlatform.maaSPlatformId,
      maasPlatformName: this.validateForm.value.selectedPlatform.maaSPlatformName,
      knowledgeBaseId: this.validateForm.value.selectKnowledgeBase.knowledgeBaseId,
      knowledgeBaseName: this.validateForm.value.selectKnowledgeBase.knowledgeBaseName,
      largeModelId: this.validateForm.value.selectedModel.modelId,
      largeModelName: this.validateForm.value.selectedModel.modelName,
      prompt: this.validateForm.value.prompt,
      temperature: this.validateForm.value.temperature,
      top_p: this.validateForm.value.top_p,
      openingRemarks: this.validateForm.value.openingRemarks
  }
  return requestBody;
}

  submitForm(): void {
    for (let i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  handleTemperatureSliderChange(event: number): void {
    this.validateForm.controls.temperature.setValue(event);
  }

  handleTemperatureInputChange(event: number): void {
    this.validateForm.controls.temperatureSlider.setValue(event);
  }

  handletoppChange(event: number): void {
    this.validateForm.controls.top_p.setValue(event);
  }

  toppSliderChange(event: number): void {
    this.validateForm.controls.top_p.setValue(event);
  }

  toppInputChange(event: number): void {
    this.validateForm.controls.top_pSlider.setValue(event);
  }
}