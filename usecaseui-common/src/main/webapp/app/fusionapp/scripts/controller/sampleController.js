app.config(function($routeProvider) {
	$routeProvider
	.when('/iframe', {
		templateUrl: 'app/fusionapp/scripts/view-models/sampleWithIframe.html',
		controller : "samplePageWithIframeController"
	})
	.otherwise({
		templateUrl: 'app/fusionapp/scripts/view-models/sample.html',
		controller : "samplePageController"
	});
});