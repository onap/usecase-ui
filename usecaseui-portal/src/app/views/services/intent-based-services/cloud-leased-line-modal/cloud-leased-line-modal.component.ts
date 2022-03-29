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
  @Output() cancelEmitter = new EventEmitter<any>();
  comunicationFormItems = COMMUNICATION_FORM_ITEMS;
  isUpdateFlag: boolean = false;
  nodeLists: any[] = [];
  cloudPointOptions: any[] = [];
  cloud_leased_line_info = {
		name: '',
		instanceId: '',
    protect: false,
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
        this.isUpdateFlag = this.modelParams.isUpdateFlag;
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
        const { code, data } = response;
        if (code !== 200) {
          return;
        }
        this.cloudPointOptions = [...data.cloudAccessNodeList];
        this.nodeLists = [...data.accessNodeList];
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
    const paramOnj = { ...this.cloud_leased_line_info };
    for (const iterator in paramOnj) {
      if (this.isBoolean(paramOnj[iterator])) {
        continue;
      }
      if (this.isString(paramOnj[iterator]) && !paramOnj[iterator]) {
        this.nzMessage.error(`Please enter ${iterator}`);
        return;
      }
      if (!this.isString(paramOnj[iterator])) {
        const { name, bandwidth} = paramOnj[iterator];
        if (!name) {
          this.nzMessage.error(`Please enter accessPointOne Name`);
          return;
        }

        if (bandwidth !== 0 && !/^\+?[1-9][0-9]*$/.test(bandwidth)) {
          this.nzMessage.error(`Please enter a positive integer accessPointOne bandwidth`);
          return;
        }
      }
    }
    
    if (this.isUpdateFlag) {
      this.updateIntentInstance();
      return;
    }
    this.createIntentInstance();
  }

  updateIntentInstance(): void {
    const { accessPointOne: { bandwidth } } = this.cloud_leased_line_info;
    this.myHttp.updateIntentInstance({
      instanceId: this.modelParams.instanceId,
      bandwidth
    }).subscribe(
      (response) => {
        const { code, message } = response;
        if (code !== 200) {
          this.nzMessage.error(message);
          return;
        }
        this.nzMessage.success('Update IntentInstance Success!');
        this.cancel(true);
      },
      (err) => {
        console.log(err);
      }
    )
  }

  createIntentInstance(): void {
    this.myHttp.createIntentInstance({
      ...this.cloud_leased_line_info
    }).subscribe(
      (response) => {
        const { code, message } = response;
        if (code !== 200) {
          this.nzMessage.error(message);
          return;
        }
        this.nzMessage.success('Create IntentInstance Success!');
        this.cancel(true);
      },
      (err) => {
        console.log(err);
      }
    )
  }

  cancel(flag): void {
    this.cloudLeasedLineShowFlag = false
    this.isUpdateFlag = false
    this.cloud_leased_line_info = {
      name: '',
      instanceId: '',
      protect: false,
      accessPointOne: {
        name: '',
        bandwidth: ''
      },
      cloudPointName: '',
    };
    this.cancelEmitter.emit(flag);
  }

  isString(val) {
    return typeof val === 'string' || typeof val === 'number';
    //return Object.prototype.toString.call(val) === '[object String]';
  }

  isBoolean(val) {
    return typeof val === 'boolean';
  }
}