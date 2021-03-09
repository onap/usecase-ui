import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Util } from '../../../../../shared/utils/utils';
import { onboardService } from '../../../../../core/services/onboard.service';
import { Recorder } from '../../../../../shared/utils/recorder';

@Component({
  selector: 'app-input-business-order',
  templateUrl: './input-business-order.component.html',
  styleUrls: ['./input-business-order.component.less']
})
export class InputBusinessOrderComponent implements OnInit {

  constructor(private Util: Util, private Recorder: Recorder, private myhttp: onboardService) { }

  @Input() showModel: boolean;
  @Output() modalOpreation = new EventEmitter();
  isSpinning: boolean = false;
  communicationMessage: String = "";
  validateRulesShow: any[] = [];
  rulesText: any[] = [];
  radioValue: String = 'text';
  isPlay: boolean = false;
  clickRepeat: boolean = false;

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
          "text": this.communicationMessage
    };
    this.myhttp["analysisInputText"](params)
      .subscribe((data) => {
        this.clickRepeat = false;
        if (data === 0) {
          return;
        }
        let orderForm = { ...data };
        this.communicationMessage = "";
        this.showModel = false;
        this.modalOpreation.emit({ "cancel": false, "param": orderForm });
      }, (err) => {
        this.clickRepeat = false;
        console.log(err);
      })
  }
  startAudio(): void {
    this.isPlay = true;
    this.Recorder.beforeStartRecord();
  }
  stopAudio(): void {
    this.isPlay = false;
    this.Recorder.stopRecord();
  }
  playAudio(): void {
    let audio = document.querySelector('audio');
    audio["src"] = this.Recorder.playRecord();
  }
}
