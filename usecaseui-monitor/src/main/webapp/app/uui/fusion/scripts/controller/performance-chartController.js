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

app.controller('pertabCtrl', ['$scope', '$http', '$routeParams', '$window' ,
    function ($scope, $http,$routeParams,$window) {
        $scope.chartShow = false;
	    $scope.ndaShow = false;
	    $scope.hdaShow = false;
        $scope.valuess = [];
        $scope.namesPIsShow = false;
        $scope.goIsShow = true;
        $scope.hourshow = false;
        $scope.dayshow = true;
        $scope.timestep = '5';
        $scope.today = function() {
            $scope.startTime = new Date();
            $scope.endTime = new Date();
            $http({
                method : "GET",
                url : global_url+"/performance/resourceIds",
                headers: {
                    'Access-Control-Allow-Origin': "*",
                    "Content-Type": "application/json"
                }
            }).then(function successCallback(resp) {
                $scope.sourceIds = resp.data;
            },function errorCallback(reps) {
                
            });
        };
        $scope.today();


        $scope.startTimeChanged = function () {
            if ($scope.startTime > $scope.endTime)
                $scope.endTime = "";
        };
        $scope.endTimeChanged = function () {
            if ($scope.endTime < $scope.startTime)
                $scope.startTime = "";
        };

        $scope.sourceIdChanged = function () {
            if ($scope.sourceId != null){
                $scope.namesPIsShow = true;
                $http({
                    method : "POST",
                    url : global_url + "/performance/names",
                    data : { "sourceId":$scope.sourceId },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj) {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        }
                        return str.join("&");
                    }

                }).then(function successCallback(resp) {
                    $scope.namePs = resp.data;
                    $scope.nameP = null;
                },function errorCallback(resq) {

                });
            }
            else{
                $scope.goIsShow = true;
                $scope.namesPIsShow = false;
            }

        };

        $scope.namePChanged = function () {
            if ($scope.nameP != null){
                $scope.goIsShow = false;
                // $http({
                //     method : "POST",
                //     url : global_url + "/performance/names",
                //     data : { "sourceId":$scope.nameP },
                //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                //     transformRequest: function(obj) {
                //         var str = [];
                //         for (var p in obj) {
                //             str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                //         }
                //         return str.join("&");
                //     }
                // }).then(function successCallback(resp) {
                //     $scope.goIsShow = false;
                // },function errorCallback(resq) {

                // });
            }
            else{
                $scope.goIsShow = true;
                $scope.namesCIsShow = false;
            }
        };

     
        $scope.genDiagram = function () {
             $scope.chartShow = true;
            $http({
                method : 'POST',
                url : global_url + "/performance/diagram",
                data : {
                    "sourceId":$scope.sourceId,
                    "startTime":FormatDate($scope.startTime),
                    "endTime":FormatDate($scope.endTime),
                    "nameParent":$scope.nameP,
                    "format":$scope.showModeId==undefined?"auto":$scope.showModeId
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                    return str.join("&");
                }
            }).then(function successCallback(resp) {
                console.info(resp);
                if (resp.data.dateList){
                    $scope.ndaShow = false;
                    $scope.hdaShow = true;

                    drawPerformanceBar(resp.data,performanceChart);
                }
                else{
                    $scope.ndaShow = true;
                    $scope.hdaShow = false;
 
                }

            },function errorCallback(resp) {

            });
        };
        $scope.showModeIdChanged = function(){

            if($scope.showModeId == 'minute'){
                $scope.hourshow = true;
                $scope.timestep = '5';
            }else if($scope.showModeId == 'hour'){
                var str = String($scope.startTime);
                var str2 = String($scope.endTime);
                $scope.startTime = new Date(str.replace(/\:[0-9]{2}\:/,':00:'));
                $scope.endTime = new Date(str2.replace(/\:[0-9]{2}\:/,':00:'));
                $scope.hourshow = true;
                $scope.timestep = '0';
            }else if($scope.showModeId == 'day'){
                $scope.hourshow = false;
            }
            
        }
        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        $scope.modeShow = false;

        $scope.showModeIds = ["minute","hour","day"];
        $scope.showModeId = 'day';
        function FormatDate (strTime) {
            var date = new Date(strTime);
            return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes();
        }

        // 获取柱状图盒子
        var performanceChart = echarts.init(document.getElementById("performanceChart"));
   
        function drawPerformanceBar(data,myChart){
            var names = Object.keys(data);
            var myseries = [];
            names.forEach(function (item) {
                if(item != 'dateList'){
                    myseries.push({
                        name: item,
                        type: 'bar',
                        // symbol: 'circle',
                        // symbolSize: 10,
                        data: data[item]
                    })
                }
            })
            var options = {
                  tooltip: {
                    trigger: 'axis',
                    formatter: (params) => {
                      var res = '<p>' + params[0].name + '</p>' + '<div>';
                    //   console.log(params);
                      for (var i = 0; i < params.length; i++) {
                        res += '<span></span>' + params[i].seriesName + ' : ' + params[i].value + '</br>';
                      }
                      res += '</div>';
                      return res;
                    }
                  },
                  legend: {
                    data: names,
                    top: 10,
                    icon: 'rect',
                    itemWidth: 10,
                    itemHeight: 10
                  },
                  grid: {
                    left: '3%',
                    right: '5%',
                    bottom: '5%',
                    top: '15%',
                    containLabel: true
                  },
                  xAxis: {
                    type: 'category',
                    name: 'Time',
                    boundaryGap: true,
                    data: data.dateList,
                    axisLabel:{
                        formatter:(value)=>{
                            if($scope.showModeId == 'day'){
                                return value.slice(5,10)
                            }else if($scope.showModeId == 'hour'){
                                return value.slice(5,16)
                            }else if($scope.showModeId == 'minute'){
                                return value.slice(5,16)
                            }
                        }
                    },
                    axisLine: {
                      symbol: ['none', 'arrow'],
                      symbolOffset: [0, 12]
                    },
                    axisTick: {
                      show: false,
                    },
                    splitLine: {
                      show: true
                    }
                  },
                  yAxis: {
                    type: 'value',
                    name: 'Num',
                    // max: 3,
                    axisLine: {
                      symbol: ['none', 'arrow'],
                      symbolOffset: [0, 12]
                    },
                    axisTick: {
                      show: false
                    }
                  },
                  color: ['green', 'orange', 'red', 'pink','gray','purple'],
                  series: myseries
            }
            myChart.setOption(options, true);
        }
        // var data = {
        //     dateList:["2018-05-23 34:35:00",2,3,4,5,6,7,8,9,10],
        //     valueList:[5,3,1,7,3,5,8,3,5,2]
        // }
        // drawPerformanceBar(data,performanceChart)
    }]);
