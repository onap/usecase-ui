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
Chart = [
        { "type":"bar", "key": "value", "yAxis": "1", "values": [
            { "x":'15min' , "y":4}, { "x":'30min' , "y":4}, { "x":'45min' , "y":12},
            { "x":'60min' , "y":3.27}
        ] } ];
memoryBarChart = [
    { "type":"bar", "key": "memory", "yAxis": "1", "values": [
        { "x":'15min' , "y":4}, { "x":'30min' , "y":4}, { "x":'45min' , "y":12},
        { "x":'60min' , "y":3.27}
    ] } ];
cpuBarChart = [
    { "type":"bar", "key": "cpu", "yAxis": "1", "values": [
        { "x":'15min' , "y":4}, { "x":'30min' , "y":4}, { "x":'45min' , "y":12},
        { "x":'60min' , "y":3.27}
    ] } ];
networkBarChart = [
    { "type":"bar", "key": "network", "yAxis": "1", "values": [
        { "x":'15min' , "y":4}, { "x":'30min' , "y":4}, { "x":'45min' , "y":12},
        { "x":'60min' , "y":3.27}
    ] } ];

var chart1,chart2,chart3,chart4;
nv.addGraph(function() {
    chart1 = nv.models.multiBarChart()
        .transitionDuration(350)
        .showLegend(false)
        .reduceXTicks(false)
        .forceY([0, 64.0])
        .showControls(false)
        .stacked(false)
        .logScale(false)
        .legendPos('top')
        .color(d3.scale.category10().range());
    chart1.xAxis
        .staggerLabels(false)
        .showMaxMin(false)
    chart1.yAxis
        .logScale(false)
        .axisLabel('');
    d3.select('#chart_alarm svg')
        .datum(Chart)
        .transition().duration(1000)
        .call(chart1);
    return chart1;
});
/*nv.addGraph(function() {
    chart2 = nv.models.multiBarChart()
        .showLegend(false)
        .reduceXTicks(false)
        .forceY([0, 64.0])
        .showControls(false)
        .stacked(false)
        .logScale(false)
        .legendPos('top')
        .color(d3.scale.category10().range());
    chart2.xAxis
        .staggerLabels(false)
        .showMaxMin(false)
    chart2.yAxis
        .logScale(false)
        .axisLabel('')
        .tickFormat(d3.format(',.1f'));
    d3.select('#Memorychart svg')
        .datum(memoryBarChart)
        .transition().duration(1000)
        .call(chart2);
    nv.utils.windowResize(chart2.update);
    return chart2;
});
nv.addGraph(function() {
    chart3 = nv.models.multiBarChart()
        .showLegend(false)
        .reduceXTicks(false)
        .forceY([0, 64.0])
        .showControls(false)
        .stacked(false)
        .logScale(false)
        .legendPos('top')
        .color(d3.scale.category10().range());
    chart3.xAxis
        .staggerLabels(false)
        .showMaxMin(false)
    chart3.yAxis
        .logScale(false)
        .axisLabel('')
        .tickFormat(d3.format(',.1f'));
    d3.select('#Diskchart svg')
        .datum(diskBarChart)
        .transition().duration(1000)
        .call(chart3);
    nv.utils.windowResize(chart3.update);
    return chart3;
});
nv.addGraph(function() {
    chart4 = nv.models.multiBarChart()
        .showLegend(false)
        .reduceXTicks(false)
        .forceY([0, 64.0])
        .showControls(false)
        .stacked(false)
        .logScale(false)
        .legendPos('top')
        .color(d3.scale.category10().range());
    chart4.xAxis
        .staggerLabels(false)
        .showMaxMin(false)
    chart4.yAxis
        .logScale(false)
        .axisLabel('')
        .tickFormat(d3.format(',.1f'));
    d3.select('#Networkchart svg')
        .datum(networkBarChart)
        .transition().duration(1000)
        .call(chart4);
    nv.utils.windowResize(chart4.update);
    return chart4;
});*/

function changeValue(s){
    chart1.xAxis.tickValues(s);
    chart2.xAxis.tickValues(s);
    chart3.xAxis.tickValues(s);
    chart4.xAxis.tickValues(s);
}

function changerotate(v){
    chart1.xAxis.rotateLabels(v);
    chart2.xAxis.rotateLabels(v);
    chart3.xAxis.rotateLabels(v);
    chart4.xAxis.rotateLabels(v);
}

function redraw(c,s1) {
    Chart[0].values = s1;
    d3.select('#chart'+c+' svg')
        .datum(Chart)
        .transition().duration(500)
        .call(chart1);
}
