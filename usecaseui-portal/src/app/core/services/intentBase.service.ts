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
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../models/dataInterface';

@Injectable()
export class intentBaseService {
    constructor(private http: HttpClient) { }

    baseUrl = baseUrl.baseUrl;
    url = {
      getInstanceId: this.baseUrl + "/intent/getInstanceId",
      createIntentInstance: this.baseUrl + "/intent/createIntentInstance",
      getInstanceList: this.baseUrl + "/intent/getInstanceList",
      queryInstancePerformanceData: this.baseUrl + "/intent/queryInstancePerformanceData",
      getFinishedInstanceInfo: this.baseUrl + "/intent/getFinishedInstanceInfo",
      deleteIntentInstance: this.baseUrl + "/intent/deleteIntentInstance",
      activeIntentInstance: this.baseUrl + "/intent/activeIntentInstance",
      invalidIntentInstance: this.baseUrl + "/intent/invalidIntentInstance",
      queryAccessNodeInfo: this.baseUrl + "/intent/queryAccessNodeInfo",
      intentInstancePredict: this.baseUrl + "/intent/intentInstancePredict"
    };

    //The following APIs function are optimizable------------------------

    /* Query data list */
    getInstanceId() {
        return this.http.get<any>(this.url["getInstanceId"]);
    }
    
    createIntentInstance(requestBody) {
      return this.http.post<any>(this.url["createIntentInstance"], requestBody);
    }

    getInstanceList(requestBody) {
      return this.http.post<any>(this.url["getInstanceList"], requestBody);
    }
    
    queryInstancePerformanceData(requestBody) {
        return this.http.post<any>(this.url["queryInstancePerformanceData"], requestBody);
    }
    
    getFinishedInstanceInfo() {
      return this.http.get<any>(this.url["getFinishedInstanceInfo"]);
    }
    
    deleteIntentInstance(instanceId) {
        let params = new HttpParams({ fromObject: { "instanceId": instanceId } });
        return this.http.delete<any>(this.url.deleteIntentInstance, { params });
    }
    
    activeIntentInstance(requestBody) {
      return this.http.post<any>(this.url["activeIntentInstance"], requestBody);
    }

    invalidIntentInstance(requestBody) {
      return this.http.post<any>(this.url["invalidIntentInstance"], requestBody);
    }

    queryAccessNodeInfo() {
      return this.http.get<any>(this.url["queryAccessNodeInfo"]);
    }

    intentInstancePredict(requestBody) {
      return this.http.post<any>(this.url["intentInstancePredict"], requestBody);
    }
}
