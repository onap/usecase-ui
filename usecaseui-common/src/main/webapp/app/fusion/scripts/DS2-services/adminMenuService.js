appDS2.factory('AdminMenuService', function ($http, $q) {
	return {
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
                url: "jcs_admin/clearAll",
			
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
		
		
		
	};
});
