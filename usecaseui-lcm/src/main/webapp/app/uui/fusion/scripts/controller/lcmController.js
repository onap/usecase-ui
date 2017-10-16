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
app.controller('lcmCtrl', ['$scope', '$uibModal', '$log', '$http', '$timeout', '$interval', 'ServiceTemplateService',
    function ($scope, $uibModal, $log, $http, $timeout, $interval, ServiceTemplateService) {
      var ctrl = this;
      ctrl.openCreateServiceDialog = function () {
        var modalInstance = $uibModal.open({
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl : 'app/uui/fusion/scripts/view-models/create-service-dialog.html',
          controller : 'createServiceCtrl',
          controllerAs : 'ctrl',
          resolve: {
            customer: function () {
              return ctrl.customer;
            },
            serviceType: function () {
              return ctrl.serviceType;
            }
          }
        });
        modalInstance.result.then(
          function(result) {
            console.log('receive ok button clicked!');
            console.log(result);
          },
          function(reason) {
            console.log('receive cancel button clicked!');
            console.log(reason);
            $log.info('Modal dismissed at: ' + new Date());
          }
        );
      };

      ctrl.init = function () {
        ctrl.canCreateService = "true";
        ServiceTemplateService.getAllCustomers(function (customers) {
          ctrl.customers = customers;
        });
        ServiceTemplateService.getPackages(function (packages) {
          ctrl.packages = packages;
        });
      };

      ctrl.customerChanged = function () {
        if(ctrl.customer === undefined || ctrl.customer === null) {
          ctrl.serviceTypes = [];
        } else {
          ServiceTemplateService.getAllServiceTypes(ctrl.customer.id, function (serviceTypes) {
            ctrl.serviceTypes = serviceTypes;
          });
        }
        ctrl.serviceType = undefined;
        ctrl.canCreateService = "true";
      };

      ctrl.serviceTypeChanged = function () {
        if(ctrl.serviceType === undefined || ctrl.serviceType === null || ctrl.customer === undefined || ctrl.customer === null) {
          ctrl.canCreateService = "true";
          return;
        }
        ctrl.canCreateService = "false";
        ServiceTemplateService.getServiceInstances(ctrl.customer.id, ctrl.serviceType.type, function (instances) {
          ctrl.serviceInstances = instances;
        });
      };

      ctrl.packageOnboard = function (onboardPackage) {
        var modalInstance = $uibModal.open({
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl : 'app/uui/fusion/scripts/view-models/vnf-ns-onboard-dialog.html',
          controller : 'packageOnboardCtrl',
          controllerAs : 'ctrl',
          resolve: {
            onboardPackage: function () {
              return onboardPackage;
            }
          }
        });
        modalInstance.result.then(
          function(result) {
            console.log('receive ok button clicked!');
            console.log(result);
          },
          function(reason) {
            console.log('receive cancel button clicked!');
            console.log(reason);
            $log.info('Modal dismissed at: ' + new Date());
          }
        );
      };
    }
  ]
)
.controller('createServiceCtrl',['$scope', '$uibModalInstance', 'ServiceTemplateService', 'customer', 'serviceType',
    function($scope, $uibModalInstance, ServiceTemplateService, customer, serviceType) {
      var ctrl = this;

      ctrl.templates = ServiceTemplateService.getAllServiceTemplates();

      ctrl.changeInput = function (serviceTemplate) {
        var paras = serviceTemplate.inputs.map(function (input) {
          return {
            name: input.name,
            description: input.description,
            defaultValue: input.defaultValue,
            isRequired: input.isRequired,
            readonly: ""
          };
        });

        var segmentsPara = serviceTemplate.nestedTemplates.map(function (nestedTemplate) {
          var nestedParas = nestedTemplate.inputs.map(function (input) {
            return {
              name: input.name,
              description: input.description,
              defaultValue: input.defaultValue,
              isRequired: input.isRequired,
              readonly: ""
            };
          });
          return {
               nodeTemplateName: nestedTemplate.name,
               location: {
                 name: nestedTemplate.name + " location",// ???
               },
               parameters: nestedParas
             };
        });

        var service = {
          serviceName: ctrl.service.serviceName,
          serviceDescription: ctrl.service.serviceDescription,
          location: {
            name: "local host" // ???
          },
          parameters: paras,
          segments: segmentsPara
        };
        ctrl.service = service;
      };

      ctrl.serviceTemplateChanged = function (template) {
        console.log('serviceTemplateChanged invoked... ' + template);
        if(template === undefined || template === null) {
          ctrl.service = undefined;
          ctrl.realTemplate = undefined;
        } else {
          ServiceTemplateService.getTemplateParameters(template, function (templateRsp) {
            ctrl.realTemplate = templateRsp;
            ctrl.changeInput(ctrl.realTemplate);
          });
        }
      };

      ctrl.ok = function() {
        console.log('ok button clicked!');
        console.log('service: ');
        console.log(ctrl.service);
        console.log(customer);
        console.log(serviceType);
        console.log(ctrl.realTemplate);
        ServiceTemplateService.createService(customer, serviceType, ctrl.service, ctrl.realTemplate);
        var result = 'success.';
        $uibModalInstance.close(result);
      };

      console.log($uibModalInstance);
      // cancel click
      ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };

      ServiceTemplateService.getAllVimInfo(function (vims) {
        ctrl.locations = vims;
      });
    }]
).controller('packageOnboardCtrl',['$scope', '$uibModalInstance', 'ServiceTemplateService','onboardPackage',
    function($scope, $uibModalInstance, ServiceTemplateService, onboardPackage) {
      var ctrl = this;

      ServiceTemplateService.getAllVimInfo(function (vims) {
        ctrl.packageLocations = vims;
      });

      ctrl.ok = function() {
        var proVims = [];
        ctrl.packageLocations.forEach(function (location) {
          if(location.productenv) {
            proVims.push(location.name);
          }
        });
        ServiceTemplateService.packageOnboard(onboardPackage, {
          testenv: ctrl.testenv,
          productenv: proVims
        });
        $uibModalInstance.close('successfully');
      };
      // cancel click
      ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };

    }]
);
