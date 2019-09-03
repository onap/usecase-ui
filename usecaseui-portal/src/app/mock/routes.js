/*
    Copyright (C) 2019 CMCC, Inc. and others. All rights reserved.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

// proxy routers setting
module.exports =
    {
        //text interface
        "/user/login/:user/test": "/user/login?user=:user",
        "/pnf/:cloudnode/p-interfaces/p-interface/:interface-name/createTerminationPoint":
            "/status",
        "/alarm/form/data": "/alarm_form_data",
        "/upload/:url_upId": "/status",
        ///////////////

        ///////<-------------home services--------->/////
        "/usecaseui-server/v1/uui-lcm/serviceNumByCustomer": "/uui-lcm_serviceNumByCustomer",
        "/usecaseui-server/v1/alarm/statusCount": "/alarm_statusCount",
        "/usecaseui-server/v1/alarm/diagram?:param": "/alarm_diagram",
        "/usecaseui-server/v1/uui-lcm/ns-packages": "/uui-lcm_ns-packages",
        "/usecaseui-server/v1/uui-lcm/vnf-packages": "/uui-lcm_vnf-packages",
        "/usecaseui-server/v1/uui-lcm/pnf-packages": "/uui-lcm_pnf-packages",
        "/usecaseui-server/v1/alarm/getSourceNames": "/alarm_getSourceNames",
        "/usecaseui-server/v1/listSortMasters": "/listSortMasters",
        "/usecaseui-server/v1/portal-auxapi/languageSetting/user/:currentloginId": "/language",
        /////////////////////////

        ///////<-------------managemence services--------->/////

        /////////////////////////
        ///////<-------------myhttp services--------->/////

        /////////////////////////
        ///////<-------------networkhttp services--------->/////

        /////////////////////////
        ///////<-------------onboard services--------->/////

        /////////////////////////

        ///////<-------------general interface--------->/////
        "/api/*": "/$1",
        "/*/*": "/$1_$2",
        "/*/*/*": "/$1_$2_$3",
        "/*/*/*/*": "/$1_$2_$3_$4",
        /////////////////////////
    }
