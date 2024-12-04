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
import { KnowledgeBase, KnowledgeBaseResponse } from '../../views/maas/knowledge-base-management/knowledge-base.type'
import { Application } from '../../views/maas/build/application.type';
@Injectable()
export class MaasService {

  constructor(private http: HttpClient) { }
  baseUrl = "/api/usecaseui-llm-adaptation/v1/";
  url = {
    getKnowledgeBaseRecord: this.baseUrl + "knowledgeBase/query",
    removeKnowledgeBase: this.baseUrl + "knowledgeBase/delete/",
    getKnowledgeBaseById: this.baseUrl + "knowledgeBase/queryById/",
    updateKnowledgeBaseRecord: this.baseUrl + "knowledgeBase/update",
    maasUrl: this.baseUrl + "maas/getAll",
    getAllApplication: this.baseUrl + "application/query",
    deleteApplicationById: this.baseUrl + "application/delete/",
    getApplicationById: this.baseUrl + "application/queryById/",
    operatorsUrl: this.baseUrl + 'operator/maas/getAll',
    KnowledgeBaseByMaas: this.baseUrl + 'knowledgeBase/queryByMaaSId/',
    createApplicationUrl: this.baseUrl + "application/create"
  };

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
    return this.http.get<KnowledgeBaseResponse>(this.url.getKnowledgeBaseById + index);
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

  getOperators() {
    return this.http.get<any>(this.url.operatorsUrl);
  }

  fetchKnowledgeBaseByMaasId(id: string) {
    return this.http.get<any>(this.url.KnowledgeBaseByMaas + id);
  }

  createApplication(body: Application) {
    return this.http.post<any>(this.url.createApplicationUrl, body)
  }

}
