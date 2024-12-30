import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NzMessageService } from "ng-zorro-antd";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MaasApi } from '@src/app/api/maas.api';
import { KnowledgeBase, MaaSPlatform, ModelInformation, Operators } from '../../knowledge-base-management/knowledge-base.type';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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
  operators: Operators[] = [];
  filteredPlatforms: MaaSPlatform[] = [];
  filteredModels: ModelInformation[] = [];
  knowledgeBases: KnowledgeBase[] = [];
  temperature = 3;
  top_p = 3;
  private submitSubject = new Subject<void>();
  @ViewChild('myTextarea') myTextarea: ElementRef;
  @ViewChild('charCount') charCount: ElementRef;
  @Input() existedNames: string[] = [];

  constructor(
    private myhttp: MaasApi,
    private message: NzMessageService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.fetchOperators();
    this.initFormData();
    this.submitSubject.pipe(debounceTime(6000)).subscribe(() => this.executeSubmit());
  }

  nameDuplicateValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (this.existedNames.includes(control.value)) {
      return { duplicated: true, error: true };
    }
  }

  initFormData() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required, this.nameDuplicateValidator]],
      description: [null],
      applicationType: [null, [Validators.required]],
      selectedOperator: [null, [Validators.required]],
      selectedPlatform: [null, [Validators.required]],
      selectedModel: [null, [Validators.required]],
      selectKnowledgeBase: [null, [Validators.required]],
      prompt: [null, [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]],
      openingRemarks: [null, [Validators.required]],
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

  handleOperatorChange(value: Operators): void {
    if (value) {
      this.filteredPlatforms = value.maaSPlatformList;
    } else {
      this.filteredPlatforms = [];
    }
    this.validateForm.get('selectedPlatform').setValue(null);
    this.validateForm.get('selectedModel').setValue(null);
    this.validateForm.get('selectKnowledgeBase').setValue(null);
  }

  handleMaasChange(value: MaaSPlatform): void {
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
    this.submitSubject.next();
  }

  private executeSubmit() {
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
      maaSPlatformId: this.validateForm.value.selectedPlatform.maaSPlatformId,
      maaSPlatformName: this.validateForm.value.selectedPlatform.maaSPlatformName,
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

  updateCharCount() {
    const textarea = this.myTextarea.nativeElement as HTMLTextAreaElement;
    const charCount = textarea.value.length;
    const maxLength = textarea.getAttribute('maxlength');
    this.charCount.nativeElement.innerText = charCount + '/' + maxLength;
  }
}

