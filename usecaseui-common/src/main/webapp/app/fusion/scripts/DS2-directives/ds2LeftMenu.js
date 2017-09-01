appDS2.directive('ds2Menu', function () {
    return {
        restrict: 'A', //This means that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        replace: false,
        templateUrl: "app/fusion/scripts/DS2-view-models/ds2Left_menu.html",
        controller: ['$scope','$filter','$http','$timeout','$cookies','LeftMenuServiceDS2', function ($scope, $filter, $http, $timeout, $cookies, LeftMenuServiceDS2) {        	
        	$scope.menuData = []; 
        	$scope.leftChildData = [];
        	$scope.leftParentData = [];
        	$scope.leftMenuItems = [];
        	$scope.app_name = "";
        	$scope.app_name_full = "";
        	LeftMenuServiceDS2.getLeftMenu().then(function(response){
        		var j = response; 
        		if (j && j !== "null" && j !== "undefined"){
        			$scope.leftParentData = JSON.parse(j.data);
        			$scope.leftChildData = JSON.parse(j.data2);
              	} else {
              		console.log("ds2Menu::controller: unexpected getLeftMenu response");
              		return;
              	}  
        		var leftParentList = $scope.leftParentData;
        		var leftChildItemList = $scope.leftChildData;
        		for (var i = 0; i < leftParentList.length; i++) {
        			var parentItem = {};
        			parentItem.name = leftParentList[i].label;
        			parentItem.imageSrc = leftParentList[i].imageSrc;
        			// Add link to items with no subitems
        			if (leftChildItemList[i].length == 0)
        				parentItem.href = leftParentList[i].action;
        			parentItem.menuItems = [];
        			for (var j = 0; j < leftChildItemList[i].length; j++) {
        				if (leftChildItemList[i][j].label != null && leftChildItemList[i][j].label.length > 0) {
        					var childItem = {};
        					childItem.name = leftChildItemList[i][j].label;
        					childItem.href = leftChildItemList[i][j].action;
        					parentItem.menuItems.push(childItem)
        				}
        			}
        			$scope.menuData.push(parentItem);
        		}	    		   		
        	},function(error){
        		console.log("ds2Menu::controller: getLeftMenu failed", error);
        	});
            	
        	LeftMenuServiceDS2.getAppName().then(function(response){
        		var j = response; 
        		try {
        			if (j && j !== "null" && j!== "undefined"){
        				$scope.app_name_full = j.data;
        				var processed_app_name = j.data;
        				var n = processed_app_name.length;
        				if (n > 15) {
        					n = 15;
        				}
        				$scope.app_name = processed_app_name.substr(0, n);
        			} else {
        				throw "Get app_name respsone is not an object/is empty"; 
        			}  
              	} catch (e) {
              		console.log("error happened while trying to get app name "+e);
              		return;
              	}	       
        	},function(error){
        		console.log("error happened while calling getAppName "+error);
        	});
            
        	$scope.drawerOpen = true;
        	
        	
        }] 
    } 
}); 