appDS2.controller('selfProfileController', function($scope, $http, $modal, $routeParams, $rootScope,SelfProfileService){
	
	/************init values***********************/
	$scope.tableData=[];
	$scope.profile=[];
	$scope.oriProfile=[];
	$scope.ociavailableRoles=[];
	$scope.ociTimeZones;
	$scope.ociCountries;
	var stateList=[];
	$scope.availableRoles = []; 
	$scope.timeZones = []; 
	$scope.selectedTimeZone = {"index":'',"value":"","title":""};
	$scope.countries = []; 
	$scope.selectedCountry = {"index":'',"value":"","title":""};
	
	$scope.isUserSystemAdmin = false;
	$scope.profileId='';
	$scope.showLoader=false;
	$scope.pageType=1 /*1 for slef page 2 for general profile page*/
	$scope.pageTitle='Self Profile Detail';
	$scope.profileIdParam = $routeParams.profileId;
	if (typeof($scope.profileIdParam) != "undefined" && $scope.profileIdParam!=''){
		$scope.pageTitle='Profile Detail';
		$scope.pageType=2;
	}
	
	$scope.sbcid=$scope.profile.sbcid;
	$scope.managerAttuid=$scope.profile.managerAttuid;
	
	/***********************************************************functions***********************************************/
	$scope.getProfileDetail = function(profileIdParam){
		$scope.showLoader=true;
		SelfProfileService.getProfileDetail(profileIdParam).then(function(data){
			$scope.showLoader=false;
			var j = data;
			$scope.data = JSON.parse(j.data);
			$scope.profile =JSON.parse($scope.data.profile);			
			$scope.oriProfile=JSON.parse($scope.data.profile); /*original value*/
			$scope.profileId = $scope.profile.id;
			$scope.ociavailableRoles =JSON.parse($scope.data.availableRoles);
			$scope.ociTimeZones=JSON.parse($scope.data.timeZones);
			$scope.ociCountries=JSON.parse($scope.data.countries);
			stateList=JSON.parse($scope.data.stateList);
			$scope.sbcid=$scope.profile.sbcid;
			$scope.managerAttuid=$scope.profile.managerAttuid;
			
			if($scope.ociavailableRoles)
				$.each($scope.ociavailableRoles, function(i, a){ 
					var availableRole = a;
					availableRole.selected = false;
					$.each($scope.profile.roles, function(j, b){ 
						if(a.id === b.id) {
							availableRole.selected = true;
							if(a.id === 1){
								$scope.isUserSystemAdmin = true;
							}
						} 
					});
					$scope.availableRoles.push(availableRole);	    
				});	
			;
			if($scope.ociTimeZones){
				$.each($scope.ociTimeZones, function(i, a){ 
					var timeZone = {"index":i, "value":a.value, "title":a.label};
					$scope.timeZones.push(timeZone);
					if($scope.profile.timeZoneId !== null && a.value === $scope.profile.timeZoneId.toString()){
						$scope.selectedTimeZone = timeZone;
					}	    
				});	
			};
			if($scope.ociCountries)
				$.each($scope.ociCountries, function(i, a){ 
					var country = {"index":i, "value":a.value, "title":a.label};
					$scope.countries.push(country);
					if(a.value === $scope.profile.country){
						$scope.selectedCountry = country;
					}	    
				});	
			;
			stateList = stateList== null? []: stateList;
			var selectedState= $scope.profile.state ? $scope.profile.state:"";
			$scope.stateList = initDropdownWithLookUp(stateList,selectedState );
		},function(error){
			$scope.errorPopUp(error);
			$scope.showLoader=false;
		});
	}
	
	$scope.getSelfProfileDetail = function(){
		$scope.showLoader=true;
		SelfProfileService.getSelfProfileDetail().then(function(data){
			$scope.showLoader=false;
			var j = data;
			$scope.data = JSON.parse(j.data);
			$scope.profile =JSON.parse($scope.data.profile);
			$scope.oriProfile=JSON.parse($scope.data.profile); /*original value*/
			$scope.profileId = $scope.profile.id;
			$scope.ociavailableRoles =JSON.parse($scope.data.availableRoles);
			$scope.ociTimeZones=JSON.parse($scope.data.timeZones);
			$scope.ociCountries=JSON.parse($scope.data.countries);
			stateList=JSON.parse($scope.data.stateList);
			$scope.sbcid=$scope.profile.sbcid;
			$scope.managerAttuid=$scope.profile.managerAttuid;

			if($scope.ociavailableRoles)
				$.each($scope.ociavailableRoles, function(i, a){ 
					var availableRole = a;
					availableRole.selected = false;
					$.each($scope.profile.roles, function(j, b){ 
						if(a.id === b.id) {
							availableRole.selected = true;
							if(a.id === 1){
								$scope.isUserSystemAdmin = true;
							}
						} 
					});
					$scope.availableRoles.push(availableRole);	    
				});	
			;
			if($scope.ociTimeZones){
				$.each($scope.ociTimeZones, function(i, a){ 
					var timeZone = {"index":i, "value":a.value, "title":a.label};
					$scope.timeZones.push(timeZone);
					if($scope.profile.timeZoneId !== null && a.value === $scope.profile.timeZoneId.toString()){
						$scope.selectedTimeZone = timeZone;
					}	    
				});	
			};
			if($scope.ociCountries)
				$.each($scope.ociCountries, function(i, a){ 
					var country = {"index":i, "value":a.value, "title":a.label};
					$scope.countries.push(country);
					if(a.value === $scope.profile.country){
						$scope.selectedCountry = country;
					}	    
				});	
			;
			stateList = stateList== null? []: stateList;
			var selectedState= $scope.profile.state ? $scope.profile.state:"";
			$scope.stateList = initDropdownWithLookUp(stateList,selectedState );
		},function(error){
			$scope.errorPopUp(error);
			$scope.showLoader=false;
		});
	}
	
	
	$scope.removeRole = function(data) {
		var modalInstance = $modal.open({
			templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-profile/modals/role-del-confirm.html',
			controller: ModalInstanceCtrl,
			sizeClass: 'modal-small', 
			resolve: {
                items: function () {
                	var message = {
            			role:data,
            			roleId:$scope.profileId,
    				};
    				return message;
                }
	        }
		});	
	};
	$scope.addNewRoleFunctionModalPopup = function(data) {		
		var modalInstance = $modal.open({
			templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-profile/modals/role-add.html',
			controller: ModalInstanceCtrl,
			windowClass:'modal-docked',
			sizeClass: 'modal-medium', 
			resolve: {
                items: function () {
                	var message = {
                			roleFunctions:data,
                			roleId:$scope.profileId,
                			availableRoleFunctions:$scope.ociavailableRoles
    						};
    				return message;
                }
	        }
		});
	}
	
	
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
    
    $scope.errorPopUp = function (msg) {
    	var modalInstance = $modal.open({
			templateUrl: 'app/fusion/scripts/DS2-modal/error_modal.html',
			controller: ModalInstanceCtrl,
			sizeClass: 'modal-small',
			resolve: {
                items: function () {
                    return msg;
                }
	        }
		});
    };
	$scope.saveProfile = function() {
		$scope.errorMsg = '';
		if($scope.oriProfile.orgUserId != $scope.profile.orgUserId){
			$scope.errorPopUp('Organization User ID cannot be changed');
			return;
		}
		if($scope.oriProfile.orgManagerUserId != $scope.profile.orgManagerUserId){
			$scope.errorPopUp('Organization Manager ID cannot be changed');
			return;
		}
		if($scope.oriProfile.loginId != $scope.profile.loginId){
			$scope.errorPopUp('Login ID cannot be changed');
			return;
		}
		if($scope.oriProfile.loginPwd != $scope.profile.loginPwd){
			$scope.errorPopUp('Login Password cannot be changed');
			return;
		}
		
		var postData={
			profile: $scope.profile,
	        selectedCountry:$scope.selectedCountry!=null?$scope.selectedCountry.value:"",
	        selectedState:$scope.stateList.selected!=null?$scope.stateList.selected.value:"",
	        selectedTimeZone:$scope.selectedTimeZone!=null?$scope.selectedTimeZone.value:""
		};
		SelfProfileService.saveProfile(postData, $scope.profileId).then(function(msg){	
			$scope.successPopUp();
		},function(error){
			$scope.errorPopUp(error);
		});
	}
	/* updating role tables after adding or deleting*/
	$rootScope.$on('updateRoles',function(e,d){
		$scope.profile.roles = d.data;
	})
	/*****init call*****/
	
	if ($scope.pageType==2){
		$scope.getProfileDetail($scope.profileIdParam);
	}else{
		$scope.getSelfProfileDetail();
	}
	

	/****************************************************************popup modal*************************************************************/
	var ModalInstanceCtrl = function ($scope, $modalInstance, items,$rootScope) {
		$scope.roleFun=items;
		$scope.msg=items;
		$scope.activateRoleConfirmPopUp = function (selected, availableRole) {
			$scope.msg.roleFun = availableRole.name;
			$scope.msg.selected = selected;
			$scope.msg.availableRole = availableRole;
			var modalInstance = $modal.open({
				templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-profile/modals/role-add-confirm.html',
				controller: ModalInstanceCtrl,
				sizeClass: 'modal-small', 
				resolve: {
	                items: function () {
	                    return $scope.msg;
	                }
		        }
			});
		}
		$scope.confirmRoleDel = function(role,profileId){
			var postData={role:role};
			SelfProfileService.removeRole(postData,profileId).then(function(msg){	
				$scope.cancel();
				$scope.roleTableRefresh(profileId);
			},function(error){
				$scope.errorPopUp(error);
			});
		}
		$scope.confirmRoleFunAdd = function(availableRole,profileId){
			var postData={role:availableRole};		
			SelfProfileService.addRole(postData,profileId).then(function(msg){	
				$scope.cancel();
				$scope.roleTableRefresh(profileId);
			},function(error){
				$scope.errorPopUp(error);
			});
		}
		
		// confirm Role Function Remove
		$scope.confirmRoleFunRemove = function(availableRole,profileId){
			var postData={role:availableRole};		
			SelfProfileService.deRole(postData,profileId).then(function(msg){	
				$scope.cancel();
				$scope.roleTableRefresh(profileId);
			},function(error){
				$scope.errorPopUp(error);
			});
		}
		
	    $scope.cancel = function () {
	        $modalInstance.dismiss('cancel');
	    };
	    
	    $scope.cancelRoleFunSwitch = function (msg) {
	    	$scope.msg.availableRole.selected = !$scope.msg.availableRole.selected;
	        $modalInstance.dismiss('cancel');
	    };
	    
	    $scope.selfProfileRoleRefresh = function(){
	    	SelfProfileService.getSelfProfileDetail().then(function(data){
	    		var j = data;
				$scope.data = JSON.parse(j.data);
				$scope.profileTemp =JSON.parse($scope.data.profile);
				$rootScope.$broadcast('updateRoles',{data:$scope.profileTemp.roles});
	    	});
	    }
	    $scope.profileRoleRefresh = function(profileId){
	    	SelfProfileService.getProfileDetail(profileId).then(function(data){
	    		var j = data;
				$scope.data = JSON.parse(j.data);
				$scope.profileTemp =JSON.parse($scope.data.profile);
				$rootScope.$broadcast('updateRoles',{data:$scope.profileTemp.roles});
	    	});
	    }
	    $scope.roleTableRefresh = function (profileId) {
	    	if($scope.pageType==1)
	    		$scope.selfProfileRoleRefresh();
	    	else
	    		 $scope.profileRoleRefresh(profileId);  	
	    };

	};

});
function initDropdownWithLookUp(arr,selectedValue){
	var dropdownArray=[];
	var selected = null;
	if(arr){
		for(var i = 0,l = arr.length; i < l; i++) {
			var option = { 
			        "index" : i ,
			        "value" : arr[i].value,
			        "title" : arr[i].label
			    };
			dropdownArray.push(option);
			if(arr[i].value === selectedValue){
				selected = option;
			}
		}
	}
	var dropDown={};
	dropDown.options = dropdownArray;
	dropDown.selected = selected!=null?selected:{"index":'',"value":"","title":""};
	return dropDown;
};
