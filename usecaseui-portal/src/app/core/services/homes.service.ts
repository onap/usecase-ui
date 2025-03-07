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
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@src/environments/environment';

@Injectable()
export class HomesService {

  constructor(private http: HttpClient) { }
  baseUrl = environment.backendUrl;
  url = {
    home_serviceData: this.baseUrl + "/uui-lcm/serviceNumByCustomer",
    home_alarmData: this.baseUrl + "/alarm/statusCount",
    home_alarmChartData: this.baseUrl + "/alarm/diagram",
    home_servicebarnsData: this.baseUrl + "/uui-lcm/ns-packages",
    home_servicebarvnfData: this.baseUrl + "/uui-lcm/vnf-packages",
    home_servicebarpnfData: this.baseUrl + "/uui-lcm/pnf-packages",
    sourceNames: this.baseUrl + "/alarm/getSourceNames",
    listSortMasters: this.baseUrl + "/listSortMasters",
    currentLanguage: "/api/portal-auxapi/languageSetting/user/",
  };

  // home
  getHomeServiceData() {
    return this.http.get<any>(this.url.home_serviceData);
  }
  getHomeAlarmData() {
    return this.http.get<any>(this.url.home_alarmData);
  }
  getHomeAlarmChartData(paramsObj) {
    let params = new HttpParams({ fromObject: paramsObj });
    return this.http.get<any>(this.url.home_alarmChartData, { params });
  }
  getHomeServiceBarNsData() {
    return this.http.get<any>(this.url.home_servicebarnsData);
  }
  getHomeServiceBarVnfData() {
    return this.http.get<any>(this.url.home_servicebarvnfData);
  }
  getHomeServiceBarPnfData() {
    return this.http.get<any>(this.url.home_servicebarpnfData);
  }

  // alarm data
  getAlarmFormData(currentPage: number, pageSize: number, sourceName?: string, priority?: string, startTime?: string, endTime?: string, vfStatus?: string) {
    return this.http.get<any>(this.baseUrl + '/alarm/' + '/' + currentPage + '/' + pageSize + '?sourceName=' + sourceName + '&priority=' + priority + '&startTime=' + startTime + '&endTime=' + endTime + '&vfStatus=' + vfStatus);
  }

  getSourceNames() {
    return this.http.get<any>(this.url.sourceNames);
  }

  getAlarmDetailData(id) {
    let httpurl = this.baseUrl + '/alarm/getAlarmsHeaderDetail/' + id;
    return this.http.get<any>(httpurl);
  }

  // performance data
  getqueryAllSourceNames() {
    let httpurl = this.baseUrl + "/performance/queryAllSourceNames";
    return this.http.get<any>(httpurl);
  }
  getperformanceSourceNames(currentPage: number, pageSize: number, sourceName: string) {
    let httpurl = this.baseUrl + "/performanceSsourceNames" + "/" + currentPage + "/" + pageSize + "?sourceName=" + sourceName;
    return this.http.get<any>(httpurl);
  }
  getPerformanceFormData(currentPage: number, pageSize: number, sourceName?: string, startTime?: string, endTime?: string) {
    return this.http.get<any>(this.baseUrl + '/performance' + '/' + currentPage + '/' + pageSize + '?sourceName=' + sourceName + '&startTime=' + startTime + '&endTime=' + endTime);
  }
  getPerformanceHeaderDetail(id) {
    let httpurl = this.baseUrl + '/performance/getPerformanceHeaderDetail/' + id;
    return this.http.get<any>(httpurl);
  }


  getListSortMasters() {
    return this.http.get<any>(this.url.listSortMasters);
  }

  getCurrentLanguage(currentloginId) {
    let url = this.url.currentLanguage + currentloginId;
    return this.http.get<any>(url);
  }
}
