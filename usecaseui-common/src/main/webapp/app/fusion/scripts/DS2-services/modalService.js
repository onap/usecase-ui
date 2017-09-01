
angular.module("template/modalsAndAlerts/window2.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/modalsAndAlerts/window.html",
	    "<div class=\"modalwrapper active {{windowClass}}\" ng-class=\"{'modal-landscape': isModalLandscape}\" role=\"dialog\" tabindex=\"-1\" aria-labelledby=\"{{title}}\" aria-describedby=\"{{content}}\">\n" +
	    "    <div class=\"modal fade {{sizeClass}}\">sdfdsfsfd</div>\n" +
	    "</div>");
	}]);

angular.module('ddh.att.modalsAndAlerts')
 
.controller('modalsAndAlertsController', function ($scope, $modal, $log) {
	$scope.name='eeee';
    $scope.items = ['item1', 'item2', 'item3'];
    $scope.dt = new Date("March 10, 2014 00:00:00");
    $scope.helperText = "The date you selected is $date. Double tap to open calendar. Select a date to close the calendar.";
    $scope.open = function (event) {
        var modalInstance = $modal.open({
            templateUrl: 'template/modalsAndAlerts/modal-demo.html',
            controller: ModalInstanceCtrl,
            sizeClass: 'modal-long-adjust', 
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
 
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
            event.target.focus();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
            event.target.focus();
        });
    };
    $scope.ok = function () {
        //add the  ok functionality
        console.log("ok");
    };
    $scope.cancel = function () {
        //add the cancel functionality
        console.log("cancel");
    };
}) 
 
var ModalInstanceCtrl = function ($scope, $modalInstance, items) {
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };
    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
