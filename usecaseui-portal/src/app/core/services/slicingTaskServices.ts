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
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SlicingTaskServices {
    constructor(private http: HttpClient) { }
    baseUrl: string = '/api/uui-slicing/nsmf';
    url = {
        slicingTaskList: this.baseUrl + "/task/business/pageNo/{pageNo}/pageSize/{pageSize}",
        taskProcessingStatus: this.baseUrl + '/task/{processingStatus}/business/pageNo/{pageNo}/pageSize/{pageSize}',
        auditInfo: this.baseUrl + '/task/{taskId}/auditInfo'
    }


    
    // Get slicing order task list
    getSlicingTaskList (pageNo: string, pageSize: string) {
        const url = this.url.slicingTaskList
                        .replace("{pageNo}", pageNo)
                        .replace("{pageSize}", pageSize);
        return this.http.get<any>(url);
    }
    // Get list based on task processing status
    getTaskProcessingStatus (processingStatus: string, pageNo: string, pageSize: string) {
        const url = this.url.taskProcessingStatus
                        .replace('{processingStatus}', processingStatus)
                        .replace("{pageNo}", pageNo)
                        .replace("{pageSize}", pageSize);
        return this.http.get<any>(url);
    }
    // Get 
    getAuditInfo (taskId: string){
        const url = this.url.auditInfo.replace('{taskId}', taskId);
        return this.http.get<any>(url);
    }
}


