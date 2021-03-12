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
module.exports = {
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
	"/PUT/uui-lcm/customers/:name/service-subscriptions/:id":
		"/PUT_uui-lcm_customers_service-subscriptions",
	"/uui-lcm/customers/:customer": "/getCustomerresourceVersion",
	"/DELETE/uui-lcm/customers?customerId=:customerId&resourceVersion=:resourceVersion":
		"/DELETE_uui-lcm_customers",
	"/uui-lcm/customers/:customer/service-subscriptions/:id":
		"/getServiceTypeResourceVersion",
	"/DELETE/uui-lcm/customers/:customer/service-subscriptions/:id":
		"/DELETE_uui-lcm_customers_service-subscriptions",
	/////////////////////////

	///////<-------------myhttp services--------->/////
	"/uui-lcm/services/:serviceId/operations/:operations":
		"/uui-lcm_services_progress",
	"/POST/uui-lcm/fetchCCVPNTemplateData/:uuid":
		"/uui-lcm_fetchCCVPNTemplateData",
	"/POST/uui-lcm/service-templates/:uuid": "/uui-lcm_e2e_service-templates",
	"/POST/uui-lcm/fetchNsTemplateData": "/uui-lcm_fetchNsTemplateData",
	"/DELETE/uui-lcm/services/:serviceInstanceId": "/uui-lcm_delete_services",
	"/uui-lcm/VnfInfo/:id": "/uui-lcm_VnfInfo",
	"/uui-lcm/jobs/getNsLcmJobStatus/:jobId": "/uui-lcm_jobs_getNsLcmJobStatus",
	"/services/scaleServices/:id": "/services_scaleServices",
	"/PUT/uui-lcm/services/updateService/:id":
		"/uui-lcm_services_updateService",
	"/uui-sotn/getPnfInfo/:name": "/uui-sotn_getPnfInfo",
	"/uui-sotn/getConnectivityInfo/:id": "/uui-sotn_getConnectivityInfo",
	"/uui-sotn/getPinterfaceByVpnId/:id": "/uui-sotn_getPinterfaceByVpnId",
	"/POST/uui-lcm/healNetworkServiceInstance?ns_instance_id=:ns_instance_id":
		"/uui-lcm_healNetworkServiceInstance",
	"/POST/uui-lcm/services?customerId=:customerId&serviceType=:serviceType&serviceDomain=:serviceDomain":
		"/uui-lcm_services",
	"/POST/uui-lcm/createNetworkServiceInstance":
		"/uui-lcm_createNetworkServiceInstance",
	"/POST/uui-lcm/instantiateNetworkServiceInstance?ns_instance_id=:ns_instance_id&customerId=:customerId&serviceType=:serviceType&serviceDomain=:serviceDomain&parentServiceInstanceId=":
		"/uui-lcm_instantiateNetworkServiceInstance",
	"/POST/uui-lcm/terminateNetworkServiceInstance?ns_instance_id=:ns_instance_id":
		"/uui-lcm_terminateNetworkServiceInstance",
	"/DELETE/uui-lcm/deleteNetworkServiceInstance?ns_instance_id=:ns_instance_id":
		"/uui-lcm_deleteNetworkServiceInstance",
	/////////////////////////

	///////<-------------networkhttp services--------->/////
	"/DELETE/uui-sotn/deleteExtNetWork": "/status",
	"/uui-sotn/getPinterfaceByPnfName/:pnfName":
		"/uui-sotn_getPinterfaceByPnfName",
	"/PUT/uui-sotn/createLink/:linkName": "/status",
	"/uui-sotn/getSpecificLogicalLink/:linkName":
		"/uui-sotn_getSpecificLogicalLink",
	"/uui-sotn/getHostUrl/:aaiId": "/uui-sotn_getHostUrl",
	"/uui-sotn/getExtAaiId/:aaiId": "/uui-sotn_getExtAaiId",
	"/PUT/uui-sotn/createTopoNetwork/:networkId": "/status",
	"/PUT/uui-sotn/createPnf/:nodeName": "/status",
	"/PUT/uui-sotn/pnf/:nodeName/p-interfaces/p-interface/:interfaceName/createTerminationPoint":
		"/status",
	"/PUT/uui-sotn/createHostUrl/:aaiId": "/status",
	/////////////////////////

	///////<-------------onboard services--------->/////
	"/nsd/v1/ns_descriptors/:nsdInfoId/nsd_content": "/nsd_content",
	"/vnfpkgm/v1/vnf_packages/:vnfPkgId/package_content": "/nsd_content",
	"/nsd/v1/pnf_descriptors/:pnfdInfoId/pnfd_content": "/nsd_content",
	"/uui-lcm/jobs/:_jobId": "/uui-lcm_jobs_progress",
	"/DELETE/uui-lcm/deleteNsdPackage?nsdInfoId:id":
		"/DELETE_uui-lcm_deleteNsdPackage",
	"/DELETE/uui-lcm/deleteVnfPackage?vnfPkgId:id":
		"/DELETE_uui-lcm_deleteVnfPackage",
	"/DELETE/uui-lcm/deletePnfPackage?pnfdInfoId:id":
		"/DELETE_uui-lcm_deletePnfPackage",
  "/POST/uui-lcm/ns-packages": "/POST_uui-lcm_ns-packages",
	"/POST/uui-lcm/vf-packages": "/POST_uui-lcm_vf-packages",
  "/POST/uui-lcm/:jsonData": "/POST_uui-lcm_create",
  "/POST/intent/predict": "/POST_intent_predict",

	///////<-------------slicing--------->/////
	"/uui-slicing/nsmf/task/business/pageNo/:pageNo/pageSize/:pageSize":
		"/slicing_task_list",
	"/uui-slicing/nsmf/task/:processingStatus/business/pageNo/:pageNo/pageSize/:pageSize":
		"/slicing_task_processing_status",
	"/uui-slicing/nsmf/task/:taskId/auditInfo": "/slicing_task_auditInfo",
	"/uui-slicing/nsmf/resource/nsi/instances/pageNo/:pageNo/pageSize/:pageSize":
		"/slicing_nsi_list",
	"/uui-slicing/nsmf/resource/nsi/:nsiId/nssiInstances":
		"/slicing_subnet_instance",
	"/uui-slicing/nsmf/resource/nssi/environmentContext/:environmentContext/instances/pageNo/:pageNo/pageSize/:pageSize":
		"/slicing_subnet_context",
	"/uui-slicing/nsmf/task/:taskId/taskCreationInfo":
		"/slicing_taskCreationInfo",
	"/uui-slicing/nsmf/task/:taskId/taskCreationProgress":
		"/slicing_taskCreationProgress",
	"/PUT/uui-slicing/nsmf/task/auditInfo": "/PUT_task_auditInfo",

	///////<-------------slicing_business--------->/////
	"/uui-slicing/nsmf/resource/business/pageNo/:pageNo/pageSize/:pageSize":
		"/slicing_business_list",
	"/uui-slicing/nsmf/resource/:businessStatus/business/pageNo/:pageNo/pageSize/:pageSize":
		"/slicing_business_list_activated",
	"/PUT/uui-slicing/nsmf/resource/:serviceId/activate":
		"/slicing_business_activate",
	"/PUT/uui-slicing/nsmf/resource/:serviceId/deactivate":
		"/slicing_business_activate",
	"/DELETE/uui-slicing/nsmf/resource/:serviceId":
		"/slicing_business_activate",
	"/uui-slicing/nsmf/resource/:serviceId/progress":
		"/getSlicingBusinessProgress",
	"/uui-slicing/nsmf/resource/business/:businessId/details":
		"/getSlicingBusinessDetail",
	///////<-------------slicing_nsi--------->/////
	"/uui-slicing/nsmf/resource/nsi/:instanceStatus/instances/pageNo/:pageNo/pageSize/:pageSize":
		"/slicing_nsi_list_activated",
	"/uui-slicing/nsmf/resource/nsi/:nsiId/details": "/getSlicingNsiDetail",
	///////<-------------slicing_nssi--------->/////
	"/uui-slicing/nsmf/resource/nssi/instances/pageNo/:pageNo/pageSize/:pageSize":
		"/slicing_nssi_list",
	"/uui-slicing/nsmf/resource/nssi/instanceStatus/:instanceStatus/instances/pageNo/:pageNo/pageSize/:pageSize":
		"/slicing_nssi_list_activated",
	"/uui-slicing/nsmf/resource/nssi/:nssiId/details": "/getSlicingNssiDetail",
	"/uui-slicing/nsmf/task/connectionLinks/pageNo/:pageNo/pageSize/:pageSize":
		"/tn_connectionLinkTable", // :todo
	///////<-------------CSMF slicing_business--------->/////
	"/uui-slicing/csmf/5gSlicing/orders/status/:status/pageNo/:pageNo/pageSize/:pageSize":
		"/csmf_slicing_businessData",
	"/POST/uui-slicing/csmf/5gSlicing": "/csmf_slicing_purchase",
	"/PUT/usecaseui/csmf/5gSlicing/service/:serviceId/activate":
		"/csmfActivate",
	"/DELETE/usecaseui/csmf/5gSlicing/service/:serviceId": "/csmfTerminate",
	"/5gSlicing/service/:serviceId/progress": "/csmfSlicingProgress",
	///////<-------------monitor 5G--------->/////
	"/POST/uui-slicing/nsmf/monitoring/queryTimestamp/:queryTimestamp/trafficData":
		"/fetchTrafficData",
	"/POST/uui-slicing/nsmf/monitoring/queryTimestamp/:queryTimestamp/onlineUsers":
		"/fetchOnlineusersData",
	"/POST/uui-slicing/nsmf/monitoring/queryTimestamp/:queryTimestamp/bandwidth":
		"/fetchBandwidthData",
	///////<-------------general interface--------->/////
	"/api/*": "/$1",
	"/*/*": "/$1_$2",
	"/*/*/*": "/$1_$2_$3",
	"/*/*/*/*": "/$1_$2_$3_$4",
	/////////////////////////
};
