import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-slicing-task-model',
  templateUrl: './slicing-task-model.component.html',
  styleUrls: ['./slicing-task-model.component.less']
})
export class SlicingTaskModelComponent implements OnInit {
  @Input() showDetail: boolean;
  @Input() moduleTitle: string;
  @Input() modelData: object;
  @Output() cancel = new EventEmitter<boolean>();

  constructor() { }
  checkDetail: [{}] = [{
    id: "b1bb0ce7-ebca-4fa7-95ed-4840d70a1177",
    name: "5G Slice eMMB",
    snssai: "1-010101",
    arrivedtime: "2019-10-29 10:00",
    status: "Checking"
  }]; //配置审核详情
  businessRequirement: [{}] = [{
    name: "5G Slice eMMB",
    snssai: "1-010101",
    expiretime: "2019-10-29 10:00",
    area: "Beijing",
  }];//业务需求信息
  NSTinfo: [{}] = [{
    id: "46da8cf8-0878-48ac-bea3-f2200959411a",
    name: "eMBB instancel"
  }];//匹配NST信息
  selectedServiceId = '46da8cf8-0878-48ac-bea3-f2200959411a';
  selectedServiceName = '';
  serviceId = ['46da8cf8-0878-48ac-bea3-f2200959411a', '46da8cf8-0878-48ac-bea3-f2200959411b', '46da8cf8-0878-48ac-bea3-f2200959411c'];
  serviceData: {} = {
    "46da8cf8-0878-48ac-bea3-f2200959411a": "eMBB instancela",
    "46da8cf8-0878-48ac-bea3-f2200959411b": "eMBB instancelb",
    "46da8cf8-0878-48ac-bea3-f2200959411c": "eMBB instancelc",
  };

  ngOnInit() {
    this.serviceIdChange(this.selectedServiceId)
  }

  serviceIdChange(value: string): void {
    this.selectedServiceName = this.serviceData[value];
    console.log(this.selectedServiceName, "=====")
  }
  resetService() {
    this.selectedServiceId = "";
    this.serviceIdChange(this.selectedServiceId);
  }

  handleCancel() {
    this.showDetail = false;
    this.cancel.emit(this.showDetail);
  }
  handleOk() {
    this.handleCancel();
  }
}
