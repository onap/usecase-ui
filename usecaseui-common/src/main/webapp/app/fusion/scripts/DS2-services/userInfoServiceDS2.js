appDS2.factory('UserInfoServiceDS2', function ($http, $q,$log) {
	return {
		getFunctionalMenuStaticDetailShareContext: function(contextId,key) {
			var deferred = $q.defer();
			$http({
                method: "GET",
                url: "get_userinfo",      
            }).success( function(res) {              	
            	if(res==null || res=='')
            		$log.error('userInfoServiceDs2: failed to get user info');                 
                deferred.resolve(res);
            }).error( function(status) {            	
                deferred.reject(status);
            });
            return deferred.promise;       
		},		
		getFunctionalMenuStaticDetailSession: function() {
			var deferred = $q.defer();
			$http({
                method: "GET",
                url: "get_topMenuInfo",    
            }).success(function(res) {                    	
            	if(res==null || res=='')
            		$log.error('userInfoServiceDs2: failed to get top menu info');                 
                deferred.resolve(res);
            }).error( function(status) {            	
                deferred.reject(status);
            });
            return deferred.promise;       
		}
	};
});
