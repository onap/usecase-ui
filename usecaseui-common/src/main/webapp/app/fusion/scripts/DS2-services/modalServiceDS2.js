angular.module("modalServicesDS2",[]).service('modalService', ['$modal', function ($modal) {
	
	this.popupConfirmWinWithCancel = function(title, msgBody, callback,dismissCallback){
		debugger;
		 var modalInstance = $modal.open({
 	        templateUrl: 'confirmation_informativeDS2.html',
 	        //controller: 'modalpopupControllerDS2',
 	        //size: 'sm',
 	        resolve: {
 	           message: function () {
 	        	   var message = {
 	        			   title:    title,
                       		text:    msgBody
                       	};
			          return message;
		        	}
 	        }
 	      }); 
		 var args = Array.prototype.slice.call( arguments, 0 );
	     args.splice( 0, 3); 
 		modalInstance.result.then(function(){
	 			callback.apply(null, args);
 			}, function() {
 			  dismissCallback();
 		  })['finally'](function(){
 		   modalInstance = undefined;
 		  });
		
	};
															
 }]);