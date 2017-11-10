.. This work is licensed under a Creative Commons Attribution 4.0 International License.


Administration
--------------

It is not hard to manage Holmes becasue it's been dockerized and split into two dockers. One is for rule management and the other for engine management.

Processes / Dockers
^^^^^^^^^^^^^^^^^^^

For both of the dockers of Holmes, there's only one process running during the run time. But the rule management docker sort of relies on the enginemanagement docker. Once the engine management module is stopped, the whole Holmes will malfunction because the Drools engine which is managed by the engine management module is the core component of Holmes.

Holmes mainly consists of two dockers:

* Rule Management Docker

* Engine Management Docker

Actions
^^^^^^^

All actions performed on the Holmes modules are docker-based.

* Create a Container: ``sudo docker run [OPTIONS] IMAGE [COMMAND] [ARG...]``

* Kill a Container: ``sudo docker kill [OPTIONS] CONTAINER [CONTAINER...]``

* Stop a Container: ``sudo docker stop [OPTIONS] CONTAINER [CONTAINER...]``

* Start a Container: ``sudo docker start [OPTIONS] CONTAINER [CONTAINER...]``

* Restart a Container: ``sudo docker restart [OPTIONS] CONTAINER [CONTAINER...]``
