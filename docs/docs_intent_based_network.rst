.. contents::
   :depth: 3
..
.. _docs_intent_based_network:


Intent Based Network
=============================

Overall Blueprint
-----------------
Intent-based network (IBN) is a self-driving network that uses decoupling 
network control logic and closed-loop orchestration techniques to automate 
application intents. An IBN is an intelligent network, which can automatically 
convert, verify, deploy, configure, and optimize itself to achieve target 
network state according to the intent of the operators, and can automatically 
solve abnormal events to ensure the network reliability. 

REQ-453 Smart Operator Intent Translation in UUI based on IBN - R8 5G Slicing Support
In R8, the smart operator intent translation function is proposed to support 
the 5G slicing selection of current E2E usecase in UUI. 
The target architecture of the Intent-Based Network is divided into a Intent 
orchestration layer (hereinafter referred to as the Intent layer), a control 
layer and a network layer.

REQ-861 Smart Intent Guarantee - Intent Instance
The new network applications, like E2E Slicing and CCVPN, provide different SLA services to customers. In this REQ, a scenario of intent guarantee is proposed to support the SLA requirements of users in run-time, as well as updating users’ intents. In R9, Intent instance will be developed to support the E2E Slicing and CCVPN.

REQ-1074 Smart Intent Guarantee based on Closed-loop in R10
In R10, the closed-loop will be developed to support the smart Intent E2E Slicing and CCVPN.

REQ-1075 Network Services without Perception for Users based on IBN
In R10, Network Services without perception for users based on IBN will be developed to support the E2E Slicing and CCVPN.


Abbreviations
-------------

+---------------+--------------------------------------------+
|  Abbreviation |                   Meaning                  |
+===============+============================================+
| IBN           | Intent Based Network                       |
+---------------+--------------------------------------------+



Scope of Honolulu release
-----------------------
The scope for Honolulu developed in UUI includes GUI, UUI-server, and NLP.

GUI
- Services
- 5G Slicing Management
- Package Management
- NLP Model resource

Server
- Intent Management Module

NLP Server
(new Micro-service)
Three NLP algorithms are considered to be applied in current solutions: 
- BERT (Bidirectional Encoder Representations from Transformers)：developed by researchers at Google AI Language. It has caused a stir in the Machine Learning community by presenting state-of-the-art results in a wide variety of NLP tasks. BERT’s key technical innovation is applying the bidirectional training of Transformer, a popular attention model, to language modelling.

Scope of Istanbul release
-----------------------
The scope for Istanbul developed in AAI focuses on Intent Instance Management 

The storage and management of AAI-based Intent Instance are realized in the R9 version.
Intent Instance is created to save the users' real-time intent (network parameters) and connected service ID (CCNVPN service ID / E2E Slicing customer service intent ID) in AAI.
 
The user's intent is stored from the UUI or SO to the intent instance in the AAI, and then DCAE calls the intent instance in the AAI through the interface.

Impacted Modules for Honolulu
---------------------------

U-UI
~~~~
Target of R8: translate from the human inputs to the slice parameters based on NLP 
in UUI, and then run the slices based on the current ONAP.

A new page is required in the UUI that users can enter network requirements through 
the natural language, which then sends the user input to the IBN component and displays 
the response information to the user.  This process can be repeated several times 
until the dialog completes and a new Intent is formed in the IBN component.

Target of R9: support multiple usecase services, so it is not a sub-node of any usecase in AAI. 

The IBN will be expect to provide unawares service to users. Multiple usecases services could be changed by IBN instead of the users, so it should be an independent node in AAI.


Functional Test Cases
---------------------



Operation Guidance
------------------
