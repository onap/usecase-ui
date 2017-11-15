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
app.controller('alarmGridCtrl', ['$scope', '$log', '$http', '$timeout', '$interval' , '$window' ,'uiGridConstants', 'uiGridGroupingConstants',
    function ($scope, $log, $http, $timeout, $interval,$window) {
        $scope.jump = function(value){
            alarmDetailId=value;
            var obj = $("#lm");
            angular.element(obj).scope().currentTab = "app/uui/fusion/scripts/view-models/alarm-details.html";
            //angular.element(obj).scope().$apply();
        };
        $scope.toChart = function () {
            var obj = $("#lm");
            angular.element(obj).scope().currentTab = "app/uui/fusion/scripts/view-models/alarm-chart.html";
        };
        $scope.selectedRows = new Array();
        $scope.condition1 = "";
        $scope.condition2 = "";
        $scope.condition3 = "";
        $scope.condition4 = "";
        $scope.condition5 = "";
        $scope.vfstatus = "null";
        $scope.toggled = function (open) {
            $log.log('Dropdown is now: ', open);
        };
        $scope.status = {
            isopen: false
        };
        $scope.toggleDropdown = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.isopen = !$scope.status.isopen;
        };
        var getPage = function (curPage, pageSize) {
            var firstRow = (curPage - 1) * pageSize;
            var url = global_url+'/alarm/' + curPage + '/' + pageSize + '';
            url += arguments[2] === "" ? "/null" : "/" + arguments[2];
            url += arguments[3] === "" ? "/null" : "/" + arguments[3];
            url += arguments[4] === "" ? "/null" : "/" + arguments[4];
            url += arguments[5] === "" ? "/null" : "/" + FormatDate(arguments[5]);
            url += arguments[6] === "" ? "/null" : "/" + FormatDate(arguments[6]);
            url += arguments[7] === "" ? "/null" : "/" + arguments[7];
            $http.get(url, {
                headers: {
                    'Access-Control-Allow-Origin': "*",
                    "Content-Type": "application/json",
                    "Authorization": "Basic " + btoa("usecase" + ':' + "usecase")
                }
            })
                .success(function (data) {
                    $scope.gridOptions.totalItems = data.totalRecords;
                    $scope.gridOptions.data = data.alarms;
                });
        };
        $scope.gridOptions = {
            columnDefs: [
                {
                    field: 'alarmsHeader.eventName',
                    displayName: 'eventName',
                    width : '10%',
                    enableHiding: false,
                    suppressRemoveSort: true,
                    enableCellEdit: false
                },
                {field: "alarmsHeader.eventId", displayName: 'eventId', enableCellEdit: false},
                {field: "alarmsHeader.sourceId", displayName: 'Source Id', enableCellEdit: false,cellTemplate: '<a ng-click="grid.appScope.jump(row.entity.alarmsHeader.sourceId)"; style="cursor:pointer" href="">{{row.entity.alarmsHeader.sourceId}}</a>'},
                {field: "alarmsHeader.sourceName", displayName: 'Source Name',  enableCellEdit: false},
                {field: "alarmsHeader.reportingEntityId", displayName: 'Reporting Entity Id', enableCellEdit: false},
                {field: "alarmsHeader.reportingEntityName", displayName: 'Reporting Entity Name', enableCellEdit: false},
                {field: "alarmsHeader.createTime", displayName: 'Start Time', enableCellEdit: false},
                {field: "alarmsHeader.status", displayName: 'Status', cellFilter: 'mapGender',enableCellEdit: false},
                {field: "option",displayName: 'option', enableCellEdit: false ,cellTemplate: '<button ng-click="grid.appScope.jump(row.entity.alarmsHeader.sourceId)" class="btn btn-primary" >Details</button>'},
            ],
            enableSorting: true,
            useExternalSorting: false,
            enableGridMenu: true,
            showGridFooter: true,
            enableHorizontalScrollbar: 1,
            enableVerticalScrollbar: 0,
            enableFiltering: true,
            enablePagination: true,
            enablePaginationControls: true,
            paginationPageSizes: [10, 15, 20],
            paginationCurrentPage: 1,
            paginationPageSize: 10,
            totalItems: 0,
            useExternalPagination: true,
            enableFooterTotalSelected: true,
            enableFullRowSelection: true,
            enableRowHeaderSelection: true,
            enableRowSelection: false,
            enableSelectAll: true,
            enableSelectionBatchEvent: true,
            isRowSelectable: function (row) {
                /* if(row.entity.age > 45){
                     row.grid.api.selection.selectRow(row.entity);
                 }*/
            },
            modifierKeysToMultiSelect: false,
            multiSelect: true,
            noUnselect: false,
            selectionRowHeaderWidth: 28,
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
                        var num = $.inArray(row.entity.alarmsHeader.eventId, $scope.selectedRows);
                        if (num == -1) {
                            $scope.selectedRows.push(row.entity.alarmsHeader.eventId);
                        }
                        else {
                            $scope.selectedRows.splice(num, 1);
                        }
                    }
                });
                $scope.gridApi.grid.registerRowsProcessor($scope.singleFilter, 200);
            }
        };
        getPage(1, $scope.gridOptions.paginationPageSize, $scope.condition1===""?"":$scope.condition1,
            $scope.condition2===""?"":$scope.condition2, $scope.condition3===""?"":$scope.condition3,
            $scope.condition4===""?"":$scope.condition4, $scope.condition5===""?"":$scope.condition5,
            $scope.vfstatus);
        $interval(function () {
            getPage(1, $scope.gridOptions.paginationPageSize, $scope.condition1===""?"":$scope.condition1,
                $scope.condition2===""?"":$scope.condition2, $scope.condition3===""?"":$scope.condition3,
                $scope.condition4===""?"":$scope.condition4, $scope.condition5===""?"":$scope.condition5,
                $scope.vfstatus);
        },10000)

        $scope.generateCsv = function () {
            if ($scope.selectedRows.length == 0){
                alert("please select row!");
            }else{
                $window.location = global_url+"/alarm/genCsv/"+$scope.selectedRows;
            }
        };
        $scope.status = [
            {id: 1, name: 'CRITICAL', count: 10},
            {id: 2, name: 'MALOR', count: 8},
            {id: 3, name: 'MINOR', count: 7},
            {id: 4, name: 'WARNING', count: 8},
            {id: 5, name: 'NORMAL', count: 7},
            {id: undefined, name: 'All', count: 7}
        ];

        $scope.open = [
            {id: 1, name: 'Active', count: 10},
            {id: 2, name: 'Closed', count: 8},
            {id: undefined, name: 'All', count: 7}
        ];

        $scope.selectOpen = function (v) {
            $scope.vfstatus = typeof(v) == "undefined" ? "null" : v;
            getPage(1, $scope.gridOptions.paginationPageSize, $scope.condition1===""?"":$scope.condition1,
                $scope.condition2===""?"":$scope.condition2, $scope.condition3===""?"":$scope.condition3,
                $scope.condition4===""?"":$scope.condition4, $scope.condition5===""?"":$scope.condition5,
                $scope.vfstatus);
            $scope.selectedOpen = v;
        };
        $scope.activeOpen = function (open_id) {
            return open_id == $scope.selectedOpen;
        };
        $scope.singleFilter = function (renderableRows) {
            var matcher = new RegExp($scope.selectedStatus);
            renderableRows.forEach(function (row) {
                var match = true;
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
        $scope.alarmSearch = function () {
            getPage(1, $scope.gridOptions.paginationPageSize, $scope.condition1===""?"":$scope.condition1,
                $scope.condition2===""?"":$scope.condition2, $scope.condition3===""?"":$scope.condition3,
                $scope.condition4===""?"":$scope.condition4, $scope.condition5===""?"":$scope.condition5,
                $scope.vfstatus);
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
    }]).filter('mapGender', function () {
    var genderHash = {
        1: 'Active',
        2: 'Closed'
    };
    return function (input) {
        if (!input) {
            return '';
        } else {
            return genderHash[input];
        }
    }

});