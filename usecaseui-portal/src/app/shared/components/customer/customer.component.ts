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
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ManagemencsService } from '../../../core/services/managemencs.service';
import { NzNotificationService } from 'ng-zorro-antd';
@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.less']
})
export class CustomerComponent implements OnInit {
    public chose = '';

    constructor(
        private managemencs: ManagemencsService,
        private notification: NzNotificationService
    ) {
    }

    ngOnInit() {
        this.getAllCustomers();
    }

    AllCustomersdata = [];
    AllServiceTypes = [];
    customerber = [];
    // Get all customers
    selectCustomer = {
        name: null,
        id: null
    };
    addNewCustomer = null;
    addNewServiceType = null;
    deleteCustomerModelVisible = false;
    deleteServiceTypeModelVisible = false;
    //2019.08.14 add
    notificationAttributes = null;
    setNotification({ title, imgPath, action, status, name }):void{
        this.notificationAttributes = { title, imgPath, action, status, name }
    }
    notificationSuccess(notificationModel,title,action,name) {
        this.notification.remove()
        this.setNotification({ title, imgPath: "assets/images/execute-success.png", action, status: 'Success', name })
        this.notification.template(notificationModel);
    }
    notificationFailed(notificationModel,title,action,name) {
        this.notification.remove()
        this.setNotification({ title, imgPath: "assets/images/execute-faild.png", action, status: 'Failed', name })
        this.notification.template(notificationModel)
    }
    getAllCustomers() {
        this.managemencs.getAllCustomers().subscribe((data) => {
            this.AllCustomersdata = data.map((item) => {
                return { name: item["subscriber-name"], id: item["global-customer-id"] }
            });
            this.selectCustomer = this.AllCustomersdata[0];
            this.serviceInit["customer"] = this.AllCustomersdata[0].name;
            this.getCustomersPie();
            this.getServiceTypes(this.selectCustomer);
            this.getCustomersColumn(this.selectCustomer);
        })

    }

    // Get all servicetype
    getServiceTypes(item) {
        this.managemencs.getServiceTypes(item).subscribe((data) => {
            this.AllServiceTypes = data.map((item) => {
                return { type: item["service-type"], id: item["global-customer-id"] }
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
                data: [],
                label: {
                    normal: {
                        position: 'center',
                        show: false,
                        formatter: '   {b|{b}：{c}}  ',
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
                labelLine: {
                    normal: {
                        show: false
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
                        borderWidth: 0,
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 10, 5, 0)'
                    }
                }
            }]
        }
    };

    // get customers chart pie
    Pie_name = [];
    Pie_value = [];
    serviceChart = true;
    getCustomersPie() {
        this.managemencs.getCustomersPie().subscribe((data) => {
            this.serviceChart =data.serviceTotalNum > 0 ? true : false
            this.CUChartData = {
                series: [{
                    data: data.customerServiceList
                }]
            }
        }, (err) => {
            console.log(err);
        });
    }

    // service bar
    serviceData: Object;
    serviceInit: Object = {
        customer: '',
        height: 190,
        option: {
            tooltip: {
                show: true,
                trigger: 'item',
                formatter: "{b}:\n{c}"
            },
            grid: {
                top: '5%',
                left: '0%',
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
                    data: [],
                },

            ],
            series: [
                {
                    name: '',
                    barWidth: '40%',
                    type: 'bar',
                    data: [],
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
                    data: '',

                },
                {
                    name: 'Type1',
                    type: 'bar',
                    stack: '',
                    data: ''
                },
                {
                    name: 'Type2',
                    type: 'bar',
                    stack: '',
                    data: ''
                },
                {
                    name: 'Type3',
                    type: 'bar',
                    stack: '',
                    data: ''
                },
                {
                    name: 'Other',
                    type: 'bar',
                    stack: '',
                    data: '',

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
            data.list.forEach((item) => {
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
        })
    }

    createNewCustomer(notificationModel) {
        let createParams = {
            customerId: this.addNewCustomer,
            'global-customer-id': this.addNewCustomer,
            'subscriber-name': this.addNewCustomer,
            'subscriber-type': 'INFRA'
        };
        this.managemencs.createCustomer(this.addNewCustomer, createParams).subscribe((data) => {
            if (data["status"] == 'SUCCESS') {
                this.notificationSuccess(notificationModel,'Customer','Create',this.addNewCustomer);
                this.getAllCustomers();
            } else {
                this.notificationFailed(notificationModel,'Customer','Create',this.addNewCustomer);
            }
        })
    }

    // Customer delete model
    thisdeleteCustomer = {
        name: null,
        id: null
    };
    deleteCustomerModel(itemCustomer) {
        this.thisdeleteCustomer = itemCustomer;
        this.deleteCustomerModelVisible = true;
    }
    deleteCustomerCancel() {
        this.deleteCustomerModelVisible = false;
    }
    deleteCustomerOk(notificationModel) {
        this.deleteCustomerModelVisible = false;
        this.getCustomerVersion(this.thisdeleteCustomer, notificationModel);
    }
    getCustomerVersion(thisdeleteCustomer, notificationModel) {
        this.managemencs.getdeleteCustomerVersion(thisdeleteCustomer).subscribe((data) => {
            if (data["status"] == 'SUCCESS') {
                let params = {
                    customerId: thisdeleteCustomer.id,
                    resourceVersion: data["result"]["resource-version"]
                };
                this.deleteCustomer(params, notificationModel)
            } else {
                console.error(data, "Interface returned error")
            }
        })
    }
    deleteCustomer(paramsObj, notificationModel) {
        this.managemencs.deleteSelectCustomer(paramsObj).subscribe((data) => {
            if (data["status"] == 'SUCCESS') {
                this.notificationSuccess(notificationModel,'Customer','delete',this.thisdeleteCustomer.name);
                this.getAllCustomers();
            } else {
                this.notificationFailed(notificationModel,'Customer','delete',this.thisdeleteCustomer.name);
            }
        })
    }

    createNewServiceType(notificationModel) {
        let createParams = {
            customer: this.selectCustomer,
            ServiceType: this.addNewServiceType,
            "service-type": this.addNewServiceType,
            "temp-ub-sub-account-id": "sotnaccount"
        };
        this.managemencs.createServiceType(createParams).subscribe((data) => {
            if (data["status"] == 'SUCCESS') {
                this.notificationSuccess(notificationModel,'ServiceType','Create',this.addNewServiceType);
                this.getAllCustomers();
            } else {
                this.notificationFailed(notificationModel,'ServiceType','Create',this.addNewServiceType);
            }
        })
    }

    // ServiceType delete model
    thisdeleteServiceType = {
        type: null
    };
    deleteServiceTypeModel(itemServiceType) {
        this.thisdeleteServiceType = itemServiceType;
        this.deleteServiceTypeModelVisible = true;
    }
    deleteServiceTypeCancel() {
        this.deleteServiceTypeModelVisible = false;
    }
    deleteServiceTypeOk(notificationModel) {
        this.deleteServiceTypeModelVisible = false;
        this.getServiceTypeVersion(notificationModel);
    }
    getServiceTypeVersion(notificationModel) {
        let paramss = {
            customerId: this.selectCustomer,
            ServiceType: this.thisdeleteServiceType["type"]
        };
        this.managemencs.getdeleteServiceTypeVersion(paramss).subscribe((data) => {
            if (data["status"] == 'SUCCESS') {
                let params = {
                    customerId: this.selectCustomer,
                    ServiceType: this.thisdeleteServiceType["type"],
                    version: data["result"]["resource-version"]
                };
                this.deleteServiceType(params, notificationModel);
            } else {
                console.error(data, "Interface returned error")
            }
        })
    }
    deleteServiceType(params, notificationModel) {
        this.managemencs.deleteSelectServiceType(params).subscribe((data) => {
            if (data["status"] == 'SUCCESS') {
                this.notificationSuccess(notificationModel,'ServiceType','delete',this.thisdeleteServiceType["type"]);
                this.getAllCustomers();
            } else {
                this.notificationFailed(notificationModel,'ServiceType','delete',this.thisdeleteServiceType["type"]);
            }
        })
    }


}
