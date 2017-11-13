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

app.controller('pertabCtrl', ['$scope', '$http', '$routeParams', '$window' ,
    function ($scope, $http, $routeParams, $window) {
        $scope.sourceIds = ["112","119","101"];
        $scope.namePs = [];
        $scope.valuess = [];
        $scope.namesPIsShow = false;
        $scope.namesCIsShow = false;
        $scope.goIsShow = false;
        $scope.today = function() {
            $scope.startTime = new Date();
            $scope.endTime = new Date();
            $http({
                method : "GET",
                url : global_url+"/performance/resourceIds",
                headers: {
                    'Access-Control-Allow-Origin': "*",
                    "Content-Type": "application/json",
                    "Authorization": "Basic " + btoa("usecase" + ':' + "usecase")
                }
            }).then(function successCallback(resp) {
                $scope.sourceIds = resp.data;
            },function errorCallback(reps) {
                
            });
        };
        $scope.today();


        $scope.startTimeChanged = function () {
            if ($scope.startTime > $scope.endTime)
                $scope.endTime = "";
        };
        $scope.endTimeChanged = function () {
            if ($scope.endTime < $scope.startTime)
                $scope.startTime = "";
        };

        $scope.sourceIdChanged = function () {
            if ($scope.sourceId != null){
                $scope.namesPIsShow = true;
                $http({
                    method : "POST",
                    url : global_url + "/performance/names",
                    data : { "sourceId":$scope.sourceId },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj) {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        }
                        return str.join("&");
                    }

                }).then(function successCallback(resp) {
                    $scope.namePs = resp.data;
                },function errorCallback(resq) {

                });
            }
            else{
                $scope.goIsShow = false;
                $scope.namesPIsShow = false;
                $scope.namesCIsShow = false;
            }

        };

        $scope.namePChanged = function () {
            if ($scope.nameP != null){
                $http({
                    method : "POST",
                    url : global_url + "/performance/names",
                    data : { "sourceId":$scope.nameP },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj) {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        }
                        return str.join("&");
                    }
                }).then(function successCallback(resp) {
                    if (resp.data.length <= 0){
                        $scope.namesCIsShow = false;
                        $scope.goIsShow = true;
                    }else{
                        $scope.namesCIsShow = true;
                        $scope.goIsShow = false;
                        $scope.nameCs = resp.data;
                    }
                },function errorCallback(resq) {

                });
            }
            else{
                $scope.goIsShow = false;
                $scope.namesCIsShow = false;
            }
        };

        $scope.nameCChanged = function () {
          if ($scope.nameC != null){
              $scope.goIsShow = true;
          }
        };

        $scope.genDiagram = function () {
            $http({
                method : 'POST',
                url : global_url + "/performance/diagram",
                data : { "sourceId":$scope.sourceId,"startTime":FormatDate($scope.startTime),"endTime":FormatDate($scope.endTime),"nameParent":$scope.nameP,"nameChild":$scope.nameC!=null?$scope.nameC:"" },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                    return str.join("&");
                }
            }).then(function successCallback(resp) {
                console.info(resp.data);
                if (resp.data.length > 0)
                    for (var i = 0 ; i<resp.data.length ; i++){
                        $scope.valuess[i] = {};
                        $scope.valuess[i].x = i+1;
                        $scope.valuess[i].y = resp.data[i];
                        $scope.valuess[i].x.length = i;
                    }
                for (var d = 0; d < 5; d++) {
                    window.setTimeout(function () {
                        redraw("_performance", $scope.valuess);
                    }, 1500);
                };
            },function errorCallback(resp) {

            });
        }

        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        function FormatDate (strTime) {
            var date = new Date(strTime);
            return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes();
        }
}]);
