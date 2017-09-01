/*
 * Copyright (c) 2014 DataTorrent, Inc. ALL Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

app
  .directive('wtTime', function ($interval) {
    return {
      restrict: 'A',
      scope: true,
      replace: true,
      template: '<div>Time<div class="alert alert-success">{{time}}</div></div>',
      link: function (scope) {
        function update() {
          scope.time = new Date().toLocaleTimeString();
        }

        update();

        var promise = $interval(update, 500);

        scope.$on('$destroy', function () {
          $interval.cancel(promise);
        });
      }
    };
  })
  .directive('wtScopeWatch', function () {
    return {
      restrict: 'A',
      replace: true,
      template: '<div>Value<div class="alert alert-info">{{value}}</div></div>',
      scope: {
        value: '=value'
      }
    };
  })
  .directive('wtFluid', function () {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'app/fusion/scripts/view-models/reportdashboard-page/src/app/template/fluid.html',
      scope: true,
      controller: function ($scope) {
        $scope.$on('widgetResized', function (event, size) {
          $scope.width = size.width || $scope.width;
          $scope.height = size.height || $scope.height;
        });
      }
    };
  })
  .directive('raptorReportChart', ['widgetDefinitions','defaultWidgets',function (widgetDefinitions, defaultWidgets) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'app/fusion/scripts/view-models/reportdashboard-page/src/app/template/raptor-report.html',
      scope: true,
      controller: function ($scope,$http, $rootScope) {
//    	  console.log('================= Raptor Report scope =================');
//				console.log($scope);
        $scope.showChart = false;
		  $scope.url = "report_embedded#/report_run/c_master="+$scope.widget.report_id+ "&refresh=Y&hideGrid=Y&width="+Math.floor($scope.width*13)+"&height=300";
//    	  $scope.url = "report_embedded#/report_run/c_master="+$scope.widget.report_id+ "&refresh=Y&hideGrid="+$scope.hideGrid+"&width=550&height=300";
    	  $rootScope.showdataContainer = false;
		  $rootScope.$watch('showdataContainer', function () {
  		    console.log('change showdataContainer');
  		    console.log($rootScope.showdataContainer);
  		    $scope.gridOptions = $rootScope.gridOptions;
  		    $scope.gridOptions = $rootScope.gridOptions;  		    
			$scope.uiGridRefresh = function(){
				  var columnDefsArray = [];
				  var columnFreezeEndColumn = $scope.widget.reportData.colIdxTobeFreezed;
				  var doColumnNeedToFreeze = false;
				  if(columnFreezeEndColumn && columnFreezeEndColumn.length>0) {
					  doColumnNeedToFreeze = true;
				  }
				  $scope.widget.reportData.reportDataColumns.forEach(function(entry) {
					  var tempColumnDef = { displayName: entry.columnTitle, field: entry.colId, enableSorting: entry.sortable,
							  sortingAlgorithm: function(a, b) {
						         return rowSorter.sortAlpha(a.displayValue, b.displayValue);
							  },
							  cellTemplate: '<div  class="ui-grid-cell-contents"  style="text-align:{{COL_FIELD.alignment}};" title="TOOLTIP">   '+
						  	 '  <div ng-if="!COL_FIELD.drillDownURL || COL_FIELD.drillDownURL==\'\'">{{COL_FIELD.displayValue}}</div>' +
			                 '  <a ng-if="COL_FIELD.drillDownURL && COL_FIELD.drillDownURL!=\'\'" ng-href="{{COL_FIELD.drillDownURL}}&parent___params==={{grid.appScope.currentReportUrlParams}}" >{{COL_FIELD.displayValue}}</a>' +
							  '</div>'};
				  if(entry.columnWidth && entry.columnWidth!='null' && entry.columnWidth!='pxpx' && entry.columnWidth!='nullpx' && entry.columnWidth!='nullpxpx'){
					  tempColumnDef['minWidth'] = entry.columnWidth.substring(0, entry.columnWidth.length - 2);
				  } else {
					  tempColumnDef['minWidth'] = '100';
				  }
				  if(doColumnNeedToFreeze) {
					  tempColumnDef['pinnedLeft']= true;
						  if(columnFreezeEndColumn === entry.colId){
							  doColumnNeedToFreeze = false;
						  }
					  }
					  columnDefsArray.push(tempColumnDef);
				  }); 
			  
				  $scope.gridOptions.paginationPageSizes= [$scope.widget.reportData.pageSize];
				  $scope.gridOptions.paginationPageSize= $scope.widget.reportData.pageSize;
				  if($scope.widget.reportData.totalRows<14){
					  $scope.widget.gridHeight = (widget.reportData.totalRows+5)*30+'px';
			  }else{
				  $scope.gridHeight = '400px';
				  }
				  $scope.gridOptions.totalItems = $scope.widget.reportData.totalRows;
				  $scope.gridOptions.columnDefs= columnDefsArray;
				  $scope.gridOptions.data= $scope.widget.reportData.reportDataRows;
				  $scope.gridOptions.exporterPdfHeader.text= $scope.widget.reportData.reportName;
			};  		    
			$scope.uiGridRefresh();
  		    
  		    
  		    /*presence.setGlobal({
  		      u: $rootScope.currentUser,
  		      s: 'on'
  		    })*/
  		  })
    	  $scope.$on('widgetResized', function (event, size) {
    		  console.log("===$scope===");
    		  console.log($scope);
    		  $scope.width = size.width || $scope.width;
    		  $scope.height = size.height || $scope.height;
    		  $scope.url = "report_embedded#/report_run/c_master="+$scope.widget.report_id+ "&refresh=Y&hideGrid=Y&width="+Math.floor($scope.width*13)+"&height=300";
    	  });
      }
    };
  }])
  .directive('raptorReportData', ['widgetDefinitions','defaultWidgets',function (widgetDefinitions, defaultWidgets) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'app/fusion/scripts/view-models/reportdashboard-page/src/app/template/raptor-report.html',
      scope: true,
      controller: function ($scope,$http, $rootScope) {
//    	  console.log('================= Raptor Report scope =================');
//				console.log($scope);
        $scope.showChart = false;
		  $scope.url = "report_embedded#/report_run/c_master="+$scope.widget.report_id+ "&refresh=Y&hideChart=Y&width="+Math.floor($scope.width*13)+"&height=300";
//    	  $scope.url = "report_embedded#/report_run/c_master="+$scope.widget.report_id+ "&refresh=Y&hideGrid="+$scope.hideGrid+"&width=550&height=300";
    	  $rootScope.showdataContainer = false;
		  $rootScope.$watch('showdataContainer', function () {
  		    console.log('change showdataContainer');
  		    console.log($rootScope.showdataContainer);
  		    $scope.gridOptions = $rootScope.gridOptions;
  		    $scope.gridOptions = $rootScope.gridOptions;  		    
			$scope.uiGridRefresh = function(){
				  var columnDefsArray = [];
				  var columnFreezeEndColumn = $scope.widget.reportData.colIdxTobeFreezed;
				  var doColumnNeedToFreeze = false;
				  if(columnFreezeEndColumn && columnFreezeEndColumn.length>0) {
					  doColumnNeedToFreeze = true;
				  }
				  $scope.widget.reportData.reportDataColumns.forEach(function(entry) {
					  var tempColumnDef = { displayName: entry.columnTitle, field: entry.colId, enableSorting: entry.sortable,
							  sortingAlgorithm: function(a, b) {
						         return rowSorter.sortAlpha(a.displayValue, b.displayValue);
							  },
							  cellTemplate: '<div  class="ui-grid-cell-contents"  style="text-align:{{COL_FIELD.alignment}};" title="TOOLTIP">   '+
						  	 '  <div ng-if="!COL_FIELD.drillDownURL || COL_FIELD.drillDownURL==\'\'">{{COL_FIELD.displayValue}}</div>' +
			                 '  <a ng-if="COL_FIELD.drillDownURL && COL_FIELD.drillDownURL!=\'\'" ng-href="{{COL_FIELD.drillDownURL}}&parent___params==={{grid.appScope.currentReportUrlParams}}" >{{COL_FIELD.displayValue}}</a>' +
							  '</div>'};
				  if(entry.columnWidth && entry.columnWidth!='null' && entry.columnWidth!='pxpx' && entry.columnWidth!='nullpx' && entry.columnWidth!='nullpxpx'){
					  tempColumnDef['minWidth'] = entry.columnWidth.substring(0, entry.columnWidth.length - 2);
				  } else {
					  tempColumnDef['minWidth'] = '100';
				  }
				  if(doColumnNeedToFreeze) {
					  tempColumnDef['pinnedLeft']= true;
						  if(columnFreezeEndColumn === entry.colId){
							  doColumnNeedToFreeze = false;
						  }
					  }
					  columnDefsArray.push(tempColumnDef);
				  }); 
			  
				  $scope.gridOptions.paginationPageSizes= [$scope.widget.reportData.pageSize];
				  $scope.gridOptions.paginationPageSize= $scope.widget.reportData.pageSize;
				  if($scope.widget.reportData.totalRows<14){
					  $scope.widget.gridHeight = (widget.reportData.totalRows+5)*30+'px';
			  }else{
				  $scope.gridHeight = '400px';
				  }
				  $scope.gridOptions.totalItems = $scope.widget.reportData.totalRows;
				  $scope.gridOptions.columnDefs= columnDefsArray;
				  $scope.gridOptions.data= $scope.widget.reportData.reportDataRows;
				  $scope.gridOptions.exporterPdfHeader.text= $scope.widget.reportData.reportName;
			};  		    
			$scope.uiGridRefresh();
  		    
  		    
  		    /*presence.setGlobal({
  		      u: $rootScope.currentUser,
  		      s: 'on'
  		    })*/
  		  })
      }
    };
  }])  
  .directive('rCloud', function () {
	    return {
	        restrict: 'A',
	        replace: true,
	        templateUrl: 'app/fusion/scripts/view-models/reportdashboard-page/src/app/template/r-cloud.html',
	        scope: true,
	        controller: function ($scope,$http) {
            $scope.showChart = false;
            $scope.hideGrid = 'true';
	          $scope.url = $scope.widget.rcloud_url;
	      	  $scope.$on('widgetResized', function (event, size) {
	      		  $scope.width = size.width || $scope.width;
	      		  $scope.height = size.height || $scope.height;
	      	  });
	        }
	      };
	    });