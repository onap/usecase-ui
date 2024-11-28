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
// import { application } from '../../views/maas/build/application.type';
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
  knowledgeBaseRecord = [
    {
      "knowledgeBaseId": "563182b7-04ce-4215-abfe-bf86399fabe1",
      "knowledgeBaseName": "ffg",
      "knowledgeBaseDescription": "ff",
      "operatorId": "11111111",
      "operatorName": "test1",
      "maaSPlatformId": "1111111111f",
      "maaSPlatformName": "chinamobile",
      "updateTime": "",
      "filesName": ["1rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkr", "11", "111"]
    },
    {
      "knowledgeBaseId": "39f2dc2e-a850-4199-8451-cbf6b121c68e",
      "knowledgeBaseName": "hh",
      "knowledgeBaseDescription": "ff",
      "operatorId": "222222222222",
      "operatorName": "test2",
      "maaSPlatformId": "222222222222f",
      "maaSPlatformName": "chinaunion",
      "updateTime": "",
      "filesName": ["2a", "2b", "2c"]
    },
    {
      "knowledgeBaseId": "04983426-7157-48a4-b098-cc4b469c0a07",
      "knowledgeBaseName": "hgkjh",
      "knowledgeBaseDescription": "dfsg",
      "operatorId": "3333333333",
      "operatorName": "test3",
      "maaSPlatformId": "333333333333f",
      "maaSPlatformName": "chinatele",
      "updateTime": "",
      "filesName": ["test1", "test2", "test3"]
    }
  ];
  applicationRecord = [
    {
      "applicationId":"111111",
      "applicationName": "qa",
      "applicationDescription":"test1 qa ",
      "applicationType":"knowledgeAssistant",
      "operatorId":"111111",
      "operatorName":"test1",
      "maasPlatformId":"11111111",
      "maasPlatformName":"test1maas",
      "knowledgeBaseName":"hh",
      "knowledgeBaseId":"39f2dc2e-a850-4199-8451-cbf6b121c68e",
      "largeModelName":"fastgpt",
      "largeModelId":"fastgpt1111",
      "prompt":"hello",
      "temperature":0.8,
      "top_p":0.5,
      "openingRemarks":"hello,i am knowledgeAssistant"
      },
      {
        "applicationId":"22222",
        "applicationName": "qa2",
        "applicationDescription":"test2 qa ",
        "applicationType":"knowledgeAssistant",
        "operatorId":"2222222222",
        "operatorName":"test2",
        "maasPlatformId":"22222222222222",
        "maasPlatformName":"test2maas",
        "knowledgeBaseName":"ffg",
        "knowledgeBaseId":"563182b7-04ce-4215-abfe-bf86399fabe1",
        "largeModelName":"fastgpt",
        "largeModelId":"fastgpt1111",
        "prompt":"hello",
        "temperature":8,
        "top_p":5,
        "openingRemarks":"hello a,i am knowledgeAssistant"
        }
      
  ]
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
    // return of({
    //   "result_body": this.knowledgeBaseRecord
    // }
    // );
  }

  updateKnowledgeBase(body: any) {
    return this.http.post<any>(this.url.updateKnowledgeBaseRecord, body);
    // console.log(body);
    // this.knowledgeBaseRecord.map(i => {
    //   if (i.knowledgeBaseId === body.metaData.knowledgeBaseId) {
    //     i.knowledgeBaseName = body.metaData.knowledgeBaseName;
    //     i.knowledgeBaseDescription = body.metaData.knowledgeBaseDescription;
    //   }
    // })
    // return of({"result_header":{"result_code":200,"result_message":"success"}})
  }

  deleteKnowledgeBaseData(index) {
    return this.http.delete<any>(this.url.removeKnowledgeBase + index);
  }
  getMaaSPlatform() {
    return this.http.get<any>(this.url.maasUrl);
  }
  getKnowledgeBaseById(index) {
    return this.http.get<{result_body: Array<knowledgeBase>}>(this.url.getKnowledgeBaseById + index);
    // let knowledgeBase = this.knowledgeBaseRecord.filter(i => i.knowledgeBaseId === index);
    // return of({
    //   "result_body": knowledgeBase.length === 0 ? {} as knowledgeBase : knowledgeBase[0] 
    // }
    // );
  }
  getAllApplication() {
    return this.http.get<any>(this.url.getAllApplication);
    // return of({"result_header": {
    //     "result_code": 200,
    //     "result_message": "success"
    // },
    //   "result_body": this.applicationRecord
    // }
    // );
  }
  deleteApplicationById(index) {
    return this.http.delete<any>(this.url.deleteApplicationById + index);
  }
  getApplicationById(index) {
    return this.http.get<any>(this.url.getApplicationById + index);
  //   let application = this.applicationRecord.filter(i => i.applicationId === index);
  //   return of({
  //     "result_header": {
  //         "result_code": 200,
  //         "result_message": "success"
  //     },
  //     "result_body": application.length === 0 ? {} as application : application[0]
  // })
  }
}
