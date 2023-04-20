import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-intent-report-detail',
  templateUrl: './intent-report-detail.component.html',
  styleUrls: ['../intent-management.component.less']
})
export class IntentReportDetailComponent implements OnInit {

  constructor() { }

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
}
