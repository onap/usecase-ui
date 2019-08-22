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
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { HomeComponent } from './views/home/home.component';
import { ManagementComponent } from './views/management/management.component';
import { FcapsComponent } from './views/fcaps/fcaps.component';
import { ServicesComponent } from './views/services/services.component';
import { ServicesListComponent } from './views/services/services-list/services-list.component';
import { OnboardVnfVmComponent } from './views/services/onboard-vnf-vm/onboard-vnf-vm.component';
import { AlarmComponent } from './views/alarm/alarm.component';
import { PerformanceComponent } from './views/performance/performance.component';
import { PerformanceVnfComponent } from './views/performance/performance-vnf/performance-vnf.component';
import { PerformanceVmComponent } from './views/performance/performance-vm/performance-vm.component';

import { CcvpnNetworkComponent } from './views/ccvpn-network/ccvpn-network.component';


import { TestComponent } from './test/test.component';

// import { DetailsComponent } from './details/details.component';

const ServicesChildRoutes: Routes = [
  { path: 'services-list', component: ServicesListComponent },
  { path: 'onboard-vnf-vm', component: OnboardVnfVmComponent },
  { path: '**', redirectTo: 'services-list' }
]

const routes: Routes = [
  { path: 'text', component: TestComponent },
  { path: 'home', component: HomeComponent },
  { path: 'management', component: ManagementComponent },
  { path: 'fcaps', component: FcapsComponent },
  // { path: 'services', component: ServicesComponent, children:ServicesChildRoutes}, //Temporarily not a sub-routing structure
  { path: 'services/services-list', component: ServicesListComponent },
  { path: 'services/onboard-vnf-vm', component: OnboardVnfVmComponent },
  { path: 'alarm', component: AlarmComponent },
  { path: 'performance', component: PerformanceComponent },
  { path: 'performance/performance-vnf', component: PerformanceVnfComponent },
  { path: 'performance/performance-vm', component: PerformanceVmComponent },
  { path: 'network', component: CcvpnNetworkComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
