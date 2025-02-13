import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MaasApi } from '@src/app/api/maas.api';
import { MaaSPlatform, Operators } from '../knowledge-base.type';
import { MaasService } from '../../maas-service.service';

@Component({
  selector: 'app-create-knowledge-base',
  templateUrl: './create-knowledge-base.component.html',
  styleUrls: ['./create-knowledge-base.component.less']
})
export class CreateKnowledgeBaseComponent implements OnInit {
  title = 'Add Knowledge Base';
  @Input() showModal: boolean;
  @Input() existedNames: string[] = [];
  @Output() modalOpreation = new EventEmitter();
  fileList: UploadFile[] = [];
  operators: Operators[] = [];
  filteredPlatforms: MaaSPlatform[] = [];
  validateForm: FormGroup;
  loading = false;

  constructor(
    private myhttp: MaasApi,
    private message: NzMessageService,
    private fb: FormBuilder,
    public maasService: MaasService
  ) { }

  nameDuplicateValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (this.existedNames.includes(control.value)) {
      return { duplicated: true, error: true };
    }
  }

  ngOnInit() {
    this.fetchOperators();
    this.validateForm = this.fb.group({
      name: [null, [Validators.required, this.nameDuplicateValidator]],
      description: [null],
      selectedOperator: [null, [Validators.required]],
      selectedPlatform: [null, [Validators.required]],
      fileList: [null, [Validators.required]]
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

  beforeUpload = (file: UploadFile): boolean => {
    if(this.fileList.length === 0 || this.fileList.some(item => item.name !== file.name)) {
      this.fileList.push(file);
      this.validateForm.get('fileList').setValue(this.fileList);
    } else {
      this.message.error("You can't upload a file with the same name.");
    }
    return false;
  }

  handleRemove = (file: UploadFile): boolean => {
    this.fileList = this.fileList.filter((item) => item.uid !== file.uid);
    this.validateForm.get('fileList').setValue(this.fileList);
    return true;
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
    this.validateForm.value.fileList.forEach((file: File) => {
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
    this.loading = true;
    this.myhttp.createKnowledgeBase(this.constructBody()).subscribe(
      (response) => {
        if (response.result_header.result_code === 200) {
          this.message.success('Created successfully');
        } else {
          this.message.error(response.result_header.result_message);
        }
        this.loading = false;
        this.modalOpreation.emit({ "cancel": false });
      },
      () => {
        this.loading = false;
        console.log('Upload failed');
      }
    );
  }
}