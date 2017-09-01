appDS2.config(['$routeProvider',
                  function($routeProvider) {
                    $routeProvider.
                    when('/', {
                    	templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-reports/report-search.html',
                    	controller: 'reportSearchController'
                    		}).
                    when('/report_search', {
                    	templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-reports/report-search.html',
                    	controller: 'reportSearchController'
                    		}).
                    when('/report_run/:reportUrlParams*', {
                      	templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-reports/report-run.html',
                      	controller: 'reportRunController'
                      		}).
                    when('/report_chart_wizard/:reportId', {
                        templateUrl: 'static/fusion/raptor/ebz/report_chart_wizard.html',
                        controller: 'ChartController'
                      		}).
                    when('/report_chart/:reportId', {
                        templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-reports/report-chart-wizard.html',
                        controller: 'reportChartController'
                      		}).                      		
                    when("/report_wizard", {
              	        templateUrl : "app/fusion/scripts/DS2-view-models/ds2-reports/wz_steps/report-step.html",
              	        controller: "reportStepController"
              	    		}).                      		                      		
                    when("/report_wizard/:reportId", {
              	        templateUrl : "app/fusion/scripts/DS2-view-models/ds2-reports/wz_steps/report-step.html",
              	        controller: "reportStepController"
              	    		}).
      	    				when("/report_wizard/:reportMode/:reportId", {
              	        templateUrl : "app/fusion/scripts/DS2-view-models/ds2-reports/wz_steps/report-step.html",
              	        controller: "reportStepController"
              	    		}).              	    		
										when("/report_import", {
              	        templateUrl : "app/fusion/scripts/DS2-view-models/ds2-reports/report-import.html",
              	        controller: "reportImportController"
              	    		})
												;
                }]);