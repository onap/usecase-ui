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
app.controller('perCtrl', function ($scope) {

});

app.controller('alarmGridCtrl', ['$scope','$log', '$http', '$timeout', '$interval', 'uiGridConstants', 'uiGridGroupingConstants',
    function ($scope,$log, $http, $timeout, $interval) {
        $scope.selectedRows = new Array();
        var mydefalutData = [
            {name: "shebei1", Id: "22", State: '1', Cpu: "40%", Memory: "60,0", Disk: "60,000", Network: "60,000"},
            {name: "shebei1", Id: "226", State: '2', Cpu: "40%", Memory: "60", Disk: "60,", Network: "60,000"},
            {
                name: "shebei1",
                Id: "225",
                State: '2',
                Cpu: "40%",
                Memory: "60,000",
                Disk: "60,000",
                Network: "60,000"
            },
            {name: "shebei1", Id: "224", State: '3', Cpu: "40%", Memory: "600", Disk: "60,000", Network: "60,000"},

            {
                name: "shebei1",
                Id: "223",
                State: '2',
                Cpu: "40%",
                Memory: "60,000",
                Disk: "60,000",
                Network: "60,000"
            },
            {
                name: "shebei1",
                Id: "221",
                State: '3',
                Cpu: "40%",
                Memory: "60,000",
                Disk: "60,000",
                Network: "60,000"
            }

        ];
		 $scope.items = [
			'The first choice!',
			'And another choice for you.',
			'but wait! A third!'
		  ];
		
		$scope.toggled = function(open) {
			$log.log('Dropdown is now: ', open);
		};
		
		$scope.status = {
			isopen: false
		};
		
		$scope.toggleDropdown = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.status.isopen = !$scope.status.isopen;
		};
		
		$scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
        $scope.gridOptions = {
            data: 'myData',
            columnDefs: [{
                field: 'name',
                displayName: 'name',
                width: '8%',
                enableColumnMenu: false,
                enableHiding: false,
                suppressRemoveSort: true,
                enableCellEdit: false
            },
                {field: "Id"},
                {field: "State",cellFilter:'mapGender'},
                {field: "Cpu"},
                {field: "Memory"},
                {field: "Disk"},
                {field: "Network"},
                {field: "Action",   cellTemplate :
				'<div uib-dropdown style="position: absolute;padding-left: 4%;"><button id="btn-append-to-single-button" type="button" style="padding:0;"  class="btn btn-primary" uib-dropdown-toggle>Action<span class="caret"></span></button><ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="btn-append-to-single-button"><li role="menuitem"><a href="#">clear</a></li><li role="menuitem"><a href="#">2</a></li><li role="menuitem"><a href="#">3</a></li></ul></div>'
				, enableCellEdit:false},
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
                /* if(row.entity.age > 45){
                     row.grid.api.selection.selectRow(row.entity);
                 }*/
            },
            modifierKeysToMultiSelect: false,
            multiSelect: true,
            noUnselect: false,
            selectionRowHeaderWidth: 20,


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
                        var num = $.inArray(row.entity.Id, $scope.selectedRows);
                        if (num == -1) {
                            $scope.selectedRows.push(row.entity.Id);
                        }
                        else {
                            $scope.selectedRows.splice(num, 1);
                        }
                    }
                });
                $scope.gridApi.grid.registerRowsProcessor( $scope.singleFilter, 200 );
            }
        };

        var getPage = function (curPage, pageSize) {
            var firstRow = (curPage - 1) * pageSize;
            $scope.gridOptions.totalItems = mydefalutData.length;
            $scope.gridOptions.data = mydefalutData.slice(firstRow, firstRow + pageSize);

            //$scope.myData = mydefalutData.slice(firstRow, firstRow + pageSize);
        };
        getPage(1, $scope.gridOptions.paginationPageSize);

        $scope.trashcan = function () {
            alert('delete ' + $scope.selectedRows);
        };

        $scope.status = [
            {id: 1, name: 'danger', count: 10},
            {id: 2, name: 'warming', count: 8},
            {id: 3, name: 'normal', count: 7},
            {id: undefined, name: 'All', count: 7}
        ];

        $scope.selectStatus = function (v) {
            $scope.selectedStatus = v;
            $scope.gridApi.grid.refresh();
        };
        $scope.activeStatus = function (status_id) {

            return status_id == $scope.selectedStatus;
        };
        $scope.open = [
            {id: 1, name: 'open', count: 10},
            {id: 2, name: 'close', count: 8},
            {id: undefined, name: 'All', count: 7}
        ];

        $scope.selectOpen = function (v) {
            $scope.selectedOpen = v;
            $scope.gridApi.grid.refresh();
        };
        $scope.activeOpen = function (open_id) {

            return open_id == $scope.selectedOpen;
        };

        $scope.singleFilter = function (renderableRows) {
            var matcher = new RegExp($scope.selectedStatus);
            renderableRows.forEach(function (row) {
                var match = false;
                ['State'].forEach(function (field) {
                    if (row.entity[field].match(matcher)) {
                        match = true;
                    }
                });
                if (!match) {
                    row.visible = false;
                }
            });
            return renderableRows;
        };
//input
$scope.menuState={show: false}
 $scope.toggleMenu=function()
 {
	 $scope.menuState.show=!$scope.menuState.show;
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

    }]).filter('mapGender', function () {
    var genderHash = {
        1: 'danger',
        2: 'alarm' ,
        3: 'normal'
    };

    return function (input) {
        if (!input) {
            return '';
        } else {
            return genderHash[input];
        }
    }
	
});