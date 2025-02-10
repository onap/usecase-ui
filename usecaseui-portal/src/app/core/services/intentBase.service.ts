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
import { environment } from '@src/environments/environment';

@Injectable()
export class intentBaseService {
    constructor(private http: HttpClient) { }

    baseUrl = environment.backendUrl;
    url = {
      getInstanceId: this.baseUrl + "/intent/getInstanceId",
      createIntentInstance: this.baseUrl + "/intent/createIntentInstance",
      getInstanceList: this.baseUrl + "/intent/getInstanceList",
      getInstanceStatus: this.baseUrl + "/intent/getInstanceStatus",
      queryInstancePerformanceData: this.baseUrl + "/intent/queryInstancePerformanceData",
      getFinishedInstanceInfo: this.baseUrl + "/intent/getFinishedInstanceInfo",
      deleteIntentInstance: this.baseUrl + "/intent/deleteIntentInstance",
      activeIntentInstance: this.baseUrl + "/intent/activeIntentInstance",
      invalidIntentInstance: this.baseUrl + "/intent/invalidIntentInstance",
      updateIntentInstance: this.baseUrl + "/intent/updateCCVPNInstance",
      queryAccessNodeInfo: this.baseUrl + "/intent/queryAccessNodeInfo",
      intentInstancePredict: this.baseUrl + "/intent/predict",
      intentBasedUnifyPredict: this.baseUrl + "/intent/unifyPredict",
      getIntentInstanceList: this.baseUrl + "/intent/getIntentList",
      delIntentInstance: this.baseUrl + "/intent/deleteIntent",
      verifyIntentInstance: this.baseUrl + "/intent/verifyIntentInstance"
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

    getInstanceStatus(requestBody) {
      return this.http.post<any>(this.url["getInstanceStatus"], requestBody);
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

    updateIntentInstance(requestBody) {
      return this.http.post<any>(this.url["updateIntentInstance"], requestBody);
    }

    queryAccessNodeInfo() {
      return this.http.get<any>(this.url["queryAccessNodeInfo"]);
    }

    intentInstancePredict(requestBody) {
      return this.http.post<any>(this.url["intentInstancePredict"], requestBody);
    }

    intentBasedUnifyPredict(requestBody) {
      return this.http.post<any>(this.url["intentBasedUnifyPredict"], requestBody);
    }

    getIntentInstanceList(paramsObj) {
      return this.http.post<any>(this.url["getIntentInstanceList"], paramsObj);
    }

    delIntentInstance(id) {
      let params = new HttpParams({ fromObject: { "id": id } });
      return this.http.delete<any>(this.url['delIntentInstance'], { params });
    }

    verifyIntentInstance(paramsObj) {
      return this.http.post<any>(this.url['verifyIntentInstance'], paramsObj);
    }
}
