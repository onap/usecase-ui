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
        url : global_url + "/alarm/1/1/null/"+alarmDetailId+"/null/null/null/null"
    }).then(function successCallback(resp) {
        $scope.alarmCondition = resp.data.alarms[0].alarmsHeader.alarmCondition;
        $scope.alarmInterfaceA = resp.data.alarms[0].alarmsHeader.alarmInterfaceA;
        $scope.eventCategory = resp.data.alarms[0].alarmsHeader.eventCategory;
        $scope.eventId = resp.data.alarms[0].alarmsHeader.eventId;
        $scope.eventName = resp.data.alarms[0].alarmsHeader.eventName;
        $scope.eventServrity = resp.data.alarms[0].alarmsHeader.eventServrity;
        $scope.eventSourceType = resp.data.alarms[0].alarmsHeader.eventSourceType;
        $scope.eventType = resp.data.alarms[0].alarmsHeader.eventType;
        $scope.faultFieldsVersion = resp.data.alarms[0].alarmsHeader.faultFieldsVersion;
        $scope.lastEpochMicroSec = resp.data.alarms[0].alarmsHeader.lastEpochMicroSec;
        $scope.nfNamingCode = resp.data.alarms[0].alarmsHeader.nfNamingCode;
        $scope.nfcNamingCode = resp.data.alarms[0].alarmsHeader.nfcNamingCode;
        $scope.priority = resp.data.alarms[0].alarmsHeader.priority;
        $scope.reportingEntityId = resp.data.alarms[0].alarmsHeader.reportingEntityId;
        $scope.reportingEntityName = resp.data.alarms[0].alarmsHeader.reportingEntityName;
        $scope.sequence = resp.data.alarms[0].alarmsHeader.sequence;
        $scope.sourceId = resp.data.alarms[0].alarmsHeader.sourceId;
        $scope.sourceName = resp.data.alarms[0].alarmsHeader.sourceName;
        $scope.specificProblem = resp.data.alarms[0].alarmsHeader.specificProblem;
        $scope.startEpochMicrosec = resp.data.alarms[0].alarmsHeader.startEpochMicrosec;
        $scope.startTIme = resp.data.alarms[0].alarmsHeader.createTime;
        $scope.alarmInformation = resp.data.alarms[0].alarmsInformation;
    },function errorCallback(resq) {

    });
});