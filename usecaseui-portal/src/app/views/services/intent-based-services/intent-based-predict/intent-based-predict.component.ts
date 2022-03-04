import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { intentBaseService } from '../../../../core/services/intentBase.service';

@Component({
  selector: 'app-intent-based-predict',
  templateUrl: './intent-based-predict.component.html',
  styleUrls: ['./intent-based-predict.component.less']
})
export class IntentBasedPredictComponent implements OnInit {

  constructor(
    private myhttp: intentBaseService,
    private msg: NzMessageService
  ) {}
  
  // textarea input predict param
  communicationMessage: String = "";
  // button loading
  isConfirmCreating: boolean = false;
  // modal param
  modalParam: Object = {};
  // cloud modal show flag
  cloudModalShowFlag: boolean = false;
  // business modal show flag
  businessModalShowFlag: boolean = false;

  ngOnInit() {
    this.communicationMessage = '';
  }

  ngOnChange() {}

  submitFormMessage(): void {
    this.isConfirmCreating = true;
    this.myhttp.intentBasedUnifyPredict({
      "text": this.communicationMessage
    }).subscribe(
      (response) => {
        this.isConfirmCreating = false;
        const { code, message, data: { type, formData } } = response;
        if (code !== 200) {
          this.msg.error(message);
          return;
        }

        this.modalParam = {
          ...formData,
          intentContent: this.communicationMessage
        };

        if (type === 'ccvpn') {
          this.cloudModalShowFlag = true;
        }

        if (type === '5gs') {
          this.businessModalShowFlag = true;
        }
      },
      (err) => {
        this.isConfirmCreating = false;
        console.log(err);
      }
    )
  }

  modalClose() {
    this.cloudModalShowFlag = false;
    this.businessModalShowFlag = false;
    this.modalParam = {};
    this.communicationMessage = '';
  }
}
