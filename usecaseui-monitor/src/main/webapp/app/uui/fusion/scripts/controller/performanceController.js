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
app.controller('perCtrl',function ($scope) {

});
app.controller('perGridCtrl',  ['$scope', '$http', '$timeout', '$interval', 'uiGridConstants', 'uiGridGroupingConstants',
    function ($scope, $http, $timeout, $interval) {

        var mydefalutData = [
		    { name: "Moroni", age: 50, birthday: "Oct 28, 1970", salary: "60,000" },
            { name: "shebei1", Id: "22", State: 50, Cpu: "40%", Memory: "60,0", Disk: "60,000", Network: "60,000" },
            { name: "shebei1", State: 50, Cpu: "40%", Memory: "60", Disk: "60,", Network: "60,000" },
            { name: "shebei1", State: 50, Cpu: "40%", Memory: "60,000", Disk: "60,000", Network: "60,000" },
            { name: "shebei1", State: 50, Cpu: "40%", Memory: "600", Disk: "60,000", Network: "60,000" },
            { name: "shebei1", State: 50, Cpu: "40%", Memory: "60,000", Disk: "60,000", Network: "60,000" },
            { name: "shebei1", State: 50, Cpu: "40%", Memory: "60,000", Disk: "60,000", Network: "60,000" }
    ];
		$scope.jump =  function (){
			console.log(1);
			$scope.currentTab = '#/pre-details';
		};
        $scope.gridOptions = {
            data: 'myData',
            columnDefs: [{ field: 'name',
                displayName: 'name',
                width: '10%',
                enableColumnMenu: false,
                enableHiding: false,
                suppressRemoveSort: true,
                enableCellEdit: false ,
				cellTemplate:'<a ng-click="jump()">shebei1</a>'
            },
                { field: "Id",},
                { field: "State"},
                { field: "Cpu"},	
                { field: "Memory"},
                { field: "Disk"},
                { field: "Network"}
            ],

            enableSorting: true,
            useExternalSorting: false,
            enableGridMenu: true,
            showGridFooter: true,
            enableHorizontalScrollbar :  1,
            enableVerticalScrollbar : 0,
            enableFiltering: true,
            //
            enablePagination: true,
            enablePaginationControls: true,
            paginationPageSizes: [10, 15, 20],
            paginationCurrentPage:1,
            paginationPageSize: 10,
            //paginationTemplate:"<div></div>",
            totalItems : 0,
            useExternalPagination: true,


            //-
            enableFooterTotalSelected: true,
            enableFullRowSelection : true,
            enableRowHeaderSelection : true,
            enableRowSelection : false,
            enableSelectAll : true,
            enableSelectionBatchEvent : true,
            isRowSelectable: function(row){
                if(row.entity.age > 45){
                    row.grid.api.selection.selectRow(row.entity);
                }
            },
            modifierKeysToMultiSelect: false ,
            multiSelect: true ,
            noUnselect: false,
            selectionRowHeaderWidth:30 ,



            //---------------api---------------------
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;

                gridApi.pagination.on.paginationChanged($scope,function(newPage, pageSize) {
                    if(getPage) {
                        getPage(newPage, pageSize);
                    }
                });

                /*$scope.gridApi.selection.on.rowSelectionChanged($scope,function(row,event){
                    if(row){
                        $scope.testRow = row.entity;
                    }
                });*/
            }
        };

		
        var getPage = function(curPage, pageSize) {
            var firstRow = (curPage - 1) * pageSize;
            $scope.gridOptions.totalItems = mydefalutData.length;
            $scope.gridOptions.data = mydefalutData.slice(firstRow, firstRow + pageSize);

            //$scope.myData = mydefalutData.slice(firstRow, firstRow + pageSize);
        };

        getPage(1, $scope.gridOptions.paginationPageSize);
		
		//input
$scope.menuState={show: false}
 $scope.toggleMenu=function()
 {
	 $scope.menuState.show=!$scope.menuState.show;
 }
		
    }]);
	
	