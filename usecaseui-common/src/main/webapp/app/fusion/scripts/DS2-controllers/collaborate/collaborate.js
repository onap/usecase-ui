app.config(function($routeProvider) {
	$routeProvider
	.when('/collaborate_list', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/collaborate-list.html',
		controller: 'collaborateListControllerDS2'
	})
});