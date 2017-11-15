.. This work is licensed under a Creative Commons Attribution 4.0 International License.


Delivery
--------

Describe how functions are packaged into run-time components. For some components a block diagram may be useful.
As mentioned in the architecture chapter, Usecase-UI mainly comprises two modules: the UI module and the Server module.

* UI Docker: The main GUI for LCM and Monitor functions are performed in this module. The module provides Lifecycle CRUD operation interfaces and system alarm/performance monitor.

* Server Docker: This module provides APIs for usecase-ui inside. Lifecycle Management and alarm/performance data Management are implemented by this module.
