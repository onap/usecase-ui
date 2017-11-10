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
 app.factory("ServiceTemplateService", function($http, $log) {
   var url = '/api/usecaseui-server/v1/uui-lcm';
   var uuiHeaders = JSON.stringify({
     'Content-Type': 'application/json'
    //  'Authorization':'Basic dXNlY2FzZTp1c2VjYXNl'
   });
   return {
     getAllCustomers: function (processFun) {
       return $http({
         url: url+'/customers',
         method: 'GET',
         data: null,
         headers: uuiHeaders
       }).then(function(response){
         var customers = response.data;
         var result = customers.map(function (customer) {
           return {
             name: customer['subscriber-name'],
             id: customer['global-customer-id'],
           };
         });
         processFun(result);
       });
     },

     getAllServiceTypes: function (customerId, processFun) {
       return $http({
         url: url+'/customers/' + customerId + '/service-subscriptions',
         method: 'GET',
         data: null,
         headers: uuiHeaders
       }).then(function(response){
         var serviceSubscriptions = response.data;
         var result = serviceSubscriptions.map(function (serviceSubscription) {
           return {
             name: serviceSubscription['service-type'],
             value: serviceSubscription['service-type']
           };
         });
         processFun(result);
       });
     },

     getServiceInstances: function (customerId, serviceType, processFun) {
       return $http({
         url: url+'/service-instances?customerId='+customerId+'&serviceType='+serviceType,
         method: 'GET',
         data: null,
         headers: uuiHeaders
       }).then(function(response){
         var serviceInstances = response.data;
         var result = serviceInstances.map(function (serviceInstance) {
           return {
             serviceInstanceId: serviceInstance['service-instance-id'],
             serviceInstanceName: serviceInstance['service-instance-name'],
             serviceType: serviceInstance['service-type'],
           };
         });
         processFun(result);
       });
     },

     getAllServiceTemplates: function (processFun) {
       return $http({
         url: url+'/service-templates',
         method: 'GET',
         data: null,
         headers: uuiHeaders
       }).then(function(response){
         var templates = response.data;
         var result = templates.map(function (template) {
           return {
             name: template.name,
             id: template.uuid,
             invariantUUID: template.invariantUUID,
             version: template.version,
             toscaModelURL: template.toscaModelURL
           };
         });
         processFun(result);
       });
     },

     getTemplateParameters: function (template, processFun) {
       return $http({
         url: url+'/service-templates/' + template.id+'?toscaModelPath='+ template.toscaModelURL,
         method: 'GET',
         data: null,
         headers: uuiHeaders
       }).then(function(response){
         var inputRsp = response.data;
         processFun(inputRsp);
       });
     },

     getAllVimInfo: function (processFun) {
       return $http({
         url: url+'/locations/',
         method: 'GET',
         data: null,
         headers: uuiHeaders
       }).then(function(response){
         var vimInfos = response.data;
         var result = vimInfos.map(function (vim) {
           return {
             name: vim['cloud-owner'] + '_' + vim['cloud-region-id'],
             value: vim['cloud-owner'] + '_' + vim['cloud-region-id']
           };
         });
         processFun(result);
       });
     },

     getAllSdnControllers: function (processFun) {
       return $http({
         url: url+'/sdnc-controllers/',
         method: 'GET',
         data: null,
         headers: uuiHeaders
       }).then(function(response){
         var sdnControllers = response.data;
         var result = sdnControllers.map(function (sdn) {
           return {
             name: sdn['thirdparty-sdnc-id'],
             value: sdn['thirdparty-sdnc-id']
           };
         });
         processFun(result);
       });
     },

     createService: function (customer, serviceType, service, template, successFun, failedFun) {
       var reqPara = [];
       service.segments.forEach(function (segment) {
         var reqParas = {};
         var vfLocations = [];
         segment.parameters.forEach(function (parameter) {
           if(parameter.type === 'vf_location') {
             // name is uuid for vf_location
             var loc = {
               vnfProfileId: parameter.name,
               locationConstraints : {
                 vimId: parameter.value.value
               }
             };
             vfLocations.push(loc);
           } else if(parameter.type === 'sdn_controller') {
             if(parameter.value === undefined || parameter.value === null) {
               reqParas[parameter.name] = '';
             } else {
               reqParas[parameter.name] = parameter.value.value;
             }
           } else {
             reqParas[parameter.name] = parameter.value;
           }
         });

         var para = {
           resourceName: segment.nodeTemplateName,
           resourceDefId: segment.invariantUUID,
           resourceId: segment.uuid,
           nsParameters: {
             locationConstraints: vfLocations,
             additionalParamForNs: reqParas
           }
         };
         reqPara.push(para);
       });

       var templateName = template.name;
       if( template.version !== undefined && template.version !== null && template.version !== '' ) {
         templateName = templateName + ":" + template.version;
       }
       var requestBody = {
         service: {
           name: service.serviceName,
           description: service.serviceDescription,
           serviceDefId: template.invariantUUID,
           templateId: template.uuid, // uuid ??
           parameters: {
             globalSubscriberId: customer.id,
             subscriberName: customer.name,
             serviceType: serviceType.value,
             templateName: templateName,
             resources: reqPara
           }
         }
       };

       console.log('request body: ');
       console.log(JSON.stringify(requestBody));

       return $http({
         url: url+'/services',
         method: 'POST',
         data: JSON.stringify(requestBody),
         headers: uuiHeaders
       }).then(function(response){
         console.log('create response...');
         console.log(response.data);

         var serviceId = response.data.service.serviceId;
         var operationId = response.data.service.operationId;
         successFun(serviceId, operationId);
       });
     },

     deleteService: function (serviceId, successFun) {
       return $http({
         url: url+'/services/' + serviceId,
         method: 'DELETE',
         data: null,
         headers: uuiHeaders
       }).then(function(response){
         console.log('delete response...');
         console.log(response.data);
         successFun(serviceId, response.data.operationId);
       });
     },

     queryServiceProgress: function (serviceId, operationId, progressFun) {
       return $http({
         url: url+'/services/' + serviceId + '/operations/' + operationId,
         method: 'GET',
         data: null,
         headers: uuiHeaders
       }).then(function(response){
         console.log('get progress response...');
         console.log(response.data);
         var op = response.data.operationStatus;
         progressFun({
           result: op.result,
           progress : op.progress,
           operationContent: op.operationContent,
           reason: op.reason
         });
       });
     },

     getPackages: function (processFun) {
       return $http({
         url: url+'/vf-ns-packages',
         method: 'GET',
         data: null,
         headers: uuiHeaders
       }).then(function(response){
         var packageRsp = response.data;
         var packages = [];
         packageRsp.nsPackage.forEach(function (ns) {
           packages.push({
             uuid: ns.uuid,
             invariantUUID: ns.invariantUUID,
             name: ns.name,
             version: ns.version,
             type: 'NS'
           })
         });
         packageRsp.vnfPackages.forEach(function (vnf) {
           packages.push({
             uuid: vnf.uuid,
             invariantUUID: vnf.invariantUUID,
             name: vnf.name,
             version: vnf.version,
             type: 'VF'
           })
         });
         processFun(packages);
       });
     },

     nsPackageOnboard: function (onboardPackage, processFun) {
       console.log('onboard...');
       console.log(onboardPackage);
       var requestBody = {
         csarId: onboardPackage.uuid
       };
       return $http({
         url: url+'/ns-packages',
         method: 'POST',
         data: JSON.stringify(requestBody),
         headers: uuiHeaders
       }).then(function(response){
         console.log('onboard ns package response...');
         console.log(response.data);
         processFun(response.data);
       });
     },

     vfPackageOnboard: function (onboardPackage, processFun) {
       console.log('onboard...');
       console.log(onboardPackage);
       var requestBody = {
         csarId: onboardPackage.uuid
       };
       return $http({
         url: url+'/vf-packages',
         method: 'POST',
         data: JSON.stringify(requestBody),
         headers: uuiHeaders
       }).then(function(response){
         console.log('onboard vf package response...');
         console.log(response.data);
         processFun(response.data);
       });
     },

     queryVfOnboardProgress: function (jobId, progressFun) {
       return $http({
         url: url+'/jobs/' + jobId,
         method: 'GET',
         data: null,
         headers: uuiHeaders
       }).then(function(response){
         console.log('get progress response...');
         console.log(response.data);
         progressFun(response.data.responseDescriptor);
       });
     },

     nsPackageDelete: function (deletePackage, processFun) {
       console.log('delete package...');
       console.log(deletePackage);
       return $http({
         url: url+'/ns-packages/' + deletePackage.uuid,
         method: 'DELETE',
         data: null,
         headers: uuiHeaders
       }).then(function(response){
         console.log('delete ns package response...');
         console.log(response.data);
         processFun(response.data);
       });
     },

     vfPackageDelete: function (deletePackage, processFun) {
       console.log('delete package...');
       console.log(deletePackage);
       return $http({
         url: url+'/vf-packages/' + deletePackage.uuid,
         method: 'DELETE',
         data: null,
         headers: uuiHeaders
       }).then(function(response){
         console.log('delete vf package response...');
         console.log(response.data);
         processFun(response.data);
       });
     }
   };
 });
