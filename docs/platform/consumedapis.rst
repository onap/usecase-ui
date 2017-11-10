.. This work is licensed under a Creative Commons Attribution 4.0 International License.
.. http://creativecommons.org/licenses/by/4.0

Consumed APIs
-------------

In the Amsterdam release, Holmes mainly depends on the APIs provided by DCAE, A&AI, DMaaP and MSB.

DCAE
^^^^

Holmes uses DCAE APIs to fetch the information of the microservices that are registered to the DCAE Consul via the Config Binding Service provided by DCAE. The definition of the APIs could be found at `Config Binding Service APIs <https://wiki.onap.org/download/attachments/13599708/cb.html?version=1&modificationDate=1503378245000&api=v2>`_.

A&AI
^^^^

In order to get the correlation between different alarms with the help of the topological information provided by A&AI. Holmes needs to call the A&AI APIs. Generally, we have to query the information of VNFs, VMs and the corresponding relation between resources from different layers. The following APIs are invoked by Holmes.

#. Query a VNF by name:

   ``/aai/v11/network/generic-vnfs/generic-vnf?vnf-name={vnf-name}``

#. Query a VNF by ID:

   ``/aai/v11/network/generic-vnfs/generic-vnf?vnf-id={vnf-id}``

#. Query a VM by name:

   ``/aai/v11/search/nodes-query?search-node-type=vserver&filter=vserver-name:EQUALS:{vserver-name}``

#. Query a VM by ID:

   ``/aai/v11/search/nodes-query?search-node-type=vserver&filter=vserver-id:EQUALS:{vserver-id}`` 

More details could be found at `A&AI APIs <https://wiki.onap.org/pages/viewpage.action?pageId=13598793>`_.
 
DMaaP
^^^^^

Holmes fetches VES data from DMaaP and publishes the control loop event back to DMaaP. The related APIs are:

#. Subscribing:

   ``/events/{topic}/{consumergroup}/{consumerid}``

#. Publishing:

   ``/events/{topic}``

More details could be found at `DMaaP APIs <https://wiki.onap.org/display/DW/DMaaP+API>`_.

MSB
^^^

MSB is a key component that Holmes depends on. Almost all communications between Holmes and other components are performed using MSB as a proxy. In order to utilize the service registration and discovery functions provided by MSB, Holmes has to register itself to MSB in advance.

Service Registration: ``/api/microservices/v1/services``

More details could be found at `MSB APIs <https://wiki.onap.org/display/DW/Microservice+Bus+API+Documentation>`_.
