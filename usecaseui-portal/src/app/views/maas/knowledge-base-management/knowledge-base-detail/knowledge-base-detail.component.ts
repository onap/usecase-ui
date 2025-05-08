import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KnowledgeBase } from '../knowledge-base.type';
import { KnowledgeBaseService } from '../knowledge-base.service';
import { MaasApi } from '@src/app/api/maas.api';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { MaasService } from '../../maas-service.service';
@Component({
  selector: 'app-knowledge-base-detail',
  templateUrl: './knowledge-base-detail.component.html',
  styleUrls: ['./knowledge-base-detail.component.less']
})
export class KnowledgeBaseDetailComponent implements OnInit {
  constructor(
    public knowledgeBaseService: KnowledgeBaseService,
    public myhttp: MaasApi,
    private maasServie: MaasService,
    private message: NzMessageService,
  ) { }
  @Input() showModal: boolean;
  displayFiles = [];
  init = true;
  data: KnowledgeBase ;
  set knowledgeBaseDetail(v: KnowledgeBase) {
    if(v) {
      this.displayFiles = v.fileList.slice().reverse();
      this.data = v;
    }
  }
  get knowledgeBaseDetail() {
    return this.data;
  }
  @Input() id = '';
  fileList: File[] = [];
  @Output() modalOpreation = new EventEmitter();
  removedFiles:string[] = [];
  url = `${(window as any).baseUrl}${this.myhttp.url.uploadFile}`;

  async ngOnInit() {
    await this.displayKnowledgeDetails(this.id);
  }

  async displayKnowledgeDetails(id: string) {
    try {
      const response = await this.myhttp.getKnowledgeBaseById(id).toPromise();
      this.knowledgeBaseDetail = response.result_body;
    } catch {
      this.knowledgeBaseDetail = null;
      this.message.error('Failed to obtain knowledge base data');
    }
  }

  handleCancel(): void {
    this.showModal = false;
    this.modalOpreation.emit();
  }

  handleOk(): void {
    this.showModal = false;
    this.modalOpreation.emit();
  }

  async handleChange({ file}) {
    const status = file.status;
    if (status === 'done') {
      this.fileList = [];
      if (file.response.result_header.result_code === 200) {
        await this.displayKnowledgeDetails(this.id);
        this.message.success(`${file.name} upload successfully.`);
      } else {
        this.displayFiles.unshift({fileId: this.maasServie.generateUniqueId, fileName: file.name, status: 'error'});
      }
    } else if (status === 'error') {
      this.fileList = [];
      this.displayFiles.unshift({fileId: this.maasServie.generateUniqueId, fileName: file.name, status: 'error'});
      this.message.error(`${file.name} file upload failed.`);
    } else if (status === 'removed') {
      console.log('file event removed!');
    }
  }

  nzdata = () => {
    const metaData = JSON.stringify({
      knowledgeBaseId: this.knowledgeBaseDetail.knowledgeBaseId
    });
    return {metaData}
  }

  removedFile({fileId, status, fileName}) {
    if (status === 'error') {
      this.displayFiles = this.displayFiles.filter(file => file.fileId !== fileId);
      this.message.success(`${fileName} delete successfully.`);
      return;
    }
    this.myhttp.removeFile(fileId).pipe(
    ).subscribe(
      (response) => {
        if (response.result_header.result_code === 200) {
          this.displayFiles = this.displayFiles.filter(file => file.fileId !== fileId);
          this.message.success(`${fileName} delete successfully.`);
        }
      },
      () => {
        this.message.success(`${fileName} delete failed.`);
      }
    )
  }

  beforeUpload = (file: UploadFile): boolean => {
    if(this.displayFiles.some(item => item.fileName === file.name)) {
      this.message.error("You can't upload a file with the same name.");
      return false;
    } else {
      return true;
    }
  }
}
