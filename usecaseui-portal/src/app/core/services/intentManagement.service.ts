/*
    Copyright (C) 2022 CMCC, Inc. and others. All rights reserved.

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
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class IntentManagementService {

  constructor(private http: HttpClient) { }
  url = {
    createIntentManagement:  "/api/usecaseui-intent-analysis/v1/intents",
    getIntentManagement:  "/api/usecaseui-intent-analysis/v1/intents",
    deleteIntentManagement: "/api/usecaseui-intent-analysis/v1/intents/",
    updateIntentManagementData: "/api/usecaseui-intent-analysis/v1/intents/"
  };

  // intentManagement
  getIntentManagementData(){
    return this.http.get<any>(this.url.getIntentManagement);
  }
  createIntentManagement(requestBody) {
    return this.http.post<any>(this.url["createIntentManagement"], requestBody);
  }
  deleteIntentManagementData(intentId) {
    return this.http.delete<any>(this.url.deleteIntentManagement + intentId);
  }
  updateIntentManagementData(id, requestBody) {//更新接口未完成
    return this.http.put<any>(this.url.updateIntentManagementData + id, requestBody);
  }
}
