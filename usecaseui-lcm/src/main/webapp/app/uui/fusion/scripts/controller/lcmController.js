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
app.controller('lcmCtrl', ['$scope','$uibModal', '$log', '$http', '$timeout', '$interval', 'uiGridConstants', 'uiGridGroupingConstants',
    function ($scope,$uibModal, $log, $http, $timeout, $interval) {
      $scope.openCreateServiceDialog = function () {
        console.log('start to open dialog....');
        var modalInstance = $uibModal.open({
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl : 'app/uui/fusion/scripts/view-models/create-service-dialog.html',
          controller : 'createServiceCtrl',
          controllerAs : 'ctrl'
        });
        modalInstance.result.then(
          function() {
            console.log('receive ok button clicked!');
          },
          function() {
            console.log('receive cancel button clicked!');
            $log.info('Modal dismissed at: ' + new Date())
          }
        );
      };

    }
  ]
)
.controller('createServiceCtrl',['$uibModalInstance', 'ServiceTemplateService',
    function($uibModalInstance, ServiceTemplateService) {
      var ctrl = this;

      ctrl.templates = [{name: "V1.1"}, {name: "V1.2"}, {name: "V1.3"}];

      ctrl.hideBasic = function() {
        console.log('hide basic clicked!');
      };

      ctrl.showBasic = function() {
        console.log('show basic clicked!');
      };

      ctrl.serviceTemplateChanged = function (template) {
        console.log('serviceTemplateChanged invoked... ' + template);
      }

      ctrl.ok = function() {
        console.log('ok button clicked!');
      };

      console.log($uibModalInstance);
      // cancel click
      ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      }

      console.log(ctrl.ok);
    }]
);
