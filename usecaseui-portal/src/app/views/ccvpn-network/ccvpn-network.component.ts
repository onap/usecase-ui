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
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as d3 from 'd3';
import * as $ from 'jquery';
import { networkHttpservice } from '../../core/services/networkHttpservice.service';

@Component({
    selector: 'app-ccvpn-network',
    templateUrl: './ccvpn-network.component.html',
    styleUrls: ['./ccvpn-network.component.css']
})
export class CcvpnNetworkComponent implements OnInit {

    constructor(private myhttp: networkHttpservice) {
    }

    ngOnInit() {
        let thisNg = this;
        thisNg.getD3Data();


        //Local cloud TP port connection, click on the right to expand the details
        $('#tpContainer').on('click', '.line-port', function () {
            thisNg.isVisible = false;
            thisNg.delBoxisVisible = true;
            thisNg.delcloud = false;

            thisNg.delTp1 = $(this).attr('data-tp1');
            thisNg.delTp2 = $(this).attr('data-tp2');
            thisNg.delNode1 = $(this).attr('data-node1');
            thisNg.delNode2 = $(this).attr('data-node2');
            thisNg.delVersion = $(this).attr('data-version');
            thisNg.delLinkname = $(this).attr('data-link');
            thisNg.delcloudUrl = null;
            thisNg.delLinkIndex = $(this);

            let dataD3 = thisNg.d3Data;
            for (let p = 0; p < dataD3.length; p++) {//Determine which Domain network the two tp ports belong to
                if (dataD3[p]['name'] == thisNg.delTp1) {
                    thisNg.network.push(dataD3[p]['source']['name']);
                }
                if (dataD3[p]['name'] == thisNg.delTp2) {
                    thisNg.network.push(dataD3[p]['source']['name']);
                }
            }
            thisNg.delNetwork1 = thisNg.network[0];
            thisNg.delNetwork2 = thisNg.network[1];
        });

        //External cloud connection, click on the right to expand the details
        $('#tpContainer').on('click', '.cloudline', function () {
            thisNg.isVisible = false;
            thisNg.delBoxisVisible = true;
            thisNg.delcloud = true;

            thisNg.delTp1 = $(this).attr('data-tp1');
            thisNg.delTp2 = $(this).attr('data-tp2');
            thisNg.delNode1 = $(this).attr('data-node1');
            thisNg.delNode2 = $(this).attr('data-node2');
            thisNg.delVersion = $(this).attr('data-version');
            thisNg.delNetwork1 = $(this).attr('data-network');
            thisNg.delNetwork2 = $(this).attr('data-cloudnetwork');
            thisNg.delcloudUrl = $(this).attr('data-url');
            thisNg.delLinkname = $(this).attr('data-link');
            thisNg.aaiId = $(this).attr('data-aaiid');
            thisNg.getCloudUrl(thisNg.aaiId);
        });
    }

    addLinkDisabled = true;
    nonetwork = false;
    isVisible = false;
    outCloudShow = false;
    inputshow = false;
    delBoxisVisible = false;
    isSpinning = true;

    d3Data = [];//D3Render the required data
    logicalLinks = [];//logicalLinks Existing connection data returned by the interface
    linkName = null;//Linked name link-name
    networkOption = [];//Form network drop-down box filled data
    nodeOption1 = {};//Node drop-down box filled data
    tpOption1 = [];//Node drop-down box filled data
    tpOption2 = [];//Node drop-down box filled data
    networkVal1 = null;//network1 Drop-down box default data
    networkVal2 = null;//network2 Drop-down box default data
    selectedNode1 = null;//node1 Drop-down box default data
    selectedNode2 = null;//node2 Drop-down box default data
    selecteTpName1 = null;//TP1 Drop-down box default data
    selecteTpName2 = null;//TP2 Drop-down box default data
    cloudUrl = null;//External cloud URL address
    cloudNetwork = null;//External cloud network name
    cloudNode = null;//External cloud Node name
    cloudTp = null;//External cloud Tp name

    dataCloud = [];//External cloud information
    dataCloudLink = [];
    aaiId = '';


    //When the connection is deleted, the data displayed in the right frame
    delLinkname = null;
    delNetwork1 = null;
    delNode1 = null;
    delTp1 = null;
    delcloudUrl = null;
    delNetwork2 = null;
    delNode2 = null;
    delTp2 = null;
    delVersion = null;
    delLinkIndex = null;
    network = [];
    delcloud = false;

    winWidth = $('#tpContainer').width();
    winHeight = $('#tpContainer').height();
    charge = -300;

    imgmap = {
        '1': 'assets/images/cloud-county1.png',
        '2': 'assets/images/tp.png',
        '3': 'assets/images/cloud-out.png',
    };
    tpoption = {
        container: '#tpContainer',
        data: '',
        width: 1000,
        height: this.winHeight
    };

    showForm(): void {
        if (this.addLinkDisabled == false) {
            this.isVisible = true;
            this.delBoxisVisible = false;
        }
    }

    hideForm(): void {
        this.isVisible = false;
        this.delBoxisVisible = false;
        this.linkName = null;
        this.networkVal1 = null;//Initialize the default data of the network1 drop-down box
        this.networkVal2 = null;//Initialize the network2 drop-down box default data
        this.selectedNode1 = null;//Initialize the default data of the node1 drop-down box
        this.selectedNode2 = null;//Initialize the default data of the node2 drop-down box
        this.selecteTpName1 = null;//Initialize the default data of the TP1 drop-down box
        this.selecteTpName2 = null;//Initialize the default data of the TP2 drop-down box
        this.cloudUrl = null;//External cloud URL address
        this.cloudNetwork = null;//External cloud network name
        this.cloudNode = null;//External cloud Node name
        this.cloudTp = null;//External cloud Tp name
    }

    //Get cloud image data
    getD3Data() {
        this.isSpinning = true;
        this.myhttp.getNetworkD3Data()
            .subscribe((data) => {
                this.isSpinning = false;
                if (data.length == 0) {
                    this.addLinkDisabled = false;
                    this.nonetwork = true;
                    return;
                }
                this.nonetwork = false;
                for (let ii = 0; ii < data.length; ii++) {//Determine if there is external cloud information in the data, and kick it out.
                    if (data[ii]['aaiId'] != null) {
                        this.dataCloud = data.splice(ii, 1);
                    }
                }

                for (let i = 0; i < data.length; i++) {
                    let name1 = {}, name2 = {};
                    let nodess = [];
                    name1['name'] = name2['network'] = data[i]['networkId'];
                    name1['type'] = '1';
                    name1['source'] = i;
                    this.d3Data.push(name1);
                    for (let c = 0; c < data[i]["pnfs"].length; c++) {
                        nodess.push(data[i]['pnfs'][c]['pnfName']);
                        this.nodeOption1[name2['network']] = nodess;
                    }
                    this.networkOption.push(name2);
                }
                for (let i = 0; i < data.length; i++) {
                    let tp_length = data[i]['tps'].length;
                    for (let h = 0; h < tp_length; h++) {
                        let name2 = {};
                        let interface_name = data[i]['tps'][h]['interface-name'];
                        name2['name'] = interface_name;
                        name2['type'] = '2';
                        name2['source'] = i;
                        this.d3Data.push(name2);
                    }
                }
                for (let b = 0; b < this.d3Data.length; b++) {
                    this.d3Data[b]['target'] = b;
                }
                this.initPosition(this.d3Data);
                setTimeout(this.render(this.d3Data, this.imgmap, this.dataCloud, this.charge, data), 0);
            }, (err) => {
                console.log(err);
            });

    }

    //Get the initial connection status of the cloud image getlogicalLinksData
    getLinksData() {
        this.myhttp.getLogicalLinksData()
            .subscribe((data) => {
                if (data["status"] == "FAILED") {
                    return;
                }
                for (let i = 0; i < data["logical-link"].length; i++) {//Determine whether there is an external cloud connection in the obtained connection, and kick it out.
                    if (data['logical-link'][i]['relationship-list']['relationship'].length > 2) {
                        this.dataCloudLink = data['logical-link'].splice(i, 1);
                    }
                }

                for (let i = 0; i < data["logical-link"].length; i++) {
                    let textval = [];
                    textval[0] = data['logical-link'][i]['relationship-list']['relationship'][0]['relationship-data'][1]['relationship-value'];//tp1
                    textval[1] = data['logical-link'][i]['relationship-list']['relationship'][1]['relationship-data'][1]['relationship-value'];//tp2
                    textval[2] = data['logical-link'][i]['resource-version'];//version
                    textval[3] = data['logical-link'][i]['relationship-list']['relationship'][0]['relationship-data'][0]['relationship-value'];//node1
                    textval[4] = data['logical-link'][i]['relationship-list']['relationship'][1]['relationship-data'][0]['relationship-value'];//node2
                    textval[5] = data['logical-link'][i]['operational-status'];
                    textval[6] = data['logical-link'][i]['link-name'];
                    this.logicalLinks.push(textval);
                    this.chose(textval);
                }
                if (this.dataCloudLink.length > 0) {
                    this.getcloudLine(this.dataCloudLink);
                }
            }, (err) => {
                console.log(err);
            });
    }

    //D3Cloud rendering
    render(nodes, imgmap, dataCloud, charge, dataD3) {
        let thiss = this;
        let _this = this.tpoption,
            width = null,
            height = _this.height;
        if (_this.width > 800) {
            width = _this.width;
        } else {
            width = 800;
        }
        if (dataD3.length <= 4) {
            charge = -300;
        } else if (dataD3.length > 4 && dataD3.length <= 6) {
            charge = -160;
        } else if (dataD3.length > 6 && dataD3.length <= 10) {
            charge = -110;
        } else {
            charge = -100;
        }
        let svg = d3.select(_this.container).append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('id', 'content-svg')
            .style('pointer-events', 'all')
            .style('position', 'absolute')
            .style('top', '1%')
            .style('right', '2%'),
            graph = svg.append('g').attr('class', 'graph').attr('id', 'graph'),

            _g_nodes = graph.selectAll('g.node')
                .data(nodes)
                .enter()
                .append('g')
                .style('display', function (d) {
                    let display = 'block';
                    switch (d.type) {
                        case '1':
                            display = 'none';
                            break;
                        case '2':
                            display = 'none';
                            break;
                        default:
                            break;
                    }
                    return display;
                })
                .style('cursor', 'pointer')
                .attr('class', 'node'),

            _g_lines = graph.selectAll('line.line')
                .data(nodes)
                .enter()
                .append('g')
                .style('display', 'none')
                .attr('class', 'line');


        _g_lines.append('line')
            .style('stroke', '#93c62d'
            )
            .style('stroke-width', 2);

        _g_nodes.append('image')
            .attr('width', function (d) {
                let width = 40;
                switch (d.type) {
                    case '1':
                        width = 4.4 * width;
                        break;
                    case '2':
                        width = 0.12 * width;
                        break;
                    default:
                        break;
                }
                return width;
            })
            .attr('height', function (d) {
                let height = 20;
                switch (d.type) {
                    case '1':
                        height = 3.5 * height;
                        break;
                    case '2':
                        height = 0.2 * height;
                        break;
                    default:
                        break;
                }
                return height;
            })
            .attr('xlink:href', function (d) {
                return imgmap[d.type];
            });

        _g_nodes.append('text')
            .text(function (d) {
                return d.name;
            })
            .style('transform', function (d) {
                let x = null;
                let y = null;
                switch (d.type) {
                    case '1':
                        x = 7;
                        y = -7;
                        break;
                    case '2':
                        x = 1;
                        y = -2;
                        break;
                    default:
                        break;
                }
                return 'translate(' + x + '%,' + y + '%)';
            })
            .style('font-size', function (d) {
                let size = 14;
                switch (d.type) {
                    case '1':
                        size = 14;
                        break;
                    case '2':
                        size = 12;
                        break;
                    default:
                        break;
                }
                return size;
            })
            .style('fill', function (d) {
                let color = '#666';
                switch (d.type) {
                    case '1':
                        color = '#666';
                        break;
                    case '2':
                        color = '#666';
                        break;
                    default:
                        break;
                }
                return color;
            })
            .style('font-weight', '500');


        //Add custom attributes online
        _g_lines.each(function (d, i) {
            let _this = d3.select(this);
            if (d.name) {
                _this.attr('data-text', d.name);
            }
        });

        let force = d3.layout.force()
            .size([1000, this.winHeight])
            .linkDistance(5)
            // .theta(0.6)
            .charge(charge)
            .nodes(nodes)
            .links(nodes)
            .start();

        force.on('tick', function () {
            if (force.alpha() <= 0.04) {

                _g_nodes.style('display', function (d) {
                    let display = 'block';
                    switch (d.type) {
                        case '1':
                            display = 'block';
                            break;
                        case '2':
                            display = 'none';
                            break;
                        default:
                            break;
                    }
                    return display;
                });

                nodes.forEach(function (d, i) {
                    d.x = d.x - 25 < 0 ? 25 : d.x;
                    d.x = d.x + 25 > width ? width - 25 : d.x;
                    d.y = d.y - 15 < 0 ? 15 : d.y;
                    d.y = d.y + 15 > height ? height - 15 : d.y;
                });

                _g_nodes.attr('transform', function (d) {

                    let image = d3.select(this).select('image')[0][0],
                        halfWidth = parseFloat(image.attributes[0]['value']) / 2,
                        halfHeight = parseFloat(image.attributes[1]['value']) / 2;
                    let xx = d.x - halfWidth,
                        yy = d.y - halfHeight;
                    return 'translate(' + xx + ',' + yy + ')';
                });

                _g_lines.select('line')
                    .attr('x1', function (d) {
                        return d.source.x;
                    })
                    .attr('y1', function (d) {
                        return d.source.y;
                    })
                    .attr('x2', function (d) {
                        return d.target.x;
                    })
                    .attr('y2', function (d) {
                        return d.target.y;
                    });

                _g_nodes.select('text').attr('dy', function (d) {
                    let image = this.previousSibling,
                        height = parseFloat(image.attributes[1]['value']),
                        fontSize = 12;
                    return height + 1.5 * fontSize;
                });
            }
        });

        force.on('end', function () {
            force.stop();
            if (dataCloud.length > 0) {
                thiss.getoutCloud(dataCloud, imgmap);
            }
            thiss.getLinksData();
            thiss.addLinkDisabled = false;
        });

    };

    //Topology drag and drop effect
    getDragBehavior(force) {

        return d3.behavior.drag()
            .origin(function (d) {
                return d;
            })
            .on('dragstart', dragstart)
            .on('drag', dragging)
            .on('dragend', dragend);

        function dragstart(d) {
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed('dragging', true);
            force.start();
        }

        function dragging(d) {
            d.x = d3.event.x;
            d.y = d3.event.y;
        }

        function dragend(d) {
            d3.select(this).classed('dragging', false);
        }

    }

    //Initialize node location
    initPosition(datas) {
        let origin = [this.tpoption.width / 2, this.tpoption.height / 2];
        let points = this.getVertices(origin, Math.min(this.tpoption.width / 2, this.tpoption.height / 2), datas.length);
        datas.forEach((item, i) => {
            item.x = points[i].x;
            item.y = points[i].y;
        });
    }

    //Get anchor points based on polygons
    getVertices(origin, r, n) {
        if (typeof n !== 'number') return;
        let ox = origin[0];
        let oy = origin[1];
        let angle = 30 * n / n;
        let i = 0;
        let points = [];
        let tempAngle = 0;
        while (i < n) {
            tempAngle = (i * angle * Math.PI) / 180;
            points.push({
                x: ox - r * Math.sin(tempAngle),
                y: oy - r * Math.cos(tempAngle),
            });
            i++;
        }
        return points;
    }

    //Rendering an external cloud
    getoutCloud(dataCloud, imgmap) {
        let _this = this,
            width;
        let networkId = dataCloud[0]['networkId'];
        if (_this.tpoption.width > 800) {
            width = _this.tpoption.width;
        } else {
            width = 800;
        }
        let svg = d3.select('#content-svg');
        svg.append('g').attr('class', 'out').attr('id', 'out').style({ 'display': 'block' }).attr('transform', 'translate(' + (width - 200) + ',0)');
        let out = d3.select('#out');
        out.append('image').style('width', '200').style('height', '118').attr('xlink:href', imgmap['3']);
        out.append('text').text(networkId)
            .style('transform', 'translate(0，0)')
            .style('font-size', '16')
            .style('font-weight', '400')
            .attr('dx', '40')
            .attr('dy', '70')
            .style('fill', '#666');
    }

    //External cloud connection
    getcloudLine(dataCloudLink) {
        let textval = [];
        textval[0] = dataCloudLink[0]['relationship-list']['relationship'][0]['relationship-data'][1]['relationship-value'];//tp1
        textval[1] = dataCloudLink[0]['relationship-list']['relationship'][1]['relationship-data'][1]['relationship-value'];//tp2
        textval[2] = dataCloudLink[0]['resource-version'];//version
        textval[3] = dataCloudLink[0]['relationship-list']['relationship'][0]['relationship-data'][0]['relationship-value'];//node1
        textval[4] = dataCloudLink[0]['relationship-list']['relationship'][1]['relationship-data'][0]['relationship-value'];//node2
        textval[5] = dataCloudLink[0]['operational-status'];//status
        textval[6] = dataCloudLink[0]['relationship-list']['relationship'][2]['relationship-data'][0]['relationship-value'];//aaiId
        textval[7] = this.dataCloud[0]['networkId'];
        let dataD3 = this.d3Data;
        let arr = [
            textval[0],
            textval[1]
        ];
        for (let p = 0; p < dataD3.length; p++) {//Determine which Domain network the two tp ports belong to
            for (let pp = 0; pp < arr.length; pp++) {//Determine which Domain network the two tp ports belong to
                if (dataD3[p]['name'] == arr[pp]) {
                    textval[8] = dataD3[p]['source']['name'];//network1
                }
            }
        }
        textval[9] = dataCloudLink[0]['link-name'];
        let lines_json = {};
        let _this = this,
            width;
        if (_this.tpoption.width > 800) {
            width = _this.tpoption.width;
        } else {
            width = 800;
        }
        for (let i = 0; i < $(".node").length; i++) {
            if ($('.node').eq(i).find('text').html() == textval[8]) {
                //Get the x, y coordinates of the second level
                let translates = $('.node').eq(i).css('transform');
                lines_json['x1'] = parseFloat(translates.substring(7).split(',')[4]);
                lines_json['y1'] = parseFloat(translates.substring(7).split(',')[5]);
                lines_json['x2'] = width - 100;
                lines_json['y2'] = 100;
            }
        }
        let x1 = lines_json['x1'];
        let y1 = lines_json['y1'];
        let x2 = lines_json['x2'];
        let y2 = lines_json['y2'];
        let color = '#14bb58';
        if (textval[5] == 'up') {
            color = '#14bb58';
        } else {
            color = 'red';
        }
        let line = '<line class=\'line cloudline line-click\' stroke=\'' + color + '\' stroke-width=\'2\' style=\'cursor:pointer\'></line>';
        let svg = d3.select('#graph');
        $('.cloudline').remove();
        $('#graph').prepend(line);
        $('.cloudline').attr({
            x1: x1 + 100,
            y1: y1 + 10,
            x2: x2,
            y2: y2,
            'data-tp1': textval[0],
            'data-tp2': textval[1],
            'data-version': textval[2],
            'data-node1': textval[3],
            'data-node2': textval[4],
            'data-network': textval[8],
            'data-cloudnetwork': textval[7],
            'data-url': '',
            'data-aaiid': textval[6],
            'data-link': textval[9],
        });
        svg.html(svg.html());
        this.getCloudUrl(textval[6]);
        this.getExtAAIIdVersion(textval[6]);
    }


    //Query external cloud host url address
    getCloudUrl(aaiId) {
        this.myhttp.queryCloudUrl(aaiId)
            .subscribe((data) => {
                this.delcloudUrl = data['service-url'];
                $('.cloudline').attr({
                    'data-url': data['service-url']
                });
            }, (err) => {
                console.log(err);
            });
    }

    //Query external cloud ext-aai-id resource-version
    getExtAAIIdVersion(aaiId) {
        this.myhttp.queryExtAAIIdVersion(aaiId)
            .subscribe((data) => {
                this.delVersion = data["resource-version"];
                $('.cloudline').attr({
                    'data-version': data["resource-version"],
                });
            }, (err) => {
                console.log(err);
            });
    }


    //The right form drop-down box data is filled with three levels of linkage
    //Left Port
    network1Change(value: string): void {
        this.selectedNode1 = this.nodeOption1[value][0];
        this.getPInterfaces1();
    }

    node1Change(): void {
        this.getPInterfaces1();
    }

    //Get the TP data under the specified node
    getPInterfaces1() {
        let params = {
            pnfName: this.selectedNode1,
        };
        this.myhttp.getPInterfacesData1(params)
            .subscribe((data) => {
                this.tpOption1 = [];
                for (let i = 0; i < data.length; i++) {
                    let tpName = data[i]['interface-name'];
                    this.tpOption1.push(tpName);
                }
                this.selecteTpName1 = this.tpOption1[0];
            }, (err) => {
                console.log(err);
            });
    }

    //Right Port
    network2Change(value: string): void {
        this.selectedNode2 = this.nodeOption1[value][0];
        this.getPInterfaces2();
    }

    node2Change(): void {
        this.getPInterfaces2();
    }

    //Get the TP data under the specified node
    getPInterfaces2() {
        let params = {
            pnfName: this.selectedNode2,
        };
        this.myhttp.getPInterfacesData2(params)
            .subscribe((data) => {
                this.tpOption2 = [];
                for (let i = 0; i < data.length; i++) {
                    let tpName = data[i]['interface-name'];
                    this.tpOption2.push(tpName);
                }
                this.selecteTpName2 = this.tpOption2[0];
            }, (err) => {
                console.log(err);
            });
    }

    //Submit form, connect
    submitForm(): void {
        //When the page ONAP is not selected, the local cloud TP connection
        let _thiss = this;
        if (this.inputshow == false) {
            if (this.linkName == null || this.networkVal1 == null || this.selectedNode1 == null || this.selecteTpName1 == null || this.networkVal2 == null || this.selectedNode2 == null || this.selecteTpName2 == null) {
                alert('The service port cannot be empty. Please select the port information.');
                return;
            } else if (this.networkVal1 == this.networkVal2) {
                alert('The TP port under the same cloud service cannot be connected!');
                return;
            }
            let tp_links = [],
                tp1 = this.selecteTpName1,
                tp2 = this.selecteTpName2;
            for (let i = 0; i < $(".line-port").length; i++) {
                let data_text1 = $('.line-port').eq(i).attr('data-tp1');
                let data_text2 = $('.line-port').eq(i).attr('data-tp2');
                tp_links.push(data_text1);
                tp_links.push(data_text2);
            }
            if (tp_links.indexOf(tp1) != -1 || tp_links.indexOf(tp2) != -1) {
                alert('This port number connection already exists!');
                return;
            }
            this.createTpLinks();

        } else {
            //When the page ONAP is selected, the external cloud is created, and the connection is made.
            if (this.linkName == null || this.networkVal1 == null || this.selectedNode1 == null || this.selecteTpName1 == null || this.cloudUrl == null || this.cloudNetwork == null || this.cloudNode == null || this.cloudTp == null) {
                alert('The service port cannot be empty. Please fill in the complete port information.');
                return;
            }
            let tp_links = [],
                tp1 = this.selecteTpName1;
            for (let i = 0; i < $(".line-port").length; i++) {
                let data_text1 = $('.line-port').eq(i).attr('data-tp1');
                tp_links.push(data_text1);
            }
            if (tp_links.indexOf(tp1) != -1) {
                alert('This port number connection already exists!');
                return;
            }

            let time = this.cloudNetwork + new Date().getTime();//Create aaiid for the external cloud, this identifier is unique and cannot be repeated
            this.createCloudUrls(time)
        }
    }

    //Create tp connection call interface createLink
    createTpLinks() {
        let params = {
            'link-name': this.linkName,
            'link-type': 'cross-link',
            'operational-status': 'up',
            'relationship-list': {
                'relationship': [
                    {
                        'related-to': 'p-interface',
                        'related-link': '/aai/v14/network/pnfs/pnf/' + this.selectedNode1 + '/p-interfaces/p-interface/' + this.selecteTpName1,
                        'relationship-data': [
                            {
                                'relationship-key': 'pnf.pnf-id',
                                'relationship-value': this.selectedNode1
                            },
                            {
                                'relationship-key': 'p-interface.p-interface-id',
                                'relationship-value': this.selecteTpName1,
                            }
                        ]
                    },
                    {
                        'related-to': 'p-interface',
                        'related-link': '/aai/v14/network/pnfs/pnf/' + this.selectedNode2 + '/p-interfaces/p-interface/' + this.selecteTpName2,
                        'relationship-data': [
                            {
                                'relationship-key': 'pnf.pnf-id',
                                'relationship-value': this.selectedNode2
                            },
                            {
                                'relationship-key': 'p-interface.p-interface-id',
                                'relationship-value': this.selecteTpName2
                            }
                        ]
                    }
                ]
            }
        };
        this.myhttp.createLink(params)
            .subscribe((data) => {
                if (data['status'] == 'SUCCESS') {
                    this.queryAddLink();
                }
            }, (err) => {
                console.log(err);
                console.log('Create connection interface call failed');
            });
    }

    //Query the newly added connection immediately after creating the tp cable
    queryAddLink() {
        let linkName = this.linkName,
            selecteTpName1 = this.selecteTpName1,
            selecteTpName2 = this.selecteTpName2,
            selectedNode1 = this.selectedNode1,
            selectedNode2 = this.selectedNode2;
        let params = {
            'link-name': linkName,
        };
        this.myhttp.querySpecificLinkInfo(params)
            .subscribe((data) => {
                let version = data['resource-version'],
                    operational_status = data['operational-status'],
                    linkname = data['link-name'];
                let textval = [selecteTpName1, selecteTpName2, version, selectedNode1, selectedNode2, operational_status, linkname];
                this.hideForm();
                this.chose(textval);
            }, (err) => {
                console.log(err);
            });
    }

    //Connection between two TP coordinates
    chose(textval) {
        let lines_json = {};
        lines_json['tp1'] = textval[0];
        lines_json['tp2'] = textval[1];
        lines_json['version'] = textval[2];
        lines_json['node1'] = textval[3];
        lines_json['node2'] = textval[4];
        lines_json['status'] = textval[5];
        lines_json['linkname'] = textval[6];
        for (let i = 0; i < $(".node").length; i++) {
            if ($('.node').eq(i).find('text').html() == textval[0]) {
                $('.node').eq(i).show();
                //Get the x, y coordinates of the second level
                let translates = $('.node').eq(i).css('transform');
                lines_json['x1'] = parseFloat(translates.substring(7).split(',')[4]);
                lines_json['y1'] = parseFloat(translates.substring(7).split(',')[5]);
            }
            if ($('.node').eq(i).find('text').html() == textval[1]) {
                $('.node').eq(i).show();
                let translates = $('.node').eq(i).css('transform');
                lines_json['x2'] = parseFloat(translates.substring(7).split(',')[4]);
                lines_json['y2'] = parseFloat(translates.substring(7).split(',')[5]);
            }
        }
        this.addLine(lines_json);
    }

    //Connection between two TPs
    addLine(lines) {
        let tp1 = lines.tp1;
        let tp2 = lines.tp2;
        let version = lines.version;
        let node1 = lines.node1;
        let node2 = lines.node2;
        let status = lines.status;
        let linkname = lines.linkname;
        let x1 = lines.x1;
        let y1 = lines.y1;
        let x2 = lines.x2;
        let y2 = lines.y2;
        let color = '#14bb58';
        if (status == 'up') {
            color = '#14bb58';
        } else {
            color = 'red';
        }
        let line = '<line class=\'line line-port line-click\' stroke=\'' + color + '\' stroke-width=\'2\' style=\'cursor:pointer\'></line>';
        let svg = d3.select('#graph');
        $('#graph').prepend(line);
        $('.line').first().attr({
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            'data-tp1': tp1,
            'data-tp2': tp2,
            'data-version': version,
            'data-node1': node1,
            'data-node2': node2,
            'data-link': linkname
        });
        svg.html(svg.html());
    }

    //After creating an external cloud connection, query the connection immediately
    queryOutCloudLink(time) {
        let networkVal1 = this.networkVal1,
            selectedNode1 = this.selectedNode1,
            selecteTpName1 = this.selecteTpName1,
            cloudUrl = this.cloudUrl,
            cloudNetWork = this.cloudNetwork,
            cloudNode = this.cloudNode,
            cloudTp = this.cloudTp,
            linkname = this.linkName;
        let params = {
            'link-name': linkname,
        };
        this.myhttp.querySpecificLinkInfo(params)
            .subscribe((data) => {
                let status = data['operational-status'];
                let link_name = data['link-name'];
                this.outCloudShow = true;
                this.hideForm();
                this.outCloud(this.imgmap);
                setTimeout(this.cloudLine(networkVal1, selectedNode1, selecteTpName1, cloudUrl, cloudNetWork, cloudNode, cloudTp, status, link_name, time), 0);
            }, (err) => {
                console.log(err);
            });
    }

    //Add external cloud
    outCloud(imgmap) {
        let _this = this,
            width;
        if (_this.tpoption.width > 800) {
            width = _this.tpoption.width;
        } else {
            width = 800;
        }
        let svg = d3.select('#content-svg');
        svg.append('g').attr('class', 'out').attr('id', 'out').style({ 'display': 'block' }).attr('transform', 'translate(' + (width - 200) + ',0)');
        let out = d3.select('#out');
        out.append('image').style('width', '200').style('height', '118').attr('xlink:href', imgmap['3']);
        out.append('text').text('Partner Network')
            .style('transform', 'translate(0，0)')
            .style('font-size', '16')
            .style('font-weight', 'bold')
            .attr('dx', '40')
            .attr('dy', '70')
            .style('fill', '#fff');
    }

    //Add external cloud connection
    cloudLine(networkVal1, selectedNode1, selecteTpName1, cloudUrl, cloudNetWork, cloudNode, cloudTp, status, link_name, time) {
        let lines_json = {};
        let _this = this,
            width;
        if (_this.tpoption.width > 800) {
            width = _this.tpoption.width;
        } else {
            width = 800;
        }
        for (let i = 0; i < $(".node").length; i++) {
            if ($('.node').eq(i).find('text').html() == networkVal1) {
                //Get the x, y coordinates of the second level
                let translates = $('.node').eq(i).css('transform');
                lines_json['x1'] = parseFloat(translates.substring(7).split(',')[4]);
                lines_json['y1'] = parseFloat(translates.substring(7).split(',')[5]);
                lines_json['x2'] = width - 100;
                lines_json['y2'] = 100;
            }
        }
        let x1 = lines_json['x1'];
        let y1 = lines_json['y1'];
        let x2 = lines_json['x2'];
        let y2 = lines_json['y2'];
        let color = '#14bb58';
        if (status == 'up') {
            color = '#14bb58';
        } else {
            color = 'red';
        }
        let line = '<line class=\'line cloudline line-click\' stroke=\'' + color + '\' stroke-width=\'2\' style=\'cursor:pointer\'></line>';
        let svg = d3.select('#graph');
        $('.cloudline').remove();
        $('#graph').prepend(line);
        $('.cloudline').attr({
            x1: x1 + 100,
            y1: y1 + 10,
            x2: x2,
            y2: y2,
            'data-tp1': selecteTpName1,
            'data-tp2': cloudTp,
            'data-node1': selectedNode1,
            'data-node2': cloudNode,
            'data-network': networkVal1,
            'data-cloudnetwork': cloudNetWork,
            'data-url': cloudUrl,
            'data-aaiid': time,
            'data-link': link_name
        });
        svg.html(svg.html());
        this.getExtAAIIdVersion(time);
    }

    //Create an external cloud, call the following 5 interfaces when connecting:createCloudNetwork,createPnfs,createCloudTp,createCloudLinks,createCloudUrls
    createCloudNetwork(time) {
        let _thiss = this;
        let params = {
            '-xmlns': 'http://org.onap.aai.inventory/v14',
            'in-maint': 'false',
            "network-id": this.cloudNetwork,
            "provider-id": "",
            "client-id": "",
            "te-topo-id": "",
            "relationship-list": {
                "relationship": [{
                    "related-to": "ext-aai-network",
                    'related-link': '/aai/v14/network/ext-aai-networks/ext-aai-network/' + time
                }]
            }
        };

        //Do some asynchronous operations
        _thiss.myhttp.createNetwrok(params)
            .subscribe((data) => {
                if (data["status"] == "SUCCESS") {
                    _thiss.createPnfs(time)
                }
            }, (err) => {
                console.log(err);
            });

    }

    createPnfs(time) {
        let _thiss = this;
        let params = {
            "-xmlns": "http://org.onap.aai.inventory/v14",
            "pnf-name": this.cloudNode,
            "pnf-id": this.cloudNode,
            "in-maint": "true",
            "relationship-list": {
                "relationship": [
                    {
                        "related-to": "ext-aai-network",
                        "relationship-label": "org.onap.relationships.inventory.BelongsTo",
                        "related-link": "/aai/v14/network/ext-aai-networks/ext-aai-network/" + time,
                        "relationship-data": {
                            "relationship-key": "ext-aai-network.aai-id",
                            "relationship-value": time
                        }
                    },
                    {
                        "related-to": "network-resource",
                        "relationship-label": "tosca.relationships.network.LinksTo",
                        "related-link": "/aai/v14/network/network-resources/network-resource/" + this.cloudNetwork
                    }
                ]
            }
        };

        //Do some asynchronous operations
        _thiss.myhttp.createPnf(params)
            .subscribe((data) => {
                if (data["status"] == "SUCCESS") {
                    _thiss.createCloudTp(time)
                }
            }, (err) => {
                console.log(err);
            });
    }

    createCloudTp(time) {
        let _thiss = this;
        let params = {
            "-xmlns": "http://org.onap.aai.inventory/v14",
            "interface-name": this.cloudTp,
            "speed-value": "1000000",
            "in-maint": "true",
            "network-ref": "",
            "transparent": "true",
            "operational-status": "up"
        };

        let cloudNodeName = this.cloudNode;
        //Do some asynchronous operations
        _thiss.myhttp.createTp(params, cloudNodeName)
            .subscribe((data) => {
                if (data["status"] == "SUCCESS") {
                    _thiss.createCloudLinks(time)
                }
            }, (err) => {
                console.log(err);
            });
    }

    createCloudLinks(time) {
        let _thiss = this;
        let params = {
            "-xmlns": "http://org.onap.aai.inventory/v14",
            "link-name": this.linkName,
            "in-maint": "false",
            "link-type": "cross-link",
            "speed-value": "",
            "operational-status": "up",
            "relationship-list": {
                "relationship": [
                    {
                        "related-to": "p-interface",
                        "relationship-label": "tosca.relationships.network.LinksTo",
                        "related-link": "/aai/v14/network/pnfs/pnf/" + this.selectedNode1 + "/p-interfaces/p-interface/" + this.selecteTpName1,
                        "relationship-data": [
                            {
                                "relationship-key": "pnf.pnf-name",
                                "relationship-value": this.selectedNode1
                            },
                            {
                                "relationship-key": "p-interface.interface-name",
                                "relationship-value": this.selecteTpName1
                            }
                        ],
                        "related-to-property": [{
                            "property-key": "p-interface.prov-status"
                        }]
                    },
                    {
                        "related-to": "p-interface",
                        "relationship-label": "tosca.relationships.network.LinksTo",
                        "related-link": "/aai/v14/network/pnfs/pnf/" + this.cloudNode + "/p-interfaces/p-interface/" + this.cloudTp,
                        "relationship-data": [
                            {
                                "relationship-key": "pnf.pnf-name",
                                "relationship-value": this.cloudNode
                            },
                            {
                                "relationship-key": "p-interface.interface-name",
                                "relationship-value": this.cloudTp
                            }
                        ],
                        "related-to-property": [{
                            "property-key": "p-interface.prov-status"
                        }]
                    },
                    {
                        "related-to": "ext-aai-network",
                        "relationship-label": "org.onap.relationships.inventory.BelongsTo",
                        "related-link": "/aai/v14/network/ext-aai-networks/ext-aai-network/" + time,
                        "relationship-data": [
                            {
                                "relationship-key": "ext-aai-network.aai-id",
                                "relationship-value": time
                            }
                        ]
                    }
                ]
            }
        };

        //Do some asynchronous operations
        _thiss.myhttp.createCloudLink(params)
            .subscribe((data) => {
                // resolve(data['status']);
                if (data["status"] == "SUCCESS") {
                    _thiss.queryOutCloudLink(time);
                }
            }, (err) => {
                console.log(err);
            });
    }

    createCloudUrls(time) {
        let _thiss = this;
        let params = {
            '-xmlns': 'http://org.onap.aai.inventory/v14',
            'aai-id': time,
            'esr-system-info': {
                'esr-system-info-id': 'example-esr-system-info-id-val-0',
                'service-url': this.cloudUrl,
                'user-name': 'demo',
                'password': 'demo123456!',
                'system-type': 'ONAP'
            }
        };
        _thiss.myhttp.createCloudUrl(params)
            .subscribe((data) => {
                if (data['status'] == 'SUCCESS') {
                    _thiss.createCloudNetwork(time);
                }
            }, (err) => {
                console.log(err);
            });
    }

    //Local cloud TP port Delete connection Call interface deleteLink
    delLink(): void {
        let deltp1 = this.delTp1,
            deltp2 = this.delTp2,
            version = this.delVersion,
            dellinkname = this.delLinkname,
            delLinkIndex = this.delLinkIndex;
        let params = {
            'logical-link': dellinkname,
            'resource-version': version,
        };
        this.myhttp.deleteLink(params)
            .subscribe((data) => {
                if (data['status'] == 'SUCCESS') {
                    this.delLine(deltp1, deltp2);
                    delLinkIndex.remove();
                }
            }, (err) => {
                console.log(err);
                console.log('Deleting a connection interface call failed');
            });
    }

    delLine(val1, val2) {
        this.delBoxisVisible = false;
        for (let i = 0; i < $(".node").length; i++) {
            if ($('.node').eq(i).find('text').html() == val1) {
                $('.node').eq(i).hide();
            }
            if ($('.node').eq(i).find('text').html() == val2) {
                $('.node').eq(i).hide();
            }
        }
    }


    //External cloud Delete connection Call interface deleteCloudLink
    delCloudLink(): void {
        let deltp1 = this.delTp1,
            deltp2 = this.delTp2,
            version = this.delVersion,
            aaiId = this.aaiId;
        let params = {
            "aaiId": aaiId,
            "version": version,
        };
        this.myhttp.deleteCloudLink(params)
            .subscribe((data) => {
                if (data['status'] == 'SUCCESS') {
                    this.delLine(deltp1, deltp2);
                    $('.cloudline').remove();
                    $('#out').remove();
                }
            }, (err) => {
                console.log(err);
                console.log('Deleting a connection interface call failed');
            });
    }

}
