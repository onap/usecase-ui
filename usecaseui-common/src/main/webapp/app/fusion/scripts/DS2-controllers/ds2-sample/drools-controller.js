appDS2.controller('droolsController', function($scope, $modal, $routeParams, DroolsService, modalService) {
	$scope.tableDate=[];
	$scope.resultsString = "";
	$scope.postDroolsBean={
			droolsFile:'',
			className:'',
			selectedRules:''
	};
	$scope.filenameFromUrl = $routeParams.filename;
	if($scope.filenameFromUrl!='' && $scope.filenameFromUrl!='0')
		$scope.postDroolsBean.droolsFile = $scope.filenameFromUrl
	$scope.execute = function(postDroolsBean) {
		if($scope.postDroolsBean.droolsFile=='' ||$scope.postDroolsBean.className=='' || $scope.postDroolsBean.selectedRules=='' ){
			modalService.errorPopUp ("Required fields cannot be empty");
			return;
		}
		var uuu = "post_drools/execute";
		var postData={postDroolsBean:postDroolsBean};
		DroolsService.executeDrools(postData).then(function(data){	
			$scope.resultsString=data.resultsString;
			modalService.successPopUp($scope.resultsString);
		},function(error){
			modalService.errorPopUp (error);
		});
	};	
});

appDS2.controller('droolsListController', function($scope, $modal, DroolsService, modalService) {
	$scope.tableDate=[];
	$scope.resultsString = "";
	$scope.postDroolsBean="";
	
	$scope.getDroolsList = function(){
		DroolsService.getDroolsList().then(function(data){
			var j = data;
			$scope.tableData = JSON.parse(j.data);
			$scope.buildTable();
		},function(error){
			modalService.errorPopUp (error);
		});
	}
	
	$scope.buildTable = function(){
		for(x in $scope.tableData){
			if($scope.tableData[x].active_yn=='Y')
				$scope.tableData[x].active_yn=true;
			else
				$scope.tableData[x].active_yn=false;
		}
	}	
    
});

