appDS2.config(function($routeProvider) {
	$routeProvider
	.when('/all', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/DS2-workflows-page/workflow-listing.html',
		controller: 'workflowsControllerDS2'
	})
});

