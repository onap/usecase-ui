.. This work is licensed under a Creative Commons Attribution 4.0 International License.
.. http://creativecommons.org/licenses/by/4.0

Logging & Diagnostic Information
---------------------------------

In the Amsterdam release, the logs are kept inside the docekr containers, which means that you can get the log information only when the docker is still running. 

Where to Access Information
^^^^^^^^^^^^^^^^^^^^^^^^^^^
Assume that the name of a running docker is *holmes-rule-mgmt*, the way to get the log is to run the command ``docker logs ${docker-name}`` in the command window:

``sudo docker logs holmes-rule-mgmt``

Then the logs will be displayed in the command window.

Error / Warning Messages
^^^^^^^^^^^^^^^^^^^^^^^^

* Failed to initialize the SSL builder.: Could not create the SSL information for HTTPS calls.
* Failed to fetch the DCAE configurations.: Could not get the configurations coded in the component specification files.
* Failed to add rules.: Failed to deploy the rules distributed by CLAMP into Holmes.
* Failed to publish the control loop message to DMaaP.: Errors occur while publishing messages to DMaaP.
* Failed to read the API description file.: Could not find the swagger.json file.
* An error occurrred while reading swagger.json.: An I/O Exception occurs while reading the swagger.json file.


