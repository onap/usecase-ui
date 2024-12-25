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
import { KnowledgeBaseResponse, KnowledgeBasesResponse, OperatorsResponse, ResponseHeader } from '../views/maas/knowledge-base-management/knowledge-base.type'
import { Application, ApplicationResponse, ApplicationsResponse } from '../views/maas/build/application.type';
@Injectable()
export class MaasApi {

  constructor(private http: HttpClient) { }
  baseUrl = "/api/usecaseui-llm-adaptation/v1/";
  url = {
    getKnowledgeBaseRecord: this.baseUrl + "knowledgeBase/query",
    removeKnowledgeBase: this.baseUrl + "knowledgeBase/delete/",
    getKnowledgeBaseById: this.baseUrl + "knowledgeBase/queryById/",
    updateKnowledgeBaseRecord: this.baseUrl + "knowledgeBase/edit",
    createKnowledgeBase: this.baseUrl + "knowledgeBase/create",
    maasUrl: this.baseUrl + "maas/getAll",
    getAllApplication: this.baseUrl + "application/query",
    deleteApplicationById: this.baseUrl + "application/delete/",
    getApplicationById: this.baseUrl + "application/queryById/",
    operatorsUrl: this.baseUrl + 'operator/maas/getAll',
    KnowledgeBaseByMaas: this.baseUrl + 'knowledgeBase/queryByMaaSId/',
    createApplicationUrl: this.baseUrl + "application/create",
    updateApplication: this.baseUrl + "application/edit"
  };

  getKnowledgeBaseRecord() {
    return this.http.get<KnowledgeBasesResponse>(this.url.getKnowledgeBaseRecord);
  }

  updateKnowledgeBase(body: any) {
    return this.http.post<ResponseHeader>(this.url.updateKnowledgeBaseRecord, body);
  }

  createKnowledgeBase(body: FormData) {
    return this.http.post<ResponseHeader>(this.url.createKnowledgeBase, body);
  }

  deleteKnowledgeBaseData(id: string) {
    return this.http.delete<ResponseHeader>(this.url.removeKnowledgeBase + id);
  }

  getKnowledgeBaseById(id: string) {
    return this.http.get<KnowledgeBaseResponse>(this.url.getKnowledgeBaseById + id);
  }

  getAllApplication() {
    return this.http.get<ApplicationsResponse>(this.url.getAllApplication);
  }

  deleteApplicationById(id: string) {
    return this.http.delete<ResponseHeader>(this.url.deleteApplicationById + id);
  }

  getApplicationById(id: string) {
    return this.http.get<ApplicationResponse>(this.url.getApplicationById + id);
  }

  getOperators() {
    return this.http.get<OperatorsResponse>(this.url.operatorsUrl);
  }

  fetchKnowledgeBaseByMaasId(id: string) {
    return this.http.get<KnowledgeBasesResponse>(this.url.KnowledgeBaseByMaas + id);
  }

  createApplication(body: Application) {
    return this.http.post<ResponseHeader>(this.url.createApplicationUrl, body)
  }

  updateApplication(body: Application) {
    return this.http.post<ResponseHeader>(this.url.updateApplication, body)
  }

}
