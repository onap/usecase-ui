/*
 Copyright (C) 2017 CMCC, Inc. and others. All rights reserved.

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
// 创建模块，同时添加依赖的服务
var app = angular.module('uui', ['ng', 'ngRoute', 'ui.bootstrap', 'ngTouch', 'ngAnimate', 'nvd3', 'smart-table', 'ui.tree']);
// 配置路由 ngRoute 也可以是第三方路由ui-router
app.config(function ($routeProvider) {
    $routeProvider
        .when('/alarm', {
            templateUrl: 'app/uui/fusion/scripts/view-models/alarm.html'
        })
        .when('/pre', {
            templateUrl: 'app/uui/fusion/scripts/view-models/performance.html'
        })
        .when('/pre-details', {
            templateUrl: 'app/uui/fusion/scripts/view-models/performance-details.html'
        })
        .when('/common', {
            templateUrl: 'app/uui/fusion/scripts/view-models/left-menu.html'
        })
        .otherwise({
            redirectTo: '/common'
        })
});

// 请求数据地址
var global_url = "http://msb-iag:80/api/usecaseui-server/v1/";
