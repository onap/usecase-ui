.. This work is licensed under a Creative Commons Attribution 4.0 International License.
.. http://creativecommons.org/licenses/by/4.0

Logging & Diagnostic Information
---------------------------------

In the Beijing release, the logs are kept inside the docekr containers, which means that you can get the log information only when the docker is still running. 

Where to Access Information
^^^^^^^^^^^^^^^^^^^^^^^^^^^
The way to get the log is to run the command ``docker logs ${docker-name}`` in the command window:

``sudo docker logs ${docker-name}``

Then the logs will be displayed in the command window.
