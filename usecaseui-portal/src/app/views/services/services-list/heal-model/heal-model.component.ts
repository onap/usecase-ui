import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-heal-model',
  templateUrl: './heal-model.component.html',
  styleUrls: ['./heal-model.component.less']
})
export class HealModelComponent implements OnInit {
  @Input()healModelVisible: boolean;
  @Input()thisService;
  @Input()nsParams;
  @Input()healActions;
  @Input()nsAdditional;
  @Input()vnfParams;
  @Input()vmSelected;
  @Input()vnfVms;
  @Input()templatehealstarting;
  @Input()templatehealSuccessFaild;

    @Output() cancel = new EventEmitter<boolean>();
    @Output() healModalOK = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }


    addActionsHealing() {
        this.healActions.push({ value: "" })
    }

    minusActionsHealing(index) {
        this.healActions.splice(index, 1);
    }

    addNsAdditional() {
        this.nsAdditional.push({ key: "", value: "" })
    }

    minusNsAdditional(index) {
        this.nsAdditional.splice(index, 1);
    }

    healOk() {
        this.healModelVisible = false;
        // nsParams
        this.nsParams.actionsHealing = this.healActions.map((item) => {
            return item.value
        });
        let additional = {};
        this.nsAdditional.forEach((item) => {
            additional[item.key] = item.value;
        });
        this.nsParams.additionalParamsforNs = JSON.stringify(additional);
        // vnfParams
        this.vnfParams.additionalParams.actionvminfo.vmid = this.vmSelected["vmId"];
        this.vnfParams.additionalParams.actionvminfo.vmname = this.vmSelected["vmName"];

        let requestBody = this.thisService["serviceDomain"] == "Network Service" ? { healNsData: this.nsParams } : { healVnfData: this.vnfParams };
        this.healModalOK.emit(requestBody)
    }

    healCancel() {
        this.healModelVisible = false;
    }

}
