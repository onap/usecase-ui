appDS2.config(function($routeProvider) {
	$routeProvider
	.otherwise({
		templateUrl: 'app/fusion/scripts/DS2-view-models/welcome-content.html',
		controller : "welcomeController"
	});
});
