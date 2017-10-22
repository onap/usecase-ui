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
             name: vim['cloud-owner'] + '-' + vim['cloud-region-id'],
             value: vim['cloud-owner'] + '-' + vim['cloud-region-id']
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

     createService: function (customer, serviceType, service, template) {

        function translateInputs(t, customer,serviceType, c, isE2E) {
              var reqParas = {
                subscriptionServiceType: serviceType.id
              };
              var vfLocations = [];
              c[t.name].parameters.forEach(function (parameter) {
                if(parameter.type === 'vf_location') {
                  var loc = {};
                  loc[parameter.name] = parameter.value.value;
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
              if(t.type === 'VF') {
                reqParas.vnfProfileId = vfLocations;
              }
              var nestedSegments = t.nestedTemplates.map(function (nestedTemplate) {
                return translateInputs(nestedTemplate,customer,serviceType, c, false);
              });
              var request = {};
              if(isE2E) {
                request.domainHost = 'localhost';
              }
              request.nodeTemplateName = t.name+':'+t.version;
              request.nodeType = 'service';
              request['GLOBALSUBSCIBERID'] = customer.id;
              request['SUBSCIBERNAME'] = customer.name;
              request.requestParameters = reqParas;
              request.segments = nestedSegments;
              return request;
       }

       var cache = {};
       cache[template.name] = {
         parameters: service.parameters
       };
       service.segments.forEach(function (segment) {
         cache[segment.nodeTemplateName] = {
           parameters: segment.parameters
         }
       });
       console.log('cache ----');
       console.log(cache);

       var reqPara = translateInputs(template,customer, serviceType, cache, true);
       var requestBody = {
         service: {
           name: service.serviceName,
           description: service.serviceDescription,
           serviceDefId: template.invariantUUID,
           templateId: template.uuid, // uuid ??
           parameters: reqPara
         }
       };

       console.log('request body: ');
       console.log(requestBody);

       return $http({
         url: url+'/services',
         method: 'POST',
         data: JSON.stringify(requestBody),
         headers: uuiHeaders
       }).then(function(response){
         console.log('create response...');
         console.log(response.data);
       });
     },

     deleteService: function (serviceId) {
       return $http({
         url: url+'/services/' + serviceId,
         method: 'DELETE',
         data: null,
         headers: uuiHeaders
       }).then(function(response){
         console.log('delete response...');
         console.log(response.data);
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
             type: 'NS'
           })
         });
         packageRsp.vnfPackages.forEach(function (vnf) {
           packages.push({
             uuid: vnf.uuid,
             invariantUUID: vnf.invariantUUID,
             name: vnf.name,
             type: 'VF'
           })
         });
         processFun(packages);
       });
     },

     packageOnboard: function (onboardPackage, vims) {
       console.log('onboard...');
       console.log(onboardPackage);
       console.log(vims);
       var requestBody = {
         csarId: onboardPackage.uuid
       }
       if(onboardPackage.type === 'NS') {
         return $http({
           url: url+'/ns-packages',
           method: 'POST',
           data: JSON.stringify(requestBody),
           headers: uuiHeaders
         }).then(function(response){
           console.log('onboard ns package response...');
           console.log(response.data);
         });
       } else {
         return $http({
           url: url+'/vf-packages',
           method: 'POST',
           data: JSON.stringify(requestBody),
           headers: uuiHeaders
         }).then(function(response){
           console.log('onboard vf package response...');
           console.log(response.data);
         });
       }
     }
   };
 });
