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
app.controller("alarmDetailsController",function ($scope,$http,$window) {
    $scope.back = function () {
        var obj = $("#lm");
        angular.element(obj).scope().currentTab = "app/uui/fusion/scripts/view-models/alarm.html";
    };
    $http({
        method : "GET",
        // url : global_url + "/alarm/1/1/"+alarmDetailId+"/null/null/null/null/null"
        url : global_url + "/alarm/getAlarmsHeaderDetail/"+alarmDetailId
    }).then(function successCallback(resp) {
        if (resp.data){
            $scope.alarmCondition = resp.data.alarmsHeader.alarmCondition;
            $scope.alarmInterfaceA = resp.data.alarmsHeader.alarmInterfaceA;
            $scope.eventCategory = resp.data.alarmsHeader.eventCategory;
            $scope.eventId = resp.data.alarmsHeader.eventId;
            $scope.eventName = resp.data.alarmsHeader.eventName;
            $scope.eventServrity = resp.data.alarmsHeader.eventServrity;
            $scope.eventSourceType = resp.data.alarmsHeader.eventSourceType;
            $scope.eventType = resp.data.alarmsHeader.eventType;
            $scope.faultFieldsVersion = resp.data.alarmsHeader.faultFieldsVersion;
            $scope.lastEpochMicroSec = resp.data.alarmsHeader.lastEpochMicroSec;
            $scope.nfNamingCode = resp.data.alarmsHeader.nfNamingCode;
            $scope.nfcNamingCode = resp.data.alarmsHeader.nfcNamingCode;
            $scope.priority = resp.data.alarmsHeader.priority;
            $scope.reportingEntityId = resp.data.alarmsHeader.reportingEntityId;
            $scope.reportingEntityName = resp.data.alarmsHeader.reportingEntityName;
            $scope.sequence = resp.data.alarmsHeader.sequence;
            $scope.sourceId = resp.data.alarmsHeader.sourceId;
            $scope.sourceName = resp.data.alarmsHeader.sourceName;
            $scope.specificProblem = resp.data.alarmsHeader.specificProblem;
            $scope.startEpochMicrosec = resp.data.alarmsHeader.startEpochMicrosec;
            $scope.startTIme = resp.data.alarmsHeader.createTime;
            $scope.alarmInformation = resp.data.list;
        }else {
            alert("No Data!");
        }
    },function errorCallback(resq) {

    });
});