.. This work is licensed under a Creative Commons Attribution 4.0 International License.
.. http://creativecommons.org/licenses/by/4.0
.. _release_notes:


Usecase UI Release Notes
========================

Usecase UI is composed of two parts that are usecase-ui and usecase-ui-server. 
It provides self-service management GUI and monitor GUI for operators and end-users. 
This project targets identifying all GUI requirements which operators and end-users need ONAP to support, 
coordinating GUI parts of each ONAP subsystem, filling the gaps for improving GUI functionalities for use cases.

Version: 4.0.0
--------------

:Release Date: 2021-03-25

**New Features**
 - IBN service : In H release, a new IBN NLP micro-service is added and the ability of creating CSMF service is expanded, creating by NLP input.
 - E2E endpoint enhancement: In H release, usecase-ui supports the presentation of the relationship between AN, TN and CN.
 - Slicing Coverage Area: In H release, usecase-ui supports the specific coverage area number param while creating slicing service. Users can input the grid number in base of CPS service division.
 
**Released Components**
 - usecase-ui  4.0.0
 - usecase-ui-server  4.0.0
 - usecase-ui-nlp  1.0.0

**Bug Fixes**
	NA

**Known Issues**
	NA

**Security Notes**

Usecase-UI code has been formally scanned during build time using NexusIQ and all critical vulnerabilities have been addressed, 
items that remain open have been assessed for risk and determined to be false positive. 
The Usecase-UI open critical security vulnerabilities and their risk assessment have been documented as part of the project.

**Quick Links**
 - `Usecase-UI project page <https://wiki.onap.org/display/DW/Usecase+UI+Project>`_
 - `Passing Badge information for Usecase-UI <https://bestpractices.coreinfrastructure.org/en/projects/1759>`_
 - `Project Vulnerability Review Table for Usecase-UI <https://wiki.onap.org/pages/viewpage.action?pageId=51282547>`__

**Upgrade Notes**
	NA

**Deprecation Notes**
	NA

**Other**
	NA


Version: 3.0.6
--------------

:Release Date: 2020-11-19

**New Features**
 - KPI monitoring GUI : In G release, usecase-ui-server change the monitoring data origin of 5G slicing to DCAE for better and quicker performance.
 - 5G network GUI : In G release, usecase-ui supports the connection of AN, TN and CN.
 - Java: In G release, usecase-ui-server and usecase-ui update all the pods to Java 11 for the requirement of community.
 
**Released Components**
 - usecase-ui  3.0.6
 - usecase-ui-server  3.0.6

**Bug Fixes**
	NA

**Known Issues**
	NA

**Security Notes**

Usecase-UI code has been formally scanned during build time using NexusIQ and all critical vulnerabilities have been addressed, 
items that remain open have been assessed for risk and determined to be false positive. 
The Usecase-UI open critical security vulnerabilities and their risk assessment have been documented as part of the project.

**Quick Links**
 - `Usecase-UI project page <https://wiki.onap.org/display/DW/Usecase+UI+Project>`_
 - `Passing Badge information for Usecase-UI <https://bestpractices.coreinfrastructure.org/en/projects/1759>`_
 - `Project Vulnerability Review Table for Usecase-UI <https://wiki.onap.org/pages/viewpage.action?pageId=51282547>`__

**Upgrade Notes**
	NA

**Deprecation Notes**
	NA

**Other**
	NA


Version: 3.0.4
--------------

:Release Date: 2020-05-28

**New Features**
 - 5G network GUI : In F release, we support the whole flow of creating 5G network slicing service. We provide CSMF portal for the network slicing customers and NSMF portal for the network slicing operators. What's more, we enhance the *Monitor* Module for monitoring 5G network slicing.
 - CCVPN GUI : In F release, UUI supports CCVPN-E-LINE over OTN Inter Domain Links, as well as the Multi-domain multi-layer Optical Service Orchestration.
 - Https: In F release, we update the frontend and backend service to https
 
**Released Components**
 - usecase-ui  3.0.4
 - usecase-ui-server  3.0.4

**Bug Fixes**
	NA

**Known Issues**
	NA

**Security Notes**

Usecase-UI code has been formally scanned during build time using NexusIQ and all critical vulnerabilities have been addressed, 
items that remain open have been assessed for risk and determined to be false positive. 
The Usecase-UI open critical security vulnerabilities and their risk assessment have been documented as part of the project.

**Quick Links**
 - `Usecase-UI project page <https://wiki.onap.org/display/DW/Usecase+UI+Project>`_
 - `Passing Badge information for Usecase-UI <https://bestpractices.coreinfrastructure.org/en/projects/1759>`_
 - `Project Vulnerability Review Table for Usecase-UI <https://wiki.onap.org/pages/viewpage.action?pageId=51282547>`__

**Upgrade Notes**
	NA

**Deprecation Notes**
	NA

**Other**
	NA


Version: 2.0.2
--------------

:Release Date: 2019-10-10

**New Features**
 - Adaptive Pages : change the Home, Customer, Lifecycle Management and Package Management modules to adaptive pages that can be normally displayed in all screen sizes
 - Mock Data Scheme : build mock data scheme to support the development and preview in local environment in case of lack of server environment
 - Document Enhancement : enrich README.md to introduce the general situation and add CHANGELOG.md to record the commit messages
 - Structure Optimization : restructure the project to increase the development efficiency and improve the performance
 - Function Optimization : delete useless modules and simplify some apis to improve loading speed of the project
 

**Released Components**
 - usecase-ui  2.0.2
 - usecase-ui-server  2.0.2

**Bug Fixes**
 - Invalid Image Path : change the invalid image path in CSS and HTML files
 - Error in Document : fix all errors in project document

**Known Issues**
	NA

**Security Notes**

Usecase-UI code has been formally scanned during build time using NexusIQ and all critical vulnerabilities have been addressed, 
items that remain open have been assessed for risk and determined to be false positive. 
The Usecase-UI open critical security vulnerabilities and their risk assessment have been documented as part of the project.

**Quick Links**
 - `Usecase-UI project page <https://wiki.onap.org/display/DW/Usecase+UI+Project>`_
 - `Passing Badge information for Usecase-UI <https://bestpractices.coreinfrastructure.org/en/projects/1759>`_
 - `Project Vulnerability Review Table for Usecase-UI <https://wiki.onap.org/pages/viewpage.action?pageId=51282547>`__

**Upgrade Notes**
	NA

**Deprecation Notes**
	NA

**Other**
	NA


Version: 2.0.1
--------------

:Release Date: 2019-06-06

**New Features**
 - Management GUI for Customer and Service Type: customers query/create/delete and service type query/create/delete
 - Lifecycle Management GUI for CCVPN Use Case : CCVPN instances query/create/delte
 - Using Modeling Parser : use modeling parser to implement CCVPN instance lifecycle management
 - Upgrade Multicloud API : support consistent identification of cloud region functional requirement
 - Maturity Enhancement : change Mysql DB to PostgreSQL

**Released Components**
 - usecase-ui  2.0.1
 - usecase-ui-server  2.0.1

**Bug Fixes**
	NA

**Known Issues**
	NA

**Security Notes**

Usecase-UI code has been formally scanned during build time using NexusIQ and all critical vulnerabilities have been addressed, 
items that remain open have been assessed for risk and determined to be false positive. 
The Usecase-UI open critical security vulnerabilities and their risk assessment have been documented as part of the project.

**Quick Links**
 - `Usecase-UI project page <https://wiki.onap.org/display/DW/Usecase+UI+Project>`_
 - `Passing Badge information for Usecase-UI <https://bestpractices.coreinfrastructure.org/en/projects/1759>`_
 - `Project Vulnerability Review Table for Usecase-UI <https://wiki.onap.org/pages/viewpage.action?pageId=51282547>`__

**Upgrade Notes**
	NA

**Deprecation Notes**
	NA

**Other**
	NA


Version: 1.2.0
--------------

:Release Date: 2018-11-30

**New Features**
 - Lifecycle Management GUI for vCPE use case
 - Network Management GUI for OTN Domain

**Released Components**
 - usecase-ui  1.2.2
 - usecase-ui-server  1.2.1

**Bug Fixes**
	NA

**Known Issues**
	NA

**Security Notes**

Usecase-UI code has been formally scanned during build time using NexusIQ and all critical vulnerabilities have been addressed, 
items that remain open have been assessed for risk and determined to be false positive. 
The Usecase-UI open critical security vulnerabilities and their risk assessment have been documented as part of the project.

**Quick Links**
 - `Usecase-UI project page <https://wiki.onap.org/display/DW/Usecase+UI+Project>`_
 - `Passing Badge information for Usecase-UI <https://bestpractices.coreinfrastructure.org/en/projects/1759>`_
 - `Project Vulnerability Review Table for Usecase-UI <https://wiki.onap.org/pages/viewpage.action?pageId=45285810>`__

**Upgrade Notes**
	NA

**Deprecation Notes**
	NA

**Other**
	NA


Version: 1.1.0
--------------

:Release Date: 2018-06-07

**New Features**
 - Lifecycle Management GUI for VoLTE use case : support NS/VNF manual scaling in/out
 - Package management GUI : support NS/VNF/PNF packages upload/onboarding

**Released Components**
 - usecase-ui  1.1.1
 - usecase-ui-server  1.1.1

**Bug Fixes**
	NA

**Known Issues**
	NA

**Security Notes**

Usecase-UI code has been formally scanned during build time using NexusIQ and all critical vulnerabilities have been addressed, 
items that remain open have been assessed for risk and determined to be false positive. 
The Usecase-UI open critical security vulnerabilities and their risk assessment have been documented as part of the project.

**Quick Links**
 - `Usecase-UI project page <https://wiki.onap.org/display/DW/Usecase+UI+Project>`_
 - `Passing Badge information for Usecase-UI <https://bestpractices.coreinfrastructure.org/en/projects/1759>`_
 - `Project Vulnerability Review Table for Usecase-UI <https://wiki.onap.org/pages/viewpage.action?pageId=41419068>`__

**Upgrade Notes**
	NA

**Deprecation Notes**
	NA

**Other**
	NA


Version: 1.0.0
--------------

:Release Date: 2017-11-16

**New Features**
 - Lifecycle Management : The feature provides GUI for the users to create, query, update and delete service instances.
 - Monitor : The feature is provides GUI for the users to monitor system alarms and VNFs performance.

**Released Components**
 - usecase-ui
 - usecase-ui-server

**Bug Fixes**
	NA

**Known Issues**
	NA

**Security Notes**
	NA

**Upgrade Notes**
	This is the inital release.

**Deprecation Notes**
	NA

**Other**
	NA

===========

End of Release Notes
