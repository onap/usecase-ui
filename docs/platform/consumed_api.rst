.. This work is licensed under a Creative Commons Attribution 4.0 International License.
.. http://creativecommons.org/licenses/by/4.0


Usecase-UI Consumed APIs
========================

References to APIs offered by other components

VFC APIs
--------
#. Distribute Network Service package:
   ``POST  /api/catalog/v1/nspackages``

#. Distribute VF resource:
   ``POST /api/catalog/v1/vnfpackages``

#. Query operation progress for distributing network service/vf resource:
   ``GET  /api/nslcm/v1/jobs/{jobId}``

#. Delete Network Service package:
   ``DELETE  /api/catalog/v1/nspackages/{csarId}``

#. Delete VF resource:
   ``DELETE /api/catalog/v1/vnfpackages/{csarId}``

SDC APIs
--------
#. Query all distributed End to End Service:
   ``GET /sdc/v1/catalog/services``

#. Query specified service:
   ``GET  /sdc/v1/catalog/services/{uuid}/metadata``

#. Query VF resource:
   ``GET /sdc/v1/catalog/resources``

#. Download csar file:
   ``GET /sdc/v1/catalog/services/{uuid}/toscaModel``

A&AI APIs
---------
#. Query all customers:
   ``/aai/v11/business/customers``

#. Query all service types for the specified customer:
   ``/aai/v11/business/customers/customer/{global-customer-id}/service-subscriptions``

#. Query all service instances:
   ``/aai/v11/business/customers/customer/{global-customer-id}/service-subscriptions/service-subscription/{service-type}/service-instances``

#. Query all cloud regions:
   ``/aai/v11/cloud-infrastructure/cloud-regions``

#. Query all sdnc controllers:
   ``/aai/v11/external-system/esr-thirdparty-sdnc-list``

#. Query 5G slicing service instances:
   ``GET /api/aai-business/v13/customers/customer/{global-customer-id}/service-subscriptions/service-subscription/{service-type}/service-instances?service-role=e2eslice-service``

#. Query 5G slicing NSI instances:
   ``GET /api/aai-business/v13/customers/customer/{global-customer-id}/service-subscriptions/service-subscription/{service-type}/service-instances?service-role=nsi``

#. Query 5G slicing NSSI instances:
   ``GET /api/aai-business/v13/customers/customer/{global-customer-id}/service-subscriptions/service-subscription/{service-type}/service-instances?service-role=nssi``

#. Query 5G slicing service profiles:
   ``GET /api/aai-business/v19/customers/customer/{global-customer-id}/service-subscriptions/service-subscription/{service-type}/service-instances/service-instance/{service-instance-id}/service-profiles``

#. Query allotted resources of 5G slicing service:
   ``GET /api/aai-business/v13/customers/customer/{global-customer-id}/service-subscriptions/service-subscription/{service-type}/service-instances/service-instance/{service-instance-id}/allotted-resources``

#. Query information associated with 5G slicing service/NSI/NSSI/:
   ``GET /api/aai-business/v13/customers/customer/{global-customer-id}/service-subscriptions/service-subscription/{service-type}/service-instances/service-instance/{service-instance-id}``

#. Query NST associated with 5G slicing service:
   ``GET /api/aai-sdc/v13/models/model/{model-invariant-id}/model-vers/model-ver/{model-version-id}``

#. Query 5G slicing order:
   ``GET /api/aai-business/v13/customers/customer/{global-customer-id}/service-subscriptions/service-subscription/{service-type}/service-instances?service-role=communication-service``

SO APIs
-------
#. Instantiate service instance:
   ``POST /ecomp/mso/infra/e2eServiceInstances/v3``

#. Query operation progress for service instantiation/termination:
   ``GET /ecomp/mso/infra/e2eServiceInstances/v3/{serviceId}/operations/{operationId}``

#. Terminate service instance:
   ``DELETE /ecomp/mso/infra/e2eServiceInstances/v3/{serviceId}``

#. Query operation progress:
   ``GET /api/so-serviceInstances/v3/{serviceId}/operations/{operationId}``

#. Activate 5G slicing service:
   ``POST /api/so-serviceInstances/v3/{serviceInstanceId}/activate``

#. Deactivate 5G slicing service:
   ``POST /api/so-serviceInstances/v3/{serviceInstanceId}/deactivate``

#. Terminate 5G slicing service:
   ``DELETE /api/so-serviceInstances/v3/{serviceInstanceId}``

#. Query 5G slicing task:
   ``GET /api/so-orchestrationTasks/v4``

#. Update 5G slicing task:
   ``PUT /api/so-orchestrationTasks/v4/{taskId}``

#. Commit 5G slicing task:
   ``POST /api/so-orchestrationTasks/v4/{taskId}/commit``

#. Submit 5G slicing order:
   ``POST /api/so-serviceInstances/v3``

MSB APIs
--------
#. Service Registration:
   ``/api/microservices/v1/services``
