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
		$scope.chartShow = false;
        $scope.valuess = [];
        $scope.ndaShow = false;
        $scope.hdaShow = false;
        $scope.sourceId = "";
        $scope.today = function () {
            $scope.startTime = new Date();
            $scope.endTime = new Date();
            $http({
                method: "GET",
                url: global_url + "/alarm/sourceId",
                headers: {
                    'Access-Control-Allow-Origin': "*",
                    "Content-Type": "application/json"
                }
            }).then(function successCallback(resp) {
                $scope.sourceIds = resp.data;
            }, function errorCallback(resp) {

            });
        };
        $scope.today();

        $scope.options = {
            chart: {
                type: 'historicalBarChart',
                height: 300,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 65,
                    left: 50
                },
                x: function(d){return d[0];},
                y: function(d){return d[1];},
                showValues: true,
                valueFormat: function(d){
                    return d3.format(',.1f')(d);
                },
                duration: 100,
                xAxis: {
                    //axisLabel: 'X Axis',
                    tickFormat: function(d) {
                        return d3.time.format('%x %H:%M')(new Date(d))
                    },
                    rotateLabels: 30,
                    showMaxMin: true
                },
                yAxis: {
                    //axisLabel: 'Y Axis',
                    axisLabelDistance: -10,
                    tickFormat: function(d){
                        return d3.format(',.1f')(d);
                    }
                },
                tooltip: {
                    keyFormatter: function(d) {
                        return d3.time.format('%x %H:%M')(new Date(d));
                    }
                },
                zoom: {
                    enabled: true,
                    scaleExtent: [1, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: true,
                    unzoomEventType: 'dblclick.zoom'
                }
            }
        };


        $scope.data = [
            {
                "key" : "Quantity" ,
                "bar": true,
                "values" : []
            }];


        $scope.genDiagram = function () {
            $http({
                method: 'POST',
                url: global_url + "/alarm/diagram",
                data: {
                    "sourceId": $scope.sourceId,
                    "startTime": FormatDate($scope.startTime),
                    "endTime": FormatDate($scope.endTime),
                    "showMode" : ($scope.showModeId==undefined?"auto":$scope.showModeId)
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
                $scope.chartShow = true;
                if (resp.data.length > 0){
                    $scope.ndaShow = false;
                    $scope.hdaShow = true;
                    $scope.data = [
                        {
                            "key" : "Max" ,
                            "bar": true,
                            "values" : resp.data
                        }];
                    $scope.api.refresh();
                }
                else{
                    $scope.ndaShow = true;
                    $scope.hdaShow = false;
                    $scope.data = [
                        {
                            "key" : "Max" ,
                            "bar": true,
                            "values" : []
                        }];
                    $scope.api.refresh();
                }


            }, function errorCallback(resp) {

            });
        }

        $scope.startTimeChanged = function () {
            if ($scope.startTime > $scope.endTime)
                $scope.endTime = "";
        };
        $scope.endTimeChanged = function () {
            if ($scope.endTime < $scope.startTime)
                $scope.startTime = "";
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

        $scope.showModeIds = ["minute","hour","day","month","year"];

        function FormatDate(strTime) {
            var date = new Date(strTime);
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
        }

    }]);
