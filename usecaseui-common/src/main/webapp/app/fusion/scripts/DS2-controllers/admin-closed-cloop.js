appDS2.controller('adminClosedLoopController', ['$scope','$http','$q','$log',function ($scope, $http,$q, $log){
			$scope.camunda_cockpit_url = '';			
			var deferred = $q.defer();
			$http({
                method: "GET",
                url: "get_camunda_cockpit_link",
            }).success( function(res) {
            	// if the returned response is error HTML page in string format
            	if(res.link_defined=='false'){
            		$log.error('Retrieval of camunda cockpit link failed. Please make sure the variable "camunda_cockpit_url" is defined in the system.properties file.');
                    deferred.reject(status);            		
            	}
				// valid cockpit url
            	else if(res.camunda_cockpit_link!=null & res.camunda_cockpit_link!= '') {
        			$scope.camunda_cockpit_url = res.camunda_cockpit_link;
                	deferred.resolve(res);
				// if the defined url is empty;
            	} else {
            		$log.error('Please ensure the variable "camunda_cockpit_url" is properly defined in system.properties file (i.e., neither null nor empty).');
                    deferred.reject(status);
            	}
				// API call fails
            }).error( function(status) {
            		$log.error('get_camunda_cockpit_link RestAPI call failed.');
                deferred.reject(status);
            });
            return deferred.promise;	
}]);