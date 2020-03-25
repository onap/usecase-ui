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

SO APIs
-------
#. Instantiate service instance:
   ``POST /ecomp/mso/infra/e2eServiceInstances/v3``

#. Query operation progress for service instantiation/termination:
   ``GET /ecomp/mso/infra/e2eServiceInstances/v3/{serviceId}/operations/{operationId}``

#. Terminate service instance:
   ``DELETE /ecomp/mso/infra/e2eServiceInstances/v3/{serviceId}``

MSB APIs
--------
#. Service Registration:
   ``/api/microservices/v1/services``