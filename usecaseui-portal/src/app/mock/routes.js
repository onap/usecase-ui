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
        ///////<-------------api proxy--------->/////
        "/usecaseui-server/v1/*": "/$1",
        "/usecaseui-server/v1/*?:param": "/$1",
        ///////////////

        //text interface
        "/user/login/:user/test": "/user/login?user=:user",
        "/pnf/:cloudnode/p-interfaces/p-interface/:interface-name/createTerminationPoint":
            "/status",
        "/alarm/form/data": "/alarm_form_data",
        "/upload/:url_upId": "/status",
        ///////////////

        ///////<-------------home services--------->/////
        "/portal-auxapi/languageSetting/user/:currentloginId": "/language",
        /////////////////////////

        ///////<-------------managemence services--------->/////
        "/uui-lcm/customers/:customer/service-subscriptions": "/serviceType",
        "/uui-lcm/serviceNumByServiceType/:customer":"/CustomersColumn",

        /////////////////////////

        ///////<-------------myhttp services--------->/////

        /////////////////////////

        ///////<-------------networkhttp services--------->/////

        /////////////////////////

        ///////<-------------onboard services--------->/////
        "/nsd/v1/ns_descriptors/:nsdInfoId/nsd_content": "/nsd_content",
        "/vnfpkgm/v1/vnf_packages/:vnfPkgId/package_content": "/nsd_content",
        "/nsd/v1/pnf_descriptors/:pnfdInfoId/pnfd_content": "/nsd_content",
        "/uui-lcm/jobs/:_jobId": "/uui-lcm_jobs_progress",

        /////////////////////////

        ///////<-------------general interface--------->/////
        "/api/*": "/$1",
        "/*/*": "/$1_$2",
        "/*/*/*": "/$1_$2_$3",
        "/*/*/*/*": "/$1_$2_$3_$4",
        /////////////////////////
    }
