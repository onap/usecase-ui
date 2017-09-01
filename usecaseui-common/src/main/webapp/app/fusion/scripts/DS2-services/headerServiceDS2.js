appDS2.factory('HeaderServiceDS2', function ($http,$log, $q) {
	return {
		getMenu: function() {
			return $http.get('get_menu')
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
		}
	};
});
