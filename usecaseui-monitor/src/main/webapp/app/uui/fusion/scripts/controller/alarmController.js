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
var alarmDetailId = "";

app.controller('alarmGridCtrl', ['$scope', '$log', '$http', '$timeout', '$interval', '$window',
    function ($scope, $log, $http, $timeout, $interval, $window) {
        $scope.jump = function (value) {
            alarmDetailId = value;
            var obj = $("#lm");
            angular.element(obj).scope().currentTab = "app/uui/fusion/scripts/view-models/alarm-details.html";
        };
        $scope.toChart = function () {
            var obj = $("#lm");
            angular.element(obj).scope().currentTab = "app/uui/fusion/scripts/view-models/alarm-chart.html";
        };

        $scope.itemsByPagea = 10;

        $http({
            url: global_url + "/alarm/statusCount",
            method: "GET"
        }).then(function successCallback(resp) {
            $scope.open[0].count = resp.data[1];
            $scope.open[1].count = resp.data[2];
            $scope.open[2].count = resp.data[0];

        });

        // li的数据
        $scope.open = [{
                id: 'active',
                name: 'Active',
                count: 0
            },
            {
                id: 'close',
                name: 'Closed',
                count: 0
            },
            {
                id: undefined,
                name: 'All',
                count: 0
            }
        ];

        $scope.menuState = {
            show: false
        };

        $scope.toggleMenu = function () {
            $scope.menuState.show = !$scope.menuState.show;
        };

        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

    }
]);
app.controller('pipeAlarmCtrl', ['$scope', 'ResourceAlarm', '$interval', function ($scope, service, $interval) {
    $scope.condition1 = "";
    $scope.condition2 = "";
    $scope.condition3 = "";
    $scope.condition4 = "";
    $scope.condition5 = "";
    $scope.vfstatus = "null";

    $scope.selectOpen = function (v, func) {
        $scope.vfstatus = typeof (v) == "undefined" ? "null" : v;
        $scope.tableState.pagination.start = 0;
        $scope.selectedOpen = v;
        func($scope.tableState);
    };


    $scope.activeOpen = function (open_id) {
        return open_id == $scope.selectedOpen;
    };

    var ctrl = this;

    ctrl.displayed = [];

    ctrl.callServer = function callServer(tableState) {
        ctrl.isLoading = true;
        $scope.tableState = tableState;
        var pagination = tableState.pagination;
        // console.log(pagination);

        var start = pagination.start / pagination.number + 1 || 0;
        var number = pagination.number || 10;

        service.getPage(start, number, $scope.condition1 === "" ? "" : $scope.condition1,
            $scope.condition2 === "" ? "" : $scope.condition2, $scope.condition3 === "" ? "" : $scope.condition3,
            $scope.condition4 === "" ? "" : $scope.condition4, $scope.condition5 === "" ? "" : $scope.condition5,
            $scope.vfstatus).then(function (result) {
                // console.log(result)
            ctrl.displayed = result.data;
            tableState.pagination.numberOfPages = result.numberOfPages;
            ctrl.isLoading = false;
        });

        // var timer = $interval(function () {
        //     ctrl.callServer($scope.tableState);
        // }, 5000)

        // console.log($scope)
    };

}]).factory('ResourceAlarm', ['$q', '$filter', '$timeout', '$http', function ($q, $filter, $timeout, $http) {
    var randomsItems = [];
    var totalCount = 0;

    function getPage(start, number) {
        var url = global_url + '/alarm/' + start + '/' + number + '';
        url += arguments[2] === "" ? "/null" : "/" + arguments[2];
        url += arguments[3] === "" ? "/null" : "/" + arguments[3];
        url += arguments[4] === "" ? "/null" : "/" + arguments[4];
        url += arguments[5] === "" ? "/null" : "/" + FormatDate(arguments[5]);
        url += arguments[6] === "" ? "/null" : "/" + FormatDate(arguments[6]);
        url += arguments[7] === "" ? "/null" : "/" + arguments[7];
        $http({
            url: url,
            method: "GET"
        }).then(function SuccessCallback(resp) {
            if (resp.data.alarms.length > 0) {
                randomsItems = resp.data.alarms;
                totalCount = resp.data.totalRecords;
            } else {
                randomsItems = [];
                totalCount = 0;
            }
        });

        var deferred = $q.defer();

        $timeout(function () {
            deferred.resolve({
                data: randomsItems,
                numberOfPages: Math.ceil(totalCount / number)
            });
        }, 1500);

        return deferred.promise;
    }

    function FormatDate(strTime) {
        var date = new Date(strTime);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
    };

    return {
        getPage: getPage
    };
}]).filter('dateformater',function(){
    return function(vmstime){
        if(!vmstime){
            return ''
        }
        let mstime = Number((vmstime + '').slice(0,13));  
        let time = new Date(mstime);
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        let hours = time.getHours();
        let minutes = time.getMinutes();
        let seconds = time.getSeconds();
        let formattime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        return formattime;
    }
});