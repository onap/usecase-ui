import { Component, OnInit } from '@angular/core';
import { SlicingTaskServices } from '.././../../core/services/slicingTaskServices';
import { pieChartconfig, lineChartconfig } from './monitorEchartsConfig';
import *as moment from 'moment';
import * as differenceInDays from 'date-fns/difference_in_days';
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
    today = new Date();
    dateValue = null;
    listOfData: any[] = [];
    pageIndex: number = 1;
    pageSize: number = 10;
    total: number = 0;
    loading = false;
    selectDate: number = 0;
    isSpinningTraffic: boolean =true;
    isSpinningOnlineuser: boolean =true;
    isSpinningBandwidth: boolean =true;

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
            this.loading = false;
            if (+result_code === 200) {
                this.total = record_number;
                this.loading = false;
                this.listOfData = [].concat(slicing_business_list);
                this.getChartsData();
            }else {
                console.log("getBusinessList false");
                this.isSpinningTraffic = false;
                this.isSpinningOnlineuser = false;
                this.isSpinningBandwidth = false;
            }
        },(res) => {
            this.loading = false;
            this.isSpinningTraffic = false;
            this.isSpinningOnlineuser = false;
            this.isSpinningBandwidth = false;
            console.error(res);
        })
    }
    disabledDate = (current: Date): boolean => {
        // Can not select days before today and today
        return differenceInDays(current, this.today) > 0;
    };
    searchData(reset: boolean = false) {
        this.getBusinessList();
    }
    onDateChange(result): void {
        if (result === null) {
            this.selectDate = 0;
            this.getChartsData()
        }
    }

    onDateOk(result: Date): void {
        this.selectDate = result.valueOf();
        this.getChartsData();
    }
    onOpenChange(result): void {
        if(this.selectDate ===0 && !result){
            this.dateValue = null;
            this.getChartsData();
        }
    }
    getChartsData = (time = new Date().getTime()) => {
        if (!this.listOfData.length) {
            return false;
        }
        if (this.selectDate !== 0) {
            time = this.selectDate
        }
        const requestBody = {
            service_list:[]
        };
        this.listOfData.forEach(item => {
            if(item.service_snssai !==null && item.service_snssai!==undefined){
                requestBody.service_list.push({ service_id: item.service_snssai });
            }
        });
        this.fetchTrafficData(requestBody, time);
        this.fetchOnlineusersData(requestBody, time);
        this.fetchBandwidthData(requestBody, time);
    }
    fetchTrafficData(service_list, time) {
        this.myhttp.getFetchTraffic(service_list, time).subscribe(res => {
            this.isSpinningTraffic = false;
            const { result_header: { result_code }, result_body: { slicing_usage_traffic_list } } = res;
            if (+result_code === 200 && slicing_usage_traffic_list.length > 0) {
                this.trafficData = [];
                this.trafficLegend = [];
                slicing_usage_traffic_list.forEach((item) => {
                    if(item.service_id !==null){
                        this.trafficData.push({
                            name: item.service_id,
                            value: item.traffic_data
                        });
                        this.trafficLegend.push(item.service_id)
                    }
                });
                this.trafficChartData = {
                    legend: {
                        orient: 'vertical',
                        type: 'scroll',
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
        },(res) => {
            this.isSpinningTraffic = false;
            console.error(res);
        })
    }
    fetchOnlineusersData(service_list, time) {
        this.myhttp.getFetchOnlineusers(service_list, time).subscribe(res => {
            this.isSpinningOnlineuser = false;
            const { result_header: { result_code }, result_body: { slicing_online_user_list } } = res;
            if (+result_code === 200) {
                this.onlineuserXAxis = [];
                this.onlineusersData = [];
                this.onlineuserLegend = [];
                let filterList = [];
                filterList = this.filterData(slicing_online_user_list);
                filterList[0].online_user_list.map((key) => {
                    let date = moment(Number(key.timestamp)).format('YYYY-MM-DD/HH:mm').split("/")[1];
                    this.onlineuserXAxis.push(date)
                });
                filterList.forEach((item) => {
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
                        type: 'scroll',
                        data: this.onlineuserLegend
                    },
                    xAxis: {
                        data: this.onlineuserXAxis
                    },
                    series: this.onlineusersData
                };
            }
        },(res) => {
            this.isSpinningOnlineuser = false;
            console.error(res);
        })
    }
    fetchBandwidthData(service_list, time) {
        this.myhttp.getFetchBandwidth(service_list, time).subscribe(res => {
            this.isSpinningBandwidth = false;
            const { result_header: { result_code }, result_body: { slicing_total_bandwidth_list } } = res;
            if (+result_code === 200) {
                this.bandwidthXAxis = [];
                this.bandwidthData = [];
                this.bandwidthLegend = [];
                let filterList = [];
                filterList = this.filterData(slicing_total_bandwidth_list);
                console.log(filterList,"filterList----slicing_total_bandwidth");
                filterList[0].total_bandwidth_list.map((key) => {
                    let date = moment(Number(key.timestamp)).format('YYYY-MM-DD/HH:mm').split("/")[1];
                    this.bandwidthXAxis.push(date)
                });
                filterList.forEach((item) => {
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
                        type: 'scroll',
                        data: this.bandwidthLegend
                    },
                    xAxis: {
                        data: this.bandwidthXAxis
                    },
                    series: this.bandwidthData
                };
            }
        },(res) => {
            this.isSpinningBandwidth = false;
            console.error(res);
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
    filterData(data){
        let filter = [];
        data.map((item,index) => {
            if(item.service_id !== null){
                filter.push(item)
            }
        });
        return filter
    }
}