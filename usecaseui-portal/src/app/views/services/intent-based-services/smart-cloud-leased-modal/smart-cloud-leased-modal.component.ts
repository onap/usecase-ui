import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { intentBaseService } from '../../../../core/services/intentBase.service';
import { Recorder } from '../../../../shared/utils/recorder';
import { Util } from '../../../../shared/utils/utils';

@Component({
  selector: 'app-smart-cloud-leased-modal',
  templateUrl: './smart-cloud-leased-modal.component.html',
  styleUrls: ['./smart-cloud-leased-modal.component.less']
})
export class SmartCloudLeasedModalComponent implements OnInit {

  constructor(
    private Util: Util,
    private Recorder: Recorder,
    private myhttp: intentBaseService,
    private msg: NzMessageService
  ) {}
  
  @Input() samrtCloudLeasedLineShowFlag: boolean;
  @Output() resolveEmitter = new EventEmitter();

  communicationMessage: String = "";
  validateRulesShow: any[] = [];
  rulesText: any[] = [];
  radioValue: String = 'text';
  isPlay: boolean = false;
  clickRepeat: boolean = false;
  isDisable: boolean = true;
  
  ngOnInit() {
    this.validateRulesShow = [];
    this.rulesText = [];
    this.communicationMessage = '';
  }

  ngOnChange() {}

  handleCancel(flag): void {
    this.samrtCloudLeasedLineShowFlag = false;
    this.communicationMessage = "";
    this.resolveEmitter.emit({ "cancel": flag });
  }

  handleOk(): void {
    if (this.radioValue === 'text') {
      this.submitFormMessage();
      return;
    }
    
  }

  submitFormAudio() {
    this.handleCancel(false);
  }

  submitFormMessage(): void {
    let params = {
      "title": "predict",
      "modelType": 'ccvpn',
      "text": this.communicationMessage
    };
    this.myhttp.intentInstancePredict(params).subscribe(
      (response) => {
        console.log(response);
        this.handleCancel(false);
      },
      (err) => {
        console.log(err);
      }
    )
  }

  startAudio(): void {
    this.isPlay = true;
    this.isDisable = true;
    this.Recorder.beforeStartRecord();
  }

  stopAudio(): void {
    this.isPlay = false;
    this.isDisable = false;
    this.Recorder.stopRecord();
  }

  playAudio(): void {
    let audio = document.querySelector('audio');
    audio["src"] = this.Recorder.playRecord();
  }
}
