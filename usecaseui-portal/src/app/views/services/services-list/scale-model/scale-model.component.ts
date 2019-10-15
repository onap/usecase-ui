import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-scale-model',
  templateUrl: './scale-model.component.html',
  styleUrls: ['./scale-model.component.less']
})
export class ScaleModelComponent implements OnInit {
  @Input()scaleModelVisible: boolean;
  @Input()templatescalestarting;
  @Input()templateScaleSuccessFaild;
  @Input()thisService;
  @Input()e2e_nsData;
  @Input()customerSelected;
  @Input()serviceTypeSelected;

  @Output() cancel = new EventEmitter<boolean>();
  @Output() scaleModalOK = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

    scaleOk() {
        this.scaleModelVisible = false;
        let requestBody = {
            "service": {
                "serviceInstanceName": this.thisService["service-instance-name"],
                "serviceType": this.serviceTypeSelected.name,
                "globalSubscriberId": this.customerSelected.id,
                "resources": this.e2e_nsData.map((item) => {
                    return {
                        "resourceInstanceId": item["netWorkServiceId"],
                        "scaleType": item["scaleType"],
                        "scaleNsData": {
                            "scaleNsByStepsData": {
                                "aspectId": item["aspectId"],
                                "numberOfSteps": item["numberOfSteps"],
                                "scalingDirection": item["scalingDirection"]
                            }
                        }
                    }
                })
            }
        };
        this.scaleModalOK.emit(requestBody)
    }

    scaleCancel() {
        this.scaleModelVisible = false;
    }

}
