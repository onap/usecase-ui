app.factory('UserInfoService', function ($http, $q,$log) {
	return {
		getFunctionalMenuStaticDetailShareContext: function(contextId,key) {
			var deferred = $q.defer();
			$http({
                method: "GET",
                url: "get_userinfo",      
            }).success( function(res) {              	
            	if(res==null || res=='')
            		$log.info('Not be able to get User Info via shared context');                 
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
            		$log.info('Not be able to get User Info via shared context');                 
                deferred.resolve(res);
            }).error( function(status) {            	
                deferred.reject(status);
            });
            return deferred.promise;       
		}
	};
});
