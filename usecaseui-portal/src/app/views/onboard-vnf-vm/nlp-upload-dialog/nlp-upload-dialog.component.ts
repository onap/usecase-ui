import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { Recorder } from '../../../shared/utils/recorder';
import { Util } from '../../../shared/utils/utils';

@Component({
  selector: 'app-nlp-upload-dialog',
  templateUrl: './nlp-upload-dialog.component.html',
  styleUrls: ['./nlp-upload-dialog.component.less']
})
export class NlpUploadDialogComponent implements OnInit {

  constructor(
    private Util: Util,
    private Recorder: Recorder,
    private msg: NzMessageService
  ) { }

  @Input() isShowFlag: boolean;
  @Output() returnNlpType = new EventEmitter();
  nlpType: String = "nlp";
  
  ngOnInit() {}

  ngOnChange() {}

  handleCancel(): void {
    this.isShowFlag = false;
    this.returnNlpType.emit({ "cancel": true });
  }

  handleOk(): void {
    this.isShowFlag = false;
    this.returnNlpType.emit({ "cancel": false, nlpType: this.nlpType });
  }
  
}
