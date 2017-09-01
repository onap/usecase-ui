app.controller('broadcastController', function ($scope, modalService, $modal,AdminService,$routeParams){
	//$scope.broadcastMessage=${broadcastMessage};
	//$scope.broadcastSites=${broadcastSites};
	//console.log($scope.broadcastMessage);	
	$scope.broadcastMessage=[];
	$scope.broadcastSites=[];
	AdminService.getBroadcast($routeParams.messageLocationId, $routeParams.messageLocation, $routeParams.messageId).then(function(data){
		var j = data;
  		$scope.data = JSON.parse(j.data);
  		$scope.broadcastMessage=JSON.parse($scope.data.broadcastMessage);
  		$scope.broadcastSites=JSON.parse($scope.data.broadcastSites);
  		console.log($scope.broadcastMessage);
  		console.log($scope.broadcastMessage.id);
  		console.log($scope.broadcastSites);
  		//$scope.resetMenu();
	
	},function(error){
		console.log("failed");
		reloadPageOnce();
    });
	
	$scope.save = function() {
		  var uuu = "broadcast/save";
		  var postData={broadcastMessage: $scope.broadcastMessage};
	  	  $.ajax({
	  		 type : 'POST',
	  		 url : uuu,
	  		 dataType: 'json',
	  		 contentType: 'application/json',
	  		 data: JSON.stringify(postData),
	  		 success : function(data){
	  			window.location.href = "admin#/broadcast_list";
			 },
			 error : function(data){
				 modalService.showFailure("Fail","Error while saving.");
			 }
	  	  });
	};
	
	$scope.close = function() {
	window.location.href = "admin#/broadcast_list";
};	
	
});

$(function() {
    $( "#startDatepicker" ).datepicker();
    $( "#endDatepicker" ).datepicker();
    
    $( "#startDatepicker" ).change(function() {
    	var tempStartDate = moment($( "#startDatepicker" ).val()).format('YYYY-MM-DD hh:mm:ss.S');
    	$( "#startDateHidden" ).val(tempStartDate.toString());
    	  //alert( $( "#startDateHidden" ).val() );
    });
    $( "#endDatepicker" ).change(function() {
    	var tempEndDate = moment($( "#endDatepicker" ).val()).format('YYYY-MM-DD hh:mm:ss.S');
    	$( "#endDateHidden" ).val(tempEndDate.toString());
    	  //alert( $( "#endDateHidden" ).val() );
  	});
});
