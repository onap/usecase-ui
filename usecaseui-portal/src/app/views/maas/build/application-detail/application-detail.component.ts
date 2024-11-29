import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-application-detail',
  templateUrl: './application-detail.component.html',
  styleUrls: ['./application-detail.component.less']
})
export class ApplicationDetailComponent implements OnInit {

  constructor() { }

  @Input() showModel: boolean;
  _applicationDetail;
  data: Array<{ label: string, value: string }> = [];
  @Input() 
  set applicationDetail(v: any) {
    if (!v) {
      return;
    }
    this.data = [
      {
        label: 'Application Name', value: v.applicationName
      },
      {
        label: 'Application Description', value: v.applicationDescription
      },
      {
        label: 'Application Type', value: v.applicationType
      },
      {
        label: 'Operator', value: v.operatorName
      },
      {
        label: 'MaaS', value: v.maaSPlatformName
      },
      {
        label: 'Large Model', value: v.largeModelName
      },
      {
        label: 'Knowledge Base', value: v.knowledgeBaseName
      },
      {
        label: 'Prompt', value: v.prompt
      },
      {
        label: 'Temperature', value: v.temperature
      },
      {
        label: 'Top_p', value: v.top_p
      },
      {
        label: 'Opening Remarks', value: v.openingRemarks
      }
    ]
    this._applicationDetail = v;
  };
  get applicationDetail() {
    return this._applicationDetail;
  }
  @Output() modalOpreation = new EventEmitter();

  ngOnInit() {}

  handleCancel(): void {
    this.showModel = false;
    this.modalOpreation.emit();
  }

   handleOk(): void {
    this.showModel = false;
    this.modalOpreation.emit();
  }

}