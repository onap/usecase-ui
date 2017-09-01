/*
 * Copyright (c) 2014 DataTorrent, Inc. ALL Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

app
  .controller('LayoutsDemoCtrl', function($scope, widgetDefinitions, defaultWidgets, LayoutStorage, $interval) {
    $scope.layoutOptions = {
      storageId: 'demo-layouts',
      storage: localStorage,
      storageHash: 'fs4df4d51',
      widgetDefinitions: widgetDefinitions,
      defaultWidgets: defaultWidgets,
      lockDefaultLayouts: true,
      defaultLayouts: [
        { title: 'Layout 1', active: true , defaultWidgets: defaultWidgets },
        { title: 'Layout 2', active: false, defaultWidgets: defaultWidgets },
        { title: 'Layout 3', active: false, defaultWidgets: defaultWidgets, locked: false }
      ]
    };
    $scope.randomValue = Math.random();
    $interval(function () {
      $scope.randomValue = Math.random();
    }, 500);

  })
  .controller('LayoutsDemoExplicitSaveCtrl', function($scope, widgetDefinitions, defaultWidgets, LayoutStorage, $interval, $http) {
	  $http.get('raptor.htm?action=report.search.execute').then(
				function(result){ 
					var data = result.data;
					var report_id_name = [];
					for (var i in data.rows[0]) {
					  report_id_name.push({index:i, value: data.rows[0][i][1].searchresultField.displayValue, title: data.rows[0][i][2].searchresultField.displayValue})
					}
					$scope.reports = report_id_name;
					console.log($scope.reports);					
					$scope.report1 = $scope.reports[1];
				});	  
	  // Can this be removed?
	  $scope.rcloud_url= "https://tbd.onap.org/mini.html?notebook=c131ea997453e75303588699936d1896";	    
    $scope.layoutOptions = {
      storageId: 'demo-layouts-explicit-save',
      storage: localStorage,
      storageHash: 'fs4df4d51',
      widgetDefinitions: widgetDefinitions,
      defaultWidgets: defaultWidgets,
      explicitSave: true,
      defaultLayouts: [
        { title: 'Layout 1', active: true , defaultWidgets: defaultWidgets },
        { title: 'Layout 2', active: false, defaultWidgets: defaultWidgets },
        { title: 'Layout 3', active: false, defaultWidgets: defaultWidgets }
      ]
    };
    $scope.randomValue = Math.random();
    $interval(function () {
      $scope.randomValue = Math.random();
    }, 500);

  });