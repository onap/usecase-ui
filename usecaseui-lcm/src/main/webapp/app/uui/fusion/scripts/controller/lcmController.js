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
      ctrl.closeAlert = function (index) {
        ctrl.alerts.splice(index, 1);
      };
      var openServiceProgressDialog = function (serviceId, operationId, title, successFun, failFun) {
        var serviceProgressInstance = $uibModal.open({
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'app/uui/fusion/scripts/view-models/progress-dialog.html',
          controller: 'ServiceProgressCtrl',
          controllerAs: 'ctrl',
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
          templateUrl: 'app/uui/fusion/scripts/view-models/create-service-dialog.html',
          controller: 'createServiceCtrl',
          controllerAs: 'ctrl',
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
          function (result) {
            console.log('receive ok button clicked!');
            console.log(result);
            var successFun = function (result) {
              ctrl.alerts.push({
                type: 'success',
                msg: result
              });
              ServiceTemplateService.getServiceInstances(ctrl.customer.id, ctrl.serviceType.value, function (instances) {
                ctrl.serviceInstances = instances;
              });
            }
            var failFun = function (reason) {
              ctrl.alerts.push({
                type: 'danger',
                msg: reason
              });
            }
            openServiceProgressDialog(result.serviceId, result.operationId, 'Create Service', successFun, failFun);
          },
          function (reason) {
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
        if (ctrl.customer === undefined || ctrl.customer === null) {
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
        if (ctrl.serviceType === undefined || ctrl.serviceType === null || ctrl.customer === undefined || ctrl.customer === null) {
          ctrl.canCreateService = "true";
          return;
        }
        ctrl.canCreateService = "false";
        ServiceTemplateService.getServiceInstances(ctrl.customer.id, ctrl.serviceType.value, function (instances) {
          ctrl.serviceInstances = instances;
        });
      };

      ctrl.scaleService = function (serviceInstance) {

        var modalInstance = $uibModal.open({
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'app/uui/fusion/scripts/view-models/scale-service-dialog.html',
          controller: 'scaleServiceCtrl',
          controllerAs: 'ctrl',
          resolve: {
            customer: function () {
              return ctrl.customer;
            },
            serviceType: function () {
              return ctrl.serviceType;
            },
            serviceInstance: serviceInstance
          }
        });
        modalInstance.result.then(
          function (result) {
            console.log(result);
            console.log(serviceInstance);
            var successFun = function (result) {
              ctrl.alerts.push({
                type: 'success',
                msg: result
              });
              ServiceTemplateService.getServiceInstances(ctrl.customer.id, ctrl.serviceType.value, function (instances) {
                ctrl.serviceInstances = instances;
              });
            }
            var failFun = function (reason) {
              console.log(reason)
              ctrl.alerts.push({
                type: 'danger',
                msg: reason
              });
            }
            openServiceProgressDialog(result.serviceId, result.operationId, 'Scale Service', successFun, failFun);
          },
          function (reason) {
            console.log('receive cancel button clicked!');
            console.log(reason);
            $log.info('Modal dismissed at: ' + new Date());
          }
        );

      };

      ctrl.deleteService = function (serviceInstance) {
        console.log(serviceInstance);
        var deleteServiceName = serviceInstance.serviceInstanceName;
        var modalInstance = $uibModal.open({
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          template:(function(deleteServiceName){
            var strtemplate = 
            '<div class="modal-header" style="background-color:#eee;">'+
              '<h4 class="modal-title" id="myModalLabel">'+
                '<span>Delete Request</span>'+
              '</h4>'+
            '</div>'+
            '<div class="modal-body">'+
              '<h3 style="margin-top:10px;"> Are you sure you want to delete <span style="color:red">'+ deleteServiceName + '</span>? </h3>'+
            '</div>'+
            '<div class="modal-footer">'+
              '<button type="button" style="width:80px;" class="btn btn-primary" ng-click="ctrl.ok()" id="startToCreateService">'+
                '<span id="nfv-virtualApplication-iui-text-cancelBtn">YES</span>'+
              '</button>'+
              '<button type="button" style="width:80px;" class="btn btn-warning" ng-click="ctrl.cancel()">'+
                '<span id="nfv-virtualApplication-iui-text-previousBtn">NO</span>'+
              '</button>'+
            '</div>';
            return strtemplate;
          })(deleteServiceName),
          
          controller: function($uibModalInstance){
            this.ok = function(){
              $uibModalInstance.close('delete implement');
            };
            this.cancel = function(){
              $uibModalInstance.dismiss('delete cancel');
            }
          } ,
          controllerAs: 'ctrl',
        });
        modalInstance.result.then(
          function(res){
            console.log(res);
            var successFun = function (serviceId, operationId) {
              var successFun = function (result) {
                ctrl.alerts.push({
                  type: 'success',
                  msg: result
                });
                ServiceTemplateService.getServiceInstances(ctrl.customer.id, ctrl.serviceType.value, function (instances) {
                  ctrl.serviceInstances = instances;
                });
              }
              var failFun = function (reason) {
                ctrl.alerts.push({
                  type: 'danger',
                  msg: reason
                });
              }
              openServiceProgressDialog(serviceId, operationId, 'Delete Service', successFun, failFun);
            }
            ServiceTemplateService.deleteService(serviceInstance.serviceInstanceId, ctrl.customer, ctrl.serviceType, successFun);
          },
          function(reason){
            console.log(reason);
          }
        )
      };

      ctrl.upDateService = function (serviceInstance) {

        var modalInstance = $uibModal.open({
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'app/uui/fusion/scripts/view-models/update-service-dialog.html',
          controller: 'updateServiceCtrl',
          controllerAs: 'ctrl',
          resolve: {
            customer: function () {
              return ctrl.customer;
            },
            serviceType: function () {
              return ctrl.serviceType;
            },
            serviceInstance: serviceInstance
          }
        });
        modalInstance.result.then(
          function (result) {
            console.log(result);
            console.log(serviceInstance);
            var successFun = function (result) {
              ctrl.alerts.push({
                type: 'success',
                msg: result
              });
              ServiceTemplateService.getServiceInstances(ctrl.customer.id, ctrl.serviceType.value, function (instances) {
                ctrl.serviceInstances = instances;
              });
            }
            var failFun = function (reason) {
              console.log(reason)
              ctrl.alerts.push({
                type: 'danger',
                msg: reason
              });
            }
            openServiceProgressDialog(result.serviceId, result.operationId, 'upDate Service', successFun, failFun);
          },
          function (reason) {
            console.log('receive cancel button clicked!');
            console.log(reason);
            $log.info('Modal dismissed at: ' + new Date());
          }
        );

      };

      ctrl.packageOnboard = function (onboardPackage) {
        if (onboardPackage.type === 'NS') {
          var processFun = function (response) {
            if ('failed' === response.status) {
              ctrl.alerts.push({
                type: 'danger',
                msg: 'Operation failed! ' + response.statusDescription
              });
            } else {
              ctrl.alerts.push({
                type: 'success',
                msg: 'Operation is finished!'
              });
            }
          };
          ServiceTemplateService.nsPackageOnboard(onboardPackage, processFun);
        } else {
          var openOnboardProgressDialog = function (jobId, title, successFun, failFun) {
            var onboardProgressInstance = $uibModal.open({
              ariaLabelledBy: 'modal-title',
              ariaDescribedBy: 'modal-body',
              templateUrl: 'app/uui/fusion/scripts/view-models/progress-dialog.html',
              controller: 'VfOnboardProgressCtrl',
              controllerAs: 'ctrl',
              resolve: {
                jobId: function () {
                  return jobId;
                },
                operationTitle: function () {
                  return title;
                }
              }
            });
            onboardProgressInstance.result.then(
              function (result) {
                successFun(result);
              },
              function (reason) {
                failFun(reason);
              }
            );
          };
          var successFun = function (result) {
            ctrl.alerts.push({
              type: 'success',
              msg: 'Operation is finished!'
            });
          };
          var failFun = function (reason) {
            ctrl.alerts.push({
              type: 'danger',
              msg: 'Operation is failed! ' + reason
            });
          };
          var processFun = function (response) {
            openOnboardProgressDialog(response.jobId, 'VF Onboarding', successFun, failFun);
          };
          ServiceTemplateService.vfPackageOnboard(onboardPackage, processFun);
        }
      };

      ctrl.packageDelete = function (deletePackage) {
        if (deletePackage.type === 'NS') {
          var processFun = function (response) {
            if ('failed' === response.status) {
              ctrl.alerts.push({
                type: 'danger',
                msg: 'Operation failed! ' + response.statusDescription
              });
            } else {
              ctrl.alerts.push({
                type: 'success',
                msg: 'Operation is finished!'
              });
            }
          };
          ServiceTemplateService.nsPackageDelete(deletePackage, processFun);
        } else {
          var openOnboardProgressDialog = function (jobId, title, successFun, failFun) {
            var onboardProgressInstance = $uibModal.open({
              ariaLabelledBy: 'modal-title',
              ariaDescribedBy: 'modal-body',
              templateUrl: 'app/uui/fusion/scripts/view-models/progress-dialog.html',
              controller: 'VfOnboardProgressCtrl',
              controllerAs: 'ctrl',
              resolve: {
                jobId: function () {
                  return jobId;
                },
                operationTitle: function () {
                  return title;
                }
              }
            });
            onboardProgressInstance.result.then(
              function (result) {
                successFun(result);
              },
              function (reason) {
                failFun(reason);
              }
            );
          };
          var successFun = function (result) {
            ctrl.alerts.push({
              type: 'success',
              msg: 'Operation is finished!'
            });
          };
          var failFun = function (reason) {
            ctrl.alerts.push({
              type: 'danger',
              msg: 'Operation is failed! ' + reason
            });
          };
          var processFun = function (response) {
            openOnboardProgressDialog(response.jobId, 'Delete VF package', successFun, failFun);
          };
          ServiceTemplateService.vfPackageDelete(deletePackage, processFun);
        }
      };

      ctrl.jumpToUrl = function () {
        var obj = $("#lm");
        angular.element(obj).scope().currentTab = "app/uui/fusion/scripts/view-models/device-topological.html";
      }

    }
  ])
  .controller('createServiceCtrl', ['$scope', '$uibModal', '$uibModalInstance', 'ServiceTemplateService', 'customer', 'serviceType',
    function ($scope, $uibModal, $uibModalInstance, ServiceTemplateService, customer, serviceType) {
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
            customizationUuid:nestedTemplate.customizationUuid,
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
        console.log(service);
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
        console.log(template);
        if (template === undefined || template === null) {
          ctrl.service = undefined;
          ctrl.realTemplate = undefined;
        } else {
          ServiceTemplateService.getTemplateParameters(template, function (templateRsp) {
            ctrl.realTemplate = templateRsp;
            ctrl.changeInput(ctrl.realTemplate);
          });
        }
      };

      ctrl.ok = function () {
        console.log('ok button clicked!');
        console.log('service: ');
        console.log(customer);
        console.log(serviceType);
        console.log(ctrl.service);
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
      ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

      ServiceTemplateService.getAllVimInfo(function (vims) {
        ctrl.locations = vims;
      });

      ServiceTemplateService.getAllSdnControllers(function (sdnControllers) {
        ctrl.sdnControllers = sdnControllers;
      });
    }
  ])
  .controller('scaleServiceCtrl', ['$scope', '$uibModal', '$uibModalInstance', 'ServiceTemplateService', 'customer', 'serviceType','serviceInstance',
    function ($scope, $uibModal, $uibModalInstance, ServiceTemplateService, customer, serviceType, serviceInstance) {
      var ctrl = this;
      console.log(ctrl);
      console.log(customer);
      console.log(serviceType);
      console.log(serviceInstance);
  
      ServiceTemplateService.getScaleServiceDialog(customer.name,serviceType.name,serviceInstance.serviceInstanceId,function(data){
        console.log(data.data);
        ctrl.nsData = data.data;
        // console.log(ctrl)
      })
      ctrl.scaleTypes = ["SCALE_NS","SCALE_VNF"];
      ctrl.scalingDirections = ["SCALE_IN","SCALE_OUT"];

      ctrl.ok = function () {
  
        let resources = [];
        ctrl.nsData.forEach(function(item){
          resources.push({
            "resourceInstanceId": item.netWorkServiceId,
            "scaleType": item.scaleType,
            "scaleNsData": {
              "scaleNsByStepsData": {
                "aspectId": item.aspectId,
                "numberOfSteps": item.numberOfStep,
                "scalingDirection": item.scalingDirection
              }
            }            
          })
        })
        var requestBody = {
          "service":{
            "serviceInstanceName": serviceInstance.serviceInstanceName,
            "serviceType": serviceType.value,
            "globalSubscriberId": serviceInstance.serviceInstanceId,
            "resources": resources
          } 
        };
        var errorMessage = function () {

        };
        var successFun = function ( operationId) {
          $uibModalInstance.close({
            serviceId:serviceInstance.serviceInstanceId,
            operationId: operationId
          });
        }
        ServiceTemplateService.scaleService(requestBody, successFun, errorMessage);

      };
      // cancel click
      ctrl.cancel = function () {
        // $uibModalInstance.close("ok关闭效果");
        $uibModalInstance.dismiss('cancel');
      };

    }
  ])
  .controller('updateServiceCtrl', ['$scope', '$uibModal', '$uibModalInstance', 'ServiceTemplateService', 'customer', 'serviceType','serviceInstance',
    function ($scope, $uibModal, $uibModalInstance, ServiceTemplateService, customer, serviceType,serviceInstance) {
      var ctrl = this;
      console.log(serviceInstance)
      var serviceInstanceId = serviceInstance.serviceInstanceId;
      ServiceTemplateService.getupdateServiceTemplate(serviceInstanceId,function(template){
        console.log(template);
        ServiceTemplateService.getAllServiceTemplates(function (res) {
          console.log(res)
          var slectTemplates = [];
          res.forEach(function(item){
            if(item.id === template.model-version-id && itme.invariantUUID !== template.model-invariant-id){
              slectTemplates.push(item);
            }
          })
          ctrl.templates = slectTemplates;
        });
      })


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
            customizationUuid:nestedTemplate.customizationUuid,
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
        console.log(service);
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
        if (template === undefined || template === null) {
          ctrl.service = undefined;
          ctrl.realTemplate = undefined;
        } else {
          ServiceTemplateService.getComparedTemplateParameters(serviceInstanceId,template, function (templateRsp) {
            ctrl.realTemplate = templateRsp;
            ctrl.changeInput(ctrl.realTemplate);
          });
        }
      };

      ctrl.ok = function () {
        console.log('ok button clicked!');
        console.log('service: ');
        console.log(customer);
        console.log(serviceType);
        console.log(ctrl.service);
        console.log(ctrl.realTemplate);


        var errorMessage = function () {

        };
        var successFun = function (operationId) {
          $uibModalInstance.close({
            serviceId: serviceInstanceId,
            operationId: operationId
          });
        }
        ServiceTemplateService.updateService(customer, serviceType,serviceInstanceId, ctrl.service, ctrl.realTemplate, successFun, errorMessage);
      };
      // cancel click
      ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

      ServiceTemplateService.getAllVimInfo(function (vims) {
        ctrl.locations = vims;
      });

      ServiceTemplateService.getAllSdnControllers(function (sdnControllers) {
        ctrl.sdnControllers = sdnControllers;
      });
    }
  ])
  .controller('packageOnboardCtrl', ['$scope', '$uibModalInstance', 'ServiceTemplateService', 'onboardPackage',
    function ($scope, $uibModalInstance, ServiceTemplateService, onboardPackage) {
      var ctrl = this;

      ServiceTemplateService.getAllVimInfo(function (vims) {
        ctrl.packageLocations = vims;
      });

      ctrl.ok = function () {
        var proVims = [];
        ctrl.packageLocations.forEach(function (location) {
          if (location.productenv) {
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
      ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

    }
  ])
  .controller('ServiceProgressCtrl', ['$uibModalInstance', 'ServiceTemplateService', 'serviceId', 'operationId', 'operationTitle', '$q', '$interval',
    function ($uibModalInstance, ServiceTemplateService, serviceId, operationId, operationTitle, $q, $interval) {
      var ctrl = this;
      ctrl.title = operationTitle;
      ctrl.operation = '';
      ctrl.max = 100;
      ctrl.dynamic = 0;

      var timerDeferred = $q.defer();
      var timerPromise = timerDeferred.promise;

      var progressFun = function (serviceProgress) {
        if ('finished' === serviceProgress.result || 'error' === serviceProgress.result) {
          ctrl.dynamic = 100;
          timerDeferred.resolve();
          if ('finished' === serviceProgress.result) {
            $uibModalInstance.close(operationTitle + ' finished!');
          } else if ('error' === serviceProgress.result) {
            $uibModalInstance.dismiss(operationTitle + ' failed! ' + serviceProgress.reason);
          }
          console.log('timer finished!');
        } else if ('processing' === serviceProgress.result) {
          ctrl.dynamic = serviceProgress.progress;
          ctrl.operation = serviceProgress.operationContent;
          console.log('timer processing ......');
        }
      };

      var timer = $interval(function () {
        ServiceTemplateService.queryServiceProgress(serviceId, operationId, progressFun);
      }, 5000);

      timerPromise.then(function () {
        $interval.cancel(timer);
        console.log('timer cancel ---- ');
      }, function () {
        $interval.cancel(timer);
      });
    }
  ])
  .controller('VfOnboardProgressCtrl', ['$uibModalInstance', 'ServiceTemplateService', 'jobId', 'operationTitle', '$q', '$interval',
    function ($uibModalInstance, ServiceTemplateService, jobId, operationTitle, $q, $interval) {
      var ctrl = this;
      ctrl.title = operationTitle;
      ctrl.operation = '';
      ctrl.max = 100;
      ctrl.dynamic = 0;

      var timerDeferred = $q.defer();
      var timerPromise = timerDeferred.promise;

      var responseId = '0';
      var progressFun = function (responseDescriptor) {
        if ('finished' === responseDescriptor.status || 'error' === responseDescriptor.status) {
          ctrl.dynamic = 100;
          timerDeferred.resolve();
          if ('finished' === responseDescriptor.status) {
            $uibModalInstance.close('');
          } else if ('error' === responseDescriptor.status) {
            $uibModalInstance.dismiss(responseDescriptor.statusDescription);
          }
          console.log('timer finished!');
        } else if ('processing' === responseDescriptor.status) {
          ctrl.dynamic = responseDescriptor.progress;
          ctrl.operation = responseDescriptor.statusDescription;
          console.log('timer processing ......');
          responseId = responseDescriptor.responseId;
          if (responseId === undefined) {
            console.log('Cannot get responseId...');
            $uibModalInstance.close('');
            timerDeferred.resolve();
          }
        }
      };

      var timer = $interval(function () {
        ServiceTemplateService.queryVfOnboardProgress(jobId, responseId, progressFun);
      }, 1000);

      timerPromise.then(function () {
        $interval.cancel(timer);
        console.log('timer cancel ---- ');
      }, function () {
        $interval.cancel(timer);
      });
    }
  ]);