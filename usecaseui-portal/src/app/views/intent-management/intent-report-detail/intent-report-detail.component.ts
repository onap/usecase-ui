import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { DatePipe} from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-intent-report-detail',
  templateUrl: './intent-report-detail.component.html',
  styleUrls: ['../intent-management.component.less']
})
export class IntentReportDetailComponent implements OnInit {

  constructor(private http: HttpClient,private datePipe:DatePipe) { }

  @Input() showModel: boolean;
  @Input() reportData;
  @Input() intentInfo;
  @Output() modalOpreation = new EventEmitter();

  ngOnInit() {
  }
  ngOnChanges(){
  }
  handleCancel(): void {
    this.showModel = false;
    this.modalOpreation.emit({ "cancel": false });
  }
  startDateTime: Date = new Date();
  endDateTime: Date = new Date();
  settings = {
		bigBanner: true,
        format: 'yyyy-MM-dd HH:mm',
        defaultOpen: false,
        timePicker: true,
        closeOnSelect: true
	}
  params: Object={
    intentId:'',
    startDate:'',
    endData: ''
  };
  exportData() {
    this.params['startDate'] = this.datePipe.transform(this.startDateTime,'yyyy-MM-dd HH:mm');
    this.params['endData'] = this.datePipe.transform(this.endDateTime,'yyyy-MM-dd HH:mm');
    this.params['intentId']=this.intentInfo['intentId']
    this.http
      .post('/api/usecaseui-intent-analysis/v1/intentReport/export', this.params,{responseType:'blob'})
      .subscribe((data) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(data);
        link.setAttribute('download', 'Report.csv');
        link.click();
      }, (error) => {
        console.error('export failed:', error);
        Swal.fire({
           icon: 'error',
           title: 'export failed',
        });
      });
  }
}
