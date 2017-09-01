app.controller('notebookFrameController', function ($scope,$location,$window,$http,$routeParams) {	
	var nid = $window.location.search.substr($window.location.search.indexOf("=")+1);
	$scope.additionalqueryParams={};
	if ($window.location.search.substr($window.location.search.indexOf("=")+1)) {
		$scope.queryParams = $window.location.search;
		if($window.location.search.substring(0, $window.location.search.length-1).indexOf("&")!=-1) {
			$scope.notebookparam = $window.location.search.substring($window.location.search.indexOf("?")+1,$window.location.search.indexOf("&"));
			$scope.additionalqueryParams = JSON.parse('{"' + decodeURI($scope.queryParams.substr($scope.queryParams.indexOf("&")+1).replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
		}
		else {
			$scope.notebookparam1 = $window.location.search.substr($window.location.search.indexOf("?")+1);
			$scope.notebookparam = $scope.notebookparam1.substring(0, $scope.notebookparam1.length - 1);
		}
		$scope.notebookvalue = $scope.notebookparam.substr($scope.notebookparam.indexOf("=")+1);
	}
	else {
		$scope.notebookvalue = '833c0a69ec1433fbb2f8752af733cf0e';
		//console.log('Notebook value absent ',$scope.notebookvalue);
	}
	$http({method:'POST', url:'rNotebookFE/authCr', data: $scope.notebookvalue, params:{'qparams' : $scope.additionalqueryParams}}).success(function(data, status) {
        //console.log('Data received', data);
        //console.log('Status ', status);
        document.getElementById('itestframe').src = data;
   
	})
});
