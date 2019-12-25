import { Component, OnInit, ViewChild } from '@angular/core';
import { SlicingTaskServices } from '.././../../../../../core/services/slicingTaskServices';
import { BUSINESS_STATUS } from '../../../../../../../constants/constants';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { SlicingBusinessModelComponent } from '../slicing-business-model/slicing-business-model.component';
@Component({
    selector: 'app-slicing-business-table',
    templateUrl: './slicing-business-table.component.html',
    styleUrls: ['./slicing-business-table.component.less']
})
export class SlicingBusinessTableComponent implements OnInit {

    constructor(
        private myhttp: SlicingTaskServices,
        private modalService: NzModalService,
        private message: NzMessageService
    ) {
    }

    ngOnInit() {
        this.getBusinessList()
    }
    ngOnDestroy() {
        this.progressingTimer.forEach((item) => {
            clearInterval(item.timer);
        })
        this.progressingTimer = [];
    }
    selectedValue: string = BUSINESS_STATUS[0];
    listOfData: any[] = [];
    pageIndex: number = 1;
    pageSize: number = 10;
    total: number = 0;
    loading = false;
    isSelect: boolean = false;
    statusOptions: any[] = BUSINESS_STATUS;
    progressingTimer: any[] = [];
    terminateStart: boolean = false;
    @ViewChild('notification') notification1: any;

    getBusinessList(): void {
        this.loading = true;
        this.isSelect = false;
        let paramsObj = {
            pageNo: this.pageIndex,
            pageSize: this.pageSize
        };
        if (this.selectedValue !== BUSINESS_STATUS[0]) {
            paramsObj["businessStatus"] = this.selectedValue;
            this.isSelect = true;
        }
        this.myhttp.getSlicingBusinessList(paramsObj, this.isSelect).subscribe(res => {
            const { result_header: { result_code }, result_body: { slicing_business_list, record_number } } = res;
            if (+result_code === 200) {
                this.total = record_number;
                this.loading = false;
                this.listOfData = slicing_business_list.map((item, index) => {
                    if (item.last_operation_progress && item.last_operation_type && item.last_operation_progress < 100) {
                        let updata = (prodata: { operation_progress: string }) => {
                            item.last_operation_progress = prodata.operation_progress || item.last_operation_progress;
                        };
                        let obj = {
                            serviceId: item.service_instance_id
                        };
                        if (item.last_operation_type === 'DELETE') this.terminateStart = true;
                        this.queryProgress(obj, item.orchestration_status, index, updata).then((res) => {
                            item.last_operation_progress = 100;
                        })
                    }
                    return item
                });
            }
        })
    }
    getListOfProcessingStatus() {
        this.pageIndex = 1;
        this.pageSize = 10;
        this.progressingTimer.forEach((item) => {
            clearInterval(item.timer);
        });
        this.progressingTimer = [];
        this.getBusinessList();
    }
    searchData(reset: boolean = false) {
        this.progressingTimer.forEach((item) => {
            clearInterval(item.timer);
        });
        this.progressingTimer = [];
        this.getBusinessList();
    }
    switchChange(slicing, i) {
        this.modalService.confirm({
            nzTitle: '<i>Do you Want to ' + (slicing.orchestration_status === 'activated' ? 'deactivate' : 'activate') + ' slicing business?</i>',
            nzContent: '<b>Name:' + slicing.service_instance_name + '</b>',
            nzOnOk: () => {
                this.notification1.notificationStart('slicing business', slicing.orchestration_status === 'activated' ? 'deactivate' : 'activate', slicing.service_instance_id);
                let paramsObj = {
                    serviceId: slicing.service_instance_id
                };
                if (slicing.orchestration_status === 'activated') {
                    this.changeActivate(paramsObj, false, slicing, "deactivate", "deactivated", i)
                } else {
                    this.changeActivate(paramsObj, true, slicing, "activate", "activated", i);
                }
            },
            nzCancelText: 'No',
            nzOnCancel: () => {
                let singleSlicing = Object.assign({}, this.listOfData[i]);
                this.listOfData[i] = singleSlicing;
                this.listOfData = [...this.listOfData];
            }
        });
    }
    changeActivate(paramsObj, isActivate, slicing, activateValue, finished, index) {
        this.loading = true;
        this.myhttp.changeActivateSlicingService(paramsObj, isActivate).subscribe(res => {
            const { result_header: { result_code, result_message }, result_body: { operation_id } } = res;
            if (+result_code === 200) {
                this.notification1.notificationSuccess('slicing business', finished, slicing.service_instance_id);
                this.getBusinessList();
            } else {
                let singleSlicing = Object.assign({}, this.listOfData[index]);
                this.listOfData[index] = singleSlicing;
                this.listOfData = [...this.listOfData];
                this.notification1.notificationFailed('slicing business', finished, slicing.service_instance_id);
                this.getBusinessList();
            }
            this.getBusinessList();
        }, () => {
            let singleSlicing = Object.assign({}, this.listOfData[index]);
            this.listOfData[index] = singleSlicing;
            this.listOfData = [...this.listOfData];
            this.notification1.notificationFailed('slicing business', finished, slicing.service_instance_id);
            this.getBusinessList();
        })
    }
    terminate(slicing) {
        this.modalService.confirm({
            nzTitle: 'Do you Want to terminate slicing business?',
            nzContent: '<b>Name:&nbsp;</b>' + slicing.service_instance_name,
            nzOnOk: () => {
                this.notification1.notificationStart('slicing business', 'terminate', slicing.service_instance_id);
                let paramsObj = { serviceId: slicing.service_instance_id };
                this.terminateStart = true;
                this.loading = true;
                this.myhttp.terminateSlicingService(paramsObj).subscribe(res => {
                    const { result_header: { result_code, result_message }, result_body: { operation_id } } = res;
                    if (+result_code === 200) {
                        this.notification1.notificationSuccess('slicing business', 'terminate', slicing.service_instance_id);
                        this.getBusinessList();
                    } else {
                        this.notification1.notificationFailed('slicing business', 'terminate', slicing.service_instance_id);
                        this.terminateStart = false;
                    }
                }, () => {
                    this.notification1.notificationFailed('slicing business', 'terminate', slicing.service_instance_id);
                    this.terminateStart = false;
                })
            },
            nzCancelText: 'No',
            nzOnCancel: () => {
                console.info('Cancel termination')
            }
        });
    }
    showdetail(data) {
        const BusinessModal = this.modalService.create({
            nzTitle: "Detail",
            nzContent: SlicingBusinessModelComponent,
            nzWidth: "70%",
            nzOkText: null,
            nzCancelText: null,
            nzComponentParams: {
                businessId: data.service_instance_id
            }
        })
    }
    queryProgress(obj, action, index, callback) {
        return new Promise(res => {
            let requery = () => {
                this.myhttp.getSlicingBusinessProgress(obj)
                    .subscribe((data) => {
                        const { result_header: { result_code, result_message }, result_body: { operation_id } } = data;
                        if (+result_code === 200) {
                            if (data.result_body.operation_progress && data.result_body.operation_progress < 100) {
                                callback(data.result_body);
                                let progressSetTimeOut = setTimeout(() => {
                                    requery();
                                }, 5000);
                                this.progressingTimer.push({
                                    id: obj.serviceId,
                                    timer: progressSetTimeOut
                                })
                            } else {
                                this.progressingTimer.forEach((item) => {
                                    if (item.serviceId === obj.serviceId) {
                                        clearInterval(item.timer);
                                    }
                                });
                                res(data.result_body);
                            }
                        } else {
                            this.progressingTimer.forEach((item) => {
                                if (item.serviceId === obj.serviceId) {
                                    clearInterval(item.timer);
                                }
                            });
                            this.getBusinessList();
                            this.message.error(result_message);
                        }
                    }, (err) => {
                        this.progressingTimer.forEach((item) => {
                            if (item.serviceId === obj.serviceId) {
                                clearInterval(item.timer);
                            }
                        });
                        this.getBusinessList();
                        this.message.error(err);
                    })
            };
            requery();
        })
    }
}
