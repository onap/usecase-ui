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
        auditInfo: this.baseUrl + '/task/{taskId}/auditInfo',
        slicingInstance: this.baseUrl + '/resource/nsi/instances/pageNo/{pageNo}/pageSize/{pageSize}',
        slicingSubnetInstance: this.baseUrl + '/resource/nsi/{nsiId}/nssiInstances',
        subnetInContext: this.baseUrl + '/resource/nssi/{environmentContext}/instances/pageNo/{pageNo}/pageSize/{pageSize}',
        //slicing-business-management
        slicingBusinessList:this.baseUrl+"/resource/business/pageNo/{pageNo}/pageSize/{pageSize}",
        slicingBusinesQueryOfStatus:this.baseUrl+"/resource/{businessStatus}/business/pageNo/{pageNo}/pageSize/{pageSize}",
        activateSlicingService:this.baseUrl+"/resource/{serviceId}/activate",
        deactivateSlicingService:this.baseUrl+"/resource/{serviceId}/deactivate",
        terminateSlicingService:this.baseUrl+"/resource/{serviceId}",
        queryOperationProgress:this.baseUrl+"resource/{serviceId}/progress",
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
    getSlicingInstance (pageNo: string, pageSize: string){
        const url = this.url.slicingInstance
                        .replace("{pageNo}", pageNo)
                        .replace("{pageSize}", pageSize);
        return this.http.get<any>(url);
    }
    getSlicingSubnetInstance(nsiId: string){
        const url = this.url.slicingSubnetInstance.replace('{nsiId}', nsiId);
        return this.http.get<any>(url);
    }
    getSubnetInContext (context: string, pageNo: string, pageSize: string) {
        const url = this.url.subnetInContext
                        .replace('{environmentContext}', context)
                        .replace('{pageNo', pageNo)
                        .replace('{pageSize}', pageSize);
        return this.http.get<any>(url);
    }

    // Get slicing business list
    getSlicingBusinessList (paramsObj,isSelect: boolean) {
        let url = this.url.slicingBusinessList .replace("{pageNo}", paramsObj.pageNo)
            .replace("{pageSize}", paramsObj.pageSize);
        if(isSelect){
            url = this.url.slicingBusinesQueryOfStatus.replace("{businessStatus}", paramsObj.businessStatus).replace("{pageNo}", paramsObj.pageNo)
                .replace("{pageSize}", paramsObj.pageSize);
        }
        let params = new HttpParams({ fromObject: paramsObj });
        return this.http.get<any>(url,{params});
    }
    changeActivateSlicingService(paramsObj, activate: boolean){
        let url = this.url.activateSlicingService.replace("{serviceId}", paramsObj.serviceId);
        if(activate){
            url = this.url.deactivateSlicingService.replace("{serviceId}", paramsObj.serviceId)
        }
        return this.http.put<any>(url,paramsObj);
    }
    terminateSlicingService(paramsObj){
        const url = this.url.terminateSlicingService.replace('{serviceId}', paramsObj.serviceId);
        return this.http.delete<any>(url);
    }
    getSlicingBusinessProgress(paramsObj) {
        let params = new HttpParams({ fromObject: paramsObj });
        let url = this.url.queryOperationProgress.replace("{serviceId}", paramsObj.serviceId);
        return this.http.get<any>(url,{params});
    }
}


