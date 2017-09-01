appDS2.controller('AdminMenuEditController', function ($scope, AdminMenuService,  $modal, $route,AdminService){
	
	  $scope.showInput = true;
      $scope.totalPages1 = 5;
      $scope.viewPerPage1 = 8;
      $scope.currentPage1 = 1;
      $scope.showLoader = false;
      $scope.firstPlay = true;
      $scope.tableFnMenuItems = [];
      $scope.$watch('viewPerPage1', function(val) {
    	  $scope.showLoader = true;
    	  AdminMenuService.getFnMenuItems($scope.currentPage1, val).then(function(data){
    		  var j = data;
    		  $scope.data = JSON.parse(j.data);
    		  $scope.fnMenuItems = $scope.data.fnMenuItems;
    		  var totalItems = $scope.fnMenuItems.length;
    		  $scope.totalPages1  = Math.ceil(totalItems / $scope.viewPerPage1);
    		  for (x in $scope.fnMenuItems) {
    			  if ($scope.fnMenuItems[x].active_yn=='Y')
    				  $scope.fnMenuItems[x].active_yn=true;
    			  else
    				  $scope.fnMenuItems[x].active_yn=false;
    		  }
    		  $scope.showLoader = false;
    		  $scope.currentPage1=1;
    		  var endIndex = 1 * $scope.viewPerPage1;
    		  var startIndex = endIndex - $scope.viewPerPage1;
    		  $scope.tableFnMenuItems = $scope.fnMenuItems.slice(startIndex, endIndex);
	    	},function(error){
	    		console.log('AdminMenuEditControler::$watch viewPerPage1 failed', error);
	    		reloadPageOnce();
	    	});
			
		});
	    
	    $scope.customHandler1 = function(num) {
	    	$scope.currentPage1=num;
            var endIndex = num * $scope.viewPerPage1;
            var startIndex = endIndex - $scope.viewPerPage1;
            $scope.tableFnMenuItems = $scope.fnMenuItems.slice(startIndex, endIndex);
	    };
		
	    $scope.init = function () {
	    	$scope.numberOfRecordstoShow=20;
	    	AdminMenuService.getFnMenuItems().then(function(data){ 
	    		var j = data;
	    		$scope.data =JSON.parse(j.data);
	    		$scope.fnMenuItems =($scope.data.fnMenuItems);  	
			},function(error){
				console.log('AdminMenuEditControler::init failed');
			}); 
	    }

	    $scope.init();
	    
	    $scope.mapActiveStatus = function(status){
	    	if(status)
	    		status = "Y";
    		else
    			status = "N";
	    	return status;
	    };

	    $scope.addNewFnMenuItemModalPopup = function(availableFnMenuItem) {
	    	$scope.editFnMenuItem = null;
	    	var modalInstance = $modal.open({
	    		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/modals/popup-modal-fnmenu-add.html',
	    		controller: fn_menu_popupController,
	    		resolve: {
	    			message: function () {
	    				var message = {
	    						availableFnMenuItem: $scope.editFnMenuItem
	    				};
	    				return message;
	    			}					
	    		}
	    	});
	    	
	    	modalInstance.result.then(function(response){
	    		// console.log('response', response);
	    		$scope.availableFnMenuItems=response.availableFnMenuItems; 
	    		$route.reload();
	    	});
		
	    };
		
	    $scope.removeMenuItem = function (fnMenuItem) {
	    	var modalInstance = $modal.open({
	    		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/modals/admin-menu-del-confirm.html',
	    		controller: deletefn_menu_popupController,
	    		sizeClass: 'modal-small', 
	    		resolve: {
	    			items: function () {
	    				var message = {
	    						title:    '',
	    						text:     fnMenuItem.label
	    				};
	    				return fnMenuItem;
	    			}
	    		} 	
	    	});
	    };
	
	
	    $scope.editRoleFunction = null;
	    var dialog = null;
	    $scope.editRoleFunctionPopup = function(availableRoleFunction) {
	    	$scope.editRoleFunction = availableRoleFunction;
	    	$( "#dialog" ).dialog({
	    		modal: true
	    	});
	    };
	
	    $scope.editMenuItemModalPopup = function(availableFnMenuItem) {
	    	$scope.editFnMenuItem = availableFnMenuItem;
	    	var modalInstance = $modal.open({
	    		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/modals/popup-modal-fnmenu-add.html',
	    		controller: fn_menu_popupController,
	    		resolve: {
	    			message: function () {
	    				var message = {
	    						availableFnMenuItem: $scope.editFnMenuItem
	    				};
	    				return message;
	    			}					
	    		}
	    	});
	    	
	    	modalInstance.result.then(function(response){
	    		$scope.availableFnMenuItems=response.availableFnMenuItems;
	    		$route.reload();
	    	});
	    };	
	
	    $scope.editRoleFunctionModalPopup = function(availableRoleFunction) {
	    	$scope.editRoleFunction = availableRoleFunction;
	    	var modalInstance = $modal.open({
	    		templateUrl: 'edit_role_function_popup.html',
	    		controller: 'rolefunctionpopupController',
	    		resolve: {
	    			message: function () {
	    				var message = {
	    						availableRoleFunction: $scope.editRoleFunction
	    				};
	    				return message;
	    			}					
	    		}
	    	}); 
	    	modalInstance.result.then(function(response){
	    		// console.log('response', response);
	    		$scope.availableRoleFunctions=response.availableRoleFunctions;
	    	});
	    };
	
	    $scope.addNewRoleFunctionModalPopup = function(availableRoleFunction) {
	    	$scope.editRoleFunction = null;
	    	var modalInstance = $modal.open({
	    		templateUrl: 'edit_role_function_popup.html',
	    		controller: 'rolefunctionpopupController',
	    		resolve: {
	    			message: function () {
	    				var message = {
	    						availableRoleFunction: $scope.editRoleFunction
	    				};
	    				return message;
	    			}					
	    		}
		  }); 
		
	    	modalInstance.result.then(function(response){
	    		$scope.availableRoleFunctions=response.availableRoleFunctions;
	    	});
	    };
	
	    $scope.addNewRoleFunctionPopup = function() {
	    	$scope.editRoleFunction = null;
	    	$( "#dialog" ).dialog({
	    		modal: true
	    	});
	    };
	


});
