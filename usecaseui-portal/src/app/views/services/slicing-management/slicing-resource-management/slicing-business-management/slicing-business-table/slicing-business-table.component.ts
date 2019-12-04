import {Component, OnInit} from '@angular/core';
import {SlicingTaskServices} from '.././../../../../../core/services/slicingTaskServices';
import {BUSINESS_STATUS} from '../../../../../../../constants/constants';
import { NzModalService } from 'ng-zorro-antd';

@Component({
    selector: 'app-slicing-business-table',
    templateUrl: './slicing-business-table.component.html',
    styleUrls: ['./slicing-business-table.component.less']
})
export class SlicingBusinessTableComponent implements OnInit {

    constructor(
        private myhttp: SlicingTaskServices,
        private modalService: NzModalService
        ) {
    }

    ngOnInit() {
        this.getBusinessList()
    }

    selectedValue:string = BUSINESS_STATUS[0];
    listOfData: any[] = [];
    pageIndex: number = 1;
    pageSize: number = 10;
    total: number = 100;
    loading = false;
    isSelect: boolean = false;
    statusOptions: any[] = BUSINESS_STATUS;
    progressingTimer :any;


    getBusinessList (): void{
        this.loading = true;
        this.isSelect = false;
        let paramsObj = {
            pageNo: this.pageIndex,
            pageSize: this.pageSize
        };
        if(this.selectedValue !== BUSINESS_STATUS[0]){
            paramsObj["businessStatus"] = this.selectedValue;
            this.isSelect = true;
        }
        this.myhttp.getSlicingBusinessList(paramsObj,this.isSelect).subscribe (res => {
            const { result_header: { result_code }, result_body: { slicing_business_list } } = res;
            if (+result_code === 200) {
                this.total = slicing_business_list.length;
                this.loading = false;
                this.listOfData = slicing_business_list.map((item)=>{
                    if(item.last_operation_progress < 100){
                        let updata = (prodata) => {
                            item.last_operation_progress = prodata.operation_progress || item.last_operation_progress;
                        };
                        let obj = {
                            serviceId: item.service_instance_id
                        };
                        this.queryProgress(obj, updata).then((res) => {
                            item.last_operation_progress = 100;
                            item.orchestration_status = item.last_operation_type === 'activate'?'activated':item.last_operation_type === 'deactivated'?'deactivated':'terminated';
                        })
                    }
                    return item
                });
            }
        })
    }
    getListOfProcessingStatus(){
        this.pageIndex = 1;
        this.pageSize = 10;
        this.getBusinessList();
    }
    searchData(reset: boolean = false) {
        this.getBusinessList();
    }
    switchChange(slicing,i){
        this.modalService.confirm({
            nzTitle: '<i>Do you Want to'+(slicing.orchestration_status === 'activated'?'deactivated':'activated')+ 'slicing business?</i>',
            nzContent: '<b>service_instance_id:'+slicing.service_instance_id+'</b>',
            nzOnOk: () => {
                let paramsObj = {
                    serviceId:slicing.service_instance_id
                };
                if(slicing.orchestration_status === 'activated'){
                    this.changeActivate(paramsObj,false,slicing,"deactivate","deactivated")
                }else {
                    this.changeActivate(paramsObj,true,slicing,"activate","activated");
                }
            },
            nzCancelText: 'No',
            nzOnCancel: () => {
                let singleSlicing = Object.assign({},this.listOfData[i]);
                this.listOfData[i] = singleSlicing;
                this.listOfData = [...this.listOfData];
            }
        });
    }
    changeActivate(paramsObj,isActivate,slicing,activateValue,finished){
        this.myhttp.changeActivateSlicingService(paramsObj,isActivate).subscribe (res => {
            const { result_header: { result_code, result_message }, result_body: { operation_id } } = res;
            if (+result_code === 200) {
                slicing.last_operation_progress = 0;
                slicing.orchestration_status = activateValue;
                console.log(operation_id,"operation_id");
                let obj = {
                    serviceId: slicing.service_instance_id
                }
                let updata = (prodata) => {
                    slicing.last_operation_progress = prodata.progress;
                    slicing.orchestration_status = prodata.operation_type;
                    this.queryProgress(obj, updata).then(() => {
                        slicing.last_operation_progress = 100;
                        slicing.orchestration_status = finished;
                    })
                }
            }else {
                console.error(result_message)
            }
        })
    }
    terminate(slicing){
        this.modalService.confirm({
            nzTitle: 'Do you Want to Terminate slicing business?',
            nzContent: '<b>service_instance_id:&nbsp;</b>'+slicing.service_instance_id,
            nzOnOk: () => {
                let paramsObj = {
                    serviceId:slicing.service_instance_id
                };
                this.myhttp.terminateSlicingService(paramsObj).subscribe (res => {
                    const { result_header: { result_code, result_message }, result_body: { operation_id } } = res;
                    if (+result_code === 200) {
                        slicing.last_operation_progress = 0;
                        slicing.orchestration_status = 'deactivate';
                        console.log(operation_id,"operation_id");
                        let obj = {
                            serviceId: slicing.service_instance_id
                        };
                        let updata = (prodata) => {
                            slicing.last_operation_progress = prodata.progress;
                            slicing.orchestration_status = prodata.operation_type;
                            this.queryProgress(obj, updata).then(() => {
                                slicing.last_operation_progress = 100;
                                slicing.orchestration_status = "terminated";
                            })
                        }
                    }else {
                        console.error(result_message)
                    }
                })
            },
            nzCancelText: 'No',
            nzOnCancel: () => {
                console.info('Cancel termination')
            }
        });
    }
    showdetail(data){

    }
    queryProgress(obj, callback) {
        return new Promise( res => {
            let requery = () => {
                this.myhttp.getSlicingBusinessProgress(obj)
                    .subscribe((data) => {
                        if (data.result_body.operation_progress < 100) {
                            callback(data.result_body);
                            this.progressingTimer = setTimeout(()=>{
                                requery();
                            },5000);
                        } else {
                            res(data.result_body);
                        }
                    })
            };
            requery();
        })
    }
}
