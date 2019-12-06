import { Component, OnInit } from '@angular/core';
import {BUSINESS_STATUS} from '../../../../../../../constants/constants';
import {SlicingTaskServices} from "../../../../../../core/services/slicingTaskServices";
@Component({
  selector: 'app-nssi-table',
  templateUrl: './nssi-table.component.html',
  styleUrls: ['./nssi-table.component.less']
})
export class NssiTableComponent implements OnInit {

    constructor(
        private myhttp: SlicingTaskServices
    ) {
    }

  ngOnInit() {
      this.getNssiList()
  }
    selectedValue:string = BUSINESS_STATUS[0];
    listOfData: any[] = [];
    pageIndex: number = 1;
    pageSize: number = 10;
    total: number = 100;
    loading = false;
    isSelect: boolean = false;
    statusOptions: any[] = BUSINESS_STATUS;

    getNssiList (): void{
        this.loading = true;
        this.isSelect = false;
        let paramsObj = {
            pageNo: this.pageIndex,
            pageSize: this.pageSize
        };
        if(this.selectedValue !== BUSINESS_STATUS[0]){
            paramsObj["instanceStatus"] = this.selectedValue;
            this.isSelect = true;
        }
        this.myhttp.getSlicingNssiList(paramsObj,this.isSelect).subscribe (res => {
            const { result_header: { result_code }, result_body: { nssi_service_instances } } = res;
            if (+result_code === 200) {
                this.total = nssi_service_instances.length;
                this.loading = false;
                this.listOfData = nssi_service_instances;
            }
        })
    }
    getListOfProcessingStatus(){
        this.pageIndex = 1;
        this.pageSize = 10;
        this.getNssiList();
    }
    searchData(reset: boolean = false) {
        this.getNssiList();
    }
    showdetail(data){

    }
}
