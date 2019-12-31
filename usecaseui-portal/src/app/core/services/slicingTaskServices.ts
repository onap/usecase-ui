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
    baseUrl: string = '/api/usecaseui-server/v1/uui-slicing/nsmf';
    url = {
        slicingTaskList: this.baseUrl + "/task/business/pageNo/{pageNo}/pageSize/{pageSize}",
        taskProcessingStatus: this.baseUrl + '/task/{processingStatus}/business/pageNo/{pageNo}/pageSize/{pageSize}',
        auditInfo: this.baseUrl + '/task/{taskId}/auditInfo',
        slicingInstance: this.baseUrl + '/resource/nsi/instances/pageNo/{pageNo}/pageSize/{pageSize}',
        slicingSubnetInstance: this.baseUrl + '/resource/nsi/{nsiId}/nssiInstances',
        subnetInContext: this.baseUrl + '/resource/nssi/environmentContext/{environmentContext}/instances/pageNo/{pageNo}/pageSize/{pageSize}',
        submitSlicing: this.baseUrl + '/task/auditInfo',
        slicingBasicInfo: this.baseUrl + '/task/{taskId}/taskCreationInfo',
        slicingCreateProgress: this.baseUrl + '/task/{taskId}/taskCreationProgress',
        //slicing-business-management
        slicingBusinessList: this.baseUrl + "/resource/business/pageNo/{pageNo}/pageSize/{pageSize}",
        slicingBusinesQueryOfStatus: this.baseUrl + "/resource/{businessStatus}/business/pageNo/{pageNo}/pageSize/{pageSize}",
        activateSlicingService: this.baseUrl + "/resource/{serviceId}/activate",
        deactivateSlicingService: this.baseUrl + "/resource/{serviceId}/deactivate",
        terminateSlicingService: this.baseUrl + "/resource/{serviceId}",
        queryOperationProgress: this.baseUrl + "/resource/{serviceId}/progress",
        slicingBusinessDetail: this.baseUrl + "/resource/business/{businessId}/details",
        //slicing-nsi-management
        slicingNsiList: this.baseUrl + "/resource/nsi/instances/pageNo/{pageNo}/pageSize/{pageSize}",
        slicingNsiQueryOfStatus: this.baseUrl + "/resource/nsi/{instanceStatus}/instances/pageNo/{pageNo}/pageSize/{pageSize}",
        slicingNsiDetail: this.baseUrl + "/resource/nsi/{nsiId}/details",
        //slicing-nssi-management
        slicingNssiList: this.baseUrl + "/resource/nssi/instances/pageNo/{pageNo}/pageSize/{pageSize}",
        slicingNssiQueryOfStatus: this.baseUrl + "/resource/nssi/instanceStatus/{instanceStatus}/instances/pageNo/{pageNo}/pageSize/{pageSize}",
        slicingNssiDetail: this.baseUrl + "/resource/nssi/{nssiId}/details",
        //monitor 5G
        fetchTraffic: this.baseUrl + "/monitoring/queryTimestamp/{queryTimestamp}/trafficData",
        fetchOnlineusers: this.baseUrl + "/monitoring/queryTimestamp/{queryTimestamp}/onlineUsers",
        fetchBandwidth: this.baseUrl + "/monitoring/queryTimestamp/{queryTimestamp}/bandwidth"
    }



    // Get slicing order task list
    getSlicingTaskList(pageNo: string, pageSize: string) {
        const url = this.url.slicingTaskList
            .replace("{pageNo}", pageNo)
            .replace("{pageSize}", pageSize);
        return this.http.get<any>(url);
    }
    // Get list based on task processing status
    getTaskProcessingStatus(processingStatus: string, pageNo: string, pageSize: string) {
        const url = this.url.taskProcessingStatus
            .replace('{processingStatus}', processingStatus)
            .replace("{pageNo}", pageNo)
            .replace("{pageSize}", pageSize);
        return this.http.get<any>(url);
    }
    // Get 
    getAuditInfo(taskId: string) {
        const url = this.url.auditInfo.replace('{taskId}', taskId);
        return this.http.get<any>(url);
    }
    getSlicingInstance(pageNo: string, pageSize: string) {
        const url = this.url.slicingInstance
            .replace("{pageNo}", pageNo)
            .replace("{pageSize}", pageSize);
        return this.http.get<any>(url);
    }
    getSlicingSubnetInstance(nsiId: string) {
        const url = this.url.slicingSubnetInstance.replace('{nsiId}', nsiId);
        return this.http.get<any>(url);
    }
    getSubnetInContext(context: string, pageNo: string, pageSize: string) {
        const url = this.url.subnetInContext
            .replace('{environmentContext}', context)
            .replace('{pageNo}', pageNo)
            .replace('{pageSize}', pageSize);
        return this.http.get<any>(url);
    }
    submitSlicing(reqbody) {
        return this.http.put<any>(this.url.submitSlicing, reqbody)
    }
    getSlicingBasicInfo(taskId: string) {
        const url = this.url.slicingBasicInfo.replace('{taskId}', taskId);
        return this.http.get<any>(url);
    }
    getSlicingCreateProgress(taskId: string) {
        const url = this.url.slicingCreateProgress.replace('{taskId}', taskId);
        return this.http.get<any>(url);
    }

    // Get slicing business list
    getSlicingBusinessList(paramsObj, isSelect: boolean) {
        let url = this.url.slicingBusinessList.replace("{pageNo}", paramsObj.pageNo)
            .replace("{pageSize}", paramsObj.pageSize);
        if (isSelect) {
            url = this.url.slicingBusinesQueryOfStatus.replace("{businessStatus}", paramsObj.businessStatus).replace("{pageNo}", paramsObj.pageNo)
                .replace("{pageSize}", paramsObj.pageSize);
        }
        return this.http.get<any>(url);
    }
    // change slicing business activate status
    changeActivateSlicingService(paramsObj, activate: boolean) {
        let url = this.url.activateSlicingService.replace("{serviceId}", paramsObj.serviceId);
        if (!activate) {
            url = this.url.deactivateSlicingService.replace("{serviceId}", paramsObj.serviceId)
        }
        return this.http.put<any>(url, paramsObj);
    }
    // terminate slicing business
    terminateSlicingService(paramsObj) {
        const url = this.url.terminateSlicingService.replace('{serviceId}', paramsObj.serviceId);
        return this.http.delete<any>(url);
    }
    // query slicing business progress
    getSlicingBusinessProgress(paramsObj) {
        let url = this.url.queryOperationProgress.replace("{serviceId}", paramsObj.serviceId);
        return this.http.get<any>(url);
    }
    //get slicingBusinessDetail
    getSlicingBusinessDetail(businessId: string) {
        let url = this.url.slicingBusinessDetail.replace("{businessId}", businessId);
        return this.http.get<any>(url);
    }
    // Get slicing nsi list
    getSlicingNsiList(paramsObj, isSelect: boolean) {
        let url = this.url.slicingNsiList.replace("{pageNo}", paramsObj.pageNo)
            .replace("{pageSize}", paramsObj.pageSize);
        if (isSelect) {
            url = this.url.slicingNsiQueryOfStatus.replace("{instanceStatus}", paramsObj.instanceStatus).replace("{pageNo}", paramsObj.pageNo)
                .replace("{pageSize}", paramsObj.pageSize);
        }
        return this.http.get<any>(url);
    }
    //get slicingNsiDetail
    getSlicingNsiDetail(nsiId: string) {
        let url = this.url.slicingNsiDetail.replace("{nsiId}", nsiId);
        return this.http.get<any>(url);
    }
    // Get slicing nssi list
    getSlicingNssiList(paramsObj, isSelect: boolean) {
        let url = this.url.slicingNssiList.replace("{pageNo}", paramsObj.pageNo)
            .replace("{pageSize}", paramsObj.pageSize);
        if (isSelect) {
            url = this.url.slicingNssiQueryOfStatus.replace("{instanceStatus}", paramsObj.instanceStatus).replace("{pageNo}", paramsObj.pageNo)
                .replace("{pageSize}", paramsObj.pageSize);
        }
        return this.http.get<any>(url);
    }
    //get slicingNssiDetail
    getSlicingNssiDetail(nssiId: string) {
        let url = this.url.slicingNssiDetail.replace("{nssiId}", nssiId);
        return this.http.get<any>(url);
    }
    //monitor 5G
    getFetchTraffic(service_list, time) {
        let url = this.url.fetchTraffic.replace("{queryTimestamp}", time);
        return this.http.post<any>(url, service_list);
    }
    getFetchOnlineusers(service_list, time) {
        let url = this.url.fetchOnlineusers.replace("{queryTimestamp}", time);
        return this.http.post<any>(url, service_list);
    }
    getFetchBandwidth(service_list, time) {
        let url = this.url.fetchBandwidth.replace("{queryTimestamp}", time);
        return this.http.post<any>(url, service_list);
    }

}


