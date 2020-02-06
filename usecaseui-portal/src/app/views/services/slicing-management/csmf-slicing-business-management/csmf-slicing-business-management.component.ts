import {Component, OnInit} from '@angular/core';
import {BUSINESS_STATUS} from "../../../../../constants/constants";
import {SlicingTaskServices} from '.././../../../core/services/slicingTaskServices';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
@Component({
    selector: 'app-csmf-slicing-business-management',
    templateUrl: './csmf-slicing-business-management.component.html',
    styleUrls: ['./csmf-slicing-business-management.component.less']
})
export class CsmfSlicingBusinessManagementComponent implements OnInit {

    constructor(
        private myhttp: SlicingTaskServices,
        private modalService: NzModalService,
        private message: NzMessageService
    ) {
    }

    ngOnInit() {
        this.getCSMFBusinessList()
    }
    ngOnDestroy() {
        this.progressingTimer.forEach((item) => {
            clearInterval(item.timer);
        });
        this.progressingTimer = [];
    }

    selectedValue: string = BUSINESS_STATUS[0];
    listOfData: any[] = [];
    pageIndex: number = 1;
    pageSize: number = 10;
    total: number = 0;
    loading = false;
    statusOptions: any[] = BUSINESS_STATUS;
    progressingTimer: any[] = [];
    terminateStart: boolean = false;

    getCSMFBusinessList() {
        this.loading = true;
        this.listOfData = [];
        let paramsObj = {
            status: this.selectedValue,
            pageNo: this.pageIndex,
            pageSize: this.pageSize
        };
        this.myhttp.getCSMFSlicingBusinessList(paramsObj).subscribe(res => {
            const {result_header: {result_code}, result_body: {slicing_service_list, record_number}} = res;
            this.loading = false;
            if (+result_code === 200) {
                this.total = record_number;
                if (slicing_service_list !== null && slicing_service_list.length > 0) {
                    this.listOfData = slicing_service_list.map((item, index) => {
                        if (item.last_operation_process && item.last_operation_type && Number(item.last_operation_process) < 100) {
                            let updata = (prodata: { operation_progress: string }) => {
                                item.last_operation_process = prodata.operation_progress || item.last_operation_process;
                            };
                            let obj = {
                                serviceId: item.service_instance_id
                            };
                            if (item.last_operation_type === 'DELETE') this.terminateStart = true;
                            this.queryProgress(obj, index, updata).then((res) => {
                                item.last_operation_process = '100';
                                this.getCSMFBusinessList();
                            })
                        }
                        return item
                    });
                }
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
        this.getCSMFBusinessList();
    }

    searchData(reset: boolean = false) {
        this.progressingTimer.forEach((item) => {
            clearInterval(item.timer);
        });
        this.progressingTimer = [];
        this.getCSMFBusinessList();
    }

    switchChange(slicing, i) {
        console.log(slicing, i, "slicing");
        this.modalService.confirm({
            nzTitle: '<i>Are you sure you want to perform this task?</i>',
            nzContent: '<b>Name:' + slicing.service_name + '</b>',
            nzOnOk: () => {
                let paramsObj = {
                    serviceId: slicing.service_id
                };
                if (slicing.service_status === 'activated') {
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
        this.myhttp.csmfChangeActivate(paramsObj, isActivate).subscribe(res => {
            const { result_header: { result_code, result_message }, result_body: { operation_id } } = res;
            this.loading = false;
            if (+result_code === 200) {
                this.getCSMFBusinessList();
            } else {
                let singleSlicing = Object.assign({}, this.listOfData[index]);
                this.listOfData[index] = singleSlicing;
                this.listOfData = [...this.listOfData];
                this.getCSMFBusinessList();
            }
            this.getCSMFBusinessList();
        }, () => {
            this.loading = false;
            let singleSlicing = Object.assign({}, this.listOfData[index]);
            this.listOfData[index] = singleSlicing;
            this.listOfData = [...this.listOfData];
            this.getCSMFBusinessList();
        })
    }

    terminate(slicing) {
        console.log(slicing, "slicing");
        this.modalService.confirm({
            nzTitle: 'Are you sure you want to terminate this task?',
            nzContent: '<b>Name:&nbsp;</b>' + slicing.service_name,
            nzOnOk: () => {
                let paramsObj = { serviceId: slicing.service_id };
                this.terminateStart = true;
                this.loading = true;
                this.myhttp.csmfTerminate(paramsObj).subscribe(res => {
                    const { result_header: { result_code, result_message }, result_body: { operation_id } } = res;
                    this.loading = false;
                    if (+result_code === 200) {
                        this.getCSMFBusinessList();
                    } else {
                        this.terminateStart = false;
                    }
                }, () => {
                    this.loading = false;
                    this.terminateStart = false;
                })
            },
            nzCancelText: 'No',
            nzOnCancel: () => {
                console.info('Cancel termination')
            }
        });
    }
    queryProgress(obj, index, callback) {
        return new Promise(res => {
            let requery = () => {
                this.myhttp.csmfSlicingProgress(obj)
                    .subscribe((data) => {
                        const { result_header: { result_code, result_message }, result_body: { operation_id } } = data;
                        if (+result_code === 200) {
                            if (data.result_body.operation_progress && Number(data.result_body.operation_progress) < 100) {
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
                            this.getCSMFBusinessList();
                            this.message.error(result_message);
                        }
                    }, (err) => {
                        this.progressingTimer.forEach((item) => {
                            if (item.serviceId === obj.serviceId) {
                                clearInterval(item.timer);
                            }
                        });
                        this.getCSMFBusinessList();
                        this.message.error(err);
                    })
            };
            requery();
        })
    }
}
