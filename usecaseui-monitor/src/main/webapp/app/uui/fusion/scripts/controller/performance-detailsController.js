/*
 Copyright (C) 2017 CMCC, Inc. and others. All rights reserved.

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
app.controller("performanceDetailsController",function ($scope,$http,$window) {
    $scope.back = function () {
        var obj = $("#lm");
        angular.element(obj).scope().currentTab = "app/uui/fusion/scripts/view-models/performance.html";
    };
    console.log(permanceId);
    $http({
        method : "GET",
        // url : global_url + "/performance/1/1/"+permanceId+"/null/null/null/null"
        url : global_url + "/performance/getPerformanceHeaderDetail/"+permanceId
    }).then(function successCallback(resp) {
        console.log(resp.data);
       if (resp.data){
           $scope.eventName = resp.data.performanceHeader.eventName;
           $scope.eventId = resp.data.performanceHeader.eventId;
           $scope.sourceId = resp.data.performanceHeader.sourceId;
           $scope.sourceName = resp.data.performanceHeader.sourceName;
           $scope.reportingEntityId = resp.data.performanceHeader.reportingEntityId;
           $scope.reportingEntityName = resp.data.performanceHeader.reportingEntityName;
           $scope.priority = resp.data.performanceHeader.priority;
           $scope.createTime = resp.data.performanceHeader.createTime;
           $scope.nfcNamingCode = resp.data.performanceHeader.nfcNamingCode;
           $scope.nfNamingCode = resp.data.performanceHeader.nfNamingCode;
           $scope.performanceInformation = resp.data.list;
       }else {
           alert("No Data");
       }
    },function errorCallback(resq) {

    });
});