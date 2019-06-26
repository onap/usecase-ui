.. contents::
   :depth: 3
..


**1. Scope**
============

This is a guide to help developer or tester to try to install Usecase-UI over OOM.

**2. Component & function**
===========================

Usecase-UI Repositories

+--------------------------+-----------------------------------------------------+
|     **Repo Name**        |     Description                                     |
+==========================+=====================================================+
| usecase-ui               |      Frontend of Usecase-UI                         |
+--------------------------+-----------------------------------------------------+
| usecase-ui/server        |      Backend of Usecase-UI                          |
+--------------------------+-----------------------------------------------------+


Usecase-UI Docker Images
::

  nexus3.onap.org:10001/onap/usecase-ui:2.0.1
  nexus3.onap.org:10001/onap/usecase-ui-server:2.0.1
  

**3. Usecase-UI Deployment**
============================

For initialization of docker there are 2 deployment options currently adpoted in ONAP : using heat template and using OOM.
From Casablanca release, OOM is the recommended way, so here mainly give the steps for OOM based deployment.
For OOM deployment you can refer to the below links:

https://onap.readthedocs.io/en/latest/submodules/oom.git/docs/oom_setup_kubernetes_rancher.html
https://onap.readthedocs.io/en/latest/submodules/oom.git/docs/oom_quickstart_guide.html#quick-start-label

1. First ensure Usecase-UI is marked true against field enabled in the oom/kubernetes/onap/values.yaml for successful deployment.

2. Upgrade Images in OOM charts to ensure the component version is right, you should check the respective component image version in Usecase-UI charts.
If you need update the version, please modify values.yaml files.

3. Rebuild all repos in helm. Every time you change the charts, you need to rebuild all repos to ensure the change can take effect.

**4. Debug and Testing in running Pod**
=======================================

When you are doing the testing and would like to replace some new file like binary or some script and want to check the new resut.
Before you replace the file to the running pod,you need to close the pod livenessProbe and readinessProbe first to avoid the pod restart.

**5. Kubectl basic command**
============================

Basic operation of kubernests cluster(Take the namespace of onap in linux client as an example)

* Check the cluster node

::
            
    kubectl  get node

* Check cluster namespace

::             
    kubectl  get ns

* View the pod information and the pod on which the node is located, under the namespace specified (for example, namespace on onap)

::
                     
    kubectl get pod -o wide
    kubectl get pod -n onap
                
