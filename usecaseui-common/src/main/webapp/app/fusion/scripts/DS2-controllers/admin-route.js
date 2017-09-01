appDS2.config(function($routeProvider) {
	$routeProvider
	.when('/net_map', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/DS2-sample-page/net_map.html',
		controller: "netMapController"
	})
		.when('/jcs_admin', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/jcs_admin.html',
		controller: 'adminController'
	})
		.when('/admin_menu_edit', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/admin-menu-edit.html',
		controller: 'AdminMenuEditController'
	})
	.when('/usage_list', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/usage.html',
		controller: 'usageListControllerDS2'
	})	
	.when('/role_function_list', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/role-function.html',
		controller : "adminController"
	})
	.when('/role/:roleId', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/role.html',
		controller: 'adminController'
	})
	.when('/collaborate_list', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/collaborate-list.html',
		controller: 'collaborateListControllerDS2'
	})	
	.when('/adminClosedLoop', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/admin_closed_loop.html',
		controller: 'adminClosedLoopController'
	})
	.when('/all', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/DS2-workflows-page/workflow-listing.html',
		controller: 'workflowsController'
	})
	.otherwise({
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/role_list.html',
		controller : 'adminController'
	});
});
