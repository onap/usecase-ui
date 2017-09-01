appDS2.controller('nbookController', ['$scope', '$location','$window','$http', function ($scope,$location,$window,$http) { 
	$scope.keyValueList = [{}];
	$scope.submitParameters = function() {
		$scope.iframevisibility = false;
		$scope.postData = {};
		$scope.additionalqueryParams = {};
		//Use this if there is only one 1 query param key value pair 
		$scope.additionalqueryParams.paramKey = $scope.qparamKey;
		$scope.additionalqueryParams.paramVal = $scope.qparamVal;
		var qryStr = '';
		for(var i = 0; i < $scope.keyValueList.length; i++) {
		    var obj = $scope.keyValueList[i];
		    if (obj.qK != undefined && obj.qV != undefined) { 
		    	if (qryStr!='')
			    	qryStr = qryStr+'&'+obj.qK+'='+obj.qV;
			    else
			    	qryStr = obj.qK+'='+obj.qV;
		    }
		}		
		var queryurl = 'nbooktest.htm?nid='+$scope.notebookvalue+'&'+qryStr;
		window.open (queryurl,'_self',false);
	}
	$scope.addKeyValuePairs = function (kv) {
		if ($scope.keyValueList.length < 9) {
			$scope.keyValueList.push({  
			      });			
		} else {
			document.getElementById("addbtn")["disabled"]  = true;
		}
	}
	$scope.removeKeyValuePairs = function (index) {
		$scope.keyValueList.splice(index, 1);
		if ($scope.keyValueList.length == 8) {
			document.getElementById("addbtn")["disabled"]  = false;
		}
	}
}]);