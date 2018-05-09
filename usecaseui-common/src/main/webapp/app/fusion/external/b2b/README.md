# B2B Library Area

## Overview

This is a README document to track changes made by ECOMP Portal team to the b2b library.

## Release Notes

All of the release notes in the b2b area apply here.

--

9 Mar 2017
Modified b2b-library.min.js for ECOMP left menu feature, toggle menu icon, hide plus sign if there is no child menus:

-                scope.toggleNav = function (val) {
-                	if(val == 0){ /*ECOMP portal change assuming the first item is home page.*/
-                		location.href = "welcome.htm";
-                	}else{
+               scope.toggleNav = function (val,link) {
+               	/**Added for ECOMP: make parent menu a link if no child menus.**/
+               	if(link!=null && link!=''){
+               		location.href = link;
+               		return;
+               	}
+               	/**Ended**/

30 May 2017 : Changed b2b sort icons
+
"<i ng-class=\"{'icon-controls-upPRIMARY active': sortPattern === 'ascending', 'icon-controls-down active down': sortPattern === 'descending'}\"></i>\n"
