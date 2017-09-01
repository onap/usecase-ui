appDS2.factory('SampleService', function ($http, $q) {
	return {
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
		
	}
});
