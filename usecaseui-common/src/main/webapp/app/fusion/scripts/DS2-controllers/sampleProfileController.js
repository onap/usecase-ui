appDS2.config(function($routeProvider) {
	$routeProvider
	.when('/profile/:profileId', {
		templateUrl: 'app/fusion/scripts/view-models/profile-page/profile_detail.html',
		controller: 'profileController'
	})
	.when('/post_search', {
		templateUrl: 'app/fusion/scripts/view-models/profile-page/post_search.html',
		controller: 'postSearchCtrl'
	})
	.when('/ase', {
		templateUrl: 'app/fusion/ase/index.html'
	})
	.when('/self_profile', {
		templateUrl: 'app/fusion/scripts/view-models/profile-page/self_profile.html',
		controller: 'selfProfileController'
	})
	.otherwise({
		templateUrl: 'app/fusion/scripts/DS2-view-models/DS2-profile-page/profile_searchDS2.html',
		controller : "profileSearchCtrlDS2"
	});
});
