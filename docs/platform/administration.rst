.. This work is licensed under a Creative Commons Attribution 4.0 International License.


Administration
--------------

It is not hard to manage Usecase-UI becasue it's been dockerized and split into two dockers. One is for UI and the other for Server.

Processes / Dockers
^^^^^^^^^^^^^^^^^^^

Usecase-UI mainly consists of two dockers:

* Usecase-UI UI Docker

* Usecase-UI Server Docker

Actions
^^^^^^^

All actions performed on the Usecase-UI modules are docker-based.

* Create a Container: ``sudo docker run [OPTIONS] IMAGE [COMMAND] [ARG...]``

* Kill a Container: ``sudo docker kill [OPTIONS] CONTAINER [CONTAINER...]``

* Stop a Container: ``sudo docker stop [OPTIONS] CONTAINER [CONTAINER...]``

* Start a Container: ``sudo docker start [OPTIONS] CONTAINER [CONTAINER...]``

* Restart a Container: ``sudo docker restart [OPTIONS] CONTAINER [CONTAINER...]``
