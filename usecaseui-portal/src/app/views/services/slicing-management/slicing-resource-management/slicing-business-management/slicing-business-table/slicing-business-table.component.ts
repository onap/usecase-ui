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

    selectedValue = null;
    switchStatusAll: any[] = [];
    listOfData: any[] = [];
    pageIndex: number = 1;
    pageSize: number = 10;
    total: number = 100;
    loading = false;
    statusOptions: any[] = BUSINESS_STATUS;


    getBusinessList (): void{
        this.loading = true;
        let paramsObj = {
            pageNo: this.pageIndex,
            pageSize: this.pageSize
        };
        this.myhttp.getSlicingBusinessList(paramsObj).subscribe (res => {
            const { result_header: { result_code }, result_body: { slicing_business_list } } = res;
            if (+result_code === 200) {
                this.listOfData = slicing_business_list;
                this.total = slicing_business_list.length;
                this.switchStatusAll = slicing_business_list.map((item)=>{
                    return item.orchestration_status
                });
                this.loading = false;
            }
        })
    }
    searchData(reset: boolean = false) {
        this.getBusinessList();
    }
    switchChange(data,i){
        console.log(data,i,"----- switchChange");
        this.modalService.confirm({
            nzTitle: '<i>Do you Want to'+(data.orchestration_status === 'activated'?'deactivated':'activated')+ 'slicing business?</i>',
            nzContent: '<b>service_instance_id:'+data.service_instance_id+'</b>',
            nzOnOk: () => {
                let paramsObj = {
                    serviceId:data.service_instance_id
                };
                if(data.orchestration_status === 'activated'){
                    this.myhttp.changeActivateSlicingService(paramsObj,false).subscribe (res => {
                        const { result_header: { result_code }, result_body: { operation_id } } = res;
                        if (+result_code === 200) {
                            this.switchStatusAll[i] = 'deactivated';
                            console.log(operation_id,"operation_id")
                        }
                    })
                }else {
                    this.myhttp.changeActivateSlicingService(paramsObj,true).subscribe (res => {
                        const { result_header: { result_code, result_message }} = res;
                        if (+result_code === 200) {
                            this.switchStatusAll[i] = 'activated';
                            console.log(result_message,"result_message")
                        }
                    })
                }
            },
            nzCancelText: 'No',
            nzOnCancel: () => {
                this.switchStatusAll[i] = data.orchestration_status
            }
        });
    }
    terminate(data){

    }
    showdetail(data){

    }
    getListOfProcessingStatus(){

    }
    detailModel(data){

    }
}
