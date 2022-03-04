import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { onboardService } from '../../../../../core/services/onboard.service';
import { Recorder } from '../../../../../shared/utils/recorder';
import { Util } from '../../../../../shared/utils/utils';

@Component({
  selector: 'app-input-business-order',
  templateUrl: './input-business-order.component.html',
  styleUrls: ['./input-business-order.component.less']
})
export class InputBusinessOrderComponent implements OnInit {

  constructor(
    private Util: Util,
    private Recorder: Recorder,
    private myhttp: onboardService,
    private msg: NzMessageService
  ) { }

  @Input() showModel: boolean;
  @Output() modalOpreation = new EventEmitter();
  isSpinning: boolean = false;
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

  ngOnChange() {
  }

  handleCancel(): void {
    this.showModel = false;
    this.communicationMessage = "";
    this.modalOpreation.emit({ "cancel": true });
  }

  handleOk(): void {
    if (this.clickRepeat) {
      return;
    }
    this.clickRepeat = true;
    if (this.radioValue === "text") {
      this.submitFormMessage();
      return;
    }
    this.clickRepeat = false;
    this.communicationMessage = "";
    this.showModel = false;
    let defaultParams = {
      coverageArea: "Beijing Beijing Haiding Wanshoulu",
      expDataRateDL: "1000",
      expDataRateUL: "1000",
      latency: "10",
      maxNumberofUEs: "10",
      name: "exclusive slicing service",
      resourceSharingLevel: "shared",
      uEMobilityLevel: "stationary"
    }
    this.modalOpreation.emit({ "cancel": false, "param": defaultParams });
  }
  submitFormMessage(): void {
    this.Util.validator("communicationMessage", "communicationMessage", this.communicationMessage, 0, this.rulesText, this.validateRulesShow);
    if (this.validateRulesShow.indexOf(true) > -1) {
      this.clickRepeat = false;
      return
    }
    let params = {
      "title": "predict",
      "modelType": '5gs',
      "text": this.communicationMessage
    };
    this.myhttp["analysisInputText"](params)
      .subscribe((response) => {
        this.clickRepeat = false;
        const { code, message, data } = response;
        if (code !== 200) {
          this.msg.error(message);
          return;
        }
        
        let orderForm = {
          ...data,
          intentContent: this.communicationMessage
        };
        this.communicationMessage = "";
        this.showModel = false;
        this.modalOpreation.emit({ "cancel": false, "param": orderForm });
      }, (err) => {
        this.clickRepeat = false;
        this.msg.error(`Error: Request failed with status code ${err.status}`);
      })
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
