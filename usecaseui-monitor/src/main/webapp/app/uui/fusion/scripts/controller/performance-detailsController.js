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
app.controller('pertabCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.tabes = [
        {title: 'one hour'},
        {title: 'one day'},
        {title: 'one month'},
        {title: 'one year'}
    ];
    $scope.barChart = function (unit) {
        $http.get(global_url + '/performance/diagram/' + unit + '/' + permanceId, {
            headers: {
                'Access-Control-Allow-Origin': "*",
                "Content-Type": "application/json"
            }
        })
            .success(function (data) {
                if (unit === "hour") {
                    $scope.valuess = [];
                    for(var i=0;i<4;i++){
                        $scope.valuess[i] = [
                            {"x": '15min', "y": 4}, {"x": '30min', "y": 4}, {"x": '45min', "y": 12},
                            {"x": '60min', "y": 3.27}
                        ];
                    };
                    var v = 0;
                    var i = 0;
                    angular.forEach(data, function (obj) {
                        for (var j = 0; j < obj.length; j++, i++) {
                            if (i >= 4) {
                                v++;
                                i = 0;
                            }
                            $scope.valuess[v][i].y = obj[j];
                        }
                    });
                    console.info($scope.valuess);
                    for (var i = 0; i < 5; i++) {
                        window.setTimeout(function () {
                            redraw("", $scope.valuess);
                        }, 1500);
                    };
                }
                if (unit === "day") {
                    $scope.valuess = [];
                    for(var i=0;i<4;i++){
                        $scope.valuess[i] = [
                            { "x":'1h' , "y":4}, { "x":'2h' , "y":4}, { "x":'3h' , "y":12},
                            { "x":'4h' , "y":3.27}, { "x":'5h' , "y":34}, { "x":'6h' , "y":34}, { "x":'7h' , "y":34},
                            { "x":'8h' , "y":34}, { "x":'9h' , "y":34}, { "x":'10h' , "y":34}, { "x":'11h' , "y":34},
                            { "x":'12h' , "y":56}, { "x":'13h' , "y":34}, { "x":'14h' , "y":34}, { "x":'15h' , "y":34},
                            { "x":'16h' , "y":12}, { "x":'17h' , "y":34}, { "x":'18h' , "y":50}, { "x":'19h' , "y":34},
                            { "x":'20h' , "y":34}, { "x":'21h' , "y":54}, { "x":'22h' , "y":34}, { "x":'23h' , "y":34},
                            { "x":'24h' , "y":36}
                        ];
                    };
                    var v = 0;
                    var i = 0;
                    angular.forEach(data, function (obj) {
                        for (var j = 0; j < obj.length; j++, i++) {
                            if (i >= 24) {
                                v++;
                                i = 0;
                            }
                            $scope.valuess[v][i].y = obj[j];
                        }
                    });
                    console.info($scope.valuess);
                    for (var i = 0; i < 5; i++) {
                        window.setTimeout(function () {
                            redraw("1", $scope.valuess);
                        }, 1500);
                    };
                }
                if (unit === "month") {
                    $scope.valuess = [];
                    for(var i=0;i<4;i++){
                        $scope.valuess[i] =  [
                            { "x":'1d' , "y":4}, { "x":'2d' , "y":4}, { "x":'3d' , "y":12},
                            { "x":'4d' , "y":3.27}, { "x":'5d' , "y":34},{ "x":'6d' , "y":4}, { "x":'7d' , "y":4}, { "x":'8d' , "y":12},
                            { "x":'9d' , "y":3.27}, { "x":'10d' , "y":34}, { "x":'11d' , "y":34}, { "x":'12d' , "y":34},  { "x":'13d' , "y":4}, { "x":'14d' , "y":4}, { "x":'15' , "y":12},
                            { "x":'16d' , "y":3.27}, { "x":'17d' , "y":34},{ "x":'18d' , "y":4}, { "x":'19d' , "y":4}, { "x":'20d' , "y":12},
                            { "x":'21d' , "y":3.27}, { "x":'22d' , "y":34}, { "x":'23d' , "y":34}, { "x":'24d' , "y":34}, { "x":'25d' , "y":4}, { "x":'26d' , "y":12},
                            { "x":'27d' , "y":3.27}, { "x":'28d' , "y":34}, { "x":'29d' , "y":34}, { "x":'30d' , "y":34}, { "x":'31d' , "y":34}
                        ];
                    };
                    var v = 0;
                    var i = 0;
                    angular.forEach(data, function (obj) {
                        for (var j = 0; j < obj.length; j++, i++) {
                            if (i >= 31) {
                                v++;
                                i = 0;
                            }
                            $scope.valuess[v][i].y = obj[j];
                        }
                    });
                    console.info($scope.valuess);
                    for (var i = 0; i < 5; i++) {
                        window.setTimeout(function () {
                            redraw("2", $scope.valuess);
                        }, 1500);
                    };
                }
                if (unit === "year") {
                    $scope.valuess = [];
                    for(var i=0;i<12;i++){
                        $scope.valuess[i] = [
                            {"x": 'Jan', "y": 4}, {"x": 'Feb', "y": 4}, {"x": 'Mar', "y": 12},
                            {"x": 'Apr', "y": 3.27},  {"x": 'May', "y": 4}, {"x": 'June', "y": 4}, {"x": 'July', "y": 12},
                            {"x": 'Aug', "y": 3.27},  {"x": 'Sept', "y": 4}, {"x": 'Oct', "y": 4}, {"x": 'Nov', "y": 12},
                            {"x": 'Jan', "y": 3.27}
                        ];
                    };
                    var v = 0;
                    var i = 0;
                    angular.forEach(data, function (obj) {
                        for (var j = 0; j < obj.length; j++, i++) {
                            if (i >= 12) {
                                v++;
                                i = 0;
                            }
                            $scope.valuess[v][i].y = obj[j];
                        }
                    });
                    console.info($scope.valuess);
                    for (var i = 0; i < 5; i++) {
                        window.setTimeout(function () {
                            redraw("3", $scope.valuess);
                        }, 1500);
                    };
                }
            });
    };
    $scope.oneHour = function () {
        changerotate(0);
        $scope.barChart('hour');

    };
    $scope.oneHour();
    $scope.oneDay = function () {
        changerotate(90);
        $scope.barChart('day');
    };
    $scope.oneMonth = function () {
        changerotate(80);
        $scope.barChart('month');

    };
    $scope.oneYear = function () {
        changerotate(0);
        $scope.barChart('year');
    };
}]);
