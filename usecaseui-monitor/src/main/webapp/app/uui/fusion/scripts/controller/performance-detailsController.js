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
    $http({
        method : "GET",
        url : global_url + "/performance/1/1/"+permanceId+"/null/null/null/null"
    }).then(function successCallback(resp) {
        $scope.eventName = resp.data.performances[0].performanceHeader.eventName;
        $scope.eventId = resp.data.performances[0].performanceHeader.eventId;
        $scope.sourceId = resp.data.performances[0].performanceHeader.sourceId;
        $scope.sourceName = resp.data.performances[0].performanceHeader.sourceName;
        $scope.reportingEntityId = resp.data.performances[0].performanceHeader.reportingEntityId;
        $scope.reportingEntityName = resp.data.performances[0].performanceHeader.reportingEntityName;
        $scope.priority = resp.data.performances[0].performanceHeader.priority;
        $scope.createTime = resp.data.performances[0].performanceHeader.createTime;
        $scope.nfcNamingCode = resp.data.performances[0].performanceHeader.nfcNamingCode;
        $scope.nfNamingCode = resp.data.performances[0].performanceHeader.nfNamingCode;
        $scope.performanceInformation = resp.data.performances[0].performanceInformation;
    },function errorCallback(resq) {

    });
});