angular.module("modalServices",[]).service('modalService', ['$modal', function ($modal) {
	var ModalInstanceCtrl = function ($scope, $modalInstance, items,$rootScope) {
		$scope.roleFun=items;
		$scope.msg=items;
		
	    $scope.cancel = function () {
	        $modalInstance.dismiss('cancel');
	    };
	};
	this.errorPopUp = function (msg) {
    	var modalInstance = $modal.open({
			templateUrl: 'app/fusion/scripts/DS2-modal/error_modal.html',
			controller: ModalInstanceCtrl,
			sizeClass: 'modal-small',
			resolve: {
                items: function () {
                    return msg;
                }
	        }
		});
    };
    this.successPopUp = function (msg) {
    	var modalInstance = $modal.open({
			templateUrl: 'app/fusion/scripts/DS2-modal/success_modal.html',
			controller: ModalInstanceCtrl,
			sizeClass: 'modal-small',
			resolve: {
				items: function () {
					var message = {
							title:    '',
	                   		text:     msg
	                };
					return message;			        	
                }
	        }
		});
    };
 }]);