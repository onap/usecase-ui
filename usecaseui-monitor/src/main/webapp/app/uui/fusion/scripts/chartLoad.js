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
diskBarChart = [
        { "type":"bar", "key": "disk", "yAxis": "1", "values": [
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

historicalBarChart1 = [
    { "type":"bar", "key": "memory", "yAxis": "1", "values": [
        { "x":'1h' , "y":4}, { "x":'2h' , "y":4}, { "x":'3h' , "y":12},
        { "x":'4h' , "y":3.27}, { "x":'5h' , "y":34}, { "x":'6h' , "y":34}, { "x":'7h' , "y":34},
        { "x":'8h' , "y":34}, { "x":'9h' , "y":34}, { "x":'10h' , "y":34}, { "x":'11h' , "y":34},
        { "x":'12h' , "y":56}, { "x":'13h' , "y":34}, { "x":'14h' , "y":34}, { "x":'15h' , "y":34},
        { "x":'16h' , "y":12}, { "x":'17h' , "y":34}, { "x":'18h' , "y":50}, { "x":'19h' , "y":34},
        { "x":'20h' , "y":34}, { "x":'21h' , "y":54}, { "x":'22h' , "y":34}, { "x":'23h' , "y":34},
        { "x":'24h' , "y":36}
    ] } ];
historicalBarChart2 = [
    { "type":"bar", "key": "memory", "yAxis": "1", "values": [
        { "x":'1d' , "y":4}, { "x":'2d' , "y":4}, { "x":'3d' , "y":12},
        { "x":'4d' , "y":3.27}, { "x":'5d' , "y":34},{ "x":'6d' , "y":4}, { "x":'7d' , "y":4}, { "x":'8d' , "y":12},
        { "x":'9d' , "y":3.27}, { "x":'10d' , "y":34}, { "x":'11d' , "y":34}, { "x":'12d' , "y":34},  { "x":'13d' , "y":4}, { "x":'14d' , "y":4}, { "x":'15' , "y":12},
        { "x":'16d' , "y":3.27}, { "x":'17d' , "y":34},{ "x":'18d' , "y":4}, { "x":'19d' , "y":4}, { "x":'20d' , "y":12},
        { "x":'21d' , "y":3.27}, { "x":'22d' , "y":34}, { "x":'23d' , "y":34}, { "x":'24d' , "y":34}, { "x":'25d' , "y":4}, { "x":'26d' , "y":12},
        { "x":'27d' , "y":3.27}, { "x":'28d' , "y":34}, { "x":'29d' , "y":34}, { "x":'30d' , "y":34}, { "x":'31d' , "y":34}
    ] } ];
historicalBarChart3 = [
    { "type":"bar", "key": "memory", "yAxis": "1", "values": [
        { "x":'Jan' , "y":4}, { "x":'Feb' , "y":4}, { "x":'Mar' , "y":12},
        { "x":'Apr' , "y":3.27}, { "x":'May' , "y":34},{ "x":'June' , "y":4}, { "x":'July' , "y":4}, { "x":'Aug' , "y":12},
        { "x":'Sept' , "y":3.27}, { "x":'Oct' , "y":34}, { "x":'Nov' , "y":34}
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
        .axisLabel('')
        .tickFormat(d3.format(',.1f'));
    d3.select('#CPUchart svg')
        .datum(cpuBarChart)
        .transition().duration(1000)
        .call(chart1);
    nv.utils.windowResize(chart1.update);
    return chart1;
});
nv.addGraph(function() {
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
});

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
    diskBarChart[0].values = s1[0];
    memoryBarChart[0].values = s1[1];
    cpuBarChart[0].values = s1[2];
    networkBarChart[0].values = s1[3];

    d3.select('#CPUchart'+c+' svg')
        .datum(cpuBarChart)
        .transition().duration(500)
        .call(chart1);
    d3.select('#Memorychart'+c+' svg')
        .datum(memoryBarChart)
        .transition().duration(500)
        .call(chart2);
    d3.select('#Diskchart'+c+' svg')
        .datum(diskBarChart)
        .transition().duration(1000)
        .call(chart3);
    d3.select('#Networkchart'+c+' svg')
        .datum(networkBarChart)
        .transition().duration(1000)
        .call(chart4);
}
