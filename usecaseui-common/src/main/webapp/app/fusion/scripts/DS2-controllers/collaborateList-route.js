appDS2.config(function($routeProvider) {
	$routeProvider
	.when('/collaborate_list', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/collaborate-list.html',
		controller: 'collaborateListControllerDS2'
	})
		.when('/notebook', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-samplePages/notebook-page.html',
		controller: 'nbookController'
	})
			.when('/leafletMap', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-samplePages/leafletMap.html',
		controller: 'leafletController'
	})
		.when('/notebook', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-samplePages/notebook-page.html',
		controller: 'nbookController'
	})
});
