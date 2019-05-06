/*
    Copyright (C) 2019 CMCC, Inc. and others. All rights reserved.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
import { Component, OnInit } from '@angular/core';
import { ManagemencsService } from '../../managemencs.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.less']
})
export class CustomerComponent implements OnInit {
  public chose = '';
 
  constructor(private managemencs: ManagemencsService) { }

    ngOnInit() {
        this.getAllCustomers();
    }

    AllCustomersdata = [];
    AllServiceTypes = [];
    customerber = [];
    // Get all customers
    active;
    selectCustomer = {
        name:null,
        id:null
    };
    addNewCustomer = null;
    addNewServiceType = null;
    deleteCustomerModelVisible = false;
    deleteServiceTypeModelVisible = false;

    getAllCustomers() {
        this.managemencs.getAllCustomers().subscribe((data) => {
            this.AllCustomersdata = data.map((item) => {
                return {name: item["subscriber-name"], id: item["global-customer-id"]}
            });
            this.active = this.selectCustomer = this.AllCustomersdata[0];
            this.serviceInit["customer"] = this.AllCustomersdata[0].name;
            this.getCustomersPie();
            this.getServiceTypes(this.active);
            this.getCustomersColumn(this.active);
        })

    }

    // Get all servicetype
    getServiceTypes(item) {
        this.managemencs.getServiceTypes(item).subscribe((data) => {
            this.AllServiceTypes = data.map((item) => {
                return {type: item["service-type"], id: item["global-customer-id"]}
            });
        })
    }

    // Switch user data
    choseCustomer(index, item) {
        this.chose = index;
        this.selectCustomer = item;
        this.serviceInit["customer"] = this.selectCustomer.name;
        this.getServiceTypes(item);
        this.getCustomersColumn(item);
    }

    customeradd = false;
    servicesadd = false;
    //Customer pie
    CUChartData: Object;
    CUChartInit: Object = {
        height: 200,
        option: {
            color: ["#F2F6FD"],
            series: [{
                type: 'pie',
                name: "customer",
                radius: '90%',
                center: ['50%', '50%'],
                data: [{
                    value: 67,
                }, {
                    value: 10,
                }, {
                    value: 17,
                }, {
                    value: 33,
                },],
                label: {
                    normal: {
                        position: 'center',
                        show: false,
                        formatter: '   {b|{b}：{d}%}  ',
                        backgroundColor: 'rgba(51,51,51,0.9)',
                        borderColor: 'rgba(51,51,51,0.9)',
                        borderWidth: 1,
                        borderRadius: 4,
                        rich: {
                            b: {
                                fontSize: 16,
                                color: '#fff',
                                lineHeight: 33
                            }
                        }
                    },
                    emphasis: {
                        show: true,

                    }
                },
                itemStyle: {
                    normal: {
                        borderWidth: 3,
                        borderColor: '#ffffff',
                    },
                    emphasis: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#7DCEFB'
                            }, {
                                offset: 1, color: '#0DA9E2'
                            }],
                            global: false
                        },
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 10, 5, 0)'
                    }
                }
            }]
        }
    };

    // get customers chart pie
    getCustomersPie() {
        this.managemencs.getCustomersPie().subscribe((data) => {
            this.CUChartData = {
                series: [{
                    data: data
                }]
            }
            console.log(this.CUChartData)
        }, (err) => {
            console.log(err);
        });
    }

    // service bar
    serviceData: Object;
    serviceInit: Object = {
        customer: '',
        height: 230,
        width: 410,
        option: {
            tooltip: {
                show: true,
                trigger: 'item',
                formatter: "{c}"
            },
            grid: {
                top: '5%',
                left: '5%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'value',
                    splitLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#EDEDED"
                        }
                    },
                    axisLabel: {
                        color: "#3C4F8C"
                    }
                }

            ],
            yAxis: [
                {
                    type: 'category',
                    splitLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#EDEDED"
                        }
                    },
                    axisLabel: {
                        color: "#3C4F8C"
                    },
                    data: ['Other', 'Type1', 'Type2', 'Type3', 'Type4'],
                },

            ],
            series: [
                {
                    name: '',
                    barWidth: '40%',
                    type: 'bar',
                    data: [2800, 1700, 1200, 1000, 900],
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                // build a color map as your need.
                                var colorList = [
                                    {
                                        type: 'bar',
                                        colorStops: [{
                                            offset: 0,
                                            color: '#FCCE2B'
                                        }, {
                                            offset: 1,
                                            color: '#FEE956'
                                        }],
                                        globalCoord: false,
                                    },
                                    {
                                        type: 'bar',
                                        colorStops: [{
                                            offset: 0,
                                            color: '#F43A59'
                                        }, {
                                            offset: 1,
                                            color: '#FA6C92'
                                        }],
                                        globalCoord: false,
                                    },
                                    {
                                        type: 'bar',
                                        colorStops: [{
                                            offset: 0,
                                            color: '#4F5B60'
                                        }, {
                                            offset: 1,
                                            color: '#879499'
                                        }],
                                        globalCoord: false,
                                    },
                                    {
                                        type: 'bar',
                                        colorStops: [{
                                            offset: 0,
                                            color: '#31DAC3'
                                        }, {
                                            offset: 1,
                                            color: '#5FEFE3'
                                        }],
                                        globalCoord: false,
                                    },
                                    {
                                        type: 'bar',
                                        colorStops: [{
                                            offset: 0,
                                            color: '#999999'
                                        }, {
                                            offset: 1,
                                            color: '#C9C9C9'
                                        }],
                                        globalCoord: false,
                                    }
                                ];
                                return colorList[params.dataIndex]
                            },
                        }
                    }
                },
                {
                    name: 'Type4',
                    type: 'bar',
                    stack: '',
                    data: 2800,

                },
                {
                    name: 'Type1',
                    type: 'bar',
                    stack: '',
                    data: 1700
                },
                {
                    name: 'Type2',
                    type: 'bar',
                    stack: '',
                    data: 1500
                },
                {
                    name: 'Type3',
                    type: 'bar',
                    stack: '',
                    data: 1300
                },
                {
                    name: 'Other',
                    type: 'bar',
                    stack: '',
                    data: 1000,

                }
            ]
        }
    };
    name_s = [];
    value_s = [];

    getCustomersColumn(item) {
        this.name_s = [];
        this.value_s = [];
        this.managemencs.getCustomersColumn(item).subscribe((data) => {
            data.forEach((item) => {
                this.name_s.push(item.name);
                this.value_s.push(item.value);
            })
            this.serviceData = {
                yAxis: [{
                    data: this.name_s
                }],
                series: [{
                    data: this.value_s
                }]
            }
            console.log(this.serviceData)
        })
    }

    createNewCustomer() {
        let createParams = {
            customerId: this.addNewCustomer
        };
        this.managemencs.createCustomer(this.addNewCustomer, createParams).subscribe((data) => {
            if (data["status"] == 'SUCCESS') {
                this.getAllCustomers();
                console.log(data, "Interface returned success")
            } else {
                console.log(data, "Interface returned error")
            }
        })
    }

    // Customer delete model
     thisdeleteCustomer={
        name:null,
         id:null
     };
    deleteCustomerModel(itemCustomer) {
        this.thisdeleteCustomer = itemCustomer;
        this.deleteCustomerModelVisible = true;
    }
    deleteCustomerCancel() {
        this.deleteCustomerModelVisible = false;
    }
    deleteCustomerOk() {
        this.deleteCustomerModelVisible = false;
        this.getCustomerVersion(this.thisdeleteCustomer);
    }
    getCustomerVersion(thisdeleteCustomer){
        this.managemencs.getdeleteCustomerVersion(thisdeleteCustomer).subscribe((data) => {
            if (data["status"] == 'SUCCESS') {
                let params = {
                    customerId:thisdeleteCustomer.id,
                    version:data["result"]["resource-version"]
                };
                this.deleteCustomer(params);
                console.log(data, "Interface returned success")
            } else {
                console.log(data, "Interface returned error")
            }
        })
    }
    deleteCustomer(params){
        this.managemencs.deleteSelectCustomer(params).subscribe((data) => {
            if (data["status"] == 'SUCCESS') {
                this.getAllCustomers();
                console.log(data, "Interface returned success")
            } else {
                console.log(data, "Interface returned error")
            }
        })
    }

    createNewServiceType() {
        let createParams = {
            customer: this.selectCustomer,
            ServiceType:this.addNewServiceType
        };
        this.managemencs.createServiceType(createParams).subscribe((data) => {
            if (data["status"] == 'SUCCESS') {
                this.getCustomersColumn(this.selectCustomer);
                console.log(data, "Interface returned success")
            } else {
                console.log(data, "Interface returned error")
            }
        })
    }

    // ServiceType delete model
    thisdeleteServiceType={
        type:null
    };
    deleteServiceTypeModel(itemServiceType) {
        this.thisdeleteServiceType = itemServiceType;
        this.deleteServiceTypeModelVisible = true;
    }
    deleteServiceTypeCancel() {
        this.deleteServiceTypeModelVisible = false;
    }
    deleteServiceTypeOk() {
        this.deleteServiceTypeModelVisible = false;
        this.getServiceTypeVersion();
    }
    getServiceTypeVersion(){
        let params={
            customerId:this.selectCustomer.id,
            ServiceType:this.thisdeleteServiceType["type"]
        };
        this.managemencs.getdeleteServiceTypeVersion(params).subscribe((data) => {
            if (data["status"] == 'SUCCESS') {
                let params = {
                    customerId:this.selectCustomer,
                    ServiceType:this.thisdeleteServiceType["type"],
                    version:data["result"]["resource-version"]
                };
                this.deleteServiceType(params);
                console.log(data, "Interface returned success")
            } else {
                console.log(data, "Interface returned error")
            }
        })
    }
    deleteServiceType(params){
        this.managemencs.deleteSelectServiceType(params).subscribe((data) => {
            if (data["status"] == 'SUCCESS') {
                this.getCustomersPie();
                this.getServiceTypes(params.customerId);
                this.getCustomersColumn(params.customerId);
                console.log(data, "Interface returned success")
            } else {
                console.log(data, "Interface returned error")
            }
        })
    }


}
