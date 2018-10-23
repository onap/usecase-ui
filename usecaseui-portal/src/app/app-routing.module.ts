import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { HomeComponent }        from './home/home.component';
import { ServicesComponent }    from './services/services.component';
import { ServicesListComponent }    from './services/services-list/services-list.component';
import { OnboardVnfVmComponent } from './services/onboard-vnf-vm/onboard-vnf-vm.component';
import { AlarmComponent }       from './alarm/alarm.component';
import { PerformanceComponent } from './performance/performance.component';
import { PerformanceVnfComponent } from './performance/performance-vnf/performance-vnf.component';
import { PerformanceVmComponent } from './performance/performance-vm/performance-vm.component';

import { CcvpnNetworkComponent } from './ccvpn-network/ccvpn-network.component';

// import { DetailsComponent } from './details/details.component';

const ServicesChildRoutes: Routes = [
  { path: 'services-list', component: ServicesListComponent},
  { path: 'onboard-vnf-vm', component: OnboardVnfVmComponent},
  { path: '**', redirectTo: 'services-list' }
]

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  // { path: 'services', component: ServicesComponent, children:ServicesChildRoutes}, //暂时不是子路由结构
  { path: 'services/services-list', component: ServicesListComponent},
  { path: 'services/onboard-vnf-vm', component: OnboardVnfVmComponent},
  { path: 'alarm', component: AlarmComponent},
  { path: 'performance', component: PerformanceComponent},
  { path: 'performance/performance-vnf', component: PerformanceVnfComponent},
  { path: 'performance/performance-vm', component: PerformanceVmComponent},
  { path: 'network', component: CcvpnNetworkComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
