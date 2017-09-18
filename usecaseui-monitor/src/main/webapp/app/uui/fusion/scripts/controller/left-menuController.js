app.controller('cmCtrl',['$scope',function ($scope) {
  $scope.routeData = [
    {name : 'Alarm' , url : 'app/uui/fusion/scripts/view-models/alarm.html' , nclass : 'fa fa-users'},
    {name : 'Performance' , url : 'app/uui/fusion/scripts/view-models/performance.html', nclass : 'fa fa-cog'},
    {name : 'About Performance Froms' , url : 'app/uui/fusion/scripts/view-models/performance-details.html', nclass : 'fa fa-cubes'},
  ];
  $scope.currentTab = 'app/uui/fusion/scripts/view-models/alarm.html';
  $scope.onClickTab = function (url) {
    $scope.currentTab = url;
  };
  $scope.isActiveTab = function (tabRoute) {
    return tabRoute == $scope.currentTab;
  }
}]);