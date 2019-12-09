import { Component, OnInit } from '@angular/core';
import {SlicingTaskServices} from '.././../../core/services/slicingTaskServices';
@Component({
  selector: 'app-monitor-5g',
  templateUrl: './monitor-5g.component.html',
  styleUrls: ['./monitor-5g.component.less']
})
export class Monitor5gComponent implements OnInit {

    constructor(
        private myhttp: SlicingTaskServices
    ) {
    }
    listOfData: any[] = [];
    pageIndex: number = 1;
    pageSize: number = 10;
    total: number = 0;
    loading = false;
  ngOnInit() {
      this.getBusinessList()
  }

    getBusinessList (): void{
        this.loading = true;
        let paramsObj = {
            pageNo: this.pageIndex,
            pageSize: this.pageSize
        };
        this.myhttp.getSlicingBusinessList(paramsObj,false).subscribe (res => {
            const { result_header: { result_code }, result_body: { slicing_business_list,record_number } } = res;
            if (+result_code === 200) {
                this.total = record_number;
                this.loading = false;
                this.listOfData = [].concat(slicing_business_list)
            }
        })
    }
    searchData(reset: boolean = false) {
        this.getBusinessList();
    }
    onDateChange(result: Date): void {
        console.log('Selected Time: ', result);
    }

    onDateOk(result: Date): void {
        console.log('onOk', result);
    }
    getChartsData = (time = new Date().getTime()) => {
        if (!this.listOfData.length) {
            return false;
        }
        const service_list = [];
        this.listOfData.forEach(item => {
            service_list.push({service_id: item.service_instance_id});
        });
    }

}
