appDS2.directive('ds2Footer', function () {
    return {
        restrict: 'A', //This means that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        replace: false,
        templateUrl: "app/fusion/scripts/DS2-view-models/footer.html",
        controller: ['$scope', '$filter','ManifestService', function ($scope, $filter,ManifestService) {
        	$scope.build_number = '';
        	ManifestService.getManifest().then(function(response){
        		$scope.build_number=response['Build-Number'];
        	});
        }]
    }
});

/*Analytics for all the pages*/
$(function() {
	portalHook();
	function portalHook() {
		var script = document.createElement('script');	
		script.src = "api/v2/analytics"
		script.async = true;			
		script.onload = function() {
			runAnalytics(); //runAnaltics() has endpoint in epsdk-fw library.
		}
		document.head.appendChild(script);
	}
});