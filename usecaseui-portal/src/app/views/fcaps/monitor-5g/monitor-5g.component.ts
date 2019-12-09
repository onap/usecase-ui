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
    trafficData: any[] =[];
    onlineusersData: any[] =[];
    bandwidthData: any[] =[];
    selectDate: Date = null;
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
                this.listOfData = [].concat(slicing_business_list);
                this.getChartsData();
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
        this.selectDate = result;
    }
    getChartsData = (time = new Date().getTime()) => {
        if (!this.listOfData.length) {
            return false;
        }
        const service_list = [];
        this.listOfData.forEach(item => {
            service_list.push({service_id: item.service_instance_id});
        });
        this.fetchTrafficData(service_list, time);
        this.fetchOnlineusersData(service_list, time);
        this.fetchBandwidthData(service_list, time);
    }
    fetchTrafficData(service_list, time){
        this.myhttp.getFetchTraffic(service_list,time).subscribe (res => {
            const { result_header: { result_code }, result_body: { slicing_usage_traffic_list } } = res;
            if (+result_code === 200) {
                this.trafficData = slicing_usage_traffic_list;
            }
        })
    }
    fetchOnlineusersData(service_list, time){
        this.myhttp.getFetchOnlineusers(service_list,time).subscribe (res => {
            const { result_header: { result_code }, result_body: { slicing_online_user_list } } = res;
            if (+result_code === 200) {
                this.onlineusersData = slicing_online_user_list;
            }
        })
    }
    fetchBandwidthData(service_list, time){
        this.myhttp.getFetchBandwidth(service_list,time).subscribe (res => {
            const { result_header: { result_code }, result_body: { slicing_total_bandwidth_list } } = res;
            if (+result_code === 200) {
                this.bandwidthData = slicing_total_bandwidth_list;
            }
        })
    }

}
