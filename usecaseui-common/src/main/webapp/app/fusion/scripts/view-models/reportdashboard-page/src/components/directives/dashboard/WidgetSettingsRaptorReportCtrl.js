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

angular.module('ui.dashboard')
  .controller('WidgetSettingsRaptorReportCtrl', ['$http','$scope','$rootScope','$uibModalInstance', 'widget', function ($http,$scope,$rootScope,$uibModalInstance, widget) {

			// add watch function for widget here
			// leave ajax call to the dashboard.js

			console.log("============= WidgetSettingsRaptorReportCtrl scope =================");
			console.log($scope);
    
      var getFormFieldListUrl = "raptor.htm?action=report.run.container&c_master="+widget.report_id + "&refresh=Y"
      console.log("============= getFormFieldListUrl =============");
      console.log(getFormFieldListUrl);
      $http.get(getFormFieldListUrl).then(
			      function(res){
			$scope.reportData = res.data;			      
			// add widget to scope
			$scope.showFormFieldIds = false;
			$scope.formFieldSelectedValues = {};
});

  	var parseQueryString = function( queryString ) {
	    var params = {}, queries, temp, i, l;
	    // Split into key/value pairs
	    queries = queryString.split("&");
	    // Convert the array of strings into an object
	    for ( i = 0, l = queries.length; i < l; i++ ) {
	        temp = queries[i].split('=');
	        //console.log(temp[0]);
	        //console.log(temp[0] != "refresh");
	        if(temp[0] && temp[0] != "refresh")
	        	params[temp[0]] = temp[1];
	    }
	    return params;
	};
      
	var paginationOptions = {
		    pageNumber: 1,
		    pageSize: 5,
		    sort: null
	};
	  
	$scope.gridOptions = {
	  paginationPageSizes: [5],
	  paginationPageSize: 5,
	  useExternalPagination: true,
	  columnDefs: [],
	  data: [],
	  enableGridMenu: true,
	  enableSelectAll: true,
	  exporterMenuPdf: false,
	  exporterMenuCsv: false,
	  exporterCsvFilename: 'myFile.csv',
	  exporterPdfDefaultStyle: {fontSize: 9},
	  exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
	  exporterPdfTableHeaderStyle: {fontSize: 10, bol$rootScoped: true, italics: true, color: 'red'},
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
		    $scope.gridApi = gridApi;
		    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
			      paginationOptions.pageNumber = newPage;
			      paginationOptions.pageSize = pageSize;
			      $scope.runReport();
			    });
			  }
			};
      
	

	    $scope.getFormFieldSelectedValuesAsURL = function(){
	    	var formFieldsUrl = '';
	    	$scope.widget.reportData.formFieldList.forEach(function(formField) {
		   		if(formField.fieldType==='LIST_BOX') {
		   			if($scope.formFieldSelectedValues && $scope.formFieldSelectedValues[formField.fieldId] && $scope.formFieldSelectedValues[formField.fieldId].value != '') {
		   				formFieldsUrl = formFieldsUrl+formField.fieldId+'='+$scope.formFieldSelectedValues[formField.fieldId].value+'&';
		   			}
		   		} else if(formField.fieldType==='LIST_MULTI_SELECT') {
		   			if($scope.formFieldSelectedValues[formField.fieldId].length >0) {
		   				for (var i = 0; i < $scope.formFieldSelectedValues[formField.fieldId].length; i++) {
		   					if($scope.formFieldSelectedValues[formField.fieldId][i].defaultValue){
			   				  formFieldsUrl = formFieldsUrl+formField.fieldId+'='+$scope.formFieldSelectedValues[formField.fieldId][i].value+'&';
		   					}
		   			    }
		   			}
		   		} else if((formField.fieldType === 'text' || formField.fieldType === 'TEXT') && formField.validationType === 'DATE'){
		   			formFieldsUrl = formFieldsUrl+formField.fieldId+'='+dateFilter($scope.formFieldSelectedValues[formField.fieldId],$scope.dateformat)+'&';
		   		} else if((formField.fieldType === 'text' || formField.fieldType === 'TEXT') && formField.validationType === 'TIMESTAMP_MIN'){
		   			formFieldsUrl = formFieldsUrl+formField.fieldId+'='+dateFilter($scope.formFieldSelectedValues[formField.fieldId],$scope.datetimeformat)+'&';
		   		} else if((formField.fieldType === 'text' || formField.fieldType === 'TEXT') && $scope.formFieldSelectedValues[formField.fieldId] && $scope.formFieldSelectedValues[formField.fieldId] != ''){
		   			formFieldsUrl = formFieldsUrl+formField.fieldId+'='+$scope.formFieldSelectedValues[formField.fieldId]+'&';
		   		}
	    	});
	    	return formFieldsUrl;

	    }	
		
		$scope.triggerOtherFormFields = function(){
				console.log("report_run");
	    	var formFieldsUrl = $scope.getFormFieldSelectedValuesAsURL();
	    	$http.get('raptor.htm?action=report.formfields.run.container&c_master='+widget.report_id+'&'+formFieldsUrl).then(
	      		 	function(response){
	    		    	$scope.widget.reportData = response.data;
	      			});
		};		
	
	
      $scope.runReport = function(pagination){
      	var formFieldsUrl = $scope.getFormFieldSelectedValuesAsURL();
  		console.log("pagination");
      	if(!pagination) {
      		console.log("refreshed ...");
      		$scope.gridOptions.pageNumber = 1;
    		  $scope.gridOptions.paginationPageSizes= [widget.reportData.pageSize];
  		  $scope.gridOptions.paginationPageSize= widget.reportData.pageSize;
  		  if(widget.reportData.totalRows<14){
  			  $scope.gridHeight = (widget.reportData.totalRows+7)*30+'px';
  		  } else{
  			  $scope.gridHeight = '400px';
  		  }
  		  $scope.gridOptions.totalItems = widget.reportData.totalRows;
  		  $scope.gridOptions.data= widget.reportData.reportDataRows;
  		  $scope.gridOptions.exporterPdfHeader.text= widget.reportData.reportName;
      	}
/*          $scope.currentReportUrlParams = 'c_master='+$scope.urlParams.c_master+'&'+formFieldsUrl+'&display_content=Y&r_page='+(paginationOptions.pageNumber-1);
      	console.log('raptor.htm?action=report.run.container&c_master='+$scope.urlParams.c_master+'&'+formFieldsUrl+'refresh=Y&display_content=Y&r_page='+(paginationOptions.pageNumber-1));
      	  $http.get('raptor.htm?action=report.run.container&c_master='+$scope.urlParams.c_master+'&'+formFieldsUrl+'refresh=Y&display_content=Y&r_page='+(paginationOptions.pageNumber-1)).then(
      	  */
        $scope.currentReportUrlParams = 'c_master='+ widget.report_id+'&'+formFieldsUrl+'&display_content=Y&r_page='+(paginationOptions.pageNumber-1);
        $scope.urlParams = parseQueryString($scope.currentReportUrlParams);
        
      	console.log('raptor.htm?action=report.run.container&c_master='+ widget.report_id +'&'+formFieldsUrl+'refresh=Y&display_content=Y&r_page='+(paginationOptions.pageNumber-1));
      	  $http.get('raptor.htm?action=report.run.container&c_master='+widget.report_id+'&'+formFieldsUrl+'refresh=Y&display_content=Y&r_page='+(paginationOptions.pageNumber-1)).then(
      			  function(response){
      				widget.reportData = response.data;
  		    	if(widget.reportData.errormessage) {
  		    		document.getElementById('errorDiv').innerHTML = widget.reportData.errormessage;
  		    		console.log(document.getElementById('errorDiv').innerHtml);
  		    		console.log(widget.reportData.errormessage);
  		    	}		   
  		    if(!pagination) {
  		      if(!$scope.urlParams.hideChart && widget.reportData.chartAvailable && widget.reportData.totalRows>1){
  		      		console.log('raptor.htm?action=chart.run&c_master='+widget.report_id+'&'+formFieldsUrl+'display_content=Y&r_page='+(paginationOptions.pageNumber-1));
  			    	$http.get('raptor.htm?action=chart.run&c_master='+widget.report_id +'&'+formFieldsUrl+'display_content=Y&r_page='+(paginationOptions.pageNumber-1)).then(
  			      		 	function(response) {
  			      		 		console.log(response.data);
  			      		 		$scope.showChart =  true;
  			      		 		document.getElementById('chartiframe').contentWindow.document.write(response.data);
  			      		 		document.getElementById('chartiframe').contentWindow.document.close();
  			      			});
  		      	} else {
  			      		 		$scope.showChart =  false;
  		      	}
  		    }
  		        if($scope.reportData.displayForm && $scope.reportData.formFieldList && $scope.reportData.formFieldList.length>0 && !$scope.urlParams.hideFormFields){
  		        	$scope.showFormFields = true;
  				} else {
  					$scope.showFormFields = false;
  				}
      		});
      	  	$rootScope.gridOptions = $scope.gridOptions;
      	  	$rootScope.gridHeight = $scope.gridHeight;
      	  	$rootScope.showdataContainer = true;
      };
	


    
    	
    // set up result object
    $scope.result = jQuery.extend(true, {}, widget);

    $scope.ok = function () {
      $uibModalInstance.close($scope.result);
    };
    
    $scope.okay = function () {
    	console.log("$scope.okay!")
    	console.log($scope);
		$scope.runReport();
/*        $uibModalInstance.close($scope.result);*/
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }]);