import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { intentBaseService } from "../../../../core/services/intentBase.service";
import { Util } from "../../../../shared/utils/utils";
import { COMMUNICATION_FORM_ITEMS } from "../constants";

@Component({
  selector: 'app-cloud-leased-line-modal',
  templateUrl: './cloud-leased-line-modal.component.html',
  styleUrls: ['./cloud-leased-line-modal.component.less']
})
export class CloudLeasedLineModalComponent implements OnInit {

  constructor(
    private myHttp: intentBaseService,
		private nzMessage: NzMessageService,
		private Util: Util
	) {}

  @Input() modelParams: any;
  @Input() cloudLeasedLineShowFlag: boolean;
  @Output() cancelEmitter = new EventEmitter<boolean>();
  comunicationFormItems = COMMUNICATION_FORM_ITEMS;
  validateRulesShow: any[] = [];
  isLoadingOne = false;
  nodeLists: any[] = [];
  cloudPointOptions: any[] = [];
  cloud_leased_line_info = {
		name: '',
		instanceId: '',
		accessPointOne: {
      name: '',
      bandwidth: ''
    },
		cloudPointName: '',
	};

  ngOnInit(): void {}
  
  ngOnChanges() {
    if (this.cloudLeasedLineShowFlag) {
      if (this.modelParams) {
        this.cloud_leased_line_info = { ...this.modelParams };
      } else {
        this.getInstanceId();
      }
      this.queryAccessNodeInfo();
    }
	}
  
  queryAccessNodeInfo() {
    this.myHttp.queryAccessNodeInfo().subscribe(
      (response) => {
        console.log(response);
      },
      (err) => {
        console.log(err);
      }
    )
  }

  getInstanceId() {
    this.myHttp.getInstanceId().subscribe(
      (response) => {
        const { code, message, data} = response;
        if (code !== 200) {
          this.nzMessage.error(message);
          return;
        }
        this.cloud_leased_line_info.instanceId = data && data.instanceId;
      },
      (err) => {
        console.log(err);
      }
    )
  }

  submit(): void {
    this.myHttp.createIntentInstance({
      ...this.cloud_leased_line_info
    }).subscribe(
      (data) => {
        console.log(data);
        this.cancel();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  cancel(): void {
    this.cloudLeasedLineShowFlag = false
    this.cloud_leased_line_info = {
      name: '',
      instanceId: '',
      accessPointOne: {
        name: '',
        bandwidth: ''
      },
      cloudPointName: '',
    };
    this.cancelEmitter.emit();
  }
}