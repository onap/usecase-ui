app.config(function($routeProvider) {
	$routeProvider
	.when('/view', {
		templateUrl: 'app/fusionapp/drools/view-models/droolsView.html',
		controller : "droolsViewController"
	})
	.otherwise({
		templateUrl: 'app/fusionapp/drools/view-models/droolsList.html',
		controller : "droolsListController"
	});
});