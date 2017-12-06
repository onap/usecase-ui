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
//
var permanceId="";
app.controller('perGridCtrl', ['$scope','$http', '$window', '$interval', '$window',
    function ($scope, $http , $window, $interval) {
        $scope.jump = function(value){
            permanceId=value;
            var obj = $("#lm");
            angular.element(obj).scope().currentTab = "app/uui/fusion/scripts/view-models/performance-details.html";
            //angular.element(obj).scope().$apply();
        };

        $scope.itemsByPage = 10;

        $scope.toChart = function () {
            var obj = $("#lm");
            angular.element(obj).scope().currentTab = "app/uui/fusion/scripts/view-models/performance-chart.html";
        };

        $scope.menuState = {show: false}
        $scope.toggleMenu = function () {
            $scope.menuState.show = !$scope.menuState.show;
        }

        $scope.checkResults = [];


        $scope.menuState = {show: false}
        $scope.toggleMenu = function () {
            $scope.menuState.show = !$scope.menuState.show;
        }
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

    }]);
app.controller('pipeCtrl', ['$scope','Resource', function ($scope,service) {
    $scope.seek1 = "";
    $scope.seek2 = "";
    $scope.seek3 = "";
    $scope.seek4 = "";
    $scope.seek5 = "";


    var ctrl = this;

    this.displayed = [];

    this.callServer = function callServer(tableState) {
        ctrl.isLoading = true;
        $scope.tableState = tableState;
        var pagination = tableState.pagination;

        var start = pagination.start/pagination.number+1 || 0;
        var number = pagination.number || 10;

        service.getPage(start, number,$scope.seek1===""?"null":$scope.seek1,
            $scope.seek2===""?"null":$scope.seek2, $scope.seek3===""?"null":$scope.seek3,
            $scope.seek4===""?"null":$scope.seek4, $scope.seek5===""?"null":$scope.seek5).then(function (result) {
            ctrl.displayed = result.data;
            tableState.pagination.numberOfPages = result.numberOfPages;
            ctrl.isLoading = false;
        });
    };

}])
    .factory('Resource', ['$q', '$filter', '$timeout','$http', function ($q, $filter, $timeout,$http) {
        var randomsItems = [];
        var totalCount = 0;
        function getPage(start, number) {
            var url = global_url+'/performance/' + start + '/' + number + '';
            url += arguments[2] === "" ? "/null" : "/" + arguments[2];
            url += arguments[3] === "" ? "/null" : "/" + arguments[3];
            url += arguments[4] === "" ? "/null" : "/" + arguments[4];
            url += arguments[5] === "null" ? "/null" : "/" + FormatDate(arguments[5]);
            url += arguments[6] === "null" ? "/null" : "/" + FormatDate(arguments[6]);
            $http({
                url : url,
                method : "GET"
            }).then(function SuccessCallback(resp) {
                if (resp.data.performances.length > 0){
                    randomsItems = resp.data.performances;
                    totalCount = resp.data.totalRecords;
                }else{
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


    }]).directive('stRatio',function(){
    return {
        link:function(scope, element, attr){
            var ratio=+(attr.stRatio);

            element.css('width',ratio+'%');

        }
    };
}).directive('pageSelect', function() {
    return {
        restrict: 'E',
        template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
        link: function(scope, element, attrs) {
            scope.$watch('currentPage', function(c) {
                scope.inputPage = c;
            });
        }
    }
});

