appDS2.controller('usageListControllerDS2', function ($scope,$interval,$http,$modal, AdminService){
	AdminService.getUsageList().then(function(data){
		
		var j = data;
  		$scope.data = JSON.parse(j.data);
  		$scope.users =$scope.data;
  		//$scope.resetMenu();  			
  		
	},function(error){
		console.log("failed");
		reloadPageOnce();
	});
	
	$scope.successPopUp = function () {
		var modalInstance = $modal.open({
		templateUrl: 'app/fusion/scripts/DS2-modal/success_modal.html',
		controller: ModalInstanceCtrl,
		sizeClass: 'modal-small',
		resolve: {
		items: function () {
		return '';
		}
		}
		});
		};
		
	$scope.removeSession = function(sessionId) {

		$http.get("usage_list/removeSession?deleteSessionId="+sessionId).success(function(response){
			$scope.users=response;
			$scope.successPopUp();
	});
/*		modalService.popupConfirmWin("Confirm","You are about to expel this user from the application. All of their unsaved data will be lost. Do you want to continue?",
    			function(){
			          $http.get("usage_list/removeSession?deleteSessionId="+sessionId).success(function(response){$scope.users=response;});
    	})*/
		
	}
});