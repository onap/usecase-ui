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
import { Http } from '../../shared/utils/http';
@Injectable()
export class SlicingTaskServices {
    constructor(
        private http: HttpClient,
        private Http: Http
        ) { }
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
        //csmf
        csmfSlicingBusinessList:"/api/usecaseui-server/v1/uui-slicing/csmf/5gSlicing/orders/status/{status}/pageNo/{pageNo}/pageSize/{pageSize}",
        csmfActivate:"/api/usecaseui/csmf/5gSlicing/service/{serviceId}/activate",
        csmfDeactivate:"/api/usecaseui/csmf/5gSlicing/service/{serviceId}/deactivate",
        csmfTerminate:"/api/usecaseui/csmf/5gSlicing/service/{serviceId}",
        csmfGetProgress:"/api/usecaseui/csmf/5gSlicing/service/{serviceId}/progress",
        csmfPurchase:"/api/usecaseui-server/v1/uui-slicing/csmf/5gSlicing",
        //monitor 5G
        fetchTraffic: this.baseUrl + "/monitoring/queryTimestamp/{queryTimestamp}/trafficData",
        fetchOnlineusers: this.baseUrl + "/monitoring/queryTimestamp/{queryTimestamp}/onlineUsers",
        fetchBandwidth: this.baseUrl + "/monitoring/queryTimestamp/{queryTimestamp}/bandwidth",
        getConnectionLinkTable: this.baseUrl + "/connectionlinktable" // :todo
    }



    // Get slicing order task list
    getSlicingTaskList(pageNo: string, pageSize: string, failedCallback?:any) {
        const url = this.url.slicingTaskList
            .replace("{pageNo}", pageNo)
            .replace("{pageSize}", pageSize);
            return this.Http.httpAxios("get", url, null, failedCallback)
    }
    // Get list based on task processing status
    getTaskProcessingStatus(processingStatus: string, pageNo: string, pageSize: string, failedCallback?:any) {
        const url = this.url.taskProcessingStatus
            .replace('{processingStatus}', processingStatus)
            .replace("{pageNo}", pageNo)
            .replace("{pageSize}", pageSize);
            return this.Http.httpAxios("get", url, null, failedCallback)
    }
    // Get 
    getAuditInfo(taskId: string, failedCallback?:any) {
        const url = this.url.auditInfo.replace('{taskId}', taskId);
        return this.Http.httpAxios("get", url, null, failedCallback);
    }
    getSlicingInstance(pageNo: string, pageSize: string, failedCallback?:any) {
        const url = this.url.slicingInstance
            .replace("{pageNo}", pageNo)
            .replace("{pageSize}", pageSize);
        return this.Http.httpAxios("get", url, null, failedCallback);
    }
    getSlicingSubnetInstance(nsiId: string, failedCallback?:any) {
        const url = this.url.slicingSubnetInstance.replace('{nsiId}', nsiId);
        return this.Http.httpAxios("get", url,null,failedCallback);
    }
    getSubnetInContext(context: string, pageNo: string, pageSize: string, failedCallback?:any) {
        const url = this.url.subnetInContext
            .replace('{environmentContext}', context)
            .replace('{pageNo}', pageNo)
            .replace('{pageSize}', pageSize);
        return this.Http.httpAxios("get", url,null,failedCallback);
    }
    submitSlicing(reqbody, failedCallback?:any) {
        return this.Http.httpAxios("put", this.url.submitSlicing,reqbody, failedCallback);
    }
    getSlicingBasicInfo(taskId: string, failedCallback?:any) {
        const url = this.url.slicingBasicInfo.replace('{taskId}', taskId);
        return this.Http.httpAxios("get", url, null, failedCallback);
    }
    getSlicingCreateProgress(taskId: string, failedCallback?:any) {
        const url = this.url.slicingCreateProgress.replace('{taskId}', taskId);
        return this.Http.httpAxios("get", url, null ,failedCallback);
    }

    // Get slicing business list
    getSlicingBusinessList(paramsObj: any, isSelect: boolean, failedCallback?:any) {
        let url = this.url.slicingBusinessList.replace("{pageNo}", paramsObj.pageNo)
            .replace("{pageSize}", paramsObj.pageSize);
        if (isSelect) {
            url = this.url.slicingBusinesQueryOfStatus.replace("{businessStatus}", paramsObj.businessStatus).replace("{pageNo}", paramsObj.pageNo)
                .replace("{pageSize}", paramsObj.pageSize);
        }
        return this.Http.httpAxios("get", url, null ,failedCallback);
    }
    // change slicing business activate status
    changeActivateSlicingService(paramsObj: any, activate: boolean, failedCallback?:any) {
        let url = this.url.activateSlicingService.replace("{serviceId}", paramsObj.serviceId);
        if (!activate) {
            url = this.url.deactivateSlicingService.replace("{serviceId}", paramsObj.serviceId)
        }
        return this.Http.httpAxios("put", url, paramsObj, failedCallback);
    }
    // terminate slicing business
    terminateSlicingService(paramsObj: any, failedCallback?:any) {
        const url = this.url.terminateSlicingService.replace('{serviceId}', paramsObj.serviceId);
        return this.Http.httpAxios("delete", url, null ,failedCallback);
    }
    // query slicing business progress
    getSlicingBusinessProgress(paramsObj: any, failedCallback?:any) {
        let url = this.url.queryOperationProgress.replace("{serviceId}", paramsObj.serviceId);
        return this.Http.httpAxios("get", url, null, failedCallback);
    }
    //get slicingBusinessDetail
    getSlicingBusinessDetail(businessId: string) {
        let url = this.url.slicingBusinessDetail.replace("{businessId}", businessId);
        return this.Http.httpAxios("get", url);
    }
    // Get slicing nsi list
    getSlicingNsiList(paramsObj, isSelect: boolean, failedCallback?:any) {
        let url = this.url.slicingNsiList.replace("{pageNo}", paramsObj.pageNo)
            .replace("{pageSize}", paramsObj.pageSize);
        if (isSelect) {
            url = this.url.slicingNsiQueryOfStatus.replace("{instanceStatus}", paramsObj.instanceStatus).replace("{pageNo}", paramsObj.pageNo)
                .replace("{pageSize}", paramsObj.pageSize);
        }
        return this.Http.httpAxios("get", url, null, failedCallback);
    }
    //get slicingNsiDetail
    getSlicingNsiDetail(nsiId: string) {
        let url = this.url.slicingNsiDetail.replace("{nsiId}", nsiId);
        return this.Http.httpAxios("get", url);
    }
    // Get slicing nssi list
    getSlicingNssiList(paramsObj, isSelect: boolean, failedCallback?:any) {
        let url = this.url.slicingNssiList.replace("{pageNo}", paramsObj.pageNo)
            .replace("{pageSize}", paramsObj.pageSize);
        if (isSelect) {
            url = this.url.slicingNssiQueryOfStatus.replace("{instanceStatus}", paramsObj.instanceStatus).replace("{pageNo}", paramsObj.pageNo)
                .replace("{pageSize}", paramsObj.pageSize);
        }
        return this.Http.httpAxios("get", url, null, failedCallback);
    }
    //get slicingNssiDetail
    getSlicingNssiDetail(nssiId: string) {
        let url = this.url.slicingNssiDetail.replace("{nssiId}", nssiId);
        return this.Http.httpAxios("get", url);
    }
    // Get CSMF slicing business list
    getCSMFSlicingBusinessList(paramsObj: any, failedCallback?:any) {
        let url = this.url.csmfSlicingBusinessList.replace("{status}", paramsObj.status).replace("{pageNo}", paramsObj.pageNo)
            .replace("{pageSize}", paramsObj.pageSize);
            return this.Http.httpAxios("get", url, null, failedCallback);
    }
    // change CSMF slicing business activate status
    csmfChangeActivate(paramsObj, activate: boolean, failedCallback?:any) {
        let url = this.url.csmfActivate.replace("{serviceId}", paramsObj.serviceId);
        if (!activate) {
            url = this.url.csmfDeactivate.replace("{serviceId}", paramsObj.serviceId)
        }
        return this.Http.httpAxios("put", url, paramsObj, failedCallback);
    }
    // terminate CSMF slicing business
    // csmfTerminate(paramsObj) {
    //     const url = this.url.csmfTerminate.replace('{serviceId}', paramsObj.serviceId);
    //     return this.http.delete<any>(url);
    // }
    // // query CSMF slicing business progress
    // csmfSlicingProgress(paramsObj) {
    //     let url = this.url.csmfGetProgress.replace("{serviceId}", paramsObj.serviceId);
    //     return this.http.get<any>(url);
    // }
    csmfSlicingPurchase(paramsObj: any, failedCallback?:any){
        let url = this.url.csmfPurchase;
        return this.Http.httpAxios("post", url, paramsObj, failedCallback);
    }

    //monitor 5G
    getFetchTraffic(service_list, time, failedCallback?:any) {
        let url = this.url.fetchTraffic.replace("{queryTimestamp}", time);
        return this.Http.httpAxios("post", url, service_list, failedCallback);
    }
    getFetchOnlineusers(service_list, time, failedCallback?:any) {
        let url = this.url.fetchOnlineusers.replace("{queryTimestamp}", time);
        return this.Http.httpAxios("post", url, service_list, failedCallback);
    }
    getFetchBandwidth(service_list, time, failedCallback?:any) {
        let url = this.url.fetchBandwidth.replace("{queryTimestamp}", time);
        return this.Http.httpAxios("post", url, service_list, failedCallback);
    }
    getConnectionLinkTable( failedCallback?:any ) { // :todo
        let url = this.url.getConnectionLinkTable;
        return this.Http.httpAxios("get", url, null, failedCallback);
    }

}


