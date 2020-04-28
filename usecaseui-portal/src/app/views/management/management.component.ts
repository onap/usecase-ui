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
import { Component, OnInit, HostBinding } from '@angular/core';
import { showHideAnimate, slideToRight } from '../../shared/utils/animates';
import { ManagemencsService } from '../../core/services/managemencs.service';
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.less'],
  animations: [showHideAnimate, slideToRight]
})
export class ManagementComponent implements OnInit {
  @HostBinding('@routerAnimate') routerAnimateState //Routing animation

    nocuster: boolean = true;
    firstCustomer: string = "";

    constructor(
        private managemencs: ManagemencsService,
        private message: NzMessageService,
    ) { }

  ngOnInit () {
    this.getAllCustomers()
  }

  // Get all customers
  getAllCustomers () {
    this.managemencs.getAllCustomers().subscribe(data => {
  	this.nocuster = data.length !== 0 ? false : true;
    })
  }
  createNewCustomer (customer) {
    let createParams = {
      // customerId: customer,
      'global-customer-id': customer,
      'subscriber-name': customer,
      'subscriber-type': 'INFRA'
    }
    this.managemencs.createCustomer(customer, createParams).subscribe(data => {
      if (data['status'] == 'SUCCESS') {
        this.nocuster = false
            } else {
                this.nocuster = true;
                this.clearCustomerInput();
                this.message.error(data["errorMessage"]);
      }
    })
  }
  clearCustomerInput () {
    this.firstCustomer = ''
  }
    closeCustomer(isClose){
        this.nocuster = isClose;
    }
}
