appDS2.config(function($routeProvider) {
	$routeProvider
	.otherwise({
		templateUrl: 'app/fusion/scripts/DS2-view-models/bootstrap-sample-content.html',
		controller : "bootstrapSampleController"
	});
});
