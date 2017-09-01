app.config(function($routeProvider) {
	$routeProvider
	
	//.when('/notebook-frame/:id/:key/:value',{
	//.when('/notebook-frame/:nid/:qprms',{
	/*.when('/notebook-frame',{
		templateUrl: 'app/fusion/notebook-integration/scripts/view-models/notebook-frame.html',
		controller: 'notebookFrameController'
	})*/
	
	.otherwise({
		templateUrl: 'app/fusion/notebook-integration/scripts/view-models/notebook-viz.html',	
		controller: 'notebookFrameController'
		});
})