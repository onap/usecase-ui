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
import { of } from 'rxjs/observable/of';
import { knowledgeBase } from '../../views/maas/knowledge-base-management/knowledge-base.type'
import { application } from '../../views/maas/build/application.type';
@Injectable()
export class IntentManagementService {

  constructor(private http: HttpClient) { }
  url = {
    createIntentManagement: "/api/usecaseui-intent-analysis/v1/intents",
    getIntentManagement: "/api/usecaseui-intent-analysis/v1/intents/intentGenerateType/USERINPUT",
    deleteIntentManagement: "/api/usecaseui-intent-analysis/v1/intents/",
    updateIntentManagementData: "/api/usecaseui-intent-analysis/v1/intents/",
    getIntentReport: "/api/usecaseui-intent-analysis/v1/intentReport/",
    getKnowledgeBaseRecord: "/api/usecaseui-llm-adaptation/v1/knowledgeBase/query",
    removeKnowledgeBase: "/api/usecaseui-llm-adaptation/v1/knowledgeBase/delete/",
    getKnowledgeBaseById: "/api/usecaseui-llm-adaptation/v1/knowledgeBase/queryById/",
    updateKnowledgeBaseRecord: "/api/usecaseui-llm-adaptation/v1/knowledgeBase/update",
    maasUrl: "/api/usecaseui-llm-adaptation/v1/maas/getAll",
    getAllApplication: "/api/usecaseui-llm-adaptation/v1/application/query",
    deleteApplicationById: "/api/usecaseui-llm-adaptation/v1/application/delete/",
    getApplicationById: "/api/usecaseui-llm-adaptation/v1/application/queryById/"
  };
  
  // intentManagement
  getIntentManagementData() {
    return this.http.get<any>(this.url.getIntentManagement);
  }
  createIntentManagement(requestBody) {
    return this.http.post<any>(this.url["createIntentManagement"], requestBody);
  }
  deleteIntentManagementData(intentId) {
    return this.http.delete<any>(this.url.deleteIntentManagement + intentId);
  }
  updateIntentManagementData(id, requestBody) {
    return this.http.put<any>(this.url.updateIntentManagementData + id, requestBody);
  }
  getIntentReportData(intentId) {
    return this.http.get<any>(this.url.getIntentReport + intentId);
  }
  getKnowledgeBaseRecord() {
    return this.http.get<any>(this.url.getKnowledgeBaseRecord);
  }

  updateKnowledgeBase(body: any) {
    return this.http.post<any>(this.url.updateKnowledgeBaseRecord, body);
  }

  deleteKnowledgeBaseData(index) {
    return this.http.delete<any>(this.url.removeKnowledgeBase + index);
  }
  getMaaSPlatform() {
    return this.http.get<any>(this.url.maasUrl);
  }
  getKnowledgeBaseById(index) {
    return this.http.get<{result_body: Array<knowledgeBase>}>(this.url.getKnowledgeBaseById + index);
  }
  getAllApplication() {
    return this.http.get<any>(this.url.getAllApplication);
  }
  deleteApplicationById(index) {
    return this.http.delete<any>(this.url.deleteApplicationById + index);
  }
  getApplicationById(index) {
    return this.http.get<any>(this.url.getApplicationById + index);
  }
}
