appDS2.factory('ManifestService', function ($http, $q, $log) {
	return {
		// Gets and returns the manifest for the webapp.
		getManifest: function() {
			// cache control for IE
			var cc = "?cc=" + new Date().getTime().toString();
			return $http({
					method: 'GET',
					url: 'manifest' + cc,
					cache: false,
					responseType: 'json'})
			.then(function(response) {
				// $log.debug("ManifestService.getManifest: " + JSON.stringify(response));
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('ManifestService.getManifest: response.data null or not object');
				else 
					return response.data;
			}, function(error) {
				$log.error('ManifestService.getManifest failed: ' + error.data);
				return $q.reject(error.data);
			});
		}		
	};
});
