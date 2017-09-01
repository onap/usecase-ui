appDS2.controller("collaborateListControllerDS2", function ($scope,$http, $modal,AdminService) { 
	  
	$scope.showInput = true;
	$scope.totalPages1 = 5;
	$scope.viewPerPage1 = 8;
	$scope.currentPage1 = 1;
	$scope.showLoader = false;
	$scope.firstPlay = true;
	// Start with empty list to silence error in console
	$scope.tableData = [];
	$scope.tableCollbItems = [];
	// $scope.totalPages1 = 20;
	$scope.$watch('viewPerPage1', function(val) {
		$scope.showLoader = true;
		AdminService.getCollaborateList($scope.currentPage1, val).then(function(data){
			var j = data;	
			$scope.data = JSON.parse(j.data);
			$scope.tableData = $scope.data;
			var totalItems = $scope.tableData.length;
			//console.log(totalItems);
			$scope.totalPages1  = Math.ceil(totalItems / $scope.viewPerPage1);
			$scope.showLoader = false;
			$scope.currentPage1=1;
			var endIndex = 1 * $scope.viewPerPage1;
			var startIndex = endIndex - $scope.viewPerPage1;
			$scope.tableCollbItems = $scope.tableData.slice(startIndex, endIndex);
		},function(error){
			console.log("failed");
			reloadPageOnce();
		});
	});
	    
	$scope.customHandler1 = function(num) {
		$scope.currentPage1=num;
		var endIndex = num * $scope.viewPerPage1;
		var startIndex = endIndex - $scope.viewPerPage1;
		$scope.tableCollbItems = $scope.tableData.slice(startIndex, endIndex);
	};
		
	$scope.openCollaboration = function(chatId){
		openInNewTab('openCollaboration?chat_id=' + chatId);
	}
	   
	$scope.toggleProfileActive = function(profileId) {
		modalService.popupConfirmWin("Confirm","You are about to change user's active status. Do you want to continue?",
				function(){
			$http.get("profile/toggleProfileActive?profile_id="+profileId).success(function(){});	
		})
	};	 

});

function openInNewTab(url) {
	var win = window.open(url, '_blank');
	win.focus();  
};

function downloadScreenCaptureExtenstion() {
	  
	var chromeURL = 'https://chrome.google.com/webstore/detail/icgmlogfeajbfdffajhoebcfbibfhaen';
	var firefoxURL = 'https://addons.mozilla.org/en-US/firefox/addon/screen-capturing-capability';
	var url;
	  
	if(isChrome)
		url = chromeURL;
	else if(isFirefox)
		url = 	firefoxURL;
	  
	var win = window.open(url);
	win.focus();
};
