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
historicalBarChart = [
    { "type":"bar", "key": "memory", "yAxis": "1", "values": [{ "x":1388552400000 , "y":10},
        { "x":1391230800000 , "y":4}, { "x":1393650000000 , "y":4}, { "x":1396324800000 , "y":12},
        { "x":1398916800000 , "y":3.27}, { "x":1401595200000 , "y":6.07}, { "x":1404187200000 , "y":8.93},
        { "x":1406865600000 , "y":11.61}, { "x":1409544000000 , "y":18.66}, { "x":1412136000000 , "y":19.04},
        { "x":1414814400000 , "y":17.5}, { "x":1417410000000 , "y":15.73}
         ] } ];
var chart1,chart2,chart3,chart4;
nv.addGraph(function() {
    chart1 = nv.models.multiBarChart()
        .margin({top: 30, right: 60, bottom: 50, left: 100})
        .showLegend(true)
        .reduceXTicks(false)
        .forceY([0, 34.0])
        .showControls(false)
        .stacked(false)
        .logScale(false)
        .legendPos('top')
        .color(d3.scale.category10().range());
    chart1.xAxis
        .tickValues([1388552400000, 1391230800000,1393650000000,1396324800000,1398916800000,1401595200000,
            1404187200000,1406865600000,1409544000000,1412136000000,1414814400000,1417410000000])
        .staggerLabels(false)
        .showMaxMin(false)
        .rotateLabels(90)
        //.axisLabel('Timestamp')
        .tickFormat(function(d) {
            return d3.time.format('%b %y')(new Date(d))
        }
    );
    chart1.yAxis
        .logScale(false)
        .axisLabel('')
        .tickFormat(d3.format(',.1f'));
    d3.select('#CPUchart svg')
        .datum(historicalBarChart)
        .transition().duration(1000)
        .call(chart1);
    nv.utils.windowResize(chart1.update);
    return chart1;
});
nv.addGraph(function() {
    chart2 = nv.models.multiBarChart()
        .margin({top: 30, right: 60, bottom: 50, left: 100})
        .showLegend(true)
        .reduceXTicks(false)
        .forceY([0, 34.0])
        .showControls(false)
        .stacked(false)
        .logScale(false)
        .legendPos('top')
        .color(d3.scale.category20b().range());
    chart2.xAxis
        .tickValues([1388552400000,1391230800000,1393650000000,1396324800000,1398916800000,1401595200000,1404187200000,1406865600000,1409544000000,1412136000000,1414814400000,1417410000000,1420088400000,1422766800000])
        .staggerLabels(false)
        .showMaxMin(false)
        .rotateLabels(90)
        .axisLabel('Timestamp')
        .tickFormat(function(d) {
            return d3.time.format('%b %y')(new Date(d)) });
    chart2.yAxis
        .logScale(false)
        .axisLabel('')
        .tickFormat(d3.format(',.1f'));
    d3.select('#Memorychart svg')
        .datum(historicalBarChart)
        .transition().duration(1000)
        .call(chart2);
    nv.utils.windowResize(chart2.update);
    return chart2;
});
nv.addGraph(function() {
    chart3 = nv.models.multiBarChart()
        .margin({top: 30, right: 60, bottom: 50, left: 100})
        .showLegend(true)
        .reduceXTicks(false)
        .forceY([0, 34.0])
        .showControls(false)
        .stacked(false)
        .logScale(false)
        .legendPos('top')
        .color(d3.scale.category50().range());
    chart3.xAxis
        .tickValues([1388552400000,1391230800000,1393650000000,1396324800000,1398916800000,1401595200000,1404187200000,1406865600000,1409544000000,1412136000000,1414814400000,1417410000000,1420088400000,1422766800000])
        .staggerLabels(false)
        .showMaxMin(false)
        .rotateLabels(90)
        .axisLabel('Timestamp')
        .tickFormat(function(d) {
            return d3.time.format('%b %y')(new Date(d)) });
    chart3.yAxis
        .logScale(false)
        .axisLabel('')
        .tickFormat(d3.format(',.1f'));
    d3.select('#Networkchart svg')
        .datum(historicalBarChart)
        .transition().duration(1000)
        .call(chart3);
    nv.utils.windowResize(chart3.update);
    return chart3;
});
nv.addGraph(function() {
    chart4 = nv.models.multiBarChart()
        .margin({top: 30, right: 60, bottom: 50, left: 100})
        .showLegend(true)
        .reduceXTicks(false)
        .forceY([0, 34.0])
        .showControls(false)
        .stacked(false)
        .logScale(false)
        .legendPos('top')
        .color(d3.scale.category50().range());
    chart4.xAxis
        .tickValues([1388552400000,1391230800000,1393650000000,1396324800000,1398916800000,1401595200000,1404187200000,1406865600000,1409544000000,1412136000000,1414814400000,1417410000000,1420088400000,1422766800000])
        .staggerLabels(false)
        .showMaxMin(false)
        .rotateLabels(90)
        .axisLabel('Timestamp')
        .tickFormat(function(d) {
            return d3.time.format('%b %y')(new Date(d)) });
    chart4.yAxis
        .logScale(false)
        .axisLabel('')
        .tickFormat(d3.format(',.1f'));
    d3.select('#Networkchart svg')
        .datum(historicalBarChart)
        .transition().duration(1000)
        .call(chart4);
    nv.utils.windowResize(chart4.update);
    return chart4;
});

function redraw() {
    d3.select('#CPUchart svg')
        .datum(historicalBarChart)
        .transition().duration(500)
        .call(chart1);
    d3.select('#Memorychart svg')
        .datum(historicalBarChart)
        .transition().duration(500)
        .call(chart2);
    d3.select('#Diskchart svg')
        .datum(historicalBarChart)
        .transition().duration(1000)
        .call(chart3);
    d3.select('#Networkchart svg')
        .datum(historicalBarChart)
        .transition().duration(1000)
        .call(chart4);
}

setInterval(function () {
    redraw();
}, 1500);
//if(historicalBarChart.length <= 0 ) {
//    document.getElementById("CPUchart").innerHTML = "<div id='noData'><b>No Data Available</b></div>";
//    document.getElementById("CPUchart").className="nodatadiv";
//    document.getElementById("Memorychart").innerHTML = "<div id='noData'><b>No Data Available</b></div>";
//    document.getElementById("Memorychart").className="nodatadiv";
//    document.getElementById("nodata").className="nodatainner";
//}