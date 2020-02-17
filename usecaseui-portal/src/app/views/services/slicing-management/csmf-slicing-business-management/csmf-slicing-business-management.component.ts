import { Component, OnInit } from '@angular/core';
import { BUSINESS_STATUS } from "../../../../../constants/constants";
import { SlicingTaskServices } from '.././../../../core/services/slicingTaskServices';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import * as moment from 'moment';
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
    // isSelect: boolean = false;
    progressingTimer: any[] = [];
    terminateStart: any[] = [];
    businessOrderShow: boolean = false;
    getCSMFBusinessList() {
        this.loading = true;
        // this.isSelect = false;
        this.listOfData = [];
        let paramsObj = {
            status: this.selectedValue.toLocaleLowerCase(),
            pageNo: this.pageIndex,
            pageSize: this.pageSize
        };
        // if (this.selectedValue !== BUSINESS_STATUS[0]) {
        //     paramsObj["businessStatus"] = this.selectedValue;
        //     this.isSelect = true;
        // }
        this.myhttp.getCSMFSlicingBusinessList(paramsObj).subscribe(res => {
            const { result_header: { result_code }, result_body: { slicing_order_list, record_number } } = res;
            this.loading = false;
            if (+result_code === 200) {
                this.total = record_number;
                if (slicing_order_list !== null && slicing_order_list.length > 0) {
                    this.listOfData = slicing_order_list.map((item, index) => {
                        item.order_creation_time = moment(Number(item.order_creation_time)).format('YYYY-MM-DD HH:mm:ss');
                        if (item.last_operation_progress && item.last_operation_type && Number(item.last_operation_progress) < 100) {
                            let updata = (prodata: { operation_progress: string }) => {
                                item.last_operation_progress = prodata.operation_progress || item.last_operation_progress;
                            };
                            let obj = {
                                serviceId: item.order_id
                            };
                            if (item.last_operation_type === 'DELETE') this.terminateStart[index] = true
                            else this.terminateStart[index] = false;
                            this.queryProgress(obj, index, updata).then((res) => {
                                item.last_operation_progress = '100';
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
        // console.log(slicing, i, "slicing");
        this.modalService.confirm({
            nzTitle: '<i>Are you sure you want to perform this task?</i>',
            nzContent: '<b>Name:' + slicing.order_name + '</b>',
            nzOnOk: () => {
                let paramsObj = {
                    serviceId: slicing.order_id
                };
                if (slicing.order_status === 'activated') {
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

    terminate(slicing, index) {
        this.modalService.confirm({
            nzTitle: 'Are you sure you want to terminate this task?',
            nzContent: '<b>Name:&nbsp;</b>' + slicing.order_name,
            nzOnOk: () => {
                let paramsObj = { serviceId: slicing.order_id };
                this.terminateStart[index] = true;
                this.loading = true;
                this.myhttp.terminateSlicingService(paramsObj).subscribe(res => {
                    const { result_header: { result_code, result_message }, result_body: { operation_id } } = res;
                    this.loading = false;
                    if (+result_code === 200) {
                        this.getCSMFBusinessList();
                    } else {
                        this.terminateStart[index] = false;
                    }
                }, () => {
                    this.loading = false;
                    this.terminateStart[index] = false;
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
                this.myhttp.getSlicingBusinessProgress(obj)
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

    OrderModelShow() {
        this.businessOrderShow = true;
    }
    orderModelClose($event) {
        this.businessOrderShow = $event;
        this.getCSMFBusinessList();
    }
}
