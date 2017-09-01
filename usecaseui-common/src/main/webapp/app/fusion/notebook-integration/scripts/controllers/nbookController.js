
app.config(function($routeProvider) {
	$routeProvider
	
	.otherwise({
	//		templateUrl: 'app/fusion/notebook-integration/scripts/view-models/notebook-frame.html',
		templateUrl: 'app/fusion/notebook-integration/scripts/view-models/notebookInputs.html',	
		controller: 'nbookController'
		});
}).controller('nbookController', ['$scope', '$location','$window','$http', function ($scope,$location,$window,$http) { 
	
	$scope.keyValueList = [{}];
	console.log('onload nbookController');
	$scope.submitParameters = function() {
		
		$scope.iframevisibility = false;
		console.log('Inside nbook invoke save');
		
		$scope.postData = {};
		
		$scope.additionalqueryParams = {};
		
	//Use this if there is only one 1 query param key value pair 
		$scope.additionalqueryParams.paramKey = $scope.qparamKey;
		$scope.additionalqueryParams.paramVal = $scope.qparamVal;
		
		
	//	console.log('$scope.additionalqueryParams',$scope.additionalqueryParams);
		console.log('$scope.notebookvalue',$scope.notebookvalue);
		

		console.log('$scope.additionalqueryParams',$scope.additionalqueryParams);
	
		console.log('$scope.keyValueList',$scope.keyValueList);

		console.log('$scope.keyValueList.length',$scope.keyValueList.length);
		
		var qryStr = '';
		for(var i = 0; i < $scope.keyValueList.length; i++) {
		    var obj = $scope.keyValueList[i];
		    //console.log('obj.qK',obj.qK);
		    if (obj.qK != undefined && obj.qV != undefined) { 
		    	//console.log('Inside qk defined');
		    	if (qryStr!='')
			    	qryStr = qryStr+'&'+obj.qK+'='+obj.qV;
			    else
			    	qryStr = obj.qK+'='+obj.qV;
			    
		    }
		    
		}
		console.log('qryStr',qryStr);

		
		
		//var testurl = 'nbooktest.htm?nid='+$scope.notebookvalue+'&k1='+$scope.additionalqueryParams.paramKey+'&v1='+$scope.additionalqueryParams.paramVal;
		
	//	var testurl = 'nbooktest.htm?nid='+$scope.notebookvalue+'&'+$scope.additionalqueryParams.paramKey+'='+$scope.additionalqueryParams.paramVal;
		
		var queryurl = 'nbooktest.htm?nid='+$scope.notebookvalue+'&'+qryStr;
		
	//	var testurl = 'notebook.htm#/notebook-frame';
		
		window.open (queryurl,'_self',false);
	
		
	} 
	
	$scope.addKeyValuePairs = function (kv) {
			
			
		if ($scope.keyValueList.length < 9) {
			$scope.keyValueList.push({  
			  
			      });
			//	alert($scope.reportRunJson.rangeAxisList.length);
			//	console.log('$scope.keyValueList',$scope.keyValueList);
			
		} else {
			//document.getElementById("addbtn").disabled = true;
			//	$scope.btnactive = false;
			document.getElementById("addbtn")["disabled"]  = true;
			//document.getElementById("addbtn")["style.background-color"]  = "#FFFF00";
			
			//$('#addbtn').btn('type') = "disabled";
		}
	}

	$scope.removeKeyValuePairs = function (index) {
		$scope.keyValueList.splice(index, 1);
		if ($scope.keyValueList.length == 8) {
			document.getElementById("addbtn")["disabled"]  = false;
		}
		//console.log($scope.hardCodeReport.rangeAxisList)
	}

}]);