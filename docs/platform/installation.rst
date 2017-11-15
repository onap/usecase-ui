.. This work is licensed under a Creative Commons Attribution 4.0 International License.


Installation
------------

In case the users want to deploy Usecase-UI, the steps for the installation is as follows.

Prerequisites
^^^^^^^^^^^^^

#. MSB must be installed and started. The user knows the IP address of the MSB API gateway service.
   
Steps
^^^^^

#. Start UI module of Usecase-UI using the command below:

   ``sudo docker run -i -t -d --name uui_ui -p 8080:8080 -e MSB_ADDR=$OPENO_IP:80 nexus3.onap.org:10001/onap/usecase-ui`` 

#. Start Server module of Usecase-UI using the command below:

   ``sudo docker run -i -t -d --name uui_server -p 8082:8082 -e MSB_ADDR=$OPENO_IP:80 -e MR_ADDR=$MR_IP:3904 nexus3.onap.org:10001/onap/usecase-ui/usecase-ui-server``
