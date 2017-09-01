appDS2.directive('ds2Header', function () {
	return {
		restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
		replace: false,
		templateUrl: "app/fusion/scripts/DS2-view-models/ds2Header.html",
		controller: ['$scope', '$filter','$http','$timeout', '$log','UserInfoServiceDS2', 'HeaderServiceDS2', '$window', '$cookies','$cookieStore', function ($scope, $filter, $http, $timeout, $log,UserInfoServiceDS2,HeaderServiceDS2, $window, $cookies,$cookieStore) {
			// copy from existing DS1

			/*Define fields*/
			$scope.userName;
			$scope.userFirstName;
			$scope.userId;
			$scope.userEmail;
			$scope.redirectUrl;
			$scope.contactUsUrl;
			$scope.getAccessUrl;
			$scope.menuItems = [];
        	$scope.showHeader = ($cookieStore.get("show_app_header") == undefined ? true : $cookies.get("show_app_header") );

        	
			/***************functions**************/
			/*getting user info from session*/
			$scope.getUserNameFromSession = function(){
				UserInfoServiceDS2.getFunctionalMenuStaticDetailSession()
				.then(function (res) {
					$scope.contactUsUrl=res.contactUsLink;
					$scope.userName = res.userName;
					$scope.userId = res.userid;
					$scope.userEmail = res.email;
					$scope.userFirstName = res.firstName;
					$scope.redirectUrl = res.portalUrl;
					$scope.getAccessUrl = res.getAccessUrl;
				});
			}
			
			$scope.returnToPortal=function(){
				window.location.href = $scope.redirectUrl;
			}

			/*Menu Structure*/
			var menuStructureConvert = function(menuItems) {	
				$scope.megaMenuDataObjectTemp = 
					[{
						text: "Manage",
						children: menuItems
					},
					{
						text: "Support",
						children: [
							{
								label:"Contact Us",
								action:$scope.contactUsUrl,
								childMenus:[]
							},
							{
								label:"Get Access",
								action:$scope.getAccessUrl,
								childMenus:[]
							}]
					}];      			
				return $scope.megaMenuDataObjectTemp;
			};

			$scope.getMenu=function() {
				$scope.getUserNameFromSession();
				var promise = HeaderServiceDS2.getMenu();
				promise.then(
						function(res) {   					
							if(res==null || res==''){
								$log.error('failed to get menu');     
								$scope.getUserNameFromSession();
							}else{
								$scope.parentMenu = JSON.parse(res.data);
								$scope.childMenu = JSON.parse(res.data2);
								for(var i=0; i<$scope.parentMenu.length;i++){
									$scope.parentMenu[i].childMenus = ($scope.childMenu[i]);
								}
								$scope.menuItems = menuStructureConvert($scope.parentMenu);	
							}
						},
						function(err) {
							$log.error('getMenu failed', err);
						}
				);
			}

			
			
			$scope.adjustHeader=function() {
        		$scope.showHeader = ($cookies.get("show_app_header") == undefined ? true : $cookies.get("show_app_header"));
        		// console.log($scope.showHeader);
        		if ($scope.showHeader==true) {
        			document.getElementById('page-content').style.marginTop = "45px";
            	}else{			
        			document.getElementById('page-content').style.marginTop = "0px";
        		}   		
        	}; // adjustHeader
        	$scope.$on('$routeChangeSuccess', function () {
        		$scope.adjustHeader();		
        	});
        	
        	$scope.getUserNameFromSession();
        	$scope.getMenu();
		}]
	}
});

appDS2.filter("ellipsis", function(){
	return function(text, length){
		if (text) {
			var ellipsis = text.length > length ? "..." : "";
			return text.slice(0, length) + ellipsis;
		};
		return text;        
	}
});
