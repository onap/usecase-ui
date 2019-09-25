/*
    Copyright (C) 2019 CMCC, Inc. and others. All rights reserved.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

// proxy routers setting
module.exports =
    {
        ///////<-------------api proxy--------->/////
        "/usecaseui-server/v1/*": "/$1",
        "/usecaseui-server/v1/*?:param": "/$1",
        ///////////////

        //text interface
        "/user/login/:user/test": "/user/login?user=:user",
        "/pnf/:cloudnode/p-interfaces/p-interface/:interface-name/createTerminationPoint":
            "/status",
        "/alarm/form/data": "/alarm_form_data",
        "/upload/:url_upId": "/status",
        ///////////////

        ///////<-------------home services--------->/////
        "/portal-auxapi/languageSetting/user/:currentloginId": "/language",
        /////////////////////////

        ///////<-------------managemence services--------->/////
        "/uui-lcm/customers/:customer/service-subscriptions": "/serviceType",
        "/uui-lcm/serviceNumByServiceType/:customer": "/CustomersColumn",
        "/PUT/uui-lcm/customers/:customer": "/PUT_uui-lcm_customers",
        "/PUT/uui-lcm/customers/:name/service-subscriptions/:id": "/PUT_uui-lcm_customers_service-subscriptions",
        "/uui-lcm/customers/:customer": "/getCustomerresourceVersion",
        "/DELETE/uui-lcm/customers?customerId=:customerId&resourceVersion=:resourceVersion": "/DELETE_uui-lcm_customers",
        "/uui-lcm/customers/:customer/service-subscriptions/:id": "/getServiceTypeResourceVersion",
        "/DELETE/uui-lcm/customers/:customer/service-subscriptions/:id": "/DELETE_uui-lcm_customers_service-subscriptions",
        /////////////////////////

        ///////<-------------myhttp services--------->/////
        "/uui-lcm/services/:serviceId/operations/:operations":"/uui-lcm_services_progress",
        "/POST/uui-lcm/fetchCCVPNTemplateData/:uuid":"/uui-lcm_fetchCCVPNTemplateData",
        "/POST/uui-lcm/service-templates/:uuid":"/uui-lcm_e2e_service-templates",
        "/POST/uui-lcm/fetchNsTemplateData":"/uui-lcm_fetchNsTemplateData",
        "/DELETE/uui-lcm/services/:serviceInstanceId":"/uui-lcm_delete_services",
        "/uui-lcm/VnfInfo/:id":"/uui-lcm_VnfInfo",
        "/uui-lcm/jobs/getNsLcmJobStatus/:jobId":"/uui-lcm_jobs_getNsLcmJobStatus",
        "/services/scaleServices/:id":"/services_scaleServices",
        "/PUT/uui-lcm/services/updateService/:id":"/uui-lcm_services_updateService",
        "/uui-sotn/getPnfInfo/:name":"/uui-sotn_getPnfInfo",
        "/uui-sotn/getConnectivityInfo/:id":"/uui-sotn_getConnectivityInfo",
        "/uui-sotn/getPinterfaceByVpnId/:id":"/uui-sotn_getPinterfaceByVpnId",
        "/POST/uui-lcm/healNetworkServiceInstance?ns_instance_id=:ns_instance_id":"/uui-lcm_healNetworkServiceInstance",
        "/POST/uui-lcm/services?customerId=:customerId&serviceType=:serviceType&serviceDomain=:serviceDomain":"/uui-lcm_services",
        "/POST/uui-lcm/createNetworkServiceInstance":"/uui-lcm_createNetworkServiceInstance",
        "/POST/uui-lcm/instantiateNetworkServiceInstance?ns_instance_id=:ns_instance_id&customerId=:customerId&serviceType=:serviceType&serviceDomain=:serviceDomain&parentServiceInstanceId=":"/uui-lcm_instantiateNetworkServiceInstance",
        "/POST/uui-lcm/terminateNetworkServiceInstance?ns_instance_id=:ns_instance_id":"/uui-lcm_terminateNetworkServiceInstance",
        "/DELETE/uui-lcm/deleteNetworkServiceInstance?ns_instance_id=:ns_instance_id":"/uui-lcm_deleteNetworkServiceInstance",
        /////////////////////////

        ///////<-------------networkhttp services--------->/////
        "/DELETE/uui-sotn/deleteExtNetWork": "/status",
        "/uui-sotn/getPinterfaceByPnfName/:pnfName": "/uui-sotn_getPinterfaceByPnfName",
        "/PUT/uui-sotn/createLink/:linkName": "/status",
        "/uui-sotn/getSpecificLogicalLink/:linkName": "/uui-sotn_getSpecificLogicalLink",
        "/uui-sotn/getHostUrl/:aaiId": "/uui-sotn_getHostUrl",
        "/uui-sotn/getExtAaiId/:aaiId": "/uui-sotn_getExtAaiId",
        "/PUT/uui-sotn/createTopoNetwork/:networkId": "/status",
        "/PUT/uui-sotn/createPnf/:nodeName": "/status",
        "/PUT/uui-sotn/pnf/:nodeName/p-interfaces/p-interface/:interfaceName/createTerminationPoint": "/status",
        "/PUT/uui-sotn/createHostUrl/:aaiId": "/status",
        /////////////////////////

        ///////<-------------onboard services--------->/////
        "/nsd/v1/ns_descriptors/:nsdInfoId/nsd_content": "/nsd_content",
        "/vnfpkgm/v1/vnf_packages/:vnfPkgId/package_content": "/nsd_content",
        "/nsd/v1/pnf_descriptors/:pnfdInfoId/pnfd_content": "/nsd_content",
        "/uui-lcm/jobs/:_jobId": "/uui-lcm_jobs_progress",
        "/DELETE/uui-lcm/deleteNsdPackage?nsdInfoId:id": "/DELETE_uui-lcm_deleteNsdPackage",
        "/DELETE/uui-lcm/deleteVnfPackage?vnfPkgId:id": "/DELETE_uui-lcm_deleteVnfPackage",
        "/DELETE/uui-lcm/deletePnfPackage?pnfdInfoId:id": "/DELETE_uui-lcm_deletePnfPackage",
        "/POST/uui-lcm/ns-packages": "/POST_uui-lcm_ns-packages",
        "/POST/uui-lcm/vf-packages": "/POST_uui-lcm_vf-packages",
        "/POST/uui-lcm/:jsonData": "/POST_uui-lcm_create",

        ///////<-------------general interface--------->/////
        "/api/*": "/$1",
        "/*/*": "/$1_$2",
        "/*/*/*": "/$1_$2_$3",
        "/*/*/*/*": "/$1_$2_$3_$4",
        /////////////////////////
    }
