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
import {Component, OnInit} from '@angular/core';
import * as d3 from 'd3'
import * as $ from 'jquery';
import {networkHttpservice} from '../../../core/services/networkHttpservice.service';
import {EventQueueService} from "../../../core/services/eventQueue.service";
import {AppEvent} from "@src/app/core/services/appEvent";
import {AppEventType} from "@src/app/core/services/appEventType";

@Component({
    selector: 'app-ccvpn-network',
    templateUrl: './ccvpn-network.component.html',
    styleUrls: ['./ccvpn-network.component.css']
})
export class CcvpnNetworkComponent implements OnInit {

   constructor(private myhttp: networkHttpservice,
                private eventDispatcher: EventQueueService) {
    }

    ngOnInit() {
        let thisNg = this;
        this.isSpinning = true;
        this.myhttp.getConnectivities()
            .subscribe((data) => {
                if(data){
                    for (let conn of data["connectivity"]) {
                        if (conn["vpn-type"] === "mdsc"){
                            this.connectivityList.push({ "name": conn["connectivity-id"],
                                                        "id": conn["connectivity-id"],
                                                        "relationship-list" : conn["relationship-list"]
                            });
                        }
                    }
                    if (this.connectivityList.length !== 0) {
                        this.connectivitySelected = this.connectivityList[0];
                        this.choseConnectivity(this.connectivitySelected);

                    };
                }
            },
                 (err) => {
                     console.log(err);
                 });
        this.myhttp.getLogicalLinksData()
            .subscribe((data) => {
                    if (data) {
                        for (let ll of data["logical-link"]){
                            // Filter layer1 logical link
                            //if (ll["relationship-list"] !== undefined &&
                            //    ll["relationship-list"]["relationship"].length) {
                            thisNg.logicalLinks.push(ll);
                            //}
                        }
                        let tpMapping = thisNg.getPnfTpMapping(thisNg.logicalLinks);

                        let links = thisNg.getLinks( thisNg.logicalLinks, tpMapping);
                        let tps = thisNg.getNodes(tpMapping);
                        console.log(links);
                        console.log(tps);

                        thisNg.drawTopo(tps, links);

                    }
                    this.isSpinning = false;
                },
                (err) => {
                    console.log(err);
                })
    }

    connectivityList = [];
    connectivitySelected = { name: null, id: null };

    addLinkDisabled = true;
    nonetwork = false;
    isVisible = false;
    outCloudShow = false;
    inputshow = false;
    delBoxisVisible = false;
    isSpinning = true;

    pnfs = [];
    layer1Tps = [];

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
    SEPERATOR = '-';


    imgMap = {
        'pnf': 'assets/images/site.png',
        'tp': 'assets/images/tp.png'
    };

    //### SELECTION - store the selected node ###
    //### EDITING - store the drag mode (either 'drag' or 'add_link') ###
    svcEditorGlobal = {
        selection: null
    }
    svcContainerOpt = {
        containerId : "svcContainer",
        width: 1000,
        height: this.winHeight
    };

    tpoption = {
        container: '#tpContainer',
        data: '',
        width: 1000,
        height: this.winHeight
    };

    /**
     * Redraw the selected L2 ethernet service.
     * @param {Array<object>} treeData parsed from AAI connectivity.
     */
    drawService(treeData) {
        //Model of service graph
        let graph = {
            nodes: [
            ],
            links: [
            ],
            objectify: (function() {
                /* resolve node IDs (not optimized at all!)
                */
                var l, n, _i, _len, _ref, _results;
                _ref = graph.links;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    l = _ref[_i];
                    _results.push((function() {
                        var _j, _len2, _ref2, _results2;
                        _ref2 = graph.nodes;
                        _results2 = [];
                        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
                            n = _ref2[_j];
                            if (l.source === n.id) {
                                l.source = n;
                                continue;
                            }
                            if (l.target === n.id) {
                                l.target = n;
                                continue;
                            } else {
                                _results2.push(void 0);
                            }
                        }
                        return _results2;
                    })());
                }
                return _results;
            }),
            remove: (function(condemned) {
                /* remove the given node or link from the graph, also deleting dangling links if a node is removed
                */      if (Array.prototype.indexOf.call(this.nodes, condemned) >= 0) {
                    this.nodes = this.nodes.filter(function(n) {
                        return n !== condemned;
                    });
                    return this.links = this.links.filter(function(l) {
                        return l.source.id !== condemned.id && l.target.id !== condemned.id;
                    });
                } else if (Array.prototype.indexOf.call(this.links, condemned) >= 0) {
                    return this.links = this.links.filter(function(l) {
                        return l !== condemned;
                    });
                }
            }),
            last_index: 0,
            add_node: (function(type) {
                var n;
                n = {
                    id: this.last_index++,
                    x: 960 / 2,
                    y: 500 / 2,
                    type: type
                };
                this.nodes.push(n);
                return n;
            }),
            add_link: (function(source, target) {
                /* avoid links to self
                */
                var l, link, _i, _len, _ref;
                if (source === target) return null;
                /* avoid link duplicates
                */
                _ref = this.links;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    link = _ref[_i];
                    if (link.source === source && link.target === target) return null;
                }
                l = {
                    source: source,
                    target: target
                };
                this.links.push(l);
                return l;
            })
        };

        var nodeList = treeData.map(obj => {
            let rObj = {};
            rObj["id"] = obj["id"];
            rObj["x"] = 500;
            rObj["y"] = 500;
            rObj["type"] = obj["type"];
            return rObj;
            })

         var linkList = [] ;
         for (var i = 0, e = treeData.length; i < e; i++){
             for (var j = i+1, k = e; j < k; j++){
                linkList.push({
                                 source: treeData[i].id,
                                 target: treeData[j].id
                             });
                }
         }
        graph.nodes = nodeList;
        graph.links = linkList;
        graph.objectify();
        var _this = this;
        var margin = {top: 20, right: 120, bottom: 20, left: 120},
            width = 1000 - margin.right - margin.left,
            height = 350 - margin.top - margin.bottom;
        //clean existing element
        d3.select("div#" + this.svcContainerOpt.containerId).selectAll("*").remove();

        let svg = d3.select("div#" + this.svcContainerOpt.containerId).append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom);
        let container = svg.append("g").style("fill", "transparent");

        let vis = container.append('g');
        container.call(d3.behavior.zoom().scaleExtent([0.5, 8])
            .on('zoom', function(){
                vis.attr('transform', "translate(" + d3.event.translate  + ")scale(" + d3.event.scale + ")");
            }));

        vis.append('rect')
            .attr('class', 'overlay')
            .attr('x', -500000)
            .attr('y', -500000)
            .attr('width', 1000000)
            .attr('height', 1000000)
            .on('click', function(d) {
                _this.svcEditorGlobal.selection = null;
                d3.selectAll('.node').classed('selected', false);
                return d3.selectAll('.link').classed('selected', false);
            });
        let colorify = d3.scale.category10();
        /* initialize the force layout
        */
        let force = d3.layout.force().size([width, height]).charge(-400).linkDistance(160)
            .on('tick', (function(e) {
            /* update nodes and links
            */
                let k = 16 * e.alpha;
                graph.nodes.forEach(function(o, i) {
                    if (o["type"] === "root"){
                        o["x"] +=  k
            //o["x"] += i & 2 ? k : -k;

                    } else if (o["type"] === "leaf") {
                        o["x"] +=  -k;
            //o["x"] += i & 2 ? k : -k;
                    }
                });
                vis.selectAll('.node').attr('transform', function(d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });


                //#svcContainer > svg > g > g > g:nth-child(3) > text
                //_this.svcEditorGlobal.selection
                return vis.selectAll('.link').attr('x1', function(d) {
                    return d.source.x;
                }).attr('y1', function(d) {
                        return d.source.y;
                }).attr('x2', function(d) {
                        return d.target.x;
                }).attr('y2', function(d) {
                        return d.target.y;
                });
            }));
        let nodeDragging = force.drag().on('dragstart', function (d){
            d3.event.sourceEvent.stopPropagation();
            d.fixed = true;
        })

        let topoNodeSync = _this.eventDispatcher.on(AppEventType.UserNodeDrag)
            .subscribe(event => {
                //console.log(event);
                let pnfId: string  = event.payload.id;
                let pnfId_short: string = pnfId.substr(pnfId.lastIndexOf('-')+1);
                vis.selectAll('.node > circle').attr('stroke-width', function(d) {
                    if (d.id.startsWith(pnfId_short)){
                        return "4px";
                    }
                    return "1px";
                });
            });

        // DELETION - pressing DEL deletes the selection
        // CREATION - pressing N creates a new node
        // d3.select(window).on('keydown', function() {
        //     if (d3.event.keyCode === 46) {
        //         if (global.selection != null) {
        //             graph.remove(global.selection);
        //             global.selection = null;
        //             return update();
        //         }
        //     } else if (d3.event.keyCode === 78) {
        //         graph.add_node();
        //         return update();
        //     }
        // });

        //Parameter for Editing tools
        let toolbar = $("<div class='toolbar'></div>");
        $("div#" + this.svcContainerOpt.containerId).append(toolbar);
        toolbar.append($("<svg\n" +
            "    class='active tool'\n    " +
            "data-tool='pointer'\n" +
            "    xmlns='http://www.w3.org/2000/svg'\n" +
            "    version='1.1'\n" +
            "    width='32'\n" +
            "    height='32'\n" +
            "    fill='#b52d0c'" +
            "    viewBox='0 0 128 128'>\n" +
            "    <g transform='translate(881.10358,-356.22543)'>\n" +
            "      <g transform='matrix(0.8660254,-0.5,0.5,0.8660254,-266.51112,-215.31898)'>\n" +
            "        <path\n" +
            "           d='m -797.14902,212.29589 a 5.6610848,8.6573169 0 0 0 -4.61823,4.3125 l -28.3428,75.0625 a 5.6610848,8.6573169 0 0 0 4.90431,13 l 56.68561,0 a 5.6610848,8.6573169 0 0 0 4.9043,-13 l -28.3428,-75.0625 a 5.6610848,8.6573169 0 0 0 -5.19039,-4.3125 z m 0.28608,25.96875 18.53419,49.09375 -37.06838,0 18.53419,-49.09375 z'\n        />\n" +
            "        <path\n" +
            "           d='m -801.84375,290.40625 c -2.09434,2.1e-4 -3.99979,1.90566 -4,4 l 0,35.25 c 2.1e-4,2.09434 1.90566,3.99979 4,4 l 10,0 c 2.09434,-2.1e-4 3.99979,-1.90566 4,-4 l 0,-35.25 c -2.1e-4,-2.09434 -1.90566,-3.99979 -4,-4 z'\n        />\n" +
            "      </g>\n" +
            "    </g>\n" +
            "</svg>"));
        toolbar.append($("<svg\n" +
            "    class='tool'\n" +
            "    data-tool='add_node'\n" +
            "    xmlns='http://www.w3.org/2000/svg'\n" +
            "    version='1.1'\n" +
            "    width='32'\n" +
            "    height='32'\n" +
            "    viewBox='0 0 128 128'>\n" +
            "    <g transform='translate(720.71649,-356.22543)'>\n" +
            "      <g transform='translate(-3.8571429,146.42857)'>\n" +
            "        <path\n           d='m -658.27638,248.37149 c -1.95543,0.19978 -3.60373,2.03442 -3.59375,4 l 0,12.40625 -12.40625,0 c -2.09434,2.1e-4 -3.99979,1.90566 -4,4 l 0,10 c -0.007,0.1353 -0.007,0.27095 0,0.40625 0.19978,1.95543 2.03442,3.60373 4,3.59375 l 12.40625,0 0,12.4375 c 2.1e-4,2.09434 1.90566,3.99979 4,4 l 10,0 c 2.09434,-2.1e-4 3.99979,-1.90566 4,-4 l 0,-12.4375 12.4375,0 c 2.09434,-2.1e-4 3.99979,-1.90566 4,-4 l 0,-10 c -2.1e-4,-2.09434 -1.90566,-3.99979 -4,-4 l -12.4375,0 0,-12.40625 c -2.1e-4,-2.09434 -1.90566,-3.99979 -4,-4 l -10,0 c -0.1353,-0.007 -0.27095,-0.007 -0.40625,0 z'\n" +
            "        />\n" +
            "        <path\n" +
            "           d='m -652.84375,213.9375 c -32.97528,0 -59.875,26.86847 -59.875,59.84375 0,32.97528 26.89972,59.875 59.875,59.875 32.97528,0 59.84375,-26.89972 59.84375,-59.875 0,-32.97528 -26.86847,-59.84375 -59.84375,-59.84375 z m 0,14 c 25.40911,0 45.84375,20.43464 45.84375,45.84375 0,25.40911 -20.43464,45.875 -45.84375,45.875 -25.40911,0 -45.875,-20.46589 -45.875,-45.875 0,-25.40911 20.46589,-45.84375 45.875,-45.84375 z'\n" +
            "        />\n" +
            "      </g>\n" +
            "    </g>\n" +
            "</svg>"));
        toolbar.append($("<svg\n" +
            "    class='tool'\n" +
            "    data-tool='add_link'\n" +
            "    xmlns='http://www.w3.org/2000/svg'\n" +
            "    version='1.1'\n" +
            "    width='32'\n" +
            "    height='32'\n" +
            "    viewBox='0 0 128 128'>\n" +
            "<g transform='translate(557.53125,-356.22543)'>\n" +
            "    <g transform='translate(20,0)'>\n" +
            "      <path\n" +
            "         d='m -480.84375,360 c -15.02602,0 -27.375,12.31773 -27.375,27.34375 0,4.24084 1.00221,8.28018 2.75,11.875 l -28.875,28.875 c -3.59505,-1.74807 -7.6338,-2.75 -11.875,-2.75 -15.02602,0 -27.34375,12.34898 -27.34375,27.375 0,15.02602 12.31773,27.34375 27.34375,27.34375 15.02602,0 27.375,-12.31773 27.375,-27.34375 0,-4.26067 -0.98685,-8.29868 -2.75,-11.90625 L -492.75,411.96875 c 3.60156,1.75589 7.65494,2.75 11.90625,2.75 15.02602,0 27.34375,-12.34898 27.34375,-27.375 C -453.5,372.31773 -465.81773,360 -480.84375,360 z m 0,14 c 7.45986,0 13.34375,5.88389 13.34375,13.34375 0,7.45986 -5.88389,13.375 -13.34375,13.375 -7.45986,0 -13.375,-5.91514 -13.375,-13.375 0,-7.45986 5.91514,-13.34375 13.375,-13.34375 z m -65.375,65.34375 c 7.45986,0 13.34375,5.91514 13.34375,13.375 0,7.45986 -5.88389,13.34375 -13.34375,13.34375 -7.45986,0 -13.34375,-5.88389 -13.34375,-13.34375 0,-7.45986 5.88389,-13.375 13.34375,-13.375 z'\n" +
            "      />\n      <path\n" +
            "         d='m -484.34375,429.25 c -1.95543,0.19978 -3.60373,2.03442 -3.59375,4 l 0,12.40625 -12.40625,0 c -2.09434,2.1e-4 -3.99979,1.90566 -4,4 l 0,10 c -0.007,0.1353 -0.007,0.27095 0,0.40625 0.19978,1.95543 2.03442,3.60373 4,3.59375 l 12.40625,0 0,12.4375 c 2.1e-4,2.09434 1.90566,3.99979 4,4 l 10,0 c 2.09434,-2.1e-4 3.99979,-1.90566 4,-4 l 0,-12.4375 12.4375,0 c 2.09434,-2.1e-4 3.99979,-1.90566 4,-4 l 0,-10 c -2.1e-4,-2.09434 -1.90566,-3.99979 -4,-4 l -12.4375,0 0,-12.40625 c -2.1e-4,-2.09434 -1.90566,-3.99979 -4,-4 l -10,0 c -0.1353,-0.007 -0.27095,-0.007 -0.40625,0 z'\n" +
            "      />\n" +
            "    </g>\n" +
            "  </g>\n" +
            "</svg>"));
        let library = $("<div class='library'></div></div>");
        toolbar.append(library);

        ['PON', 'ETH'].forEach(function(type) {
            var new_btn;
            new_btn = $("<svg width='42' height='42'>\n" +
                "    <g class='node'>\n" +
                "        <circle\n" +
                "            cx='21'\n" +
                "            cy='21'\n" +
                "            r='18'\n" +
                "            stroke='" + (colorify(type)) + "'\n" +
                "            fill='" + (d3.hcl(colorify(type)).brighter(3)) + "'\n" +
                "        >\n" +
                "        <title>" + (type) + " UNI</title>   \n" +
                "       </circle>" +
                "    </g>\n" +
                "</svg>");
            new_btn.bind('click', function() {
                graph.add_node(type);
                return update();
            });
            library.append(new_btn);
            return library.hide();
        });

        let tool = 'pointer';
        let new_link_source = null;
        let drag_link;
        vis.on('mousemove.add_link', (function(d) {
            /* check if there is a new link in creation
            */
            var p;
            if (new_link_source != null) {
                /* update the draggable link representation
                */
                p = d3.mouse(vis.node());
                return drag_link.attr('x1', new_link_source.x).attr('y1', new_link_source.y).attr('x2', p[0]).attr('y2', p[1]);
            }
        })).on('mouseup.add_link', (function(d) {
            new_link_source = null;
            /* remove the draggable link representation, if exists
            */
            if (drag_link != null) return drag_link.remove();
        }));
        d3.selectAll('.tool').on('click', function() {
            var new_tool, nodes;
            d3.selectAll('.tool').classed('active', false).style("fill", "#a3a4c3");
            d3.select(this).classed('active', true).style("fill", "#b52d0c");
            new_tool = $(this).data('tool');
            nodes = vis.selectAll('.node');

            //mode change to add_link
            if (new_tool === 'add_link' && tool !== 'add_link') {
                /* remove drag handlers from nodes
                */
                nodes.on('mousedown.drag', null).on('touchstart.drag', null);
                /* add drag handlers for the add_link tool
                */
                nodes.call(drag_add_link);
            } else if (new_tool !== 'add_link' && tool === 'add_link') {
                /* remove drag handlers for the add_link tool
                */
                nodes.on('mousedown.add_link', null).on('mouseup.add_link', null);
                /* add drag behavior to nodes
                */
                nodes.call(nodeDragging);
            }
            if (new_tool === 'add_node') {
                library.show();
            } else {
                library.hide();
            }
            return tool = new_tool;
        });
        update();
        function update() {
            /* update the layout
      */
            var links, new_nodes, nodes;
            force.nodes(graph.nodes).links(graph.links).start();
            /* create nodes and links
            */
            /* (links are drawn with insert to make them appear under the nodes)
            */
            /* also define a drag behavior to drag nodes
            */
            /* dragged nodes become fixed
            */
            nodes = vis.selectAll('.node').data(graph.nodes, function(d) {
                return d.id;
            });
            new_nodes = nodes.enter().append('g').attr('class', 'node');
/*            .on('click', (function(d) {
                /!* SELECTION
                *!/
                _this.svcEditorGlobal.selection = d;
                d3.selectAll('.node').classed('selected', function(d2) {
                    return d2 === d;
                });
                return d3.selectAll('.link').classed('selected', false);
            }));*/
            links = vis.selectAll('.link').data(graph.links, function(d) {
                return "" + d.source.id + "->" + d.target.id;
            });

            links.enter().insert('line', '.node').attr('class', 'link').on('click', (function(d) {
                /* SELECTION
                */
                _this.svcEditorGlobal.selection = d;
                d3.selectAll('.link').classed('selected', function(d2) {
                    return d2 === d;
                });
                return d3.selectAll('.node').classed('selected', false);
            }));
            links
                .style("stroke-width", "6px")
                .style("stroke", "gray")
                .style("opacity", "0.5");

            links.exit().remove();
            /* TOOLBAR - add link tool initialization for new nodes
            */
            if (tool === 'add_link') {
                new_nodes.call(drag_add_link);
            } else {
                new_nodes.call(nodeDragging);
            }
            new_nodes.append('circle').attr('r', 18).attr('stroke', function(d) {
                return colorify(d.type);
            }).attr('fill', function(d) {
                return d3.hcl(colorify(d.type)).brighter(3);
            });
            /* draw the label
            */
            new_nodes.append('text').text(function(d) {
                return d.id;
            }).attr('dy', '0.35em').attr('fill', function(d) {
                return colorify(d.type);
            });
            return nodes.exit().remove();
        };
        function drag_add_link (selection) {
            return selection.on('mousedown.add_link', (function(d) {
                var p;
                new_link_source = d;
                /* create the draggable link representation
                */
                p = d3.mouse(vis.node());
                drag_link = vis.insert('line', '.node').attr('class', 'drag_link').attr('x1', d.x).attr('y1', d.y).attr('x2', p[0]).attr('y2', p[1]);
                drag_link
                    .style("stroke-width", "6px")
                    .style("stroke", "gray")
                    .style("opacity", "0.5");
                /* prevent pan activation
                */
                d3.event.stopPropagation();
                /* prevent text selection
                */
                return d3.event.preventDefault();
            })).on('mouseup.add_link', (function(d) {
                /* add link and update, but only if a link is actually added
                */      if (graph.add_link(new_link_source, d) != null) return update();
            }));
        };


    }

    /**
     * Redraw the underlay network topology.
     * @param {Array<object>} nodes parsed from AAI logicalLinks.
     * @param {Array<object>} lines parsed from AAI logicalLinks.
     */
    drawTopo(nodes: Array<object>, lines: Array<object>){
        let margin = {top: 20, right: 120, bottom: 20, left: 120},
            width = 1000 - margin.right - margin.left,
            height = 350 - margin.top - margin.bottom;

        let thisNg = this;

        let nodeById = d3.map();

        nodes.forEach(function(node) {
            nodeById.set(node["id"], node);
        });

        lines.forEach(function(link) {
            link["source"] = nodeById.get(link["source"]);
            link["target"] = nodeById.get(link["target"]);
        });

        let svg = d3.select("div#tpContainer").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .style("pointer-events", "all");

        let graph = svg.append("g").attr("class", "graph");

        let force = d3.layout.force()
            .nodes(nodes)
            .links(lines)
            .size([width, height])
            /*            .linkStrength(function(d){
                            switch(d.type){
                                case 1:
                                    return 0.15;
                                case 2:
                                default:
                                    return 0.1;
                            }
                        })*/
            //.gravity(0)
            //.gravity(0)
            .linkDistance(function (d) {
                        return 150;
            })
            .charge(function(d) {
                return -600;
            })
            .start();

        let drag = force.drag()
            .on("dragstart", dragstart)
            .on("dragend", dragend);

        let _g_lines = graph.selectAll("line.line")
                .data(lines)
                .enter()
                .append("g")
                .attr("class", "line");

        let  _g_nodes = graph.selectAll("g.node")
                .data(nodes)
                .enter()
                .append("g")
                .attr("class", "node")
                .call(drag);
        _g_lines.append("line")
            .style('stroke', function (d) {
                if(d.type === 2){
                    return "#000000";
                } else {
                    return '#93c62d';
                }

            })
            .style("stroke-width", 4);


        _g_nodes.append("image")
            .attr("width", function (d) {
                switch (d.group) {
                    case 'pnf':
                        return 70;
                    case 'tp':
                    default:
                        return 10;
                }
            })
            .attr("height", function (d) {
                switch (d.group) {
                    case 'pnf':
                        return 70;
                    case 'tp':
                    default:
                        return 10;
                }
            })
            .attr("xlink:href", function (d) {
                return thisNg.imgMap[d.group];
            });

        _g_nodes.append("text")
            .text(function (d) {
                return d.id.substr( d.id.lastIndexOf('-')+1);
            })
            .style('font-size', '12')
            .style('fill', '#333');

        //_g_nodes.each(function (d, i) {
            var selection = d3.select(this);
/*            if (d.status == '0') {
                selection.append("g").attr("class", "error-tip")
                    .append("image").attr("xlink:href", function (d) {
                    return imgMap['error-tip'];
                });
            }*/
       // });

        _g_lines.each(function (d, i) {
            var _this = d3.select(this);
            if (d.type === 1) {
                _this.append("text")
                    .text("100GB")
                    .style('fill', 'rgb(255,198,22)')
                    .style('font-size', '11');

                _this.append("rect")
                    .attr("fill", function (d) {
                        return '#555';
                    })
                    .attr("width", function (d) {
                        return 4;
                    })
                    .attr("height", function (d) {
                        return 4;
                    })
                    .append("animate");

                _this.select("rect").append("animate");
            } else {
                _this.append("image")
                    .attr("xlink:href", function () {
                        return thisNg.imgMap['link-cut'];
                    });
            }
        });


        force.on("tick", function (e) {

            _g_lines.select("line").attr("x1", function (d) {
                return d.source.x;
            })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });
            _g_lines.select("image").attr("x", function (d) {
                var x1 = d.source.x,
                    x2 = d.target.x,
                    x = x1 - (x1 - x2) / 2;
                return x - 8;
            })
                .attr("y", function (d) {
                    var y1 = d.source.y,
                        y2 = d.target.y,
                        y = y1 - (y1 - y2) / 2;
                    return y - 15;
                });

            _g_lines.select("text")
                .attr('x', function (d) {
                    var x1 = d.source.x,
                        x2 = d.target.x,
                        halfX = x1 - (x1 - x2) / 2,
                        x3 = x1 - (x1 - halfX) / 2;
                    return x3;
                })
                .attr('y', function (d) {
                    var y1 = d.source.y,
                        y2 = d.target.y,
                        halfY = y1 - (y1 - y2) / 2,
                        y3 = y1 - (y1 - halfY) / 2;
                    y3 = y3 - 5;
                    return y3;
                })
                .attr("transform", function (d) {
                    var x1 = d.source.x,
                        x2 = d.target.x,
                        y1 = d.source.y,
                        y2 = d.target.y,
                        x = x1 - (x1 - x2) / 2,
                        y = y1 - (y1 - y2) / 2,
                        rightAngleSide1 = Math.abs(y2 - y1),
                        rightAngleSide2 = Math.abs(x2 - x1),
                        _asin = 0,
                        _rotateAngle = 0,
                        x3 = x1 - (x1 - x) / 2,
                        y3 = y1 - (y1 - y) / 2;

                    if (x1 < x2) {
                        _asin = (y2 - y1) / Math.sqrt(Math.pow(rightAngleSide1, 2) + Math.pow(
                            rightAngleSide2, 2));
                        _rotateAngle = Math.asin(_asin) * 180 / Math.PI;
                    } else {
                        _asin = (y1 - y2) / Math.sqrt(Math.pow(rightAngleSide1, 2) + Math.pow(
                            rightAngleSide2, 2));
                        _rotateAngle = Math.asin(_asin) * 180 / Math.PI;
                        _rotateAngle = _rotateAngle < 0 ? (180 + _rotateAngle) : -(180 -
                            _rotateAngle);
                    }
                    return 'rotate(' + (_rotateAngle) + ',' + x3 + ' ' + y3 + ')';
                });

            _g_lines.select("rect")
                .attr('x', function (d) {
                    return d.source.x - 1;
                })
                .attr('y', function (d) {
                    return d.source.y - 1;
                })
                .selectAll('animate').each(function (d, i) {
                if (i == 0) {
                    d3.select(this)
                        .attr("attributeName", function (d) {
                            return 'x';
                        })
                        .attr("from", function (d) {
                            return d.source.x - 1;
                        })
                        .attr("to", function (d) {
                            return d.target.x;
                        });
                } else {
                    d3.select(this)
                        .attr("attributeName", function (d) {
                            return 'y';
                        })
                        .attr("from", function (d) {
                            return d.source.y - 1;
                        })
                        .attr("to", function (d) {
                            return d.target.y;
                        });
                }

                d3.select(this).attr("attributeType", "XML")
                    .attr("dur", function (d) {
                        return '1.5s';
                    })
                    .attr("repeatCount", "indefinite");

            })
/*            let k = 6 * e.alpha;
            nodes.forEach(function(o, i) {
                if (o["layer"] === "Otn"){
                    o["y"] +=  k
                    //o["x"] += i & 2 ? k : -k;

                } else if (o["layer"] === "Eth") {
                    o["y"] +=  -k;
                    //o["x"] += i & 2 ? k : -k;
                }
            });*/

            _g_nodes.attr("transform", function (d) {
                if(d.group === 'pnf') {
                    var image = d3.select(this).select("image")[0][0],
                        halfWidth = parseFloat("70") / 2,
                        halfHeight = parseFloat("70") / 2;

                    return 'translate(' + (d.x - halfWidth) + ',' + (d.y - halfHeight) + ')';
                } else {
                    return 'translate(' + (d.x) + ',' + (d.y) + ')';
                }

            });

            _g_nodes.select("text").attr('dy', function (d) {
                var image = this.previousSibling,
                    height = parseFloat("10"),
                    fontSize = parseFloat(this.style.fontSize);

                return height + 1.5 * fontSize;
            });

            _g_nodes.select(".error-tip").attr("transform", function (d) {

                var image = this.parentNode.firstChild,
                    width = parseFloat("70");

                return 'translate(' + 0.8 * width + ',0)';

            });

        });


        function dblclick(d) {
            d3.select(this).classed("fixed", d.fixed = false);
        }

        function dragstart(d) {
            d3.select(this).classed("fixed", d.fixed = true);
            thisNg.eventDispatcher.dispatch(new AppEvent(AppEventType.UserNodeDrag, d));
        }
        function dragend(d) {

        }

        function color (d){
            const scale = d3.scaleOrdinal(d3.schemeCategory10);
            switch(d.group){
                case "pnf":
                    return  scale(1);
                case "tp":
                    return  scale(2);
                default:
                    return  scale(9);
            }
        }
    }

    choseConnectivity(item) {
        if (this.connectivitySelected !== item) this.connectivitySelected = item;
           this.drawService(this.getSvcTree());
    }

    getSvcTree(): Array<object> {
            let tree = []
            let rel = this.connectivitySelected["relationship-list"]["relationship"] || null;
            if (rel){
                   tree = rel.filter(rl => rl["related-to"] === "uni")
                        .map(obj => {
                               let rObj ={};
                               rObj["id"] = obj["relationship-data"][0]["relationship-value"],
                               rObj["type"] = "leaf";
                               return rObj;
                        })
            }
            return tree;
    }

    getNodes(ptMapping: Array<object>) : Array<object>{
        let nodes = [];
        for (let pnf of ptMapping){
            if (pnf["layer"] === 2){
                continue;
            }
            let name = pnf["pnfName"];
            let newNode = {
                "id" : name,
                "group": "pnf",
                "radius" : 2,
                "layer" : pnf["layer"] === 2? "Eth" : "Otn"
            }
            nodes.push(newNode);
        }
        return nodes;
    }

    getLinks(logicalLinks: Array<object>, ptMapping: Array<object>) : Array<object> {
        let links = [];
        for (let ll of logicalLinks){
            let lkName:string = ll["link-name"];
            let topoIdIdx:number = lkName.lastIndexOf("topologyId-");
            if (topoIdIdx !== -1 && lkName.charAt(topoIdIdx + 11) === '2'){
                //Ignore
                continue;
            } else if (typeof ll["relationship-list"] === 'undefined' ||
                           typeof ll["relationship-list"]["relationship"] === 'undefined'){
                continue;
            }
            //pnf to pnf
            let endpoints = [];
            for (let pi of ll["relationship-list"]["relationship"]) {
                if (pi["related-to"] === "p-interface"){
                    for (let rd of pi["relationship-data"]){
                        if (rd["relationship-key"] === "pnf.pnf-name"){
                            endpoints.push(rd["relationship-value"]);
                        }
                    }
                }
            }
            if (endpoints.length === 2){
                let newlk = {
                    "source": endpoints[0],
                    "target": endpoints[1],
                    "type" : 1
                }
                links.push(newlk);
            }
        }
        return links;
    }

    getPnfTpMapping(logicalLinks: Array<object>) {
        let pnfs = [];
        let pnfVisited = {};
        let pnfIndex: number = 0;
        for (let ll of logicalLinks){
            let lkName:string = ll["link-name"];
            let topoIdIdx:number = lkName.lastIndexOf("topologyId-");
            if (topoIdIdx !== -1 && lkName.charAt(topoIdIdx + 11) === '2'){
                //Ethernet layer logical-link
                let lastDashIdx:number = lkName.lastIndexOf("-");
                let pnfName: string = lkName.replace("linkId", "nodeId").substr(0, lastDashIdx);
                let uniName: string = lkName.substr( lastDashIdx+1);

                if (pnfVisited[pnfName]){
                    let idx: number = parseInt(pnfVisited[pnfName].substr(1));
                    pnfs[idx].tps[uniName] = true;
                } else {
                    pnfVisited[pnfName] = '#' + pnfIndex;
                    let newPnf = {
                        "pnfName" : pnfName,
                        "tps" : {
                        },
                        "layer" :2
                    }
                    newPnf.tps[uniName] = true;
                    pnfs.push(newPnf);
                    pnfIndex++;

                }
                continue;
            } else if (ll["relationship-list"] === undefined ||
                    ll["relationship-list"]["relationship"].length === 0 ){
                continue;
            }
            for (let pi of ll["relationship-list"]["relationship"]) {
                if (pi["related-to"] === "p-interface"){
                    let pnfName:string;
                    let tpName:string;
                    for (let rd of pi["relationship-data"]){
                        if (rd["relationship-key"] === "pnf.pnf-name"){
                            pnfName = rd["relationship-value"];
                        } else if (rd["relationship-key"] === "p-interface.interface-name"){
                            tpName = rd["relationship-value"];
                        }
                    }
                    if (pnfVisited[pnfName]){
                        let idx: number = parseInt(pnfVisited[pnfName].substr(1));
                        pnfs[idx].tps[tpName] = true;
                    } else {
                        pnfVisited[pnfName] = '#' + pnfIndex;
                        let newPnf = {
                            "pnfName" : pnfName,
                            "tps" : {
                            },
                            "layer" : 1
                        }
                        newPnf.tps[tpName] = true;
                        pnfs.push(newPnf);
                        pnfIndex++;

                    }
                }
            }
        }
        return pnfs;
    }
}
