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

app.controller('alarmchartCtrl', ['$scope', '$http', '$routeParams', '$window',
    function ($scope, $http, $routeParams, $window) {
		$scope.goIsShow = false;
        $scope.chartShow = false;
        $scope.valuess = [];
        $scope.today = function () {
            $scope.startTime = new Date();
            $scope.endTime = new Date();
            $http({
                method: "GET",
                url: global_url + "/alarm/sourceId",
                headers: {
                    'Access-Control-Allow-Origin': "*",
                    "Content-Type": "application/json",
                    "Authorization": "Basic " + btoa("usecase" + ':' + "usecase")
                }
            }).then(function successCallback(resp) {
                //console.info(resp);
                $scope.sourceIds = resp.data;
            }, function errorCallback(resp) {

            });
        };
        $scope.today();

        $scope.genDiagram = function () {
            $http({
                method: 'POST',
                url: global_url + "/alarm/diagram",
                data: {
                    "sourceId": $scope.sourceId,
                    "startTime": FormatDate($scope.startTime),
                    "endTime": FormatDate($scope.endTime)
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                    return str.join("&");
                }
            }).then(function successCallback(resp) {
                console.info(resp);
                $scope.chartShow = true;
                if (resp.data.length > 0)
                    for (var i = 0; i < resp.data.length; i++) {
                        $scope.valuess[i] = {};
                        $scope.valuess[i].x = resp.data[i].Time;
                        $scope.valuess[i].y = resp.data[i].Count;
                    }
                else
                    $scope.valuess = [];
                for (var d = 0; d < 5; d++) {
                    window.setTimeout(function () {
                        redraw("_alarm", $scope.valuess);
                    }, 1500);
                };

            }, function errorCallback(resp) {

            });
        }
		$scope.sourceIdChanged = function(){
			if ($scope.sourceId != null)
				$scope.goIsShow = true;
			else
				$scope.goIsShow = false;	
		};

        $scope.startTimeChanged = function () {
            if ($scope.startTime > $scope.endTime)
                $scope.endTime = "";
           // console.info($scope.startTime);
        };
        $scope.endTimeChanged = function () {
            if ($scope.endTime < $scope.startTime)
                $scope.startTime = "";
           // console.info($scope.endTime);
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

        function FormatDate(strTime) {
            var date = new Date(strTime);
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
        }

    }]);
