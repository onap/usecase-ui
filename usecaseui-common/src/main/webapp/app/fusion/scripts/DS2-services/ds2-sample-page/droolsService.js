appDS2.factory('DroolsService', function ($http, $q) {
	return {
		getDroolsList: function() {
			return $http.get('getDrools')
			.then(function(response) {
				console.log(response);
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
		executeDrools:function(droolsData) {
			return $http({
				method: "POST",
                url: "post_drools/execute",
                data:droolsData
			}).then(function(response) {
				console.log(response);
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
