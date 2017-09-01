appDS2.directive('leftMenuEcomp', function () {
   	/*
   	 * Custom version of b2b-left-navigation directive:
   	 * 1. Make parent menu a link if no child menus.
   	 * 2. Add unique IDs to all items.
   	 * 3. Hide icon if no child menus.
   	 * 4. Arrow toggle button.
   	 * 5. Adjust the page on collapse/expand.
   	 */
    return {
        restrict: 'EA',
        templateUrl: 'app/fusion/scripts/DS2-view-models/b2b-leftnav-ext.html',
        scope: {
            menuData: '='
        },
        link: function (scope, element, attrs, ctrl) {
            scope.idx = -1;
            scope.itemIdx = -1;
            scope.navIdx = -1;
            /*assuming menu is expanded when page loads*/
            scope.showmenu=true;
            scope.leftMenuClass= ""; 
            scope.leftMenuArrowClass="leftmenu-arrow-expand";
            scope.toggleNav = function (val,link,menuStatus) {
            	
            	if(!menuStatus){
            		scope.toggleDrawer(menuStatus);
            		return;
            	}
            	if(link!=null && link!=''){
            		location.href = link;
            		return;
            	}
           		if (val === scope.idx) {
                    scope.idx = -1;
                    return;
                }
                scope.idx = val;
            };
            scope.toggleDrawer = function(menuStatus){
            	scope.idx=-1; /*hide the sub menus*/
        		if(menuStatus){     
        			//Collapse Menu
        			scope.showmenu=false;
        			scope.leftMenuClass = "left-menu-collapsed";
        			scope.leftMenuArrowClass="leftmenu-arrow-collapse";
        			document.getElementById('page-content').style.marginLeft = "50px";
        		}else{
        			//Expand Menu
        			scope.showmenu=true;
        			scope.leftMenuClass = "";
        			scope.leftMenuArrowClass="leftmenu-arrow-expand";
        			document.getElementById('page-content').style.marginLeft = "250px";           	
        		}
        			
            };
            scope.liveLink = function (evt, val1, val2) {
                scope.itemIdx = val1;
                scope.navIdx = val2;
                evt.stopPropagation();
            };
        }
    };
});