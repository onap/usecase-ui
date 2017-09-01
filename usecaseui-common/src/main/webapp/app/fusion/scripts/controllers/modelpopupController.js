var modalpopupController =  function ($scope, $modalInstance, message){
	
	$scope.message = message;
	
	
	$scope.hello = function () {
        $modalInstance.close($scope.digitPattern);
    };
	$modalInstance.ok = function() {
        //add the  ok functionality
        alert("Logout");        
    };
    $modalInstance.cancel = function() {
        //add the cancel functionality
        alert("Keep Log in");
    };
    $modalInstance.cancelbutton = function() {
        //add the cancel functionality
        alert("Modal Waring popup close event");
    };
}