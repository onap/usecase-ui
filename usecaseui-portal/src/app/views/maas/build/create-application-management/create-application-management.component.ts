import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NzMessageService } from "ng-zorro-antd";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MaasApi } from '@src/app/api/maas.api';
import { KnowledgeBase, MaaSPlatform, ModelInformation, Operators } from '../../knowledge-base-management/knowledge-base.type';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Application } from '../application.type';

@Component({
  selector: 'app-create-application-management',
  templateUrl: './create-application-management.component.html',
  styleUrls: ['./create-application-management.component.less']
})
export class CreateApplicationManagementComponent implements OnInit {
  @Input() applicationId: string;
  title = 'Add Application';
  isEdit_ = false;
  @Input()
  set isEdit(v: boolean) {
    if (v) {
      this.title = 'Edit Application';
    } else {
      this.title = 'Add Application';
    }
    this.isEdit_ = v;
  }

  get isEdit() {
    return this.isEdit_;
  }
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
  application: Application;

  constructor(
    private myhttp: MaasApi,
    private message: NzMessageService,
    private fb: FormBuilder
  ) { }

  async ngOnInit() {
    this.initFormData();
    await this.fetchOperators();
    if (this.isEdit) {
      await this.fetchApplication();
    }
    this.submitSubject.pipe(debounceTime(3000)).subscribe(() => this.executeSubmit());
  }

  async fetchApplication(): Promise<void> {
    try {
      const response = await this.myhttp.getApplicationById(this.applicationId).toPromise();
      if (response.result_header.result_code !== 200) {
        this.message.error('get application error');
        return;
      }
      this.application = response.result_body;

      this.validateForm.patchValue({
        name: this.application.applicationName,
        description: this.application.applicationDescription,
        applicationType: this.application.applicationType,
        selectedOperator: this.operators.find(i => i.operatorId === this.application.operatorId),
        selectedPlatform: this.application.maaSPlatformId,
        selectedModel: this.application.largeModelId,
        selectKnowledgeBase: this.application.knowledgeBaseId,
        prompt: this.application.prompt,
        openingRemarks: this.application.openingRemarks,
        temperature: this.application.temperature,
        top_p: this.application.top_p,
        temperatureSlider: this.application.temperature,
        top_pSlider: this.application.top_p
      });
    } catch (error) {
      this.message.error('Failed to obtain knowledge base data');
    }
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
      name: this.isEdit ? [null, [Validators.required]] : [null, [Validators.required, this.nameDuplicateValidator]],
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

  async fetchOperators(): Promise<void> {
    try {
      const response = await this.myhttp.getOperators().toPromise();
      this.operators = response.result_body;
    } catch (error) {
      this.message.error('Failed to fetch operators');
    }
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

  handleMaasChange(maaSPlatformId: string): void {
    if (maaSPlatformId) {
      const filteredPlatformsByMaas = this.filteredPlatforms.find(i => i.maaSPlatformId === maaSPlatformId)
      this.filteredModels = filteredPlatformsByMaas ? filteredPlatformsByMaas.modelList : [];
      this.fetchKnowledgeBase(maaSPlatformId);
    } else {
      this.filteredModels = [];
    }
    this.validateForm.get('selectedModel').setValue(null);
    this.validateForm.get('selectKnowledgeBase').setValue(null);
  }

  fetchKnowledgeBase(maaSPlatformId: string): void {
    this.myhttp.fetchKnowledgeBaseByMaasId(maaSPlatformId).subscribe(
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
    const url = this.isEdit ? this.myhttp.url.updateApplication : this.myhttp.url.createApplicationUrl;
    this.myhttp.createApplication(url, this.constructBody()).subscribe(
      (response) => {
        if (response.result_header.result_code === 200) {
          this.showModal = false;
          this.modalOpreation.emit({ "cancel": false });
          this.message.success('Operate successfully');
        } else {
          this.message.error(response.result_header.result_message);
        }
      },
      () => {
        this.showModal = false;
        this.message.error('Operate failed');
      }
    )
  }

  constructBody() {
    const filteredPlatformById = this.filteredPlatforms.find(i => i.maaSPlatformId === this.validateForm.value.selectedPlatform);
    const maaSPlatformName = filteredPlatformById ? filteredPlatformById.maaSPlatformName : '';
    const filteredModelById = this.filteredModels.find(i => i.modelId === this.validateForm.value.selectedModel);
    const largeModelName = filteredModelById ? filteredModelById.modelName : '';
    const filteredKnowledgebaseById = this.knowledgeBases.find(i => i.knowledgeBaseId === this.validateForm.value.selectKnowledgeBase);
    const knowledgeBaseName = filteredKnowledgebaseById ? filteredKnowledgebaseById.knowledgeBaseName : '';

    const requestBody = {
      applicationName: this.validateForm.value.name,
      applicationDescription: this.validateForm.value.description,
      applicationType: this.validateForm.value.applicationType,
      operatorName: this.validateForm.value.selectedOperator.operatorName,
      operatorId: this.validateForm.value.selectedOperator.operatorId,
      maaSPlatformId: this.validateForm.value.selectedPlatform,
      maaSPlatformName,
      knowledgeBaseId: this.validateForm.value.selectKnowledgeBase,
      knowledgeBaseName,
      largeModelId: this.validateForm.value.selectedModel,
      largeModelName,
      prompt: this.validateForm.value.prompt,
      temperature: this.validateForm.value.temperature,
      top_p: this.validateForm.value.top_p,
      openingRemarks: this.validateForm.value.openingRemarks
    }
    if (this.isEdit) {
      requestBody['applicationId'] = this.applicationId;
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

