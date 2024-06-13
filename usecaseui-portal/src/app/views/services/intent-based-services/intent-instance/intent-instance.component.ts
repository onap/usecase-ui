import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NzMessageService } from "ng-zorro-antd";
import { intentBaseService } from "../../../../core/services/intentBase.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-intent-instance',
  templateUrl: './intent-instance.component.html',
  styleUrls: ['./intent-instance.component.less']
})
export class IntentInstanceComponent implements OnInit {

  constructor(
    private router: Router,
    private http: HttpClient,
    private myHttp: intentBaseService,
    private nzMessage: NzMessageService
  ) { }

  ngOnChanges() { }

  ngOnInit() {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.getIntentionInstanceList();
  }

  ngOnDestroy() { }

  // table lists
  listOfData: any[] = [];
  // pageSize or pageNum
  pageIndex: number = 1;
  pageSize: number = 10;
  total: number = 0;
  loading = false;

  // init source data
  getIntentionInstanceList(): void {
    this.myHttp.getIntentInstanceList({
      currentPage: this.pageIndex,
      pageSize: this.pageSize
    }).subscribe((response) => {
      const { code, message, data: { totalRecords, list } } = response;
      if (code !== 200) {
        this.nzMessage.error(message);
        return;
      }

      this.total = totalRecords;
      this.listOfData = list;
    }, (err) => {
      console.log(err);
    });
  }

  // change page message
  searchData(): void {
    this.getIntentionInstanceList();
  }

  verificationIntentionInstance(row): void {
    this.myHttp.verifyIntentInstance({
      id: row.id
    }).subscribe((response) => {
      const { code, message, data } = response;
      if (code !== 200) {
        this.nzMessage.error(message);
        return;
      }
      this.nzMessage.success(data);
      this.resetParam2Query();
    }, (err) => {
      console.log(err);
    });
  }

  deleteIntentionInstance(row): void {
    this.myHttp.delIntentInstance(row.id).subscribe((response) => {
      const { code, message } = response;
      if (code !== 200) {
        this.nzMessage.error(message);
        return;
      }
      this.nzMessage.success('Delete IntentionInstance Success');
      this.resetParam2Query();
    }, (err) => {
      console.log(err);
    });
  }
  params: Object = {
    intentId: '',
    startDate: '',
    endData: ''
  };
  exportData() {
    this.http.post('/api/usecaseui-server/v1/intent/exportIntentContent', {}, { responseType: 'blob' })
      .subscribe((data) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(data);
        link.setAttribute('download', 'excelData');
        link.click();
      }, (error) => {
        console.error('export failed:', error);
        Swal.fire({
          icon: 'error',
          title: 'export failed',
        });
      });
  }
  resetParam2Query() {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.getIntentionInstanceList();
  }
}