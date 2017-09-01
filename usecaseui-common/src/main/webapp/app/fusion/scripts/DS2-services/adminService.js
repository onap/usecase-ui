appDS2.factory('AdminService', function ($http, $q) {
	return {		
	getRole: function(roleId) {			
			return $http.get('get_role?role_id=' + roleId)
			.then(function(response) {
				if (typeof response.data === 'object') {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
	
			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		},
		getCollaborateList: function() {
			return $http.get('get_collaborate_list')
			.then(function(response) {
				if (typeof response.data === 'object') {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
	
			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		},
		
		getCacheRegions: function() {
			return $http.get('get_regions')
			.then(function(response) {
				if (typeof response.data === 'object') {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
	
			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		},
			
		getUsageList: function() {
			return $http.get('get_usage_list')
			.then(function(response) {
				if (typeof response.data === 'object') {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
	
			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		},
		
getFnMenuItems: function(){
			
			return $http.get('admin_fn_menu')
			.then(function(response) {
				if (typeof response.data === 'object') {
					
					return response.data;
				} else {
					return $q.reject(response.data);
				}

			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});			
		},

/*		saveRoleFunctionList: function(roleData) {
			return $http.post('role_function_list/saveRoleFunction',{
				roleData
			})
			.then(function(response) {
				console.log(response);
				if (response.status == 200) {
					return response.data;
				} else {
					console.log('eror');
					return $q.reject(response.data);
				}
				return response.data;

			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		}*/
	
		getRoleFunctionList: function() {
			return $http.get('get_role_functions')
			.then(function(response) {
				if (typeof response.data === 'object') {
					return response.data;
				} else {
					return $q.reject(response.data);
				}

			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		},
		saveRoleFunctionList: function(roleData) {
			return $http({
				method: "POST",
                url: "role_function_list/saveRoleFunction",
                data:roleData
			
			}).then(function(response) {
				if (response.status == 200) {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
				return response.data;

			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		},
		addRoleFunctionList: function(roleData) {
			return $http({
				method: "POST",
                url: "role_function_list/addRoleFunction",
                data:roleData
			
			}).then(function(response) {
				if (response.status == 200) {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
				return response.data;

			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		},
		delRoleFunctionList: function(roleData) {
			return $http({
				method: "POST",
                url: "role_function_list/removeRoleFunction",
                data:roleData
			
			}).then(function(response) {
				if (response.status == 200) {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
				return response.data;

			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		},
		clearAdminRegions: function() {
			return $http({
				method: "GET",
                url: "jcs_admin/clearAll"
               
			}).then(function(response) {
				if (response.status == 200) {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
				return response.data;

			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		},
		
		showRegionDetails: function(cacheName) {
			return $http({
				method: "GET",
                	url: "jcs_admin/showRegionDetails?cacheName="+cacheName,
                contentType: 'application/json',
   			}).then(function(response) {
   				//var parsed = JSON.stringify(response);
				var responseData = JSON.stringify(response);
				if (response.status == 200) {
					return response;
				} else {
					return $q.reject(response.data);
				}
				return response.data;

			}, function(response) {
				console.log('response'+response);
				// something went wrong
				return $q.reject(response.data);
			});
		},
		
		clearRegionFunction: function(cacheName) {
			return $http({
				method: "GET",
                url: "jcs_admin/clearRegion?cacheName="+cacheName
			}).then(function(response) {
				if (response.status == 200) {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
				return response.data;

			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		},
		
		clearItemnFunction: function(cacheName, key) {
			return $http({
				method: "GET",
                url: "jcs_admin/clearItem?keyName="+key+"&cacheName="+cacheName
			
			}).then(function(response) {
				if (response.status == 200) {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
				return response.data;

			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		},
		
		showItemDetails: function(cacheName, key) {
			return $http({
				method: "GET",
                url: "jcs_admin/showItemDetails?keyName="+key+"&cacheName="+cacheName
			
			}).then(function(response) {
				if (response.status == 200) {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
				return response.data;

			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		},
		
		//role deletion
		delRoleList: function(roleData) {
			return $http({
				method: "POST",
                url: "role_list/removeRole",
                data:JSON.stringify({role:roleData})
			
			}).then(function(response) {
				if (response.status == 200) {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
				return response.data;

			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		},		
		
		// activate role
		activateRole: function(selected,availableRole){
			return $http({
				method: "POST",
                url: "role_list/toggleRole",
                data:JSON.stringify({role:availableRole})
			
			}).then(function(response) {
				if (response.status == 200) {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
				return response.data;

			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		}, 
		
		// save Role
		saveRole: function(role,roleId){
			return $http({
				method: "POST",
                url: "role/saveRole.htm?role_id="+roleId,
                data:JSON.stringify(role)
			
			}).then(function(response) {
				if (response.status == 200) {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
				return response.data;

			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		},
		
		// activate RoleFun Remove
		confirmRoleFunRemove: function(selected,availableRole,id){
			return $http({
				method: "POST",
                url: "role/removeRoleFunction.htm?role_id=" + id,
                data:JSON.stringify({roleFunction:availableRole})
			
			}).then(function(response) {
				if (response.status == 200) {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
				return response.data;

			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		},
		
		// activate RoleFun Add
		confirmRoleFunAdd: function(selected,availableRole,id){
			return $http({
				method: "POST",
                url: "role/addRoleFunction.htm?role_id=" + id,
                data:JSON.stringify({roleFunction:availableRole})
			
			}).then(function(response) {
				if (response.status == 200) {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
				return response.data;

			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		},
		
		// activate RoleChild Remove
		confirmRoleChildRemove: function(selected,availableRole,id){
			return $http({
				method: "POST",
                url: "role/removeChildRole.htm?role_id=" + id,
                data:JSON.stringify({roleFunction:availableRole})
			
			}).then(function(response) {
				if (response.status == 200) {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
				return response.data;

			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		},
		
		// activate RoleChild Add
		confirmRoleChildAdd: function(selected,availableRole,id){
			return $http({
				method: "POST",
                url: "role/addChildRole.htm?role_id=" + id,
                data:JSON.stringify({roleFunction:availableRole})
			
			}).then(function(response) {
				if (response.status == 200) {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
				return response.data;

			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		},
		
		//Role Function delete for associated role on Edit Role
		removeRoleFunction: function(roleFunction,roleId){
			return $http({
				method: "POST",
                url: "role/removeRoleFunction.htm?role_id=" + roleId,
                data:JSON.stringify({roleFunction:roleFunction})
			
			}).then(function(response) {
				if (response.status == 200) {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
				return response.data;

			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		}
		
/*		toggleProfileActiveFunction: function(profileId) {
			return $http({
				method: "GET",
                url: "jcs_admin/clearRegion?cacheName="+cacheName
			}).then(function(response) {
				if (response.status == 200) {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
				return response.data;

			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		}*/
	};
});
