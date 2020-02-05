import { Component, OnInit } from '@angular/core';
import {BUSINESS_STATUS} from "../../../../../constants/constants";
import { SlicingTaskServices } from '.././../../../core/services/slicingTaskServices';
@Component({
  selector: 'app-csmf-slicing-business-management',
  templateUrl: './csmf-slicing-business-management.component.html',
  styleUrls: ['./csmf-slicing-business-management.component.less']
})
export class CsmfSlicingBusinessManagementComponent implements OnInit {

    constructor(
        private myhttp: SlicingTaskServices
    ) {
    }
  ngOnInit() {
      this.getCSMFBusinessList()
  }
    selectedValue: string = BUSINESS_STATUS[0];
    listOfData: any[] = [];
    pageIndex: number = 1;
    pageSize: number = 10;
    total: number = 0;
    loading = false;
    isSelect: boolean = false;
    statusOptions: any[] = BUSINESS_STATUS;
    terminateStart: boolean = false;

    getCSMFBusinessList(){
        this.loading = true;
        this.listOfData = [];
        let paramsObj = {
            status:this.selectedValue,
            pageNo: this.pageIndex,
            pageSize: this.pageSize
        };
        this.myhttp.getCSMFSlicingBusinessList(paramsObj).subscribe(res => {
            const { result_header: { result_code }, result_body: { slicing_service_list, record_number } } = res;
            this.loading = false;
            if (+result_code === 200) {
                this.total = record_number;
                if(slicing_service_list !==null && slicing_service_list.length >0){
                    this.listOfData = slicing_service_list.map((item, index) => {
                        if (item.last_operation_process && item.last_operation_type && Number(item.last_operation_process) < 100) {

                            if (item.last_operation_type === 'DELETE') this.terminateStart = true;
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
        this.getCSMFBusinessList();
    }
    searchData(reset: boolean = false) {
        this.getCSMFBusinessList();
    }

    switchChange(slicing, i) {
      console.log(slicing,i,"slicing")
    }
    terminate(slicing) {
        console.log(slicing,"slicing")
    }
}
