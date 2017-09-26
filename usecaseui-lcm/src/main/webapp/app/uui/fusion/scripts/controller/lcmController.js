/*
 * Copyright 2016-2017 ZTE Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
app.controller('lcmCtrl', ['$scope','$log', '$http', '$timeout', '$interval', 'uiGridConstants', 'uiGridGroupingConstants',
    function ($scope,$log, $http, $timeout, $interval) {
      $scope.init = function() {
        $('#createService').click(function() {
          console.log("create service...");
          $('#createServiceDialog').modal({}).draggable();
        });
        $('#startToCreateService').click(this.okAction);
        $('.onboard-button').click(function () {
          console.log("show vnf ns vims...");
          document.getElementById("vnf-ns-vim-table").innerHTML = generateVnfNsOnboardDialog({});
          $("#vnf-ns-onboard-dialog").modal();
        });

      };
    }]);
