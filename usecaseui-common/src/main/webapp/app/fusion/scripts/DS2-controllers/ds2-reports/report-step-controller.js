appDS2.controller('reportStepController', function($scope,$http,$location, $routeParams, $q, $modal,$log,$window, raptorReportFactory, stepFormFactory) {

	$scope.showLoader = true;
	// tabs for report wizard steps:
	$scope.activeTabsId = 'Definition';
	$scope.addReportUserId = {'id':''};
	$scope.addReportRoleId = {'id':''};
	// For all the dropdown box, please declare the active selection variable in the following manner:
	// $scope.selectedOpt = {}; 
	// $scope.selectedOpt.value = "";
	$scope.getDefinitionById = function(id) {
		raptorReportFactory.getDefinitionByReportId(id).then(function(data){
			$scope.loadDefinition(data);
			$scope.definitionData = data;
			$scope.showLoader = false;
		},function(error){
			$log.error("raptorReportFactory: getSearchData failed.");
			$scope.showLoader = false;
		});
	}

	$scope.addReportSecurityUser = function(userId) {		
		raptorReportFactory.addReportSecurityUser(userId).then(function(data){
			$scope.loadSecurityPage();
		},function(error){
			$log.error("raptorReportFactory: addReportSecurityUser failed.");
		});	
	}
	
	$scope.removeReportSecurityUser = function(securityUser) {
		   var modalInstance = $modal.open({
				 scope: $scope,
				 animation: $scope.animationsEnabled,
				 templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-reports/modal/report-security-user-del-confirm.html',
				 sizeClass: 'modal-large',
				 controller: ['$scope', '$modalInstance', '$http', '$log','raptorReportFactory','securityUser', function ($scope, $modalInstance, $http, $log, raptorReportFactory,securityUser) {					 
					 $scope.securityUserName = securityUser.name;
					 $scope.ok = function() {
							raptorReportFactory.removeReportSecurityUser(securityUser.id).then(function(data){
								$modalInstance.close();		
							},function(error){
								$log.error("raptorReportFactory: removeReportSecurityUser failed.");
							});							 
						}					 
					 $scope.cancel = function() {
			      		$modalInstance.dismiss();
			      	 };
			    }],
				resolve:{
					securityUser: function(){
		   			return securityUser;
					}
				 }
			  });
		      modalInstance.result.then(function () {
		    	  $scope.loadSecurityPage();
		      }, function () {
		      });
	};	
	
	
	$scope.addReportSecurityRole = function(roleId) {			
		raptorReportFactory.addReportSecurityRole(roleId).then(function(data){
			$scope.loadSecurityPage();
		},function(error){
			$log.error("raptorReportFactory: addReportSecurityRole failed.");
		});	
	}	
			
	$scope.removeReportSecurityRole = function(securityRole) {
		   var modalInstance = $modal.open({
				 scope: $scope,
				 animation: $scope.animationsEnabled,
				 templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-reports/modal/report-security-role-del-confirm.html',
				 sizeClass: 'modal-large',
				 controller: ['$scope', '$modalInstance', '$http', '$log','raptorReportFactory','securityRole', function ($scope, $modalInstance, $http, $log, raptorReportFactory,securityRole) {					 
					 $scope.securityRoleName = securityRole.name;
					 $scope.ok = function() {
							raptorReportFactory.removeReportSecurityRole(securityRole.id).then(function(data){
								$modalInstance.close();		
							},function(error){
								$log.error("raptorReportFactory: removeReportSecurityRole failed.");
							});	
						}					 
					 $scope.cancel = function() {
			      		$modalInstance.dismiss();
			      	 };
			    }],
				resolve:{
					securityRole: function(){
		   			return securityRole;
					}
				 }
			  });
		      modalInstance.result.then(function () {
		    	  $scope.loadSecurityPage();
		      }, function () {
		      });
	}			

	$scope.saveReportSecurityInfo = function(userId, isPublic) {		
		var securityInfo = {'userId':userId+"",'isPublic':isPublic};
		raptorReportFactory.updateReportSecurityInfo(securityInfo).then(function(data){
			$scope.loadSecurityPage();
		},function(error){
			$log.error("raptorReportFactory: updateReportSecurityInfo failed.");
		});	
	};
	
	$scope.createNewDefinition = function() {
		raptorReportFactory.createNewDefinition().then(function(data){
			$scope.loadDefinition(data);
			$scope.definitionData = data;
			$scope.showLoader = false;
		},function(error){
			$log.error("raptorReportFactory: getSearchData failed.");
		});
	}	
	
	var initializeCreateReport = function() {
		$scope["selectedReportType"] ={};
		$scope.selectedReportType.value ="linear";
		$scope.selectedReportType2 ={};
		$scope.selectedReportType2.value ="";
		$scope.selectedDataSource ={};
		$scope.selectedDataSource.value="local";
		$scope.sqlScript = "SELECT ";
		$scope.pageSize = {"value":"50"};
	}

	
	var loadSqlInSession = function(){		
		raptorReportFactory.getSqlInSession().then(function(data){
			$scope.sqlInSessionJSON = data;
			$scope.sqlScript = data.query;
	    	$scope.showLoader = false;
		},function(error){
			$log.error("raptorReportFactory: getSearchData failed.");
		});
	};
	
	initializeCreateReport();
	if ($routeParams.reportMode) {
		if ($routeParams.reportMode=="copy") {
			raptorReportFactory.copyReportById($routeParams.reportId).then(function(data){
				  $scope.$emit('RefreshInsession');
			},function(error){
				$log.error("raptorReportFactory: deleteFormFieldById failed.");
			});										 			
		} else if ($routeParams.reportMode=="import") {
			$scope.$emit('RefreshInsession');
		}
	} else if ($routeParams.reportId) {
		$scope.getDefinitionById($routeParams.reportId);
		$scope.isEdit = true;
		$scope.reportId = $routeParams.reportId;
	} else {
		$scope.isEdit = false;
		$scope.createNewDefinition();
	}
	
	
	$scope.RunCurrentReport = function (){
		$window.location.href = "#/report_run/c_master="+$scope.reportId+"&refresh=Y";
	}
	
	$scope.deleteFormField = function(rowData) {		
		   var modalInstance = $modal.open({
				 scope: $scope,
				 animation: $scope.animationsEnabled,
				 templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-reports/modal/report-formfield-del-confirm.html',
				 sizeClass: 'modal-large',
				 controller: ['$scope', '$modalInstance', '$http', '$log','raptorReportFactory','rowData', function ($scope, $modalInstance, $http, $log, raptorReportFactory, rowData) {
					 $scope.tempFieldId = rowData.id;
					 $scope.ok = function() {
							raptorReportFactory.deleteFormFieldById(rowData.id).then(function(data){
					      		$modalInstance.close();																									
							},function(error){
								$log.error("raptorReportFactory: deleteFormFieldById failed.");
							});										 
					 }					 
					 $scope.cancel = function() {
			      		$modalInstance.dismiss();
			      	 };
			    }],
				resolve:{
					rowData: function(){
		   			return rowData;
					}
				 }
			  });
		      modalInstance.result.then(function () {
		    	  $scope.$emit('RefreshFormField');
		      }, function () {
		      });		
	}
	
	$scope.loadDefinition = function(definitionData) {
		$scope.reportId =  definitionData.reportId+"";
		$scope.reportName = definitionData.reportName;
		$scope.reportDescr = definitionData.reportDescr;
		$scope.formHelpText = definitionData.formHelpText;
		$scope.selectedPageSize = {"value": definitionData.pageSize+''};
		$scope.selectedMaxRowsInExcelCSVDownload = {"value": definitionData.maxRowsInExcelCSVDownload};
		$scope.reportTitle = definitionData.reportTitle;
		$scope.reportSubTitle = definitionData.reportSubTitle;
		$scope.selectedNumFormCols ={"value": definitionData.numFormCols+''}; 
		$scope.selectedFrozenColumns={"value": definitionData.frozenColumns+''};
		$scope.selectedDataGridAlign = {"value":definitionData.dataGridAlign+''};
		$scope.emptyMessage = definitionData.emptyMessage+'';
		$scope.selectedDataContainerHeight = {"value":definitionData.dataContainerHeight+''};
		$scope.selectedDataContainerWidth = {"value":definitionData.dataContainerWidth+''};
		var displayAreaValue = "null"
		for (var i=0; i<3; i++ ) {
			if (definitionData.displayArea[i].selected) {
				displayAreaValue = definitionData.displayArea[i].name;
			}
		}
		$scope.selectedDisplayArea = {"value":displayAreaValue+""}; 
		
		$scope.hideFormFieldsAfterRunSelected = {"value": definitionData.hideFormFieldsAfterRun}

		$scope.hideFormFieldsSelected = {"value":definitionData.displayOptions[0].selected};
		$scope.hideChartSelected = {"value":definitionData.displayOptions[1].selected};
		$scope.hideReportDataSelected = {"value":definitionData.displayOptions[2].selected};
		$scope.hideExcelSelected = {"value":definitionData.displayOptions[3].selected};
		$scope.hidePdfSelected = {"value":definitionData.displayOptions[4].selected};
		$scope.runtimeColSortDisabled = {"value":definitionData.runtimeColSortDisabled};
		$scope.showLoader = false;
	} 
	
	
	var setDefinition = function(){
 		$scope.updatedDefJson = {
				  "tabName" : "Definition",
				  "tabId" : "Def",
				  "reportId" : ($scope.isEdit?$scope.reportId+'':"-1"),
				  "reportName" : $scope.reportName,
				  "reportDescr" :  $scope.reportDescr,
				  "reportType" : "Linear",
				  "dbInfo" : "local",
				  "formHelpText" : $scope.formHelpText,
				  "pageSize" : Number($scope.selectedPageSize.value),
				  "displayArea" : [ {
				    "id" : "HOME",
				    "name" : "HOME",
				    "selected" : ($scope.selectedDisplayArea.value=="HOME")
				  }, {
				    "id" : "CUSTOMER",
				    "name" : "CUSTOMER",
				    "selected" : ($scope.selectedDisplayArea.value==="CUSTOMER")
				  }, {
				    "id" : "REPORTS",
				    "name" : "REPORTS",
				    "selected" : ($scope.selectedDisplayArea.value==="REPORTS")
				  } ],
				  "hideFormFieldsAfterRun" : $scope.hideFormFieldsAfterRunSelected.value,
				  "maxRowsInExcelCSVDownload" : Number($scope.selectedMaxRowsInExcelCSVDownload.value),
				  "frozenColumns" : Number($scope.selectedFrozenColumns.value),
				  "dataGridAlign" : $scope.selectedDataGridAlign.value,
				  "emptyMessage" : $scope.emptyMessage,
				  "dataContainerHeight" : $scope.selectedDataContainerHeight.value,
				  "dataContainerWidth" : $scope.selectedDataContainerWidth.value,
				  "displayOptions" : [ {
				    "name" : "HideFormFields",
				    "selected" : $scope.hideFormFieldsSelected.value
				  }, {
				    "name" : "HideChart",
				    "selected" : $scope.hideChartSelected.value
				  }, {
				    "name" : "HideReportData",
				    "selected" : $scope.hideReportDataSelected.value
				  }, {
				    "name" : "HideExcel",
				    "selected" : $scope.hideExcelSelected.value
				  }, {
				    "name" : "HidePdf",
				    "selected" : $scope.hidePdfSelected.value
				  } ],
				  "runtimeColSortDisabled" : $scope.runtimeColSortDisabled.value,
				  "numFormCols" :  Number($scope.selectedNumFormCols.value),
				  "reportTitle" : $scope.reportTitle,
				  "reportSubTitle" : $scope.reportSubTitle
				}

	}
	
	var updateDefinitionData = function() {
			setDefinition();
			raptorReportFactory.updateDefinition($scope.updatedDefJson,$scope.isEdit).then(function(data){
			},function(error){
				$log.error("raptorReportFactory: updateDefinition by Id failed.");
			});				
	}
	
	var saveNewDefinitionData = function() {
		setDefinition();
		raptorReportFactory.saveNewDefinition($scope.updatedDefJson).then(function(data){
		},function(error){
			$log.error("raptorReportFactory: saveNewDefinition by Id failed.");
		});		
	}
	
	$scope.testRunSql = function(){
		var queryJSON = {query: $scope.sqlScript};
		queryJSON = JSON.stringify(queryJSON);
		raptorReportFactory.testRunSQL(queryJSON).then(function(data){
			var modalInstance = $modal.open({
				 scope: $scope,
				 animation: $scope.animationsEnabled,
				 templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-reports/modal/report-wizard-test-run-sql.html',
				 sizeClass: 'modal-large',
				 controller: ['$scope', '$modalInstance', '$http', '$log','raptorReportFactory','queriedData', function ($scope, $modalInstance, $http, $log, raptorReportFactory, queriedData) {
					 var init = function() {
						 $scope.isError = false;
						 if (queriedData.errormessage) {
							 $scope.isError = true;
							 $scope.errormessage = queriedData.errormessage;
							 $scope.stacktrace = queriedData.stacktrace;
						 } else {
							 $scope.queryData = queriedData;
						}
					 }
					 init();	 		
			      	  $scope.close = function() {
			      		$modalInstance.dismiss();
			      	  };
			    }],
				resolve:{
					queriedData: function(){
		   			return data;
					}
				 }
		   })			
			
		},function(error){
			$log.error("raptorReportFactory: test run SQL failed.");
		});		
	}


	$scope.formFieldVerifySQL= function(sqlScript){
		var queryJSON = {query: sqlScript};
		queryJSON = JSON.stringify(queryJSON);
		raptorReportFactory.formFieldVerifySQL(queryJSON).then(function(data){
			var modalInstance = $modal.open({
				 scope: $scope,
				 animation: $scope.animationsEnabled,
				 templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-reports/modal/report-wizard-test-run-sql.html',
				 sizeClass: 'modal-large',
				 controller: ['$scope', '$modalInstance', '$http', '$log','raptorReportFactory','queriedData', function ($scope, $modalInstance, $http, $log, raptorReportFactory, queriedData) {
					 var init = function() {
						 $scope.isError = false;
						 if (queriedData.errormessage) {
							 $scope.isError = true;
							 $scope.errormessage = queriedData.errormessage;
							 $scope.stacktrace = queriedData.stacktrace;
						 } else {
							 $scope.queryData = queriedData;
						}
					 }
					 init();	 		
			      	  $scope.close = function() {
			      		$modalInstance.dismiss();
			      	  };
			    }],
				resolve:{
					queriedData: function(){
		   			return data;
					}
				 }
		   })			
			
		},function(error){
			$log.error("raptorReportFactory: test run SQL failed.");
		});		
	}
	
	
	/*	$scope.selectedDataSource.allowSchedule={};
	$scope.selectedDataSource.allowSchedule.value=""*/
	
    var getJsonSrcName = function(stepNum){
    	var JsonSrcPrefix = "app/fusion/scripts/DS2-view-models/ds2-reports/wz_steps/json/step"
    	return JsonSrcPrefix + stepNum +".json";
    }
        
	$scope.gTabs = [
         {
             title: 'Definition',
             id: 'Definition',
             uniqueId: 'uniqueTab1x',
             tabPanelId: 'threetab1x'
         }, {
             title: 'SQL',
             id: 'SQL',
             uniqueId: 'uniqueTab2x',
             tabPanelId: 'threetab2x',
             disabled: (!$scope.isEdit)
         }, {
             title: 'Columns',
             id: 'Columns',
             uniqueId: 'uniqueTab3x',
             tabPanelId: 'threetab3x',
             disabled: (!$scope.isEdit)
         }, {
             title: 'Form Fields',
             id: 'Form Fields',
             uniqueId: 'uniqueTab4x',
             tabPanelId: 'threetab4x',
             disabled: (!$scope.isEdit)
         }, {
             title: 'Security',
             id: 'Security',
             uniqueId: 'uniqueTab5x',
             tabPanelId: 'threetab5x',
             disabled: (!$scope.isEdit)
         }, {
             title: 'Run',
             id: 'Run',
             uniqueId: 'uniqueTab6x',
             tabPanelId: 'threetab6x',
             disabled: (!$scope.isEdit)
         }
     ];
	
	$scope.unhideAllOtherTabs = function(){
		for (var selectedTab = 0; selectedTab < $scope.gTabs.length; selectedTab++) {
			$scope.gTabs[selectedTab].disabled = false;
		}
	}
    
	$scope.openColumnPopup = function (rowData) {
		   var modalInstance = $modal.open({
				 scope: $scope,
				 animation: $scope.animationsEnabled,
				 templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-reports/modal/report-wizard-col-edit.html',
				 sizeClass: 'modal-large',
				 controller: ['$scope', '$modalInstance', '$http', '$log','raptorReportFactory','colData', function ($scope, $modalInstance, $http, $log, raptorReportFactory, colData) {
					 raptorReportFactory.getColumnEditInfoById(colData.id).then(function(data){
							$scope.columnEditData = data;
							$scope.colId = data.colId;
/*							$scope.colName = data.colName;*/
							$scope.colName = {'value':data.colName+''};
							$scope.selectedDisplayAlignment = {"value":data.displayAlignment+''};
							$scope.selectedDisplayHeaderAlignment = {"value":data.displayHeaderAlignment+''};
							$scope.sortable = {"value":''+data.sortable};
							$scope.visible = {"value":''+data.visible};
							$scope.drilldownURL = data.drilldownURL;
							$scope.drilldownParams = data.drilldownParams;
							$scope.drilldownType = data.drilldownType;					
							$scope.selectedDrillDownReport = {"value":""};
						 							
							
							},function(error){
							$log.error("raptorReportFactory: getColumnEditInfoById failed.");
						}); 						 

					 var init = function() {
						 
						 raptorReportFactory.getDrillDownReportList().then(function(data2){
							 $scope.drilldownReports = data2;
								},function(error){
								$log.error("raptorReportFactory: getDrillDownReportList failed.");
							}); 
						 
/*						 $scope.colTableRowData = colData;*/
						 $scope.displayAlignmentOptions = [
							 {value:"null", text:""},							 
							 {value:"Left", text:"Left"},
							 {value:"Center", text:"Center"},
							 {value:"Right", text:"Right"}
						 ];
						 $scope.ynOptions = [
							 {value:"true", text:"Yes"},
							 {value:"false", text:"No"}							 
						 ];
						 $scope.drillDownOptions = [
							 {value:"drillDownOpt1", text:"drillDownOpt1"},
							 {value:"drillDownOpt2", text:"drillDownOpt2"},
							 {value:"drillDownOpt3", text:"drillDownOpt3"}
						 ];
					 }
					 
					 init();
					 $scope.$watch('selectedDrillDownReport.value',function(){
						 if ($scope.selectedDrillDownReport) {
						     $scope.$emit('openDrillDownpage',$scope.selectedDrillDownReport.value);
						 }
					 });
					 
					 $scope.save = function() {
						 var drilldownURL = "";//raptorReportFactory.drillDownPopupOptions
						//raptorReportFactory.drillDownPopupOptions.radioGroup
						 var colInfo = {
								  "tabId" : "ColEdit",
								  "tabName" : "Column Edit",
								  "colId" : $scope.colId,
								  "colName" : $scope.colName.value,
								  "displayAlignment" : ($scope.selectedDisplayAlignment.value=="null")?null:$scope.selectedDisplayAlignment.value,
								  "displayHeaderAlignment" : ($scope.selectedDisplayHeaderAlignment.value=="null")?null:$scope.selectedDisplayHeaderAlignment.value,
								  "sortable" : ($scope.sortable.value=="true"),
								  "visible" : ($scope.visible.value=="true"),
								  "drilldownURL" : raptorReportFactory.drillDownURL,
								  "drilldownParams" : raptorReportFactory.drillDownParams,
								  "drilldownType" : ""
								}
						 raptorReportFactory.saveColumnEditInfo(colInfo).then(function(data){
					      		$modalInstance.close();																	
								},function(error){
								$log.error("raptorReportFactory: getColumnEditInfoById failed.");
							}); 						 
			      	  };					
			
			      	  $scope.cancel = function() {
			      		$modalInstance.dismiss();
			      	  };
			    }],
				resolve:{
					colData: function(){
		   			return rowData;
					}
				 }
			  });

		      modalInstance.result.then(function () {
			    	$scope.$emit('RefreshColumnList');
		      }, function () {
		      });
    };
    
    
    $scope.throwReportNameMissingError = function () {
		   var modalInstance = $modal.open({
				 scope: $scope,
				 animation: $scope.animationsEnabled,
				 templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-reports/modal/report-wizard-report-name-validation.html',
				 sizeClass: 'modal-small',
				 controller: ['$scope', '$modalInstance', '$http', '$log', function ($scope, $modalInstance, $http, $log) {			
			      	  $scope.close = function() {
			      		$modalInstance.dismiss();
			      	  };
			    }]
			  });
		      modalInstance.result.then(function () {
		      }, function () {
		      });		   
 };

    
    $scope.addNewFormField = function () {
		   var modalInstance = $modal.open({
				 scope: $scope,
				 animation: $scope.animationsEnabled,
				 templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-reports/modal/report-wizard-formfield-edit.html',
				 sizeClass: 'modal-large',
				 controller: ['$scope', '$modalInstance', '$http', '$log','raptorReportFactory', function ($scope, $modalInstance, $http, $log, raptorReportFactory) {    	
					 raptorReportFactory.getFormFieldEditInfoById("add").then(function(data){
					 	 $scope.formFieldEditData = data;
					 	 $scope.fieldId = $scope.formFieldEditData.fieldId;
					 	 $scope.fieldName ={"value": $scope.formFieldEditData.fieldName};
						 $scope.selectedVisible = {"value":$scope.formFieldEditData.visible+''};
						 $scope.defaultValue = {"value": $scope.formFieldEditData.defaultValue};
						 $scope.fieldDefaultSQL = {"value": $scope.formFieldEditData.fieldDefaultSQL};
						 $scope.fieldSqlContent = {"value": $scope.formFieldEditData.fieldSQL};
						 $scope.selectedValidationType = {"value":$scope.formFieldEditData.validationType +''};
						 $scope.selectedFieldType = {"value":$scope.formFieldEditData.fieldType +''};
						$scope.sqlDefaultValueSelected= {value:false};
						$scope.sqlDefaultValueSelected ={"value":false};
						if (($scope.fieldDefaultSQL.value)&&($scope.fieldDefaultSQL.value!="")) {
							$scope.sqlDefaultValueSelected.value =true;
						} 
						},function(error){
						$log.error("raptorReportFactory: getColumnEditInfoById failed.");
					});
					 

					 $scope.ynOptions = [
						 {value:"true", text:"Yes"},
						 {value:"false", text:"No"}							 
					 ];
					 
					 $scope.verifyFieldValueOptions = [
						 {value:"DATE", text:"Date"},
						 {value:"TIME_STAMP_HOUR", text:"TimeStamp (Hour)"},
						 {value:"TIME_STAMP_HOUR_MIN", text:"TimeStamp (Hour,Min)"},
						 {value:"HIDDEN", text:"Hidden"}						 							 						 							 
					 ]					 
					 
					 $scope.fieldTypeOptions = [
						 {value:"TEXT", text:"Text Box"},
						 {value:"LIST_BOX", text:"List Box"},
						 {value:"LIST_MULTI_SELECT", text:"Multi-select List Box"},
						 {value:"HIDDEN", text:"Hidden"}						 							 						 
					];
					 
					 $scope.save = function() {
						 var formFieldJSON = {
							  "tabId" : "FormEdit",
							  "tabName" : "Form Edit",
							  "fieldId" : $scope.fieldId,
							  "fieldName" : $scope.fieldName.value,
							  "fieldType" : $scope.selectedFieldType.value,
							  "visible" : ($scope.selectedVisible.value=="true"),
							  "defaultValue" : ($scope.sqlDefaultValueSelected.value?'':$scope.defaultValue.value),
							  "fieldDefaultSQL" : ($scope.sqlDefaultValueSelected.value?$scope.fieldDefaultSQL.value:""),
							  "fieldSQL" :$scope.fieldSqlContent.value,
							  "validationType" : "NONE",
							  "predefinedValueList" :null
							}
						 raptorReportFactory.saveFormFieldEditInfo(formFieldJSON).then(function(data){
					      		$modalInstance.close();	
								},function(error){
								$log.error("raptorReportFactory: saveFormFieldEditInfo failed.");
							});			      	  
			      	  };
			
			      	  $scope.cancel = function() {
			      		$modalInstance.dismiss();
			      	  };
			    }]
			  });
		      modalInstance.result.then(function () {
			    	$scope.$emit('RefreshFormField');
		      }, function () {
		      });		   
    };
        
	$scope.openFormFieldPopup = function (rowData) {
		   var modalInstance = $modal.open({
				 scope: $scope,
				 animation: $scope.animationsEnabled,
				 templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-reports/modal/report-wizard-formfield-edit.html',
				 sizeClass: 'modal-large',
				 controller: ['$scope', '$modalInstance', '$http', '$log','raptorReportFactory','fieldData', function ($scope, $modalInstance, $http, $log, raptorReportFactory, fieldData) {
					 var init = function() {
						 raptorReportFactory.getFormFieldEditInfoById(fieldData.id).then(function(data){
							 	 $scope.formFieldEditData = data;
							 	 $scope.fieldId = $scope.formFieldEditData.fieldId;
							 	 $scope.fieldName = {"value":$scope.formFieldEditData.fieldName};
								 $scope.selectedVisible = {"value":$scope.formFieldEditData.visible+''};
								 $scope.defaultValue = {"value":$scope.formFieldEditData.defaultValue};
								 $scope.fieldDefaultSQL = {"value": $scope.formFieldEditData.fieldDefaultSQL};
								 $scope.fieldSqlContent = {"value": $scope.formFieldEditData.fieldSQL};
								 $scope.selectedValidationType = {"value":$scope.formFieldEditData.validationType +''};
								 $scope.selectedFieldType = {"value":$scope.formFieldEditData.fieldType +''};
								$scope.sqlDefaultValueSelected ={"value":false};
								if (($scope.fieldDefaultSQL.value)&&($scope.fieldDefaultSQL.value!="")) {
									$scope.sqlDefaultValueSelected.value =true;
								} 
								},function(error){
								$log.error("raptorReportFactory: getColumnEditInfoById failed.");
							});						 						
						 
						 $scope.ynOptions = [
							 {value:"true", text:"Yes"},
							 {value:"false", text:"No"}							 
						 ];
						 
						 $scope.verifyFieldValueOptions = [
							 {value:"DATE", text:"Date"},
							 {value:"TIME_STAMP_HOUR", text:"TimeStamp (Hour)"},
							 {value:"TIME_STAMP_HOUR_MIN", text:"TimeStamp (Hour,Min)"},
							 {value:"HIDDEN", text:"Hidden"}						 							 						 							 
						 ]
						 
						 $scope.fieldTypeOptions = [
							 {value:"TEXT", text:"Text Box"},
							 {value:"LIST_BOX", text:"List Box"},
							 {value:"LIST_MULTI_SELECT", text:"Multi-select List Box"},
							 {value:"HIDDEN", text:"Hidden"}						 							 						 
						];
						
					 }
					 
					 init();
					 
					 $scope.save = function() {
						 var formFieldJSON = {
							  "tabId" : "FormEdit",
							  "tabName" : "Form Edit",
							  "fieldId" : $scope.fieldId,
							  "fieldName" : $scope.fieldName.value,
							  "fieldType" : $scope.selectedFieldType.value,
							  "visible" : ($scope.selectedVisible.value=="true"),
							  "defaultValue" : ($scope.sqlDefaultValueSelected.value?'':$scope.defaultValue.value),
							  "fieldDefaultSQL" : ($scope.sqlDefaultValueSelected.value?$scope.fieldDefaultSQL.value:""),
							  "fieldSQL" :$scope.fieldSqlContent.value,
							  "validationType" : "NONE",
							  "predefinedValueList" :null
							}
						 raptorReportFactory.saveFormFieldEditInfo(formFieldJSON).then(function(data){
					      		$modalInstance.close();	
								},function(error){
								$log.error("raptorReportFactory: saveFormFieldEditInfo failed.");
							});			      	  
			      	  };
			
			      	  $scope.cancel = function() {
			      		$modalInstance.dismiss();
			      	  };
			    }],
				resolve:{
					fieldData: function(){
		   			return rowData;
					}
				 }
			  });

		      modalInstance.result.then(function () {
			    	$scope.$emit('RefreshFormField');
		      }, function () {
		      });
 };
    
	$scope.openDrillDownReportPopup = function (reportId,parentReportId) {
		   var modalInstance = $modal.open({
				 scope: $scope,
				 animation: $scope.animationsEnabled,
				 templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-reports/modal/report-wizard-drilldown-edit.html',
				 sizeClass: 'modal-large',
				 controller: ['$scope', '$modalInstance', '$http', '$log','raptorReportFactory','reportId', function ($scope, $modalInstance, $http, $log, raptorReportFactory, reportId) {
					 
					 $scope.drillDownOptionList =[];
					 $scope.selectedvalueradioGroup = {"name":""};
					 $scope.selectedChildReportFormField = {"value":""};
					 $scope.selectedChildReportColumn = {"value":""};
					 $scope.fixedValue = {"value":""};
					 $scope.suppressValues = {"value":""};

				    	raptorReportFactory.getChildReportFormField(reportId).then(function(data){				    		
				    		for (var i=0;i<data.length;i++) {
				    			$scope.drillDownOptionList.push(
				    					{
				    					"name": data[i].name,
				    					"id": data[i].id,
				    					"selectedvalueradioGroup":{"name":""},
				    					"selectedChildReportFormField":{"value":""},
				    					"selectedChildReportColumn":{"value":""},
				    					"fixedValue":{"value":""},
				    					"suppressValues":{"value":""}				    					
				    					}
				    					)
				    		}
						},function(error){
							$log.error("raptorReportFactory: getChildReportFormField failed.");  
							});

				    	raptorReportFactory.getChildReportFormField(parentReportId).then(function(data){
				    		$scope.childReportFF =data;
						},function(error){
							$log.error("raptorReportFactory: getChildReportFormField failed.");  
							});				    	

				    	raptorReportFactory.getChildReportColumn(parentReportId).then(function(data){
				    		$scope.childReportCol =data;
						},function(error){
							$log.error("raptorReportFactory: getChildReportFormField failed.");  
							});
				    	
				    	raptorReportFactory.setDrillDownPopupOptions(null);				    					    					    	
			
			      	  $scope.complete = function() {			      		
			      		var drillDownPopupOptions= {
			      				radioGroup : $scope.selectedvalueradioGroup.name,
			      				reportFF: $scope.selectedChildReportFormField.value,
			      				reportCol:  $scope.selectedChildReportColumn.value,
			      				fixedValue:  $scope.fixedValue.value,
			      				suppressValues: $scope.suppressValues.value
			      		}
			      		var drillDownParams = "";
			      		var ampStr ="";
			      		for (var i=0;i<$scope.drillDownOptionList.length; i++) {
			      			if (drillDownParams!="") {
			      				ampStr = "&amp;";
			      			} 
			      			if ($scope.drillDownOptionList[i].selectedvalueradioGroup.name=="fixedValue"){
			      				drillDownParams = drillDownParams + ampStr + $scope.drillDownOptionList[i].id + "="+$scope.drillDownOptionList[i].fixedValue.value;
			      			} else if ($scope.drillDownOptionList[i].selectedvalueradioGroup.name=="reportFF"){
			      				drillDownParams = drillDownParams + ampStr + $scope.drillDownOptionList[i].id + "=[!"+$scope.drillDownOptionList[i].selectedChildReportFormField.value + "]";			      				
			      			} else if ($scope.drillDownOptionList[i].selectedvalueradioGroup.name=="reportCol"){
			      				drillDownParams = drillDownParams + ampStr + $scope.drillDownOptionList[i].id + "=["+$scope.drillDownOptionList[i].selectedChildReportColumn.value + "]";			      							      				
			      			}			      				
			      		}
				      	raptorReportFactory.setDrillDownPopupOptions(reportId,drillDownParams);
			      		
			      		$modalInstance.close();
			      	  };
			    }],
				resolve:{
					reportId: function(){
		   			return reportId;
					}
				 }
			  });

		      modalInstance.result.then(function () {
/*			    	$scope.$emit('RefreshFormField');*/
		      }, function () {
		      });
};
 
    $scope.$watch('activeTabsId', function (newVal, oldVal) {
        if(newVal !== oldVal) {
        	$scope.showLoader = true;
            var selectedTab;
            for (selectedTab = 0; selectedTab < $scope.gTabs.length; selectedTab++) {
                if ($scope.gTabs[selectedTab].id === newVal) {
                    $scope.stepNum = selectedTab;
/*                    stepFormFactory.getStepJSONData(getJsonSrcName($scope.stepNum))*/
            		$scope.isColumnStep = false;              	  	                    
            		$scope.isFormFieldStep = false;
            		$scope.isSecurityStep = false;
                	$scope.renderStep(selectedTab+1);
                	if ($scope.stepNum == 1) {
                    	$scope.showLoader = false;
                	}
                	else if ($scope.stepNum == 2) {
                		loadSqlInSession();
                	}	else if ($scope.stepNum == 3) {
                		$scope.isColumnStep = true;
                		raptorReportFactory.getColumnList().then(function(data){
                			$scope.colTableRowData = data;
                        	$scope.showLoader = false;
                		},function(error){
                			$log.error("raptorReportFactory: get column list failed.");
                			$scope.showLoader = false;});
                    	                		
                	}  else if ($scope.stepNum == 4) {
                		$scope.isFormFieldStep = true;
                		// put within then function:
                		raptorReportFactory.getFormFieldList().then(function(data){
                			$scope.formFieldData = data;
                        	$scope.showLoader = false;
                		},function(error){
                			$log.error("raptorReportFactory: get formfields failed."); 
                			$scope.showLoader = false;});
                	}  else if ($scope.stepNum == 5) {
                		$scope.isSecurityStep = true;
                		$scope.reportOwnerId={'id':''};
                		$scope.isPublicOptionList = [
                			{'value':'true','text':'Yes'},
                			{'value':'false','text':'No'},                			
                		];
                		$scope.loadSecurityPage();
                		
                	}
                	else if ($scope.stepNum == 6) {
                		raptorReportFactory.getDefinitionInSession().then(function(data){
                    		$scope.reportId = data.reportId;
                        	$scope.showLoader = false;
                    	},function(error){
                    		$log.error("raptorReportFactory: getDefinitionInSession failed."); 
                    		$scope.showLoader = false;});		
                	}
                	
                	if ($scope.stepNum>1){
                		$scope.unhideAllOtherTabs();
                	}
                    break;
                }
            }
        }
    });	 
	 
    $scope.loadSecurityPage = function() {
    	$scope.showLoader = true;
    	raptorReportFactory.resetSecurityLoadingCounter();
    	
    	//API call 1:
		raptorReportFactory.getSecurityReportOwnerList().then(function(data){
    		$scope.reportOwnerList = data;
			raptorReportFactory.icrementSecurityLoadingCounter();
			if(raptorReportFactory.checkSecurityLoadingCounter()){$scope.showLoader = false;};
    	},function(error){
    		$log.error("raptorReportFactory: getSecurityReportOwnerList failed."); 
    		});

		//API call 2: get report role list
		raptorReportFactory.getReportRoleList().then(function(data){
    		$scope.reportRoleList = data;
			raptorReportFactory.icrementSecurityLoadingCounter();
			if(raptorReportFactory.checkSecurityLoadingCounter()){$scope.showLoader = false;};
		},function(error){
    		$log.error("raptorReportFactory: getReportRoleList failed."); 
    		});	

		//API call 3: get security page basic info
		raptorReportFactory.getReportSecurityInfo().then(function(data){
    		$scope.reportSecurityInfo = data;
    		$scope.reportOwnerId ={id: $scope.reportSecurityInfo.ownerId};        	
			raptorReportFactory.icrementSecurityLoadingCounter();
			if(raptorReportFactory.checkSecurityLoadingCounter()){$scope.showLoader = false;};
    	},function(error){
    		$log.error("raptorReportFactory: getReportSecurityInfo failed."); 
    		$scope.showLoader = false;});
		               		
		//API call 4: retrieve security users
		raptorReportFactory.getReportSecurityUsers().then(function(data){
    		$scope.reportSecurityUsers = data;
    		for (var i=0; i<$scope.reportSecurityUsers.length;i++) {
    			$scope.reportSecurityUsers[i]["accessAllowed"] = !$scope.reportSecurityUsers[i]["readOnly"];
    		}
    		raptorReportFactory.icrementSecurityLoadingCounter();
			if(raptorReportFactory.checkSecurityLoadingCounter()){$scope.showLoader = false;};
    	},function(error){
    		$log.error("raptorReportFactory: reportSecurityUsers failed."); 
    		});

		//API call 5: retrieve security roles
		raptorReportFactory.getReportSecurityRoles().then(function(data){
    		$scope.reportSecurityRoles = data;
    		for (var i=0; i<$scope.reportSecurityRoles.length;i++) {
    			$scope.reportSecurityRoles[i]["accessAllowed"] = !$scope.reportSecurityRoles[i]["readOnly"];
    		}
    		
			raptorReportFactory.icrementSecurityLoadingCounter();
			if(raptorReportFactory.checkSecurityLoadingCounter()){$scope.showLoader = false;};			
    	},function(error){
    		$log.error("raptorReportFactory: reportSecurityRoles failed."); 
    		});     	
    }
    
    
    $scope.renderStep = function(stepNum){
    	var containerElement = angular.element(document.getElementById("stepView"));
        containerElement.empty();
        $scope.stepNum = stepNum;
        var jsonSrcName = getJsonSrcName(stepNum);
        stepFormFactory.renderForm(jsonSrcName, containerElement, $scope);
    }

    $scope.toggleUserEditAccessActive = function(rowData) {
		   var modalInstance = $modal.open({
				 scope: $scope,
				 animation: $scope.animationsEnabled,
				 templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-reports/modal/report-user-role-confirm-toggle.html',
				 sizeClass: 'modal-small',
				 controller: ['$scope', '$modalInstance', '$http', '$log','raptorReportFactory','rowData', function ($scope, $modalInstance, $http, $log, raptorReportFactory, rowData) {
					$scope.rowData = rowData;
					$scope.toggleEditAccessStatus = function(rowData) {
						raptorReportFactory.toggleUserEditAccess(rowData);
				        $modalInstance.close();
					};
					 
					$scope.cancelEditAccessToggle = function(rowData) {
						rowData.accessAllowed = ! rowData.accessAllowed;
						$modalInstance.dismiss('cancel');}
			    }],
				resolve:{
					rowData: function(){
		   			return rowData;
					}
				 }
			  });
		      modalInstance.result.then(function () {
		    	  
		      }, function () {
		      });		
	}
    
    $scope.toggleRoleEditAccessActive = function(rowData) {
		   var modalInstance = $modal.open({
				 scope: $scope,
				 animation: $scope.animationsEnabled,
				 templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-reports/modal/report-user-role-confirm-toggle.html',
				 sizeClass: 'modal-small',
				 controller: ['$scope', '$modalInstance', '$http', '$log','raptorReportFactory','rowData', function ($scope, $modalInstance, $http, $log, raptorReportFactory, rowData) {
					$scope.rowData = rowData;
					$scope.toggleEditAccessStatus = function(rowData) {
						raptorReportFactory.toggleRoleEditAccess(rowData); 
				        $modalInstance.close();
					};
					 
					$scope.cancelEditAccessToggle = function(rowData) {
						rowData.accessAllowed = ! rowData.accessAllowed;
						$modalInstance.dismiss('cancel');}
			    }],
				resolve:{
					rowData: function(){
		   			return rowData;
					}
				 }
			  });
		      modalInstance.result.then(function () {
		    	  
		      }, function () {
		      });		
	}
    
    
    
    
    
	// initialize the page at step 1;
    $scope.renderStep(1);
    
	// create a message to display in our view
	$scope.allProjects = [];
	if(!$routeParams.step && $routeParams.step == "") $routeParams.step = 1;
	if($routeParams.proj && $routeParams.proj > 0) 
		$scope.projid  = $routeParams.proj;
	if($routeParams.step)
		$scope.stepNum = $routeParams.step;
	else
		$scope.stepNum = 1;	

    $scope.jsonSrcName = getJsonSrcName($scope.stepNum);
    
    $scope.selectAction = function () {
      var containerElement = angular.element(document.getElementById("stepView"));
      containerElement.empty();
      $scope.project_name = this.prj.projectName;
      $scope.stepNum = 1;
      var stepNum = $scope.stepNum;      
      var jsonSrcName = 	getJsonSrcName(stepNum);
      stepFormFactory.renderForm(jsonSrcName, containerElement, $scope);
      renderProject(this.prj.id, 1);
    };

    
    $scope.createAction = function () {
      var containerElement = angular.element(document.getElementById("stepView"));
      containerElement.empty();
      $scope.stepNum = 1;
      var stepNum = $scope.stepNum;
      $scope.jsonSrcName = "app/fusion/scripts/DS2-view-models/ds2-reports/wz_steps/json/step"+$scope.stepNum +".json";
        var jsonSrcName = $scope.jsonSrcName;
      stepFormFactory.renderForm(jsonSrcName, containerElement, $scope);
    };

    // select current project
    renderProject = function (proj_id, stepNum) {
        var userSelectedPrjId = proj_id;
    	$http({
            method: 'GET',
            url: 'get_selected_project_data',   
            params:{'selectedPrjId':userSelectedPrjId, 'step': stepNum}
    		}).then(function successCallback(response) {
           	 var selectedproject = response.data;
           	$scope.projid  = userSelectedPrjId;
             //$scope.allProjects = projectLists; 
             //$location.path('/'+userSelectedPrjId+'/'+stepNum);
             var div = d3.select("#stepView");
             div.select("[name='proj_id']").text(userSelectedPrjId);
             div.select("[name='proj_id']").property("value", userSelectedPrjId);
             d3.select("[name='project_id']").property("value", userSelectedPrjId);
             var h3Text = div.select("h3").text();
             div.select("h3").text($scope.project_name+ " - " + h3Text);
             for (var key in selectedproject) {
            	  if (selectedproject.hasOwnProperty(key)) {
            	    var val = selectedproject[key];
            	    var formElement = d3.selectAll("[name='" + key +  "']");            	    
            	    if(formElement[0].length > 0)
            	     console.log(formElement.attr("type"));
            	    if(formElement[0].length > 0 && formElement.attr("type") === "radio") {
            	    	var formRadio = d3.selectAll("[id='" + key +"_"+val +  "']");
            	    	formRadio.property('checked', true);
            	    }
            	    if(formElement[0].length > 0 && formElement.property("type") === "textarea") {
            	    	div.select("textarea[name='" + key +"']").property('value', val);
            	    }
            	    if(formElement[0].length > 0 && formElement.attr("type") === "text") {
            	    	var formText = d3.selectAll("[name='" + key +  "']");
            	    	formText.property("value", val);            	    	
            	    }
            	    if(formElement[0].length > 0 && formElement.html().startsWith("<option")) {
            	    	var formSelect = d3.selectAll("[name='" + key + "']");
            	    	
            	    	var checkOption = function (e) {
            	    	    if(e.label === val){
            	    	        return formSelect.property("selectedIndex", e.index );
            	    	    }
            	    	};

            	    	formSelect.selectAll("option").forEach(function(d) {d.forEach(function(optionD) {checkOption(optionD); }) });
            	    }
            	    	 
            	    if(formElement[0].length == 0) {
            	    	if(key != 'step') {
                            if( Object.prototype.toString.call( val ) === '[object Array]' ) {
                    	    	val.forEach(function(d){
                    	    		for (var keyCheck in d) {
                    	    			if (d.hasOwnProperty(keyCheck)) {
                    	    				var valCheck = d[keyCheck];
                    	    				var formCheck = d3.selectAll("[name='" + key + "_"+keyCheck + "']");
                    	    				if(valCheck === true)
                    	    				formCheck.property('checked', true);
                    	    			}
                    	    		}
                    	    	});
                           }
            	    	}
            	    	var formElementOther = d3.selectAll("[name='" + key + "_"+ val + "']");
            	    	if(formElementOther[0].length > 0 && formElementOther.attr("type") === "checkbox") {
            	    		var formCheckbox = d3.selectAll("[name='" + key +"_"+val +  "']");
                	    	formRadio.property('checked', true);
            	    	}
            	    }
            	  }
            	}
             
             
             
    	});
    }
        
  //submit function
    $scope.submit = function(){
        let defer = $q.defer();
      
      	var div = d3.select("#stepView");
        var jsonSrcName = $scope.jsonSrcName;
        var stepNum = $scope.stepNum;
    	var values = "";
    	 $http({
             method: 'GET',
             url: jsonSrcName
             }).then(function successCallback(response) {
            	 var json = response.data;
            	 var step = json.step;
            	 if(step > 0) {
            		 var sections = json.content.sections;            		 
                     sections.forEach(function(d, i) {
                    	 var elements = d.elements;
                    	 if(elements) {
                             //elements.forEach(function(element, elementIndex) {
                    		 values += "{";
                    		 values += "\"step\""+ ":\"" + step + "\",";
                    		 values += "\"proj_id\""+ ":\"" + d3.select('input[name="project_id"]').property("value") + "\",";
                    		 
                    		 for (elementIndex = 0; elementIndex < elements.length; elementIndex++) {
                    			 var element = elements[elementIndex];
                            	 
                            	 if(elementIndex > 0) values += ",";  
                            	 values += "\""+element.name +"\""+ ":" ;
                            	 if(element.input === "hidden") {
                            		  values += "\""+div.select('input[name="'+element.name+'"]').property("value") +"\"";
                            	 }
                            	 if(element.input === "radio") {
                            		 values += "\""+ div.select('input[name="'+element.name+'"]:checked').property("value") +"\"";                            		 
                            	 }
                            	 if(element.input === "checkbox") {
                            		 var checkOptions = element.options;
                            		 values += "[{";
                            		 checkOptions.forEach(function(d, i) {
                                       // if(document.getElementById("'"+element.name+"_"+d.id+"'") != null)
                                		  values += "\""+d.id+"\""+ ":" + div.select('input[name="'+element.name+"_"+d.id+'"]').property("checked") ;
                                		  if(i<checkOptions.length-1) {
                                			  values +=  ",";
                                		  }
                            		 })
                            		 values += "}]";
                            	 }
                            	 if(element.input === "text") {
                            		 values += "\""+div.select('input[name="'+element.name+'"]').property("value") +"\"";
                            	 }                            	 
                            	 if(element.input === "textarea") {
                            		 values += "\""+div.select('textarea[name="'+element.name+'"]').node().value +"\"";
                            	 }                            	 
                            	 if(element.input === "select") {
                            		 values += "\""+ div.select('select[name="'+element.name+'"]').property("value") + "\"";
                            	 } 
                            	 
                             };
                             values += "}";
                    	 }
                     });
            	 }
        		 var valueJSON = JSON.parse(values);
        		 var valueStr = JSON.stringify(valueJSON, null, 4);
            	 $http({method:'POST', url:'save_steps', data: jsonSrcName, params:{'result' : valueStr, 'proj_id' : values.proj_id}}).success(function(data, status) {
                    if(data.project_name)
                        $scope.project_name = data.project_name;
       	            div.select("[name='proj_id']").property("value", data.proj_id);
       	            d3.select("[name='project_id']").property("value", data.proj_id);
       	            //$scope.projid = data.proj_id;
       	            valueStr=JSON.stringify(data, null, 4);
                    defer.resolve();
                    //stepNum = Number(stepNum || 0)+1;
       	            //document.getElementById('itestframe').src = data;
       	       
       	    	}) 

                defer.resolve();           	 
            	 
             });
       // $location.path('/step'+($scope.stepNum+1));
        return defer.promise;
    
    };
    
    //Save function
    $scope.save = function() {
	 	if ($scope.stepNum ==1) {	 		
	 		updateDefinitionData();
	 	} else if($scope.stepNum ==5) {
	 		$scope.saveReportSecurityInfo($scope.reportOwnerId.id,$scope.reportSecurityInfo.isPublic);
	 	}
	};

    //Next function
    $scope.next = function(){
	 	if ($scope.stepNum ==1) {	 		
	 		if ($scope.reportName==="") {
	 			$scope.throwReportNameMissingError();
	 			return;
	 		}
	 		updateDefinitionData();
	 	}
    	$scope.stepNum = $scope.stepNum +1;
    	$scope.activeTabsId = $scope.gTabs[$scope.stepNum-1].id;
    };   

    //Previous function
    $scope.previous = function(){
    	$scope.stepNum = $scope.stepNum -1;
    	$scope.activeTabsId = $scope.gTabs[$scope.stepNum-1].id;
    	
    };

	$scope.$on('RefreshInsession', function(event) {
		$scope.isEdit = true;
		$scope.reportId = -1;				
		$scope.getDefinitionById(-1);
	});
	
	    $scope.$on('openDrillDownpage', function(event, reportId) {
    	if (reportId!="") {
				$scope.openDrillDownReportPopup(reportId,$scope.reportId);
    	}
	});

    
	$scope.$on('RefreshFormField', function(event) {
		raptorReportFactory.getFormFieldList().then(function(data){
			$scope.formFieldData = data;
		},function(error){
			$log.error("raptorReportFactory: get formfields failed.");  
			});
	});

	$scope.$on('RefreshColumnList', function(event) {
		raptorReportFactory.getColumnList().then(function(data){
			$scope.colTableRowData = data;
		},function(error){
			$log.error("raptorReportFactory: get column list failed.");           
		});		
	});
	
    $scope.getAllProjects = function(){
    	$http({
            method: 'GET',
            url: 'get_projects'   
            }).then(function successCallback(response) {
           	 var projectLists = response.data;
             $scope.allProjects = projectLists; 
         });
    }

    // getAllProjects();

});
