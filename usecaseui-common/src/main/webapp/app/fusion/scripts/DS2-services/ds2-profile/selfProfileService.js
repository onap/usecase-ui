appDS2.factory('SelfProfileService', function ($http, $q) {
	return {
		getProfileDetail: function(profileId) {
			return $http({
				method: "GET",
                url: "get_profile?profile_id=" + profileId,
			
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
	
		getSelfProfileDetail: function() {
			return $http.get('get_self_profile')
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
		
		addRole: function(roleData,profileId) {
			return $http({
				method: "POST",
                url: "profile/addNewRole?profile_id=" + profileId,
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
		deRole: function(roleData,profileId) {
			return $http({
				method: "POST",
                url: "profile/removeRole?profile_id=" + profileId,
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
		saveProfile: function(data,profileId) {
			return $http({
				method: "POST",
                url: "profile/saveProfile?profile_id=" + profileId,
                data:data
			
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
		removeRole: function(data,profileId) {
			return $http({
				method: "POST",
                url: "profile/removeRole?profile_id=" + profileId,
                data:data
			
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
