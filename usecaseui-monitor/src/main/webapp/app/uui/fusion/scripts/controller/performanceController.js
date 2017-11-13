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
app.controller('perGridCtrl', ['$scope','$http', '$window', '$interval', 'uiGridConstants', 'uiGridGroupingConstants', '$window' ,
    function ($scope, $http , $window, $interval ) {
        $scope.jump = function(value){
            permanceId=value;
            var obj = $("#lm");
            angular.element(obj).scope().currentTab = "app/uui/fusion/scripts/view-models/performance-details.html";
            //angular.element(obj).scope().$apply();
        };
        $scope.selectedRows = new Array();
        $scope.seek1 = "";
        $scope.seek2 = "";
        $scope.seek3 = "";
        $scope.seek4 = "";
        $scope.seek5 = "";
        $scope.getSearch = function (){
            getPage(1, $scope.gridOptions.paginationPageSize, $scope.seek1===""?"null":$scope.seek1,
                $scope.seek2===""?"null":$scope.seek2, $scope.seek3===""?"null":$scope.seek3,
                $scope.seek4===""?"null":$scope.seek4, $scope.seek5===""?"null":$scope.seek5);
        };
        $scope.toChart = function () {
            var obj = $("#lm");
            angular.element(obj).scope().currentTab = "app/uui/fusion/scripts/view-models/performance-chart.html";
        };
        $scope.gridOptions = {
            columnDefs: [{
                field: 'performanceHeader.eventName',
                displayName: 'Event Name',
                width: '10%',
                enableColumnMenu: false,
                enableHiding: false,
                suppressRemoveSort: true,
                enableCellEdit: false
            }, {
                    field: "performanceHeader.eventId",
                  enableCellEdit: false,
                    displayName: 'Event Id',
                    cellTemplate: '<a ng-click="grid.appScope.jump(row.entity.performanceHeader.sourceId)"; style="cursor:pointer" href="">{{row.entity.performanceHeader.sourceId}}</a>',
                },
                {field: "performanceHeader.sourceId", displayName: 'Source Id',enableCellEdit: false},
                {field: "performanceHeader.sourceName", displayName: 'Source Name',enableCellEdit: false},
                {field: "performanceHeader.reportingEntityId", displayName: 'Reporting Entity Id',enableCellEdit: false},
                {field: "performanceHeader.reportingEntityName", displayName: 'Reporting Entity Name',enableCellEdit: false},
                {field: "performanceHeader.priority", displayName: 'Priority',enableCellEdit: false},
                {field: "performanceHeader.createTime", displayName: 'Start Time',enableCellEdit: false},
                {field: "option",displayName: 'option', enableCellEdit: false ,
                    cellTemplate: '<button ng-click="grid.appScope.jump(row.entity.performanceHeader.sourceId)" class="btn btn-primary" >Details</button>'}
            ],
            enableSorting: true,
            useExternalSorting: false,
            enableGridMenu: true,
            showGridFooter: true,
            enableHorizontalScrollbar: 1,
            enableVerticalScrollbar: 0,
            enableFiltering: true,
            //
            enablePagination: true,
            enablePaginationControls: true,
            paginationPageSizes: [10, 15, 20],
            paginationCurrentPage: 1,
            paginationPageSize: 10,
            //paginationTemplate:"<div></div>",
            totalItems: 0,
            useExternalPagination: true,
            enableFooterTotalSelected: true,
            enableFullRowSelection: true,
            enableRowHeaderSelection: true,
            enableRowSelection: false,
            enableSelectAll: true,
            enableSelectionBatchEvent: true,
            isRowSelectable: function (row) {
                if (row.entity.age > 45) {
                    row.grid.api.selection.selectRow(row.entity);
                }
            },
            modifierKeysToMultiSelect: false,
            multiSelect: true,
            noUnselect: false,
            selectionRowHeaderWidth: 30,

            //---------------api---------------------
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;

                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    if (getPage) {
                        getPage(newPage, pageSize);
                    }
                });
                $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {
                    if (row) {
                        var num = $.inArray(row.entity.performanceHeader.eventId, $scope.selectedRows);
                        if (num == -1) {
                            $scope.selectedRows.push(row.entity.performanceHeader.eventId);
                        }
                        else {
                            $scope.selectedRows.splice(num, 1);
                        }
                    }
                });
                $scope.gridApi.grid.registerRowsProcessor($scope.singleFilter, 200);
            }   };

        $scope.singleFilter = function (renderableRows) {
            var matcher = new RegExp($scope.selectedStatus);
            renderableRows.forEach(function (row) {
                var match = true;
                /*['State'].forEach(function (field) {
                 if (row.entity[field].match(matcher)) {
                 match = true;
                 }
                 });*/
                if (!match) {
                    row.visible = false;
                }
            });
            return renderableRows;
        };
        $scope.menuState = {show: false}
        $scope.toggleMenu = function () {
            $scope.menuState.show = !$scope.menuState.show;
        }
        $scope.singleModel = 1;
        $scope.radioModel = 'Middle';

        $scope.checkModel = {
            open: false,
            close: true
        };
        $scope.checkResults = [];

        $scope.$watchCollection('checkModel', function () {
            $scope.checkResults = [];
            angular.forEach($scope.checkModel, function (value, key) {
                if (value) {
                    $scope.checkResults.push(key);
                }
            });
        });
        var getPage = function (curPage, pageSize) {
            var firstRow = (curPage - 1) * pageSize;
            var url = global_url+'/performance/' + curPage + '/' + pageSize + '';
            url += arguments[2] === "" ? "/null" : "/" + arguments[2];
            url += arguments[3] === "" ? "/null" : "/" + arguments[3];
            url += arguments[4] === "" ? "/null" : "/" + arguments[4];
            url += arguments[5] === "null" ? "/null" : "/" + FormatDate(arguments[5]);
            url += arguments[6] === "null" ? "/null" : "/" + FormatDate(arguments[6]);
            $http.get(url, {
                headers: {
                    'Access-Control-Allow-Origin': "*",
                    "Content-Type": "application/json",
                    "Authorization": "Basic " + btoa("usecase" + ':' + "usecase")
                }
            })
                .success(function (data) {
                    $scope.gridOptions.totalItems = data.totalRecords;
                    $scope.gridOptions.data = data.performances;
                });
        };
        getPage(1, $scope.gridOptions.paginationPageSize, $scope.seek1===""?"null":$scope.seek1,
            $scope.seek2===""?"null":$scope.seek2, $scope.seek3===""?"null":$scope.seek3,
            $scope.seek4===""?"null":$scope.seek4, $scope.seek5===""?"null":$scope.seek5);
        $interval(function () {
            getPage(1, $scope.gridOptions.paginationPageSize, $scope.seek1===""?"null":$scope.seek1,
                $scope.seek2===""?"null":$scope.seek2, $scope.seek3===""?"null":$scope.seek3,
                $scope.seek4===""?"null":$scope.seek4, $scope.seek5===""?"null":$scope.seek5);
        },10000)
        $scope.generateCsv = function () {
            if ($scope.selectedRows.length == 0){
                alert("please select row!");
            }else{
                $window.location = global_url+"/performance/genCsv/"+$scope.selectedRows;
            }
        };
        //input
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
        function FormatDate(strTime) {
            var date = new Date(strTime);
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
        };
    }]);
	
	