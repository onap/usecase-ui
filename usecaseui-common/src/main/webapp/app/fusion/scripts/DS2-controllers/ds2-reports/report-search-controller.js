appDS2.requires.push('ui.grid');
appDS2.requires.push('ui.grid.pagination');
appDS2.requires.push('ui.grid.resizeColumns');
appDS2.controller("reportSearchController", ['$scope','$rootScope','$http','$timeout','uiGridConstants','$modal','$q','$log','raptorReportFactory',function ($scope,$rootScope,$http,$timeout,uiGridConstants,$modal,$q,$log,raptorReportFactory) { 
	    
	$scope.getSearchData = function(){
		raptorReportFactory.getSearchData().then(function(data){
			$scope.searchdData = data;
		},function(error){
			$log.error("raptorReportFactory: getSearchData failed.");
		});
	}
	
	$scope.getSearchData();
	
	$scope.runReport = function(){
			var searchParams = '';
			if($scope.reportId && $scope.reportId!=''){
				searchParams = '&rep_id='+$scope.reportId+'&rep_id_options='+$scope.operatorRepId.index;
			}
			if($scope.reportName && $scope.reportName!=''){
				searchParams = searchParams+'&rep_name='+$scope.reportName+'&rep_name_options='+$scope.operatorRepName.index;
			}
			
			var pageSearchParameter = ($scope.paginationOptions.pageNumber-1)+searchParams
			raptorReportFactory.getSearchDataAtPage(pageSearchParameter).then(function(data){
				$scope.searchdData = data
			},function(error){
				$log.error("raptorReportFactory: getSearchDataAtPage failed.");
			});
	};


	$scope.paginationOptions = {
		    pageNumber: 1,
		    pageSize: 5,
		    sort: null
	};
	  
	var correctTotalPaginationTemplate = 
		  //same as normal template, but fixed totals:  {{(((grid.options.paginationCurrentPage-1)*grid.options.paginationPageSize)+1)}}   {{(grid.options.paginationCurrentPage*grid.options.paginationPageSize>grid.options.totalItems?grid.options.totalItems:grid.options.paginationCurrentPage*grid.options.paginationPageSize)}}
		  "<div role=\"contentinfo\" class=\"ui-grid-pager-panel\" ui-grid-pager ng-show=\"grid.options.enablePaginationControls\"><div role=\"navigation\" class=\"ui-grid-pager-container\"><div role=\"menubar\" class=\"ui-grid-pager-control\"><button type=\"button\" role=\"menuitem\" class=\"ui-grid-pager-first\" ui-grid-one-bind-title=\"aria.pageToFirst\" ui-grid-one-bind-aria-label=\"aria.pageToFirst\" ng-click=\"pageFirstPageClick()\" ng-disabled=\"cantPageBackward()\"><div class=\"first-triangle\"><div class=\"first-bar\"></div></div></button> <button type=\"button\" role=\"menuitem\" class=\"ui-grid-pager-previous\" ui-grid-one-bind-title=\"aria.pageBack\" ui-grid-one-bind-aria-label=\"aria.pageBack\" ng-click=\"pagePreviousPageClick()\" ng-disabled=\"cantPageBackward()\"><div class=\"first-triangle prev-triangle\"></div></button> <input type=\"number\" ui-grid-one-bind-title=\"aria.pageSelected\" ui-grid-one-bind-aria-label=\"aria.pageSelected\" class=\"ui-grid-pager-control-input\" ng-model=\"grid.options.paginationCurrentPage\" min=\"1\" max=\"{{ paginationApi.getTotalPages() }}\" required> <span class=\"ui-grid-pager-max-pages-number\" ng-show=\"paginationApi.getTotalPages() > 0\"><abbr ui-grid-one-bind-title=\"paginationOf\">/</abbr> {{ paginationApi.getTotalPages() }}</span> <button type=\"button\" role=\"menuitem\" class=\"ui-grid-pager-next\" ui-grid-one-bind-title=\"aria.pageForward\" ui-grid-one-bind-aria-label=\"aria.pageForward\" ng-click=\"pageNextPageClick()\" ng-disabled=\"cantPageForward()\"><div class=\"last-triangle next-triangle\"></div></button> <button type=\"button\" role=\"menuitem\" class=\"ui-grid-pager-last\" ui-grid-one-bind-title=\"aria.pageToLast\" ui-grid-one-bind-aria-label=\"aria.pageToLast\" ng-click=\"pageLastPageClick()\" ng-disabled=\"cantPageToLast()\"><div class=\"last-triangle\"><div class=\"last-bar\"></div></div></button></div><div class=\"ui-grid-pager-row-count-picker\" ng-if=\"grid.options.paginationPageSizes.length > 1\"><select ui-grid-one-bind-aria-labelledby-grid=\"'items-per-page-label'\" ng-model=\"grid.options.paginationPageSize\" ng-options=\"o as o for o in grid.options.paginationPageSizes\"></select><span ui-grid-one-bind-id-grid=\"'items-per-page-label'\" class=\"ui-grid-pager-row-count-label\">&nbsp;{{sizesLabel}}</span></div><span ng-if=\"grid.options.paginationPageSizes.length <= 1\" class=\"ui-grid-pager-row-count-label\">{{grid.options.paginationPageSize}}&nbsp;{{sizesLabel}}</span></div><div class=\"ui-grid-pager-count-container\"><div class=\"ui-grid-pager-count\"><span ng-show=\"grid.options.totalItems > 0\">{{(((grid.options.paginationCurrentPage-1)*grid.options.paginationPageSize)+1)}} <abbr ui-grid-one-bind-title=\"paginationThrough\">-</abbr> {{(grid.options.paginationCurrentPage*grid.options.paginationPageSize>grid.options.totalItems?grid.options.totalItems:grid.options.paginationCurrentPage*grid.options.paginationPageSize)}} {{paginationOf}} {{grid.options.totalItems}} {{totalItemsLabel}}</span></div></div></div>";
	
	$scope.gridOptions = {			
	  paginationPageSizes: [5],
	  paginationPageSize: 5,
	  paginationTemplate: correctTotalPaginationTemplate,
	  columnDefs: [],
	  enableColumnResizing: true,
	  data: [],
	  enableGridMenu: true,
	  enableSelectAll: true,
	  exporterMenuPdf: false,
	  exporterMenuCsv: false,
	  exporterCsvFilename: 'myFile.csv',
	  exporterPdfDefaultStyle: {fontSize: 9},
	  exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
	  exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
	  exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
	  exporterPdfFooter: function ( currentPage, pageCount ) {
	    return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
	  },
	  exporterPdfCustomFormatter: function ( docDefinition ) {
	    docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
	    docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
	    return docDefinition;
	  },
	  exporterPdfOrientation: 'portrait',
	  exporterPdfPageSize: 'LETTER',
	  exporterPdfMaxGridWidth: 500,
	  exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
	  onRegisterApi: function(gridApi) {
		    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
		    	$scope.paginationOptions.pageNumber = newPage;
		    	$scope.paginationOptions.pageSize = pageSize;
			      $scope.runReport();
			    });	 
		  }
		};


	var getPage = function() {
		$scope.gridOptions.columnDefs = [];
		$scope.searchdData.columns[0].forEach(function(entry) {
			if(entry.columnTitle=='Run'){
				$scope.gridOptions.columnDefs.push({ displayName: entry.columnTitle, field: entry.columnId, enableSorting: false,
				cellTemplate: '<div class="ui-grid-cell-contents"><a ng-href="#/report_run/{{COL_FIELD.drillDownLink.substr(39)}}" class="icon-controls-pointer" style="font-size:20px;"></a></div>'
				});
			} else if(entry.columnTitle=='Edit'){
				$scope.gridOptions.columnDefs.push({ displayName: entry.columnTitle, field: entry.columnId, enableSorting: false,
					cellTemplate: '<div class="ui-grid-cell-contents"><a ng-href="{{COL_FIELD.drillDownLink}}" class="icon-misc-pen" style="font-size:20px;"></a></div>'
				});
			} else if(entry.columnTitle=='Delete'){
				$scope.gridOptions.columnDefs.push({ displayName: entry.columnTitle, field: entry.columnId, enableSorting: false,
					cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.removeReport(COL_FIELD.drillDownLink,row)" class="icon-misc-trash" style="font-size:20px;"></a></div>'
				});
			}  else if(entry.columnTitle=='Copy'){
				$scope.gridOptions.columnDefs.push({ displayName: entry.columnTitle, field: entry.columnId, enableSorting: false,
					cellTemplate: '<div class="ui-grid-cell-contents"><a ng-href="{{COL_FIELD.drillDownLink}}" class="icon-documents-copy" style="font-size:20px;"></a></div>'
				});
			} else if(entry.columnTitle=='Schedule'){
			} else if(entry.columnTitle=='No'){
			} else {
					$scope.gridOptions.columnDefs.push({ displayName: entry.columnTitle, field: entry.columnId, 
						enableSorting: true,
				        cellTemplate: '<div class="ui-grid-cell-contents"  style="text-align:{{COL_FIELD.alignment}};" title="TOOLTIP"> <div>{{COL_FIELD.displayValue}}</div> </div>'	
				       });
			}
		});
		
		$scope.gridOptions.paginationPageSizes= [$scope.searchdData.metaReport.pageSize];
		$scope.gridOptions.paginationPageSize= $scope.searchdData.metaReport.pageSize;
		$scope.gridOptions.totalItems = $scope.searchdData.metaReport.totalSize;
		
		$scope.gridOptions.data = [];
		$scope.searchdData.rows[0].forEach(function(entry) {
			var localData = {};
			entry.forEach(function(rowData){
				localData[rowData["columnId"]]= rowData["searchresultField"];
			});
			$scope.gridOptions.data.push(localData);
		});
	};

	$scope.$watch("searchdData",function(newValue,oldValue) {
		if($scope.searchdData){
			getPage();
		}
	});
	
	$scope.operatorsRepId = [
		{index: 0, value: 'Equal To', text: 'Equal To', alias:'Equal To'},
        {index: 1, value: 'Less Than', text: 'Less Than', alias:'Less Than'},
        {index: 2, value: 'Greater Than', text: 'Greater Than', alias:'Greater Than'}];
	$scope.operatorRepId = {};
	$scope.operatorRepId.value = $scope.operatorsRepId[0].value;
	$scope.operatorRepId.index = $scope.operatorsRepId[0].index;

	$scope.operatorsRepName = [
		{index: 0, value: 'Starts With', text: 'Starts With', alias:'Starts With'},
        {index:1, value: 'Ends With', text: 'Ends With', alias:'Ends With'},
        {index: 2, value: 'Contains', text: 'Contains', alias:'Contains'}];

	$scope.operatorRepName = {};
	$scope.operatorRepName.value = $scope.operatorsRepName[0].value;
	$scope.operatorRepName.index = $scope.operatorsRepName[0].index;

	$scope.removeReport = function(reportDeleteUrl,row) {		
		   var modalInstance = $modal.open({
				 animation: $scope.animationsEnabled,
				 templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-reports/modal/report-del-confirm.html',
					sizeClass: 'modal-small',
				 controller: ['$scope', '$modalInstance', '$http', '$log','raptorReportFactory', function ($scope, $modalInstance, $http, $log, raptorReportFactory) {
						$scope.ok = function() {
							raptorReportFactory.getReportDeleteStatus(reportDeleteUrl).then(function(data){
								if (!(data.deleted))  {
									 $log.error("raptorReportFactory: report removal failed.")
								}
					      		$modalInstance.close();																	
							},function(error){
								 $log.error("report removal error.")
						    });
			      	  };
			
			      	  $scope.cancel = function() {
			      		$modalInstance.dismiss();
			      	  };
			    }]
			  });

		      modalInstance.result.then(function () {
			    	$scope.$emit('RefreshGridOptions');
		      }, function () {
		      });
	};
	
	$scope.$on('RefreshGridOptions', function(event) {
		$scope.getSearchData();
	});

	$timeout(function() {
		$rootScope.isViewRendering = false;
		});
	
	
}]);
