app.controller('pertabCtrl',['$scope',function ($scope) {

  $scope.tabes = [
    { title:'one hour'},
    { title:'one day', content:'' },
    { title:'one month', content:'Dynamic content 2' },
    { title:'one year', content:'Dynamic content 2' }
  ];
}]);
