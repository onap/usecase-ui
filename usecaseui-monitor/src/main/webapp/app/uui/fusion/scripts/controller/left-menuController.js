/*
 Copyright (C) 2017 CMCC, Inc. and others. All rights reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
var currentTab = 'app/uui/fusion/scripts/view-models/lifecyclemanagement.html';

app.controller('cmCtrl', ['$scope', function ($scope) {
  $scope.routeData = [{
      name: 'Services',
      url: 'app/uui/fusion/scripts/view-models/lifecyclemanagement.html',
      nclass: 'fa fa-users'
    },
    {
      name: 'Alarm',
      url: 'app/uui/fusion/scripts/view-models/alarm.html',
      nclass: 'fa fa-users'
    },
    {
      name: 'Performance',
      url: 'app/uui/fusion/scripts/view-models/performance.html',
      nclass: 'fa fa-cog'
    }
  ];
  $scope.currentTab = currentTab;
  $scope.$watch('currentTab', function (newValue, oldValue) {
    if (newValue === oldValue) {
      return;
    } // AKA first run
    // $scope.onClickTab(newValue);
  });
  $scope.onClickTab = function (url) {
    $scope.currentTab = url;
  };
  $scope.isActiveTab = function (tabRoute) {
    return tabRoute == $scope.currentTab;
  }
}]);