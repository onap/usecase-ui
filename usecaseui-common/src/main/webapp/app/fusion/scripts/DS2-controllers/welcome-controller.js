appDS2
		.directive(
				'integer',
				function() {
					return {
						require : 'ngModel',
						link : function(scope, ele, attr, ctrl) {
							ctrl.$parsers.unshift(function(viewValue) {
								if (viewValue === '' || viewValue === null
										|| typeof viewValue === 'undefined') {
									return null;
								}
								return parseInt(viewValue, 10);
							});
						}
					};
				})

		.controller(
				'welcomeController',
				function($scope, $interval, $http, $modal, $log, ManifestService) {

					$scope.testMsg = "Welcome Page1";
					$scope.gridsterOpts = {
						columns : 6, // the width of the grid, in columns
						pushing : true, // whether to push other items out of
										// the way on move or resize
						floating : true, // whether to automatically float
											// items up so they stack (you can
											// temporarily disable if you are
											// adding unsorted items with
											// ng-repeat)
						width : 'auto', // can be an integer or 'auto'. 'auto'
										// scales gridster to be the full width
										// of its containing element
						colWidth : 'auto', // can be an integer or 'auto'.
											// 'auto' uses the pixel width of
											// the element divided by 'columns'
						rowHeight : 60, // can be an integer or 'match'. Match
										// uses the colWidth, giving you square
										// widgets.
						margins : [ 10, 10 ], // the pixel distance between
												// each widget
						outerMargin : true, // whether margins apply to outer
											// edges of the grid
						swapping : true,
						draggable : {
							enabled : true, // whether dragging items is
											// supported
							stop : function(event, uiWidget, $element) {
								$scope.setCookie();
							} // optional callback fired when item is finished
								// dragging
						}

					};

					/*
					 * $scope.gridsterOpts = { columns: 6, width: 'auto',
					 * colWidth: '230', rowHeight: '120', margins: [10, 10],
					 * outerMargin: true, pushing: true, floating: true,
					 * swapping: true };
					 */

					$scope.toggleMinMax = function(index, tileName) {
						if (tileName == '') {
							$scope.standardItems[index].max = !$scope.standardItems[index].max;
							if ($scope.standardItems[index].max)
								$scope.standardItems[index].sizeY = $scope.standardItems[index].maxHeight;
							else
								$scope.standardItems[index].sizeY = 0;
						} else {
							$scope.tileTemp = $scope.$eval(tileName);
							var tileMax = $parse(tileName + '.max');
							tileMax.assign($scope, !$scope.$eval(tileName).max);
							var tileSizeY = $parse(tileName + '.sizeY');
							if ($scope.tileTemp.max)
								tileSizeY.assign($scope,
										$scope.tileTemp.maxHeight);
							else
								tileSizeY.assign($scope, 0);
						}
					};

					// These map directly to gridsterItem options
					// IMPORTANT: Items should be placed in the grid in the
					// order in which
					// they should appear.
					// In most cases the sorting should be by row ASC, col ASC
					$scope.standardItems = [
							{
								sizeX : 2,
								sizeY : 8,
								maxHeight : 8,
								row : 0,
								col : 0,
								headerText : 'Dashboard',
								max : false

							},
							{
								sizeX : 2,
								sizeY : 5,
								maxHeight : 5,
								row : 0,
								col : 2,
								headerText : 'Donut Chart',
								max : false

							},/*
								 * { sizeX : 1, sizeY : 5, maxHeight : 5, row :
								 * 0, col : 2, headerText : 'Area Chart', max :
								 * false },
								 */
							{
								sizeX : 2,
								sizeY : 5,
								maxHeight : 5,
								row : 8,
								col : 0,
								headerText : 'Pie Chart',
								max : false
							},
							/*
							 * { sizeX : 1, sizeY : 5, maxHeight : 5, row : 8,
							 * col : 1, headerText : 'Line Chart', max : false },
							 */
							{
								sizeX : 2,
								sizeY : 5,
								maxHeight : 5,
								row : 8,
								col : 4,
								headerText : 'Gauges',
								max : false
							},
							{
								sizeX : 2,
								sizeY : 8,
								maxHeight : 8,
								row : 16,
								col : 0,
								headerText : 'Traffic distribution by day of week',
								max : false
							},
							{
								sizeX : 2,
								sizeY : 8,
								maxHeight : 8,
								row : 16,
								col : 2,
								headerText : 'Busy hour traffic analysis by day of week',
								max : false
							}, {
								sizeX : 2,
								sizeY : 6,
								maxHeight : 7,
								row : 24,
								col : 4,
								headerText : 'Additional Samples',
								max : false
							}, {
								sizeX : 2,
								sizeY : 8,
								maxHeight : 8,
								row : 24,
								col : 2,
								headerText : 'Sticky Notes',
								max : false
							}, {
								sizeX : 6,
								sizeY : 10,
								maxHeight : 10,
								row : 32,
								col : 0,
								headerText : 'Service Configuration',
								max : false
							} ];

					/*
					 * $.each($scope.standardItems, function(i, a) {
					 * $scope.toggleMinMax(i, ''); });
					 */
					var counter = 0;
					angular.forEach($scope.standardItems, function(i, a) {
						$scope.toggleMinMax(counter, '');
						counter = counter + 1;
					});

					$scope.activeTabId = 'Monday';
					// for generic tabs

					$scope.selectedTrafficDay = [ {
						title : 'Mon',
						url : '#Monday'
					}, {
						title : 'Tue',
						url : '#Tuesday'
					}, {
						title : 'Wed',
						url : '#Wednesday'
					}, {
						title : 'Thu',
						url : '#Thursday'
					}, {
						title : 'Fri',
						url : '#Friday'
					}, {
						title : 'Sat',
						url : '#Saturday'
					}, {
						title : 'Sun',
						url : '#Sunday'
					} ];

					$scope.currentSelectedDayTab = '#Monday';

					$scope.onClickTab1 = function(Daytab) {
						$scope.currentSelectedDayTab = Daytab.url;
					}

					$scope.isActiveTab1 = function(tabUrl) {
						return tabUrl == $scope.currentSelectedDayTab;
					}

					$scope.gTabs = [ {
						title : 'Monday',
						id : 'Monday',
						url : '#Monday',
						selected : true
					}, {
						title : 'Tuesday',
						id : 'Tuesday',
						url : '#Tuesday'
					}, {
						title : 'Wednesday',
						id : 'Wednesday',
						url : '#Wednesday'
					}, {
						title : 'Thursday',
						id : 'Thursday',
						url : '#Thursday'
					}, {
						title : 'Friday',
						id : 'Friday',
						url : '#Friday'
					}, {
						title : 'Saturday',
						id : 'Saturday',
						url : '#Saturday'
					}, {
						title : 'Sunday',
						id : 'Sunday',
						url : '#Sunday'
					} ];

					$scope.BusyHourTraffic = [ {
						title : 'BH SNRC DLSTX - Incoming',
						url : '#Incoming'
					}, {
						title : 'BH SNRC DLSTX - Outgoing',
						url : '#Outgoing'
					}, {
						title : 'BH National - Default',
						url : '#Default'
					}, {
						title : 'BH National - Priority',
						url : '#Priority'
					}, {
						title : 'BH National',
						url : '#BHNational'
					}

					];

					$scope.currentSelectedBusyHourTraffic = '#Incoming';

					$scope.onClickTab2 = function(TrafficTab) {
						$scope.currentSelectedBusyHourTraffic = TrafficTab.url;
					}

					$scope.isActiveTab2 = function(tabUrl) {
						return tabUrl == $scope.currentSelectedBusyHourTraffic;
					}

					$scope.activeTabId2 = 'Incoming';
					// for generic tabs
					$scope.gTabs2 = [ {
						title : 'BH SNRC DLSTX - Incoming',
						id : 'Incoming',
						url : '#Incoming',
						selected : true
					}, {
						title : 'BH SNRC DLSTX - Outgoing',
						id : 'Outgoing',
						url : '#Outgoing'
					}, {
						title : 'BH National - Default',
						id : 'Default',
						url : '#Default'
					}, {
						title : 'BH National - Priority',
						id : 'Priority',
						url : '#Priority'
					}, {
						title : 'BH National',
						id : 'BHNational',
						url : '#BHNational'
					} ];

					$scope.activeTabId3 = 'Incoming';
					// for generic tabs
					$scope.gTabs3 = [ {
						title : 'BH SNRC DLSTX - Incoming',
						id : 'Incoming',
						url : '#Incoming',
						selected : true
					}, {
						title : 'BH SNRC DLSTX - Outgoing',
						id : 'Outgoing',
						url : '#Outgoing'
					}, {
						title : 'BH National - Default',
						id : 'Default',
						url : '#Default'
					}, {
						title : 'BH National - Priority',
						id : 'Priority',
						url : '#Priority'
					}, {
						title : 'BH National',
						id : 'BHNational',
						url : '#BHNational'
					} ];

					/*
					 * $scope.$watch('activeTabId', function(newVal) {
					 * alert(newval); $('#'+newval).show(); }, true);
					 */

					$scope.toggleEastToWest = function() {
						$("#toggle").toggle('slide');
						if ($("#leftIcon").is(":visible")) {
							$("#rightIcon").show();
							$("#leftIcon").hide();
						} else if ($("#rightIcon").is(":visible")) {
							$("#rightIcon").hide();
							$("#leftIcon").show();
						}
					};

					$scope.group1 = {
						open : true
					};
					$scope.group2 = {
						open : true
					};
					$scope.group3 = {
						open : true
					};
					$scope.group4 = {
						open : true
					};
					$scope.group5 = {
						open : true
					};
					$scope.group6 = {
						open : true
					};
					$scope.group7 = {
						open : true
					};
					$scope.group71 = {
						open : true
					};
					$scope.group8 = {
						open : true
					};
					$scope.group9 = {
						open : true
					};
					$scope.group10 = {
						open : true
					};
					$scope.group11 = {
						open : true
					};
					$scope.group12 = {
						open : false
					};
					
			// Fetch manifest info
			$scope.manifest = {};
			ManifestService.getManifest()
   			.then(function(jsonObj) {
   				// $log.debug("welcome-controller: getManifest returned " + JSON.stringify(jsonObj));
   				if (jsonObj.error) {
   					$log.error('welcome-controller: failed to get manifest: ' + JSON.stringify(jsonObj));
   				}
   				else {
   					$scope.manifest=jsonObj;
   				}
   			},function(error){
   				$log.error("welcome-controller: getManifest failed: " + error);
   			});    	
					

				});
