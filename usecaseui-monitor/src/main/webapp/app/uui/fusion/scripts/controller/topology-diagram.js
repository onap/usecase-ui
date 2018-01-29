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
app.controller('topologyCtrl', ['$scope', '$http', '$location', 'drawTree', '$timeout', function ($scope, $http, $location, drawTree, $timeout) {

    // 获取拓补图盒子
    var myChart = echarts.init(document.getElementById("tree-container"));
    // 请求数据，渲染选项标签
    $http({
        method: 'GET',
        url: global_url + '/topology/services'
    }).then(function successCallback(response) {
        $scope.serviceType = response.data;
        $scope.selectedName = response.data[0];
    }, function errorCallback(error) {

    }).then(function () {
        // 默认渲染第一条拓补图
        $http({
            method: 'GET',
            url: global_url + '/topology/' + $scope.selectedName.ServiceName,
        }).then(function successCallback(response) {
            drawTree.treeChart(false, response.data, myChart);

        }, function errorCallback(error) {

        })
    });

    // 点击切换拓补图
    $scope.selectedNameChanged = function (selectedName) {
        $http({
            method: 'GET',
            url: global_url + '/topology/' + selectedName.ServiceName,
        }).then(function successCallback(response) {
            drawTree.treeChart(true, response.data, myChart);
        }, function errorCallback(error) {

        })
    };

}]).factory('drawTree', function () {
    function treeChart(isChange, data, myChart) {

        if (isChange) {
            myChart.clear(); //如果切换就清空下
        }
        data.symbol = "image://./app/uui/fusion/images/E2E.png";
        for (k in data.children) {
            data.children[k].symbol = "image://./app/uui/fusion/images/NS.png";
            if (data.children[k].children) {
                for (i in data.children[k].children) {
                    if (data.children[k].children[i].isAlarm) {
                        data.children[k].children[i].symbol = "image://./app/uui/fusion/images/vnf-alarm.png";
                    } else {
                        data.children[k].children[i].symbol = "image://./app/uui/fusion/images/vnf-1.png";
                    }
                }
            }
        }

        var option = {
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: [{
                type: 'tree',
                top: '20%',
                left: '7%',
                bottom: '20%',
                right: '10%',
                symbolSize: 50,
                orient: 'vertical',
                label: {
                    normal: {
                        position: 'bottom',
                        fontSize: 16,
                        color: '#000'
                    }
                },
                leaves: {
                    label: {
                        normal: {
                            position: 'right',
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                    }
                },
                lineStyle: {
                    width: 3,
                    curveness: 0,
                },
                data: [data],
                expandAndCollapse: true
            }]
        }
        myChart.setOption(option, true);
    }
    return {
        treeChart: treeChart
    }
})