appDS2.controller('profileSearchCtrlDS2', function($scope, $log, $modal, ProfileServiceDS2){
    $scope.showInput = true;
    $scope.totalPages1 = 0;
    $scope.viewPerPage1 = 8;
    $scope.currentPage1 = 1;
    $scope.showLoader = false;

    var debug = false;
    
	$scope.$watch('viewPerPage1', function(val) {
		$scope.showLoader = true;
		ProfileServiceDS2.getProfilePagination($scope.currentPage1, val).then(function(data){
    		var j = data;
      		$scope.data = JSON.parse(j.data);
      		$scope.tableData =JSON.parse($scope.data.profileList);     		
      		$scope.totalPages1 =JSON.parse($scope.data.totalPage);
      		$scope.showLoader = false;
    	},function(error){
    		console.log("watch of viewPerPage1 failed");
    		reloadPageOnce();
    	});
		
	});
	    
	$scope.customHandler = function(num) {
	    	$scope.currentPage1 = num;	 
	    	$scope.showLoader = true;
	    	ProfileServiceDS2.getProfilePagination($scope.currentPage1,$scope.viewPerPage1).then(function(data){
	    		var j = data;
	      		$scope.data = JSON.parse(j.data);
	      		$scope.tableData =JSON.parse($scope.data.profileList);
	      		$scope.totalPages1 =JSON.parse($scope.data.totalPage);
	      		$scope.showLoader = false;
	    	},function(error){
	    		console.log("customHandler failed");
	    		reloadPageOnce();
	    	});

	    };

	$scope.editRow = function(profileId){
        window.location = 'userProfile#/profile/' + profileId;
    };
   
	var ModalInstanceCtrl = function ($scope, $log, $modalInstance, items) {
		$scope.msg = items;
	
		$scope.toggleUserStatus = function(id) {
			if (debug)
				$log.debug('profileSearchCtrlDS2:ModalInstanceCtrl:toggleUserStatus: data is ' + id);
			ProfileServiceDS2.toggleProfileStatus(id);
	        $modalInstance.close();
		};
    
		$scope.cancelUserStatusToggle = function(rowData) {
			if (debug)
				$log.debug('profileSearchCtrlDS2:ModalInstanceCtrl: cancelUserStatusToggle: data is ' + JSON.stringify(rowData));
			// Undo the toggle of the checkbox
			rowData.active = ! rowData.active;
			$modalInstance.dismiss('cancel');
		}	
		
	}

	// user activation/deactivation
	$scope.toggleProfileActive = function(rowData) {
		if (debug)
			$log.debug('profileSearchCtrlDS2:toggleProfileActive: id is ' + rowData.id 
				+ ', active is ' + rowData.active);
		var toggleType = null;
		// The checkbox is already in the desired state,
		// so the sense of the "if" is reversed here.
		if (rowData.active)
			toggleType = "activate";
		else
			toggleType = "deactivate";
		var modalInstance = $modal.open({
			templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-profile/modals/profile-confirm-toggle.html',
			controller: ModalInstanceCtrl,
			sizeClass: 'modal-small', 
			resolve: {
				items: function () {
					var message = {
						text : toggleType,
						rowData : rowData
					};
					return message;
				}
	        }
		});
	};
    
});
