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
      ctrl.alerts = [];
      ctrl.closeAlert = function(index) {
        ctrl.alerts.splice(index, 1);
      };
      var openServiceProgressDialog = function (serviceId, operationId, title, successFun, failFun) {
        var serviceProgressInstance = $uibModal.open({
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl : 'app/uui/fusion/scripts/view-models/progress-dialog.html',
          controller : 'ServiceProgressCtrl',
          controllerAs : 'ctrl',
          resolve: {
            serviceId: function () {
              return serviceId;
            },
            operationId: function () {
              return operationId;
            },
            operationTitle: function () {
              return title;
            }
          }
        });
        serviceProgressInstance.result.then(
          function (result) {
            successFun(result);
          },
          function (reason) {
            failFun(reason);
          }
        );
      };
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
            var successFun = function (result) {
              ctrl.alerts.push({type: 'success', msg: result});
              ServiceTemplateService.getServiceInstances(ctrl.customer.id, ctrl.serviceType.value, function (instances) {
                ctrl.serviceInstances = instances;
              });
            }
            var failFun = function (reason) {
              ctrl.alerts.push({type: 'danger',msg: reason});
            }
            openServiceProgressDialog(result.serviceId, result.operationId, 'Create Service', successFun, failFun);
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
        ServiceTemplateService.getServiceInstances(ctrl.customer.id, ctrl.serviceType.value, function (instances) {
          ctrl.serviceInstances = instances;
        });
      };

      ctrl.deleteService = function (serviceInstance) {
        var successFun = function (serviceId, operationId) {
          var successFun = function (result) {
            ctrl.alerts.push({type: 'success', msg: result});
            ServiceTemplateService.getServiceInstances(ctrl.customer.id, ctrl.serviceType.value, function (instances) {
              ctrl.serviceInstances = instances;
            });
          }
          var failFun = function (reason) {
            ctrl.alerts.push({type: 'danger',msg: reason});
          }
          openServiceProgressDialog(serviceId, operationId, 'Delete Service', successFun, failFun);
        }
        ServiceTemplateService.deleteService(serviceInstance.serviceInstanceId, successFun);
      };

      ctrl.packageOnboard = function (onboardPackage) {
        ServiceTemplateService.packageOnboard(onboardPackage);
      };
    }
  ]
)
.controller('createServiceCtrl',['$scope', '$uibModal','$uibModalInstance', 'ServiceTemplateService', 'customer', 'serviceType',
    function($scope,$uibModal, $uibModalInstance, ServiceTemplateService, customer, serviceType) {
      var ctrl = this;

      ServiceTemplateService.getAllServiceTemplates(function (t) {
        ctrl.templates = t;
      });

      ctrl.changeInput = function (serviceTemplate) {
        var paras = serviceTemplate.inputs.map(function (input) {
          return {
            name: input.name,
            type: input.type,
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
              type: input.type,
              description: input.description,
              defaultValue: input.defaultValue,
              isRequired: input.isRequired,
              readonly: ""
            };
          });
          return {
               nodeTemplateName: nestedTemplate.name,
               invariantUUID: nestedTemplate.invariantUUID,
               uuid: nestedTemplate.uuid,
               type: nestedTemplate.type,
               parameters: nestedParas
             };
        });

        var service = {
          serviceName: ctrl.service.serviceName,
          serviceDescription: ctrl.service.serviceDescription,
          parameters: paras,
          segments: segmentsPara
        };
        ctrl.service = service;
      };
      ctrl.service = {
        serviceName: '',
        serviceDescription: '',
        parameters: [],
        segments: []
      };
      ctrl.sdnControllers = [];
      ctrl.locations = [];

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


        var errorMessage = function () {

        };
        var successFun = function (serviceId, operationId) {
          $uibModalInstance.close({
            serviceId: serviceId,
            operationId: operationId
          });
        }
        ServiceTemplateService.createService(customer, serviceType, ctrl.service, ctrl.realTemplate, successFun, errorMessage);
      };
      // cancel click
      ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };

      ServiceTemplateService.getAllVimInfo(function (vims) {
        ctrl.locations = vims;
      });

      ServiceTemplateService.getAllSdnControllers(function (sdnControllers) {
        ctrl.sdnControllers = sdnControllers;
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
).controller('ServiceProgressCtrl', ['$uibModalInstance', 'ServiceTemplateService', 'serviceId', 'operationId', 'operationTitle', '$q', '$interval',
function ($uibModalInstance, ServiceTemplateService, serviceId, operationId, operationTitle, $q, $interval) {
  var ctrl = this;
  ctrl.title = operationTitle;
  ctrl.operation = '';
  ctrl.max = 100;
  ctrl.dynamic = 0;

  var timerDeferred = $q.defer();
  var timerPromise = timerDeferred.promise;

  var progressFun = function (serviceProgress) {
    if('finished' === serviceProgress.result || 'error' === serviceProgress.result) {
      ctrl.dynamic = 100;
      timerDeferred.resolve();
      if('finished' === serviceProgress.result) {
        $uibModalInstance.close(operationTitle + ' finished!');
      } else if('error' === serviceProgress.result) {
        $uibModalInstance.dismiss(operationTitle + ' failed! ' + serviceProgress.reason);
      }
      console.log('timer finished!');
    } else if('processing' === serviceProgress.result) {
      ctrl.dynamic = serviceProgress.progress;
      ctrl.operation = serviceProgress.operationContent;
      console.log('timer processing ......');
    }
  };

  var timer = $interval(function () {
    ServiceTemplateService.queryServiceProgress(serviceId, operationId, progressFun);
  }, 1000);

  timerPromise.then(function () {
    $interval.cancel(timer);
    console.log('timer cancel ---- ');
  },function () {
    $interval.cancel(timer);
  });
}]
);
