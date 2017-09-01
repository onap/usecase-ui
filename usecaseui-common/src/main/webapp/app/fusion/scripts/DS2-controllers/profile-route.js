appDS2.config(function($routeProvider) {
	$routeProvider
	.when('/profile/:profileId', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-profile/self_profile.html',
		controller: 'selfProfileController'
	})
	.when('/self_profile', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-profile/self_profile.html',
		controller: 'selfProfileController'
	})
	.when('/post_search', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-profile/post.html',
		controller: 'postController'
	})
	.otherwise({
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-profile/profile_searchDS2.html',
		controller : "profileSearchCtrlDS2"
	});
});
