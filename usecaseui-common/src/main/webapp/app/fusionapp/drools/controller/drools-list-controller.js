app.controller("droolsListController", function ($scope,$http,droolsService, modalService, $modal) { 
	// Table Data
	droolsService.getDrools().then(function(data){
		
		var j = data;
  		$scope.tableData = JSON.parse(j.data);
  		//$scope.resetMenu();
	
	},function(error){
		console.log("failed");
		reloadPageOnce();
	});
	
	$scope.viewPerPage = 20;
    $scope.scrollViewsPerPage = 2;
    $scope.currentPage = 1;
    $scope.totalPage;
    $scope.searchCategory = "";
    $scope.searchString = "";
 /*    modalService.showSuccess('','Modal Sample') ; */
	for(x in $scope.tableData){
		if($scope.tableData[x].active_yn=='Y')
			$scope.tableData[x].active_yn=true;
		else
			$scope.tableData[x].active_yn=false;
	}
    $scope.openDialog = function(droolFile){
    	droolsService.setSelectedFile(droolFile);
    	$modal.open({
            templateUrl: 'app/fusionapp/drools/view-models/droolsView.html',
            controller: 'droolsViewController'
          
        })
    }
   

   
});

function openInNewTab(url) {
	  var win = window.open(url, '_blank');
	  win.focus();
};