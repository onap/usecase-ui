appDS2.controller('adminController', function($scope, $http,AdminService, $modal, $routeParams, $rootScope){

	$scope.totalPages = 5;
	$scope.viewPerPage = 8;
	$scope.searchString = "";
	$scope.currentPage = 1;
	$scope.nextSort="";
	$scope.showLoader = false;
	$scope.tableData=[];
	$scope.showLoader=false;
	$scope.routeRoleId = $routeParams.roleId;
	$scope.regions = [];
	/*function*/
	$scope.getFunctionList = function(){
		$scope.tableData.length=0;
		$scope.showLoader=true;
		AdminService.getRoleFunctionList().then(function(data){	
			var j = data;
			$scope.data = JSON.parse(j.data);
			$scope.tableData =JSON.parse($scope.data.availableRoleFunctions);
		},function(error){
			console.log("failed");
		}).finally(function() {
			$scope.showLoader=false; // Always execute this on both error and success
		});
	}
	
	$scope.getCacheRegionsList = function(){
		 AdminService.getCacheRegions().then(function(data){
				var j = data;
		  		$scope.data = JSON.parse(j.data);
		  		$scope.regions =$scope.data;
			},function(error){
				console.log("failed");
			});
		}
	

	$scope.delRoleFunc = function(roleData){
		AdminService.delRoleFunctionList(roleData).then(function(msg){	
			var message = msg;
			if(message.data!=null && message.data!=''){
				var status = message.data;
				if(status=='"success"'){
					$scope.successPopUp();	
					$scope.getFunctionList();
				}else{
					$scope.errorPopUp('');	
				}	
			}
					
		},function(error){
			
		});
	}
			
    $scope.saveRoleFunction = function(roleData){
		AdminService.saveRoleFunctionList(roleData).then(function(msg){	
			var message = msg;
			if(message.data!=null && message.data!=''){
				var status = message.data;
				if(status=='"success"'){
					$scope.successPopUp();	
					$scope.getFunctionList();
				}else{
					$scope.errorPopUp('');	
				}	
			}
					
		},function(error){
			
		});
	}
    
    $scope.addRoleFunction = function(roleData){
		AdminService.addRoleFunctionList(roleData).then(function(msg){	
			var message = msg;
			if(message.data!=null && message.data!=''){
				var status = message.data;
				if(status=='"success"'){
					$scope.successPopUp();	
					$scope.getFunctionList();
				}else if(status=='"code exists"'){
					$scope.errorPopUp('Code already exists');	
					$scope.getFunctionList();
				}else{
					$scope.errorPopUp('');	
				}	
			}
					
		},function(error){
			
		});
	}
    /*init*/
	$scope.getFunctionList();
	$scope.getCacheRegionsList();
    /*popup*/
	var ModalInstanceCtrl = function ($scope, $modalInstance, items, AdminService,$rootScope) {
		$scope.roleFun=items;
		$scope.msg=items;
		
		// remove role function associated to a role on Role Edit page
		$scope.roleFunRemoveRole = function (roleFunction) {
			AdminService.removeRoleFunction(roleFunction, $routeParams.roleId).then(function(msg){	
				var message = msg;
				$scope.cancel();
				if(message.role){
					$rootScope.$broadcast('updateRoleFunctions',{data:message.role});
				}else{
					$modal.open({
						templateUrl: 'app/fusion/scripts/DS2-modal/error_modal.html',
						controller: ModalInstanceCtrl,
						sizeClass: 'modal-small',
						resolve: {
			                items: function () {
			                    return msg;
			                }
				        }
					})
				}	
						
			},function(error){
				console.log("error");
			});
		}
		
		//role activation for selected child role
		$scope.activateRoleChildConfirmPopUp = function (selected, availableRole) {
			$scope.msg.roleFun = availableRole.name;
			$scope.msg.selected = selected;
			$scope.msg.availableRole = availableRole;
			var toggleType = null;
			if(selected) {
				toggleType = "activate";
			} else {
				toggleType = "inactivate";
			}
			var modalInstance = $modal.open({
				templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/modals/role-child-add-confirm.html',
				controller: ModalInstanceCtrl,
				sizeClass: 'modal-small', 
				resolve: {
	                items: function () {
	                    return $scope.msg;
	                }
		        }
			});
		}
		
		// confirm Child Role Add
		$scope.confirmRoleChildAdd = function(selected,availableRole,id){
			AdminService.confirmRoleChildAdd(selected,availableRole,id).then(function(msg){	
				var message = msg;
				$scope.cancel();
				if(message.role){
				}else{
					$modal.open({
						templateUrl: 'app/fusion/scripts/DS2-modal/error_modal.html',
						controller: ModalInstanceCtrl,
						sizeClass: 'modal-small',
						resolve: {
			                items: function () {
			                    return msg;
			                }
				        }
					})
				}	
						
			},function(error){
				console.log("error");
			});
		}
		
		// confirm Child Role Remove
		$scope.confirmRoleChildRemove = function(selected,availableRole,id){
			AdminService.confirmRoleChildRemove(selected,availableRole,id).then(function(msg){	
				var message = msg;
				$scope.cancel();
				if(message.role){
					//$rootScope.$broadcast('updateAvailbleRoles',{data:message.availableRoles});
					/*$modal.open({
						templateUrl: 'app/fusion/scripts/DS2-modal/success_modal.html',
						sizeClass: 'modal-small',
					})*/
				}else{
					$modal.open({
						templateUrl: 'app/fusion/scripts/DS2-modal/error_modal.html',
						controller: ModalInstanceCtrl,
						sizeClass: 'modal-small',
						resolve: {
			                items: function () {
			                    return msg;
			                }
				        }
					})
				}	
						
			},function(error){
				console.log("error");
			});
		}
		
		//role activation for role function
		$scope.activateRoleConfirmPopUp = function (selected, availableRole) {
			$scope.msg.roleFun = availableRole.name;
			$scope.msg.selected = selected;
			$scope.msg.availableRole = availableRole;
			var toggleType = null;
			if(selected) {
				toggleType = "activate";
			} else {
				toggleType = "inactivate";
			}
			var modalInstance = $modal.open({
				templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/modals/role-fun-add-confirm.html',
				controller: ModalInstanceCtrl,
				sizeClass: 'modal-small', 
				resolve: {
	                items: function () {
	                    return $scope.msg;
	                }
		        }
			});
		}
		
		// confirm Role Function Add
		$scope.confirmRoleFunAdd = function(selected,availableRole,id){
			AdminService.confirmRoleFunAdd(selected,availableRole,id).then(function(msg){	
				var message = msg;
				$scope.cancel();
				if(message.role){
					$rootScope.$broadcast('updateRoleFunctions',{data:message.role});
				}else{
					$modal.open({
						templateUrl: 'app/fusion/scripts/DS2-modal/error_modal.html',
						controller: ModalInstanceCtrl,
						sizeClass: 'modal-small',
						resolve: {
			                items: function () {
			                    return msg;
			                }
				        }
					})
				}	
						
			},function(error){
				console.log("error");
			});
		}
		
		// confirm Role Function Remove
		$scope.confirmRoleFunRemove = function(selected,availableRole,id){
			AdminService.confirmRoleFunRemove(selected,availableRole,id).then(function(msg){	
				var message = msg;
				$scope.cancel();
				if(message.role){
					$rootScope.$broadcast('updateRoleFunctions',{data:message.role});
				}else{
					$modal.open({
						templateUrl: 'app/fusion/scripts/DS2-modal/error_modal.html',
						controller: ModalInstanceCtrl,
						sizeClass: 'modal-small',
						resolve: {
			                items: function () {
			                    return msg;
			                }
				        }
					})
				}	
						
			},function(error){
				console.log("error");
			});
		}
		
		//role activation
		$scope.roleActivate = function(selected,availableRole){			
			AdminService.activateRole(selected,availableRole).then(function(msg){	
				var message = msg;
				$scope.cancel();
				if(message.availableRoles){
					$rootScope.$broadcast('updateAvailbleRoles',{data:message.availableRoles});
				}else{
					$modal.open({
						templateUrl: 'app/fusion/scripts/DS2-modal/error_modal.html',
						controller: ModalInstanceCtrl,
						sizeClass: 'modal-small',
						resolve: {
			                items: function () {
			                    return msg;
			                }
				        }
					})
				}	
						
			},function(error){
				console.log("error");
			});
		}
		
		//role deletion
		$scope.delRole = function(roleData){
			AdminService.delRoleList(roleData).then(function(msg){	
				var message = msg;
				$scope.cancel();
				if(message.availableRoles){
					$rootScope.$broadcast('updateAvailbleRoles',{data:message.availableRoles});
				}else{
					$modal.open({
						templateUrl: 'app/fusion/scripts/DS2-modal/error_modal.html',
						controller: ModalInstanceCtrl,
						sizeClass: 'modal-small',
						resolve: {
			                items: function () {
			                    return msg;
			                }
				        }
					})
				}	
						
			},function(error){
				
			});
		}
		
	    $scope.save = function (data) {
	        $modalInstance.close(data);
	    };

		// Cancel for toggle switch on Role Fn  
	    $scope.cancelRoleFunSwitch = function (msg) {
	    	$scope.msg.availableRole.selected = !$scope.msg.availableRole.selected;
	        $modalInstance.dismiss('cancel');
	    };
	    
	    // Cancel for toggle switch on Role List 
	    $scope.cancelRoleSwitch = function (msg) {
	    	$scope.msg.availableRole.active = !$scope.msg.availableRole.active;
	        $modalInstance.dismiss('cancel');
	    };
	    
	    $scope.cancel = function () {
	        $modalInstance.dismiss('cancel');
	    };
	    
	    $scope.deleteFun = function(data){
	    	 $modalInstance.close(data);
	    }
	};
	
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
    
    $scope.successTestModelPopUp = function (response) {
    	var modalInstance = $modal.open({
			templateUrl: 'app/fusion/scripts/DS2-modal/success_modalpopup.html',
			controller: ModalInstanceCtrl,
			sizeClass: 'modal-large',
			resolve: {
				items: function () {
	        	   var message = {
	        			   title:    '',
                   		text:     response
                   	};
		          return message;
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
	$scope.saveRoleFuncPopUp = function (availableRoleFunction) {
		var modalInstance = $modal.open({
			templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/modals/role-function-edit.html',
			controller: ModalInstanceCtrl,
			sizeClass: 'modal-small', 
			resolve: {
                items: function () {
                    return availableRoleFunction;
                }
	        }
		});
		
		modalInstance.result.then(function (data) {
	       $scope.saveRoleFunction(data);
        });
	}
	
	$scope.addRoleFuncPopUp = function (availableRoleFunction) {
		var modalInstance = $modal.open({
			templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/modals/role-function-add.html',
			controller: ModalInstanceCtrl,
			sizeClass: 'modal-small', 
			resolve: {
                items: function () {
                    return availableRoleFunction;
                }
	        }
		});
		
		modalInstance.result.then(function (data) {
	       $scope.addRoleFunction(data);
        });
	}
	
	$scope.delRoleFuncConfirmPopUp = function (availableRoleFunction) {
		var modalInstance = $modal.open({
			templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/modals/role-function-del-confirm.html',
			controller: ModalInstanceCtrl,
			sizeClass: 'modal-small', 
			resolve: {
				items: function () {
					var message = {
						title:    '',
						text:     availableRoleFunction.name,
						content:  availableRoleFunction
					};
					return message;
				}
	        }
		});
		
		modalInstance.result.then(function (data) {
	       $scope.delRoleFunc(data.content);
        });
	}
	$scope.clearAllFuncPopUp = function () {
		var modalInstance = $modal.open({
			templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/modals/cache-menu-clear-confirm.html',
			controller: ModalInstanceCtrl,
			sizeClass: 'modal-small', 
			resolve: {
                items: function () {
                }
	        }
		});
		
		modalInstance.result.then(function () {
	       $scope.clearAll();
        });
	}
	
	 $scope.clearAll = function(){
			AdminService.clearAdminRegions().then(function(msg){
				var message = msg;
				if(message.data!=null && message.data!=''){
					var status = message.data;
					if(status=='"success"'){
						$scope.successTestModelPopUp('');	
						$scope.getCacheRegionsList();
					}else{
						$scope.errorPopUp();	
					}	
				}
						
			},function(error){
				
			});
		}
	 $scope.showRegionDetailsFuncPopUp = function (response) {
			var modalInstance = $modal.open({
				templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/modals/success_modalpopup.html',
				controller: ModalInstanceCtrl,
				resolve: {
					items: function () {
 	        	   var message = {
 	        			   title:    '',
                       		text:     response,
                       	};
			          return message;
			        	}
		        }
			});
			
			modalInstance.result.then(function (response) {
		       $scope.showRegionDetails(response);
	        });
		}
	 
	 $scope.showRegionDetails = function(cacheName) {
		 AdminService.showRegionDetails(cacheName).then(function(res){
			 
				var message = res.data;
				var msgParsed = JSON.stringify(message);
				
				var messaged = message.data;
				var msgParsedd = JSON.stringify(messaged);				
				
				if(message.data!=null && message.data!=''){
					var status = res.status;

					
					if(status==200){
					
						
					
						var htmlstring = message.data.toString();
						var htmlStrReplace = htmlstring.replace(/['"]+/g, '');
						var htmlStrReplaceSplit = htmlStrReplace.split('\n');
						var dataStr = htmlStrReplace.replace(/\\n/g, "\n"); 
					$scope.successTestModelPopUp(dataStr);
					}else{
						$scope.errorPopUp('');	
					}	
				}
						
			},function(error){
				
			});
		}
	 
		$scope.clearRegionFuncPopUp = function (cacheName) {
			var modalInstance = $modal.open({
				templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/modals/cache-menu-clear-region-confirm.html',
				controller: ModalInstanceCtrl,
				sizeClass: 'modal-small', 
				resolve: {
					items: function () {
    	        	   var message = {
    	        			   title:    '',
                          		text:     cacheName
                          	};
 			          return message;
			        	}
		        }
			});
			
			modalInstance.result.then(function (cacheName) {
		       $scope.clearRegionFunction(cacheName);
	        });
		}
		
	    $scope.clearRegionFunction = function(cacheName){
			AdminService.clearRegionFunction(cacheName).then(function(msg){	
				var message = msg;
				if(message.data!=null && message.data!=''){
					var status = message.data;
					if(status=='"success"'){
						$scope.successPopUp();	
						$scope.getCacheRegionsList()();
					}else{
						$scope.errorPopUp('');	
					}	
				}
						
			},function(error){
				
			});
		}
	    
		$scope.clearItemFuncPopUp = function (cacheName, key) {
			var modalInstance = $modal.open({
				templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/modals/clearItem-region-confirm.html',
				controller: ModalInstanceCtrl,
				sizeClass: 'modal-small', 
				resolve: {
					items: function () {
    	        	   var message = {
    	        			   title:    '',
                          		text:     cacheName
                          	};
 			          return message;
			        	}
		        }
			});
			
			modalInstance.result.then(function (cacheName, key) {
		       $scope.clearItemFunction(cacheName, key);
	        });
		}
		
	    $scope.clearItemFunction = function(cacheName, key){
			AdminService.clearItemnFunction(cacheName, key).then(function(msg){	
				var message = msg;
				if(message.data!=null && message.data!=''){
					var status = message.data;
					if(status=='"success"'){
						$scope.successPopUp();	
						$scope.getCacheRegionsList()();
					}else{
						$scope.errorPopUp('');	
					}	
				}
						
			},function(error){
				
			});
		}
	    
	    
	
	$scope.showItemDetails = function(cacheName, key){
		AdminService.showItemDetails(cacheName, key).then(function(msg){	
			var message = msg;
			if(message.data!=null && message.data!=''){
				var status = message.data;
				if(status=='"success"'){
					
					$scope.successPopUp();	
					$scope.getCacheRegionsList()();
				}else{
					$scope.errorPopUp('');	
				}	
			}
					
		},function(error){
			
		});
	}
		

	//role deletion pop up
	$scope.delRoleConfirmPopUp = function (availableRole) {
		
		var modalInstance = $modal.open({
			templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/modals/role-delete-confirm.html',
			controller: ModalInstanceCtrl,
			sizeClass: 'modal-small', 
			resolve: {
                items: function () {
                	var message = {
    						availableRole:availableRole,
    						roleName: availableRole.name
    						};
    				return message;
                }
	        }
		});		
	}
	
	// role activation
	$scope.activateRoleConfirmPopUp = function (selected, availableRole) {
		var toggleType = null;
		if(selected) {
			toggleType = "activate";
		} else {
			toggleType = "inactivate";
		}
		var modalInstance = $modal.open({
			templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/modals/role-confirm-activation.html',
			controller: ModalInstanceCtrl,
			sizeClass: 'modal-small', 
			resolve: {
				items: function () {
				var message = {
						text: toggleType,
						selected:selected,
						availableRole:availableRole,
						roleName:availableRole.name
						};
				return message;
				}
	        }
		});
	}
		
	$scope.roleFnInit = function(){
		$scope.showLoader=true;
		AdminService.getRole($routeParams.roleId).then(function(data){
			
			var j = data;
	  		$scope.data = JSON.parse(j.data);
	  		$scope.role =JSON.parse($scope.data.role);
	  		
	  		$scope.ociavailableRoleFunctions =JSON.parse($scope.data.availableRoleFunctions);
	  		$scope.availableRoleFunctions=[];
	  		
	  		if($scope.ociavailableRoleFunctions)
	  			angular.forEach($scope.ociavailableRoleFunctions, function(a,i){ 
	  				var availableRoleFunction = a;
	  				availableRoleFunction.selected = false;
	  			   angular.forEach($scope.role.roleFunctions, function(b,j){ 
	  			    	if(a.code === b.code) {
	  			    		availableRoleFunction.selected = true;
	  			    	}
	  			    });
	  			    $scope.availableRoleFunctions.push(availableRoleFunction);	    
	  		});	
	  		
	
	  		$scope.ociavailableRoles=JSON.parse($scope.data.availableRoles);
	  		$scope.availableRoles=[];
	
		},function(error){
			console.log("roleControllerDS2 failed: " + error);
			reloadPageOnce();
		}).finally(function() {
			$scope.showLoader=false; // Always execute this on both error and success
		});
	}
	
	// updating roles on role list page after deletion of a role
	$rootScope.$on('updateAvailbleRoles', function(e,d){
		$scope.ociavailableRoles = d.data;
	})
	
	// updating role functions on roles page after deletion of a role function
	$rootScope.$on('updateRoleFunctions',function(e,d){
			$scope.role = d.data;
	})

	$scope.roleFnInit();
	
	$scope.saveRole = function() {
		var errorMsg;
		$scope.showLoader=true; 
		if($scope.role.id == null || $scope.role.id == undefined ){
		$scope.role = {
				'id':null,
				'created':null,
				'modified':null,
				'createdId':null,
				'modifiedId':null,
				'rowNum':null,
				'auditUserId':null,
				'auditTrail':null,
				'name':$scope.role.name,
				'active':false,
				'priority':$scope.role.priority,
				'roleFunctions':null,
				'childRoles':null,
				'toggleActiveAltText':"Click to Activate Role ",
				'toggleActiveImage':" / static fusion images inactive.png ",
				'editUrl':" role.htm ? role_id = null",
				};
		}
		// Validate non-empty priority as integer
		if ($scope.role.priority && $scope.role.priority != '' && isNaN(parseInt($scope.role.priority))) {
			errorMsg = 'Priority must be an integer.';
			var modalInstance = $modal.open({
				templateUrl: 'app/fusion/scripts/DS2-modal/error_modal.html',
				controller: ModalInstanceCtrl,
				sizeClass: 'modal-small', 
				resolve: {
					items: function () {
						return errorMsg;
					}
		        }
			});
			return;
		}
		for (x in $scope.availableRoles){
			if ($scope.availableRoles[x].name==$scope.role.name){
				errorMsg = 'Role already exists.';
				var modalInstance = $modal.open({
					templateUrl: 'app/fusion/scripts/DS2-modal/error_modal.html',
					controller: ModalInstanceCtrl,
					sizeClass: 'modal-small', 
					resolve: {
						items: function () {
							return errorMsg;
						}
			        }
				});
				return;
			}
		}
		if(!errorMsg){
			var postData={
					role: $scope.role, 
					childRoles: $scope.role.childRoles, 
					roleFunctions : $scope.role.roleFunctions
			};
			AdminService.saveRole(postData, $routeParams.roleId).then(function(msg){
				if(msg.role){
					sessionStorage.setItem('addCall', true);
					location.href='admin#/role/'+msg.role.id;
					$scope.availableRoles.push(msg);
					$scope.routeRoleId = msg.role.id;
					$rootScope.$broadcast('updateAvailbleRoles',{data:$scope.availableRoles});
					//saving the addCall variable in sessionStorage to change the url from AddRole to Edit Role on success of Save and displaying the success pop up
					if(sessionStorage.addCall){
						$modal.open({
							templateUrl: 'app/fusion/scripts/DS2-modal/success_modal.html',
							sizeClass: 'modal-small'
						});
						sessionStorage.removeItem('addCall');
					}
				} else{
					var modalInstance = $modal.open({
						templateUrl: 'app/fusion/scripts/DS2-modal/error_modal.html',
						controller: ModalInstanceCtrl,
						sizeClass: 'modal-small', 
						resolve: {
							items: function () {
								msg = 'Error saving Role. Please retry';
								return msg;
							}
				        }
					});
				}
			},function(error){
				console.log("error msg");
			}).finally(function() {
				$scope.showLoader=false; // Always execute this on both error and success
			});
					
		}
	}
				
	$scope.addNewRoleFunctionModalPopup = function(data, role,info) {		
		var modalInstance = $modal.open({
			templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/modals/role-functions-modal.html',
			controller: ModalInstanceCtrl,
			sizeClass: 'modal-large', 
			windowClass:"modal-docked",
			resolve: {
                items: function () {
                	var message = {
                			role:role,
                			roleId:info.id,
                			availableRoleFunctions:$scope.ociavailableRoleFunctions
    						};
    				return message;
                }
	        }
		});
	}
		
	$scope.addNewChildRoleFunctionModalPopup = function(data, role,info) {	
		data = $scope.role;
		var modalInstance = $modal.open({
			templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/modals/role-functions-child-roles-modal.html',
			controller: ModalInstanceCtrl,
			sizeClass: 'modal-large', 
			resolve: {
                items: function () {
                	var message = {
                			roleChildFunctions:$scope.ociavailableRoles,
                			role:role,
                			roleId:info.id
    						};
    				return message;
                }
	        }
		});
	}
	
	// remove role function associated to a role on Role Edit page
	$scope.removeRoleFunction= function(roleFunction){
		var modalInstance = $modal.open({
			templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/modals/role-fun-role-del-confirm.html',
			controller: ModalInstanceCtrl,
			sizeClass: 'modal-small', 
			resolve: {
                items: function () {
                	var message = {
                			roleFunction:roleFunction
    						};
    				return message;
                }
	        }
		});
	}
	
});
