appDS2.controller('reportImportController', function($scope,$http,$location, $routeParams, $q, $modal,$log,$window, raptorReportFactory, stepFormFactory, DOMHelper) {
	$scope.importXML = function(){
		
		var importXMLJSON = {
				"tabId":"Import",
				"tabName":"Import",
				"reportXML":$scope.xmlContent
		}
		$scope.errorMessage = ""
		raptorReportFactory.postImportXml(importXMLJSON).then(function(data){
			if (data.errormessage) {
				$scope.errorMessage = data.errormessage;
			} else {
			$window.location.href = 'report#/report_wizard/-1';
			};
		},function(error){
			$log.error("raptorReportFactory: postImportXml failed.");
		});		
	}
});