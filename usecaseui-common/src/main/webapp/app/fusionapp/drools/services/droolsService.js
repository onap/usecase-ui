app.factory('droolsService', function ($http, $q) {
	return {
		getDrools: function() {
			return $http.get('getDrools')
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
		
		getDroolDetails: function(selectedFile) {
			return $http.get('getDroolDetails'+'?selectedFile=' + selectedFile )
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
		
		getSelectedFile: function() {
			return this.selectedFile;
		},
		
		setSelectedFile: function(_selectedFile) {
			this.selectedFile = _selectedFile;
		}
	};
});