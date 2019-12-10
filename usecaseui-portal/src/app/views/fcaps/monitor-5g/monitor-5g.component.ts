import { Component, OnInit } from '@angular/core';
import { SlicingTaskServices } from '.././../../core/services/slicingTaskServices';
import { pieChartconfig, lineChartconfig } from './monitorEchartsConfig';
import *as moment from 'moment';
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
    selectDate: number = 0;

    trafficData: any[] = [];
    trafficLegend: any[] = [];
    trafficChartInit: Object = pieChartconfig;
    trafficChartData: Object;

    onlineusersData: any[] = [];
    onlineuserXAxis: any[] = [];
    onlineuserLegend: any[] = [];
    onlineuserChartInit: Object = lineChartconfig;
    onlineuserChartData: Object;

    bandwidthData: any[] = [];
    bandwidthXAxis: any[] = [];
    bandwidthLegend: any[] = [];
    bandwidthChartInit: Object = lineChartconfig;
    bandwidthChartData: Object;
    ngOnInit() {
        this.getBusinessList()
    }

    getBusinessList(): void {
        this.loading = true;
        let paramsObj = {
            pageNo: this.pageIndex,
            pageSize: this.pageSize
        };
        this.myhttp.getSlicingBusinessList(paramsObj, false).subscribe(res => {
            const { result_header: { result_code }, result_body: { slicing_business_list, record_number } } = res;
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
        if (result === null) {
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
        if (this.selectDate !== 0) {
            time = this.selectDate
        }
        const service_list = [];
        this.listOfData.forEach(item => {
            service_list.push({ service_id: item.service_instance_id });
        });
        this.fetchTrafficData(service_list, time);
        this.fetchOnlineusersData(service_list, time);
        this.fetchBandwidthData(service_list, time);
    }
    fetchTrafficData(service_list, time) {
        this.myhttp.getFetchTraffic(service_list, time).subscribe(res => {
            const { result_header: { result_code }, result_body: { slicing_usage_traffic_list } } = res;
            if (+result_code === 200 && slicing_usage_traffic_list.length > 0) {
                this.trafficData = [];
                this.trafficLegend = [];
                slicing_usage_traffic_list.forEach((item) => {
                    this.trafficData.push({
                        name: item.service_id,
                        value: item.traffic_data
                    });
                    this.trafficLegend.push(item.service_id)
                });
                this.trafficChartData = {
                    legend: {
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
    fetchOnlineusersData(service_list, time) {
        this.myhttp.getFetchOnlineusers(service_list, time).subscribe(res => {
            const { result_header: { result_code }, result_body: { slicing_online_user_list } } = res;
            if (+result_code === 200) {
                this.onlineuserXAxis = [];
                this.onlineusersData = [];
                this.onlineuserLegend = [];
                slicing_online_user_list[0].online_user_list.map((key) => {
                    let date = moment(Number(key.timestamp)).format('YYYY-MM-DD/HH:mm').split("/")[1];
                    this.onlineuserXAxis.push(date)
                });
                slicing_online_user_list.forEach((item) => {
                    this.onlineuserLegend.push(item.service_id);
                    this.onlineusersData.push({
                        name: item.service_id,
                        type: 'line',
                        data: this.getOnlineuserSeriesData(item)
                    })
                });
                this.onlineuserChartData = {
                    legend: {
                        bottom: '0px',
                        data: this.onlineuserLegend
                    },
                    xAxis: {
                        data: this.onlineuserXAxis
                    },
                    series: this.onlineusersData
                };
            }
        })
    }
    fetchBandwidthData(service_list, time) {
        this.myhttp.getFetchBandwidth(service_list, time).subscribe(res => {
            const { result_header: { result_code }, result_body: { slicing_total_bandwidth_list } } = res;
            if (+result_code === 200) {
                this.bandwidthXAxis = [];
                this.bandwidthData = [];
                this.bandwidthLegend = [];
                slicing_total_bandwidth_list[0].total_bandwidth_list.map((key) => {
                    let date = moment(Number(key.timestamp)).format('YYYY-MM-DD/HH:mm').split("/")[1];
                    this.bandwidthXAxis.push(date)
                });
                slicing_total_bandwidth_list.forEach((item) => {
                    this.bandwidthLegend.push(item.service_id);
                    this.bandwidthData.push({
                        name: item.service_id,
                        type: 'line',
                        data: this.getBandwidthSeriesData(item)
                    })
                });
                this.bandwidthChartData = {
                    legend: {
                        bottom: '0px',
                        data: this.bandwidthLegend
                    },
                    xAxis: {
                        data: this.bandwidthXAxis
                    },
                    series: this.bandwidthData
                };
            }
        })
    }
    getOnlineuserSeriesData(item) {
        let datas = [];
        item.online_user_list.forEach((keys) => {
            datas.push(keys.online_users)
        })
        return datas
    }
    getBandwidthSeriesData(item) {
        let datas = [];
        item.total_bandwidth_list.forEach((keys) => {
            datas.push(keys.total_bandwidth)
        })
        return datas
    }
}
