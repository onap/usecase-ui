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
        "/portal-auxapi/languageSetting/user/:currentloginId": "/language",
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
