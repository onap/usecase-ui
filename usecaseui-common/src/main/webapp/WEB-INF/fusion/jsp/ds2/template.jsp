<%--
  ================================================================================
  eCOMP Portal SDK
  ================================================================================
  Copyright (C) 2017 AT&T Intellectual Property
  ================================================================================
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
       http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  ================================================================================
  --%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>

<!DOCTYPE html>
<html>
    <head>
<%-- 		<%@ include file="/WEB-INF/fusion/jsp/ds2/meta.jsp" %>		 --%>
	<!-- B2b Library -->	
	<link rel="stylesheet" type="text/css" href="app/fusion/external/b2b/css/b2b-angular/b2b-angular.css">
	<link rel="stylesheet" type="text/css" href="app/fusion/external/b2b/css/b2b-angular/font_icons.css">

	<!-- icons in open source -->
	<link rel="stylesheet" type="text/css" href="app/fusion/external/ds2/css/digital-ng-library/ionicons.css">

	<link rel="stylesheet" type="text/css" href="app/fusion/external/angular-bootstrap/ui-bootstrap-csp.css">
	<link rel="stylesheet" type="text/css" href="app/fusion/external/angular-gridster/dist/angular-gridster.min.css">
	<!-- digital-design-library must be loaded late -->
	<link rel="stylesheet" type="text/css" href="app/fusion/external/ds2/css/digital-ng-library/digital-design-library.css">
	<link rel="stylesheet" type="text/css" href="app/fusion/styles/ecomp.css">


	<!-- Common scripts -->	
	<script src="app/fusion/external/jquery/dist/jquery.min.js"></script>
	<!-- Report Dashboard Specific items -->
    <script src="app/fusion/ase/scripts/menus/bootstrap.min.js"></script>
	<script src="app/fusion/ase/scripts/menus/jquery-ui.min.js"></script>
    <script src="app/fusion/external/lodash/4.5.1/lodash.js"></script>
    <script src="app/fusion/external/showdown/0.3.4/showdown.js"></script>
	
	<!--<script src="app/fusion/external/angular-1.5/angular.min.js"></script>
	<script src="app/fusion/external/angular-1.5/angular-messages.js"></script>
	<script src="app/fusion/external/angular-1.5/angular-touch.js"></script>
	<script src="app/fusion/external/angular-1.5/angular-sanitize.js"></script>	
	<script src="app/fusion/external/angular-1.5/angular-route.min.js"></script>
	<script src="app/fusion/external/angular-1.5/angular-cookies.min.js"></script>-->
	<script src="app/fusion/external/angular-1.4.8/angular.min.js"></script>
	<script src="app/fusion/external/angular-1.4.8/angular-messages.js"></script>
	<script src="app/fusion/external/angular-1.4.8/angular-touch.js"></script>
	<script src="app/fusion/external/angular-1.4.8/angular-sanitize.js"></script>	
	<script src="app/fusion/external/angular-1.4.8/angular-route.min.js"></script>
	<script src="app/fusion/external/angular-1.4.8/angular-cookies.min.js"></script>
	<script src="app/fusion/external/b2b/js/b2b-angular/b2b-library.min.js"></script>
	<script src="app/fusion/external/ds2/js/digital-ng-library/digital-design-library.js"></script>	
	<script src="app/fusion/external/javascript-detect-element-resize/jquery.resize.js"></script>
	<script src="app/fusion/external/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
	<script src="app/fusion/external/angular-gridster/dist/angular-gridster.min.js"></script>
	<script src="app/fusion/external/angular-gridster/dist/angular-gridster.min.js"></script>
		
	<!-- EPSDK App scripts and common services -->	
	<script src="app/fusion/scripts/DS2-services/ds2-modal/modalService.js"></script>
	<script src="app/fusion/external/ds2/js/appDS2.js"></script>
			
	<script src="app/fusion/scripts/DS2-services/userInfoServiceDS2.js"></script>	 
	<script src="app/fusion/scripts/DS2-services/headerServiceDS2.js"></script>
	<script src="app/fusion/scripts/DS2-services/leftMenuServiceDS2.js"></script>
	<script src="app/fusion/scripts/DS2-services/manifestService.js"></script>
	
	<script src="app/fusion/scripts/DS2-directives/footer.js"></script>
	<script src="app/fusion/scripts/DS2-directives/ds2Header.js"></script>
	<script src="app/fusion/scripts/DS2-directives/ds2LeftMenu.js"></script>
	<script src="app/fusion/scripts/DS2-directives/b2b-leftnav-ext.js"></script> 
	<script src= "app/fusion/scripts/DS2-services/userInfoServiceDS2.js"></script>
	
	</head>
	<body class="appBody" ng-app="abs">
 		<div ds2-Header class="header-container" ></div>
 		<div ds2-menu id="menuContainer" class="menu-container" ></div>
<%-- 			<div>
				<tiles:insertAttribute name="header" />
			</div> --%>

		<div class="applicationWindow">
			<br>
			<div class="content" id="mContent">
				<div class="body-content-jsp">
					<tiles:insertAttribute name="body" />
				</div>
			</div>
			<br>
		<div ds2-Footer class="footer-container"></div>
		</div>
	</body>
</html>