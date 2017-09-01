app.controller('droolsViewController', function ($scope,modalService,droolsService){ 


		$scope.resultsString = "";
		// Table Data
	    droolsService.getDroolDetails(droolsService.getSelectedFile()).then(function(data){
			
			var j = data;
			$scope.postDroolsBean = JSON.parse(j.data);
			//execute($scope.postDroolsBean);
		
		},function(error){
			console.log("failed");
			//reloadPageOnce();
		});
		
	
		
		$scope.execute = function(postDroolsBean) {
				console.log(postDroolsBean);
				var uuu = "post_drools/execute";
				  var postData={postDroolsBean:postDroolsBean};
			  	  $.ajax({
			  		 type : 'POST',
			  		 url : uuu,
			  		 dataType: 'json',
			  		 contentType: 'application/json',
			  		 data: JSON.stringify(postData),
			  		 success : function(data){
			  			$scope.$apply(function(){
			  				$scope.resultsString=data.resultsString;
			  				console.log($scope.resultsString);
			  				});  
					 },
					 error : function(data){
						 console.log(data);
						 modalService.showFailure("Fail","Error while executing: "+ data.responseText);
					 }
			  	  });
			
		};
		
		
		
	});	