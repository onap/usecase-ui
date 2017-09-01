appDS2.controller('reportChartController', function ($scope, $rootScope, $timeout, $window, $http, $routeParams,modalService) {
	$scope.showLoader = true;
    $scope.commonOptionOpen = false;
    $scope.additionalOptionOpen = false;
    $scope.barChartOptionOpen = false;
    $scope.timeSeriesChartOptionOpen = false;
	$scope.selectedChartType = {value:""};
    $scope.chartTypeOptions = [
        {value: 'BarChart3D', text: 'Bar Chart'},
        {value: 'TimeSeriesChart', text: 'Time Series/Area Chart'},
        {value: 'PieChart', text: 'Pie Chart'},    	
        {value: 'AnnotationChart', text: 'Annotation Chart'},
        {value: 'FlexTimeChart', text: 'Flexible Time Chart'}    
    ];
        
	$scope.populateChrtWzdFields = function() {
		$scope.reportRunJson = {};
		$http.get("raptor.htm?action=chart.json&c_master="+$routeParams.reportId).then(function (response) {
			$scope.reportRunJson = response.data;
			  //Set chart type
			$scope.reportRunJson.commonChartOptions.animateAnimatedChart = $scope.reportRunJson.commonChartOptions.animateAnimatedChart+"";
			$scope.reportRunJson.commonChartOptions.hideLegend = $scope.reportRunJson.commonChartOptions.hideLegend + "";
			$scope.reportRunJson.showTitle = $scope.reportRunJson.showTitle + "";
			
			// if barChartOptions is not null
			if ($scope.reportRunJson.barChartOptions) {
				$scope.reportRunJson.barChartOptions.displayBarControls = $scope.reportRunJson.barChartOptions.displayBarControls+"";
				$scope.reportRunJson.barChartOptions.minimizeXAxisTickers = $scope.reportRunJson.barChartOptions.minimizeXAxisTickers+"";
				$scope.reportRunJson.barChartOptions.stackedChart = $scope.reportRunJson.barChartOptions.stackedChart+"";
				$scope.reportRunJson.barChartOptions.timeAxis =$scope.reportRunJson.barChartOptions.timeAxis+""; 
				$scope.reportRunJson.barChartOptions.verticalOrientation = $scope.reportRunJson.barChartOptions.verticalOrientation +"";
				$scope.reportRunJson.barChartOptions.xAxisDateType = $scope.reportRunJson.barChartOptions.xAxisDateType +"";
				}			
			
			  if ($scope.reportRunJson.chartTypeJSON) {
				  var chrtTypeValue = $scope.reportRunJson.chartType;
					 for(var i = 0; i < $scope.chartTypes.length; i++) {
						    if ($scope.chartTypes[i].value==chrtTypeValue) {
						    	$scope.reportRunJson.chartTypeJSON.index=$scope.chartTypes[i].index;						    	
						    	$scope.reportRunJson.chartTypeJSON.value=$scope.chartTypes[i].value;
						    	$scope.reportRunJson.chartTypeJSON.title=$scope.chartTypes[i].title;
						    }
	
					}
			  }	 
				 
				//Set Domain Axis
				 if ($scope.reportRunJson.domainAxisJSON) {
					  var domaninAxisValue = $scope.reportRunJson.domainAxisJSON.value;
						 for(var i = 0; i < $scope.reportRunJson.chartColumnJSONList.length; i++) {
							   if ($scope.reportRunJson.chartColumnJSONList[i].value==domaninAxisValue) {
							    	$scope.reportRunJson.domainAxisJSON.index=$scope.reportRunJson.chartColumnJSONList[i].index;
							    	$scope.reportRunJson.domainAxisJSON.title=$scope.reportRunJson.chartColumnJSONList[i].title;
							    }
		
						}
				  }
				 
				//Set Category
				 if ($scope.reportRunJson.categoryAxisJSON) {
					  var categoryAxisValue = $scope.reportRunJson.categoryAxisJSON.value;
						 for(var i = 0; i < $scope.reportRunJson.chartColumnJSONList.length; i++) {
							   if ($scope.reportRunJson.chartColumnJSONList[i].value==categoryAxisValue) {
							    	$scope.reportRunJson.categoryAxisJSON.index=$scope.reportRunJson.chartColumnJSONList[i].index;
							    	$scope.reportRunJson.categoryAxisJSON.title=$scope.reportRunJson.chartColumnJSONList[i].title;
							    }
						}
				  }
				 
				//Set range axis label
		if ($scope.reportRunJson.rangeAxisList) {
			for(var j = 0; j < $scope.reportRunJson.rangeAxisList.length; j++) { 
				 
				 if ($scope.reportRunJson.rangeAxisList[j].rangeAxisLabelJSON) {
					  var rangeAxisLabelValue = $scope.reportRunJson.rangeAxisList[j].rangeAxisLabelJSON.value;
						 for(var i = 0; i < $scope.reportRunJson.chartColumnJSONList.length; i++) {
							   if ($scope.reportRunJson.chartColumnJSONList[i].value==rangeAxisLabelValue) {
							    	$scope.reportRunJson.rangeAxisList[j].rangeAxisLabelJSON.index=$scope.reportRunJson.chartColumnJSONList[i].index;
							    	$scope.reportRunJson.rangeAxisList[j].rangeAxisLabelJSON.title=$scope.reportRunJson.chartColumnJSONList[i].title;
							    }
						}
				  }
			}
		}
				
				
				//set range linetype
				if ($scope.reportRunJson.rangeAxisList) {
					for(var j = 0; j < $scope.reportRunJson.rangeAxisList.length; j++) { 
						 if ($scope.reportRunJson.rangeAxisList[j].rangeLineTypeJSON != null && $scope.reportRunJson.rangeAxisList[j].rangeLineTypeJSON.value != ""
							 && $scope.reportRunJson.rangeAxisList[j].rangeLineTypeJSON.value != null) {
							 var lineTypeValue = $scope.reportRunJson.rangeAxisList[j].rangeLineTypeJSON.value;
							 for(var i = 0; i < $scope.lineTypes.length; i++) {
								    if ($scope.lineTypes[i].value==lineTypeValue) {
								    	$scope.reportRunJson.rangeAxisList[j].rangeLineTypeJSON.index=$scope.lineTypes[i].index;
								    	$scope.reportRunJson.rangeAxisList[j].rangeLineTypeJSON.title=$scope.lineTypes[i].title;
								    }
							}
						} else {
							$scope.reportRunJson.rangeAxisList[j].rangeLineTypeJSON = null;
						}  
					}
				}
				//set range color
				if ($scope.reportRunJson.rangeAxisList) {
					for(var j = 0; j < $scope.reportRunJson.rangeAxisList.length; j++) { 
						 if ($scope.reportRunJson.rangeAxisList[j].rangeColorJSON != null && $scope.reportRunJson.rangeAxisList[j].rangeColorJSON.value != ""
							 && $scope.reportRunJson.rangeAxisList[j].rangeColorJSON.value != null) {
							 var colorValue = $scope.reportRunJson.rangeAxisList[j].rangeColorJSON.value; 
							 for(var i = 0; i < $scope.rangeColors.length; i++) {
								 if ($scope.rangeColors[i].value==colorValue) {
									 $scope.reportRunJson.rangeAxisList[j].rangeColorJSON.index=$scope.rangeColors[i].index;
									 $scope.reportRunJson.rangeAxisList[j].rangeColorJSON.title=$scope.rangeColors[i].title;
								 }
							 }
						 }else {
							 $scope.reportRunJson.rangeAxisList[j].rangeColorJSON = null; 
						 }
					}
				}
				$scope.showLoader = false;				
	 	  });
		
	 	$scope.legend = "true";
	}
	
	$scope.saveChartData = function() {
		$scope.showLoader = true;

		$scope.reportRunJson.commonChartOptions.animateAnimatedChart = ($scope.reportRunJson.commonChartOptions.animateAnimatedChart=="true")
		$scope.reportRunJson.commonChartOptions.hideLegend = ($scope.reportRunJson.commonChartOptions.hideLegend=="true");
		$scope.reportRunJson.showTitle = ($scope.reportRunJson.showTitle=="true");
		
		$scope.reportRunJson.chartTypeJSON = {
				'index':0,'title':'','value':''};
		
		
		if (($scope.reportRunJson.chartType == "BarChart3D")&&($scope.reportRunJson.barChartOptions)) {
			$scope.reportRunJson.barChartOptions.displayBarControls = ($scope.reportRunJson.barChartOptions.displayBarControls=="true") ;
			$scope.reportRunJson.barChartOptions.minimizeXAxisTickers = ($scope.reportRunJson.barChartOptions.minimizeXAxisTickers=="true") ;
			$scope.reportRunJson.barChartOptions.stackedChart = ($scope.reportRunJson.barChartOptions.stackedChart=="true") ;
			$scope.reportRunJson.barChartOptions.timeAxis= ($scope.reportRunJson.barChartOptions.timeAxi=="true") ;
			$scope.reportRunJson.barChartOptions.verticalOrientation = ($scope.reportRunJson.barChartOptions.verticalOrientation=="true") ;
			$scope.reportRunJson.barChartOptions.xAxisDateType = ($scope.reportRunJson.barChartOptions.xAxisDateType=="true") ;
		}
		
		for (var i=0;i<$scope.chartTypes.length;i++) {
			if ($scope.reportRunJson.chartType==$scope.chartTypes[i].value) {
				$scope.reportRunJson.chartTypeJSON = {
						'index':$scope.chartTypes[i].index,
						'title':$scope.chartTypes[i].title,
						'value':$scope.chartTypes[i].value					
				}				
			}
		}
		
		$scope.reportRunJson.domainAxisJSON = {
				"index":0,"value":$scope.reportRunJson.domainAxis,"title": $scope.reportRunJson.domainAxis
			};
		$scope.reportRunJson.categoryAxisJSON = {
				"index":0,"value":$scope.reportRunJson.categoryAxis,"title": $scope.reportRunJson.categoryAxis
			};
		
		// Specifically for DS2 for color 
		for (var i=0; i<$scope.reportRunJson.rangeAxisList.length; i ++) {
			$scope.reportRunJson.rangeAxisList[i].rangeColorJSON = 
			{"index":0, "value": $scope.reportRunJson.rangeAxisList[i].rangeColor, "title": ""};
			
			$scope.reportRunJson.rangeAxisList[i].rangeLineTypeJSON = 				
			{"index":0, "value": "", "title": ""};
			for (var j=0;j<$scope.lineTypes.length;j++) {
				if ($scope.reportRunJson.rangeAxisList[i].rangeLineType ==$scope.lineTypes[j].value) {
					$scope.reportRunJson.rangeAxisList[i].rangeLineTypeJSON = 				
					{"index":$scope.lineTypes[j].index, "value": $scope.lineTypes[j].value, "title": $scope.lineTypes[j].title};
				}
			}
			
		}
		
		//Converting string variables to numbers
		$scope.reportRunJson.commonChartOptions.rightMargin = Number($scope.reportRunJson.commonChartOptions.rightMargin);
		$scope.reportRunJson.commonChartOptions.topMargin = Number($scope.reportRunJson.commonChartOptions.topMargin);
		$scope.reportRunJson.commonChartOptions.bottomMargin = Number($scope.reportRunJson.commonChartOptions.bottomMargin);
		$scope.reportRunJson.commonChartOptions.leftMargin = Number($scope.reportRunJson.commonChartOptions.leftMargin);
	 
		if ($scope.reportRunJson.categoryAxisJSON == "") { 
			$scope.reportRunJson.categoryAxisJSON = {}; 
			$scope.reportRunJson.categoryAxisJSON.value = -1; 
		}
		//add the remove list to the json
		$scope.reportRunJson.rangeAxisRemoveList= $scope.rangeAxisRemoveList;
		$http.post("save_chart", JSON.stringify($scope.reportRunJson)).success(function(data, status) {
			 $scope.successSubmit=true;  
			$scope.showLoader = false;
			$scope.reportRunJson.commonChartOptions.animateAnimatedChart = $scope.reportRunJson.commonChartOptions.animateAnimatedChart+"";
			$scope.reportRunJson.commonChartOptions.hideLegend = $scope.reportRunJson.commonChartOptions.hideLegend + "";
			$scope.reportRunJson.showTitle = $scope.reportRunJson.showTitle + "";			
			if ($scope.reportRunJson.chartType == "BarChart3D") {
				$scope.reportRunJson.barChartOptions.displayBarControls = $scope.reportRunJson.barChartOptions.displayBarControls+"";
				$scope.reportRunJson.barChartOptions.minimizeXAxisTickers = $scope.reportRunJson.barChartOptions.minimizeXAxisTickers+"";
				$scope.reportRunJson.barChartOptions.stackedChart = $scope.reportRunJson.barChartOptions.stackedChart+"";
				$scope.reportRunJson.barChartOptions.timeAxis =$scope.reportRunJson.barChartOptions.timeAxis+""; 
				$scope.reportRunJson.barChartOptions.verticalOrientation = $scope.reportRunJson.barChartOptions.verticalOrientation +"";
				$scope.reportRunJson.barChartOptions.xAxisDateType = $scope.reportRunJson.barChartOptions.xAxisDateType +"";
			}	
			$scope.populateChrtWzdFields();
		})
	}
	
	
	$scope.addRangeAxisRow = function (rangeaxisitem) {
		$scope.reportRunJson.rangeAxisList.push({
	      });	
	};

	$scope.rangeAxisRemoveList= [];
	$scope.removeRangeAxisRow = function (index) {	
		$scope.rangeAxisRemoveList.push($scope.reportRunJson.rangeAxisList[index]);
		$scope.reportRunJson.rangeAxisList[index].removed="true";
	};
	
	
	$scope.init = function () {
		if ($scope) { 
			$scope.populateChrtWzdFields();
			$scope.reportRunJson.rangeAxisRemoveList= [];
		}
	};
	
	
	
	$scope.domainItems = [{title:"Domain Axis1", content:"Test1", open: false},{title:"Domain Axis2", content:"Test2", open: false}];
	
	$scope.chartTypes = [        
	                     {index: 0, value: 'BarChart3D', title: 'Bar Chart'},
	                     {index: 1, value: 'TimeSeriesChart', title: 'Time Series/Area Chart'},
	                     {index: 2, value: 'PieChart', title: 'Pie Chart'},
	                     {index: 3, value: 'AnnotationChart', title: 'Annotation Chart'},
	                     {index: 4, value: 'FlexTimeChart', title: 'Flexible Time Chart'}
	 ];
	 
	 $scope.categories = [        
		                     {index: 0, value: 'scenario_name', title: 'scenario_name'},
		                     {index: 1, value: 'total_traffic_in_PB', title: 'Total Traffic in PB'},
		                     {index: 2, value: 'Avg Utilization Day', title: 'Avg Utilization Day'}      
		 ];
	 
	 $scope.rangeColors = [        		                     
		                     {index: 0, value: "#1f77b4",title: "Dodger Blue"},  						
							 {index: 1, value: "#ff7f0e",title: "Vivid orange"},							
							 {index: 2, value: "#2ca02c",title: "Forest Green"},							
							 {index: 3, value: "#8c864b",title: "Greenish Red"},							
							 {index: 4, value: "#9467bd",title: "Desaturated violet"},					
							 {index: 5, value: "#8c564b",title: "Dark moderate red"},					
							 {index: 6, value: "#e377c2",title: "Soft pink"},							
							 {index: 7, value: "#7f7f7f",title: "Dark gray"},							
							 {index: 8, value: "#bcbd22",title: "Strong yellow"},						
							 {index: 9, value: "#17becf",title: "Strong cyan"},							
							 {index: 10, value: "#dc143c",title: "Vivid red"},							
							 {index: 11, value: "#800080",title: "Dark magenta"},							
							 {index: 12, value: "#0000FF",title: "Blue"},									
							 {index: 13, value: "#008000",title: "Dark lime green"},						
							 {index: 14, value: "#D2691E",title: "Reddish Orange"},					
							 {index: 15, value: "#FF0000",title: "Red"},								
							 {index: 16, value: "#000000",title: "Black"},								
							 {index: 17, value: "#DB7093",title: "Pink"},								
							 {index: 18, value: "#FF00FF",title: "Pure Magenta"},						
							 {index: 19, value: "#7B68EE",title: "Soft blue"},							
							 {index: 20, value: "#1f77b6",title: "Strong blue"},						
							 {index: 21, value: "#9edae5",title: "Very soft cyan"},						
							 {index: 22, value: "#393b79",title: "Dark Blue"},							
							 {index: 23, value: "#5254a3",title: "Dark moderate Blue"},					
							 {index: 24, value: "#6b6ecf",title: "Slightly desaturated blue"},			
							 {index: 25, value: "#9c9ede",title: "Very soft blue"},			
							 {index: 26, value: "#637939",title: "Dark Green"},							
							 {index: 27, value: "#8ca252",title: "Dark moderate green"},				
							 {index: 28, value: "#b5cf6b",title: "Slightly desaturated green"},			
							 {index: 29, value: "#cedb9c",title: "Desaturated Green"},	
     
							 /* Old Colors  */
							 {index: 30, value: "#00FFFF",title: "Aqua"},
							 {index: 31, value: "#000000",title: "Black"},
							 {index: 32, value: "#0000FF",title: "Blue"},
							 {index: 33, value: "#FF00FF",title: "Fuchsia"},
							 {index: 34, value: "#808080",title: "Gray"},
							 {index: 35, value: "#008000",title: "Green"},
							 {index: 36, value: "#00FF00",title: "Lime"},
							 {index: 37, value: "#800000",title: "Maroon"},
							 {index: 38, value: "#000080",title: "Navy"},
							 {index: 39, value: "#808000",title: "Olive"},
							 {index: 40, value: "#FF9900",title: "Orange"},
							 {index: 41, value: "#800080",title: "Purple"},
							 {index: 42, value: "#FF0000",title: "Red"},
							 {index: 43, value: "#C0C0C0",title: "Silver"},
							 {index: 44, value: "#008080",title: "Teal"},
							 {index: 45, value: "#FFFFFF",title: "White"},
							 {index: 46, value: "#FFFF00",title: "Yellow"}
						];	
    
    
	 $scope.lineTypes = [        
	                     {index: 0, value: 'default', title: 'Default'},
	                     {index: 1, value: 'dotted_lines', title: 'Dotted Lines'},
	                     {index: 2, value: 'dashed_lines', title: 'Dashed Lines'}       
	 ]; 
	 
	 $scope.hardCodeReport= {
		   "reportID":"3356",
		   "reportName":"Test: Line Chart",
		   "reportDescr":"",
		   "reportTitle":"",
		   "reportSubTitle":"",
		   "formFieldList":[
		   ],
		   "chartColumnJSONList":[
		      {
		         "index":0,
		         "value":"tr0",
		         "title":"traffic_date",
		         "$$hashKey":"056"
		      },
		      {
		         "index":1,
		         "value":"ut1",
		         "title":"util_perc",
		         "$$hashKey":"057"
		      }
		   ],
		   "formfield_comments":null,
		   "totalRows":0,
		   "chartSqlWhole":"SELECT traffic_date tr0, traffic_date tr0_1,util_perc ut1, 1 FROM portal.demo_util_chart   ORDER BY 1",
		   "chartAvailable":true,
		   "chartType":{"index": "", "value": "Bar Chart", "title": ""},
		   "width":"700",
		   "height":"420",
		   "animation":false,
		   "rotateLabels":"90",
		   "staggerLabels":false,
		   "showTitle":"false",
		   "domainAxis":{
			      "index":0,
			      "value":"tr0",
			      "title":"traffic_date",
			      "$$hashKey":"11H"
			   },

			   "categoryAxis":{
				      "index":1,
				      "value":"ut1",
				      "title":"util_perc",
				      "$$hashKey":"11I"
				   },

		   "hasCategoryAxis":false,
		   "rangeAxisList":[
		      {
		         
		         "rangeColor":{
		        	"index":"",
		            "value":"#bcbd22",
		            "title":""
		         },
		         
		         "rangeLineType":{
		            "index":"",
		            "value":"dotted_lines",
		            "title":""
		         },		         
		         "rangeAxisLabel":{
		            "index":0,
		            "value":"tr0",
		            "title":"traffic_date",
		            "$$hashKey":"056"
		         },
		         "YAxis":"10",
		         "chartTitle":"test"
		      },
		      {      
			         "rangeColor":{
			        	"index":"",
			            "value":"#2ca02c",
			            "title":""
			         },
			         
			         "rangeLineType":{
			            "index":"",
			            "value":"dashed_lines",
			            "title":""
			            
			            
			         },
			         
			         "rangeAxisLabel":{
			            "index":0,
			            "value":"tr0",
			            "title":"traffic_date",
			            "$$hashKey":"056"
			         },
			         "YAxis":"10",
			         "chartTitle":"test"
			      }
		      
		     
		   ],
		  
		   "primaryAxisLabel":"testlabel",
		   "secondaryAxisLabel":"testseclabel",
		   "minRange":"10",
		   "maxRange":"20",
		   "topMargin":"6",
		   "bottomMargin":"5",
		   "leftMargin":"4",
		   "rightMargin":"3"
		};
	 
	 var colorValue = $scope.hardCodeReport.rangeAxisList[0].rangeColor.value;
	 	 
	 	$timeout(function() {
			$rootScope.isViewRendering = false;
			});


});

appDS2.directive('onlyDigits', function () {

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) return;
            ngModel.$parsers.unshift(function (inputValue) {
                var digits = inputValue.split('').filter(function (s) { return (!isNaN(s) && s != ' '); }).join('');
                ngModel.$viewValue = digits;
                ngModel.$render();
                return digits;
            });
        }
    };
});

appDS2.directive('onlyCharacters', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) return;
            ngModel.$parsers.unshift(function (inputValue) {
                var digits = inputValue.split('').filter(function (s) { return (isNaN(s) && s != ' '); }).join('');
                ngModel.$viewValue = digits;
                ngModel.$render();
                return digits;
            });
        }
    };
});



