import { Component, OnInit } from '@angular/core';
import {SlicingTaskServices} from '.././../../core/services/slicingTaskServices';
import {pieChartconfig} from './monitorEchartsConfig';
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
    trafficLegend: any[] =[];
    onlineusersData: any[] =[];
    bandwidthData: any[] =[];
    selectDate: number = 0;
    trafficChartInit :Object = pieChartconfig;
    trafficChartData :Object;
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
        if(result === null){
            this.selectDate = 0;
            this.getChartsData()
        }
    }

    onDateOk(result: Date): void {
        console.log('onOk', result);
        this.selectDate = result.valueOf();
        this.getChartsData();
    }
    getChartsData = (time = new Date().getTime()) => {
        if (!this.listOfData.length) {
            return false;
        }
        if(this.selectDate !==0){
            time = this.selectDate
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
            if (+result_code === 200 && slicing_usage_traffic_list.length >0) {
                console.log(this.trafficChartInit,"----trafficChartInit")
                slicing_usage_traffic_list.forEach((item)=>{
                    this.trafficData.push({
                        name:item.service_id,
                        value:item.traffic_data
                    });
                    this.trafficLegend.push(item.service_id)
                });
                this.trafficChartData = {
                    legend:{
                        orient: 'vertical',
                        left: '0px',
                        bottom: '0px',
                        itemWidth: 10,
                        itemHeight: 10,
                        textStyle: {
                            color: "#3C4F8C"
                        },
                        data: this.trafficLegend
                    },
                    series: [{
                        data: this.trafficData
                    }]
                };
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
