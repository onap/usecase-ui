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
import { Component, OnInit , HostBinding} from '@angular/core';
import { showHideAnimate, slideToRight } from '../animates';
import { ManagemencsService } from '../managemencs.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.less'],
  animations: [
    showHideAnimate, slideToRight
  ]
})
export class ManagementComponent implements OnInit {
  @HostBinding('@routerAnimate') routerAnimateState; //Routing animation

  constructor(private managemencs: ManagemencsService) { }

  ngOnInit() {
    this.getAllCustomers();
  }

    nocuster = true;
    firstCustomer = null;
    AllCustomersdata = [];

    // Get all customers
    getAllCustomers() {
        this.managemencs.getAllCustomers().subscribe((data) => {
            if (data.length > 0) {
                this.nocuster = false;
            } else {
                this.nocuster = true;
            }
        })
    }

    createNewCustomer(customer) {
        let createParams = {
            customerId: customer
        };
        this.managemencs.createCustomer(customer, createParams).subscribe((data) => {
            if (data["status"] == 'SUCCESS') {
                this.nocuster = false;
            } else {
                this.nocuster = true;
                console.log(data, "Interface returned error")
            }
        })
    }
    clearCustomerInput(){
        this.firstCustomer=null;
    }
}
