import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KnowledgeBase } from '../knowledge-base.type';
import { KnowledgeBaseService } from '../knowledge-base.service';
import { MaasApi } from '@src/app/api/maas.api';
import { NzMessageService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';
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
  
  ngOnInit() {
    this.displayKnowledgeDetails(this.id);
  }

  displayKnowledgeDetails(id: string) {
    this.myhttp.getKnowledgeBaseById(id).subscribe(
      (response) => {
        this.knowledgeBaseDetail = response.result_body;
      },
      () => {
        this.message.error('Failed to obtain knowledge base data');
      }
    );
  }

  handleCancel(): void {
    this.showModal = false;
    this.modalOpreation.emit();
  }

  handleOk(): void {
    this.showModal = false;
    this.modalOpreation.emit();
  }

  handleChange({ file}): void {
    const status = file.status;
    if (status === 'done') {
      this.fileList = [];
      if (file.response.result_header.result_code === 200) {
        this.message.success(`${file.name} upload successfully.`);
        this.displayKnowledgeDetails(this.id);
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

  beforeUpload = (): boolean => {
    return true;
  }

}