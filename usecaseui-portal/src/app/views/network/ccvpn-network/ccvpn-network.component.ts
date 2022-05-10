/*
    Copyright (C) 2019 CMCC, Inc. and others. All rights reserved.
    Copyright (C) 2022 Huawei Canada Limited. All rights reserved.

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
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3'
import * as $ from 'jquery';
import {networkHttpservice} from '../../../core/services/networkHttpservice.service';

// Customizable colors for edge, domain, node and font
const DOMAIN_COLOR = 'lightcyan'
const NODE_COLOR = 'DeepSkyBlue'
const CE_COLOR = 'Gray'
const FONT_COLOR = 'Navy'
const TITLE_COLOR = '#0da9e2' //'linear-gradient(90deg, #07a9e1 0%, #30d9c4 100%)'
const DEFAULT_COLOR= '#000000'
// Customizable colors for endpoint CRUD status
const EP_COLOR_MAP = new Map([
    ['create', 'RoyalBlue'],
    ['retrieve', 'ForestGreen'],
    ['update', 'orange'],
    ['delete', 'red'],
])

enum NodePosition {
  L2_NODE_POS = 'l2_node_pos',
}

declare var mxGraph: any;
declare var mxCell: any;
declare var mxHierarchicalLayout: any;
declare var mxRubberband: any;
declare var mxKeyHandler: any;
declare var mxConstants: any;
declare var mxCellRenderer: any;
declare var mxVertexHandler: any;
declare var mxGraphHandler: any;
declare var mxGraphSelectionModel: any;
declare var mxFastOrganicLayout: any;
declare var mxStackLayout: any;
declare var mxParallelEdgeLayout: any;
declare var mxPerimeter: any;
declare var mxEdgeStyle: any;
declare var mxAbstractCanvas2D: any;

@Component({
    selector: 'app-ccvpn-network',
    templateUrl: './ccvpn-network.component.html',
    styleUrls: ['./ccvpn-network.component.css']
})
export class CcvpnNetworkComponent implements OnInit {

    @ViewChild('tpContainer') graphContainer: ElementRef;
    @ViewChild('tableContainer') tableContainer: ElementRef;

    constructor(private myhttp: networkHttpservice) {}

    ngOnInit() {
    }

    reqNumber = 0
    controllers = []
    onap = {}
    domainMap = new Map<any, any>()
    enniMap = new Map()
    sliceMap = new Map()
    tunnelsMap = new Map()
    e2eTunnels = []
    e2eTunnelMap = new Map()
    servicesMap = new Map()
    e2eServices = []
    e2eServiceMap = new Map()
    defBandwidth = 1
    currentLayer = 1
    currentCloud = ''
    currentSlice = 'Physical'
    isNodeName = true
    isMoreLabels = true
    storage = window.localStorage

    graph = null;
    gLayers = [];
    graphScale = 1;
    tunnelTable = null;
    serviceTable = null;
    edgeLayout = null;
    organicLayout = null;
    stackLayout = null;

    // Constants
    readonly DOMAIN_STYLE = 'fillColor=' + DOMAIN_COLOR + ';shape=rectangle;strokeColor=none;gradientColor=none;' +
            'verticalLabelPosition=top;verticalAlign=bottom;autosize=1;resizable=1;rounded=1;opacity=50;fontStyle=1';
    readonly CPE_STYLE = 'fillColor=' + CE_COLOR + ';shape=rectangle;rounded=1';
    readonly CLOUD_STYLE = 'fillColor=' + CE_COLOR + ';shape=cloud';
    readonly LINK_STYLE = 'strokeWidth=3;edgeStyle=null'
    readonly UNI_LINK_STYLE = 'strokeWidth=2;edgeStyle=null;strokeColor=' + CE_COLOR
    readonly TUNNEL_STYLE = 'strokeWidth=2;curved=1'
    readonly SERVICE_STYLE = 'strokeWidth=1;curved=1'

    ngAfterViewInit() {
        let thisNg = this;
        this.graph = new mxGraph(this.graphContainer.nativeElement);
        this.graph.setPanning(true)
        this.graph.setTooltips(true)
        this.graph.setHtmlLabels(true)
        this.graph.cellsDisconnectable = false
        this.graph.cellsEditable = false
        this.graph.cellsCloneable = false
        this.graph.foldingEnabled = false
        this.graph.edgeLabelsMovable = false
        this.graph.autoExtend = false
        this.graph.gridEnabled = false
        this.graph.model.maintainEdgeParent = false;
        this.graphScale = 1;

        new mxRubberband(this.graph);
        new mxKeyHandler(this.graph);
        //mxLog.show = () => { }
        mxConstants.VERTEX_SELECTION_STROKEWIDTH = 1
        mxConstants.EDGE_SELECTION_STROKEWIDTH = 5
        // mxConstants.EDGE_SELECTION_DASHED = false
        mxConstants.LOCKED_HANDLE_FILLCOLOR = 'none'
        mxConstants.HANDLE_STROKECOLOR = 'none'
        mxConstants.INVALID_COLOR = '#000000'
        // Keeps the font sizes independent of the scale
        mxCellRenderer.prototype.getTextScale = function (state) {
            return 1
        }
        mxVertexHandler.prototype.constrainGroupByChildren = true
        mxGraphHandler.prototype.maxLivePreview = 16
        mxGraphHandler.prototype.removeCellsFromParent = false
        mxGraphHandler.prototype.isPropagateSelectionCell =
            function (cell, immediate, me) {
                return false
            }
        const CELL_ADDED = mxGraphSelectionModel.prototype.cellAdded
        mxGraphSelectionModel.prototype.cellAdded = function (cell) {
            CELL_ADDED.call(this, cell)
            if (cell.isEdge()) this.addCells([cell.source, cell.target])
        }
        const CELL_REMOVED = mxGraphSelectionModel.prototype.cellRemoved
        mxGraphSelectionModel.prototype.cellRemoved = function (cell) {
            CELL_REMOVED.call(this, cell)
            if (cell.isVertex()) {
                this.removeCells(cell.edges)
            }
        }

        // Creates a layout algorithm to be used with the graph
        this.organicLayout = new mxFastOrganicLayout(this.graph);
        // Moves stuff wider apart than usual 50
        this.organicLayout.forceConstant = 80;
        this.stackLayout = new mxStackLayout(this.graph)
        this.edgeLayout = new mxParallelEdgeLayout(this.graph)
        this.edgeLayout.spacing = 15

        // Sets default vertex style
        this.setObjValues(this.graph.stylesheet.getDefaultVertexStyle(), {
            STYLE_SHAPE: mxConstants.SHAPE_ELLIPSE,
            STYLE_PERIMETER: mxPerimeter.EllipsePerimeter,
            STYLE_FILLCOLOR: NODE_COLOR,
            STYLE_GRADIENTCOLOR: 'white',
            STYLE_STROKECOLOR: '#1B78C8',
            STYLE_FONTCOLOR: FONT_COLOR,
            STYLE_FONTSIZE: '14',
            STYLE_VERTICAL_LABEL_POSITION: 'bottom',
            STYLE_VERTICAL_ALIGN: 'top',
            STYLE_RESIZABLE: '0',
        }, mxConstants)

        // Sets default edge style
        this.setObjValues(this.graph.stylesheet.getDefaultEdgeStyle(), {
            STYLE_FONTCOLOR: 'black',
            STYLE_FONTSIZE: '14',
            STYLE_STROKECOLOR: 'black',
            STYLE_EDGE: mxEdgeStyle.TopToBottom,
            STYLE_ENDARROW: 'none',
            STYLE_LABEL_BACKGROUNDCOLOR: 'white',
            STYLE_TEXT_OPACITY: '70',
        }, mxConstants)

        // Gets label from custom user object
        // TODO:
        this.graph.convertValueToString = function (cell) {
            if (cell.isEdge() && !cell.value.uni && !thisNg.isMoreLabels) return '';
            return (cell.value && cell.value.label) ? cell.value.label : '';
        }

        // Installs a custom tooltip for cells
        this.graph.getTooltipForCell = function (cell) {
            let tooltip = ''
            for (let key of Object.keys(cell.value).sort()) {
                if (key === 'label' || cell.value[key] === '' || key[0] == '$' ||
                    !thisNg.isBasicType(cell.value[key])) continue
                tooltip += '<b>' + key + ': </b>' + cell.value[key] + '\n'
            }
            return tooltip
        }

        // Installs a popupmenu handler.
        this.graph.popupMenuHandler.factoryMethod = this.createPopupMenu
        document.body.onmousedown = function () {
            let popupMenu = document.body.getElementsByClassName('mxPopupMenu')
            if (popupMenu.length) document.body.removeChild(popupMenu[0])
        }

//        var dragStatus = 0
        // Listen to the Mouseup event to update table and json data view
//         this.graph.addMouseListener({
//             mouseDown: function (sender, evt) {
//                 dragStatus = 1
//             },
//             mouseMove: function (sender, evt) {
//                 if (dragStatus == 1) dragStatus = 2
//             },
//             mouseUp: function (sender, evt) {
//                 if (dragStatus == 2) {
//                     if (sender.getSelectionCount() >= 1) {
//                         this.clientNodeLabelLayout()
//                     }
//                 }
//                 dragStatus = 0
//
//                 this.deselectTableRow()
//                 let cell = null
//                 if (!evt.evt.defaultPrevented) {
//                     if (!evt.state) return
//                     else cell = evt.state.cell
//                 } else {
//                     if (sender.getSelectionCount() == 1) {
//                         cell = sender.getSelectionCell()
//                     } else if (sender.getSelectionCount() == 3) {
//                         for (let item of sender.getSelectionCells()) {
//                             if (item.isEdge()) {
//                                 if (!cell) cell = item
//                                 else {
//                                     cell = null;
//                                     break
//                                 }
//                             }
//                         }
//                     }
//                 }
//                 if (!cell || !cell.value) {
//                     return
//                 }
//                 let obj = null
//                 if (obj = cell.value.controller) {
//                     this.showJsonData([obj], false)
//                 } else if (obj = cell.value.node) {
//                     this.showJsonData(obj.uniSliceMap.get(this.currentSlice), false)
//                 } else if (obj = cell.value.enni) {
//                     this.showJsonData([obj.data[0].link.data, obj.data[1].link.data], false)
//                 } else if (obj = cell.value.inni) {
//                     this.showJsonData([obj.data[0].data, obj.data[1].data], false)
//                 } else if (obj = cell.value.uni) {
//                     this.showJsonData(obj.data, false)
//                 } else if (obj = cell.value.tunnel) {
//                     this.selectTableRow(cell.value.index)
//                     this.showJsonData(this.tunnelsMap.get(obj.name), false)
//                 } else if (obj = cell.value.service) {
//                     this.selectTableRow(cell.value.index)
//                     this.showJsonData(this.servicesMap.get(obj.name), false)
//                 }
//             }
//         })

        this.isSpinning = true;
        let reqCount = 0;

        reqCount++;
        this.myhttp.getLogicalLinksData()
            .subscribe((data) => {
                    if (data && !data["status"]) {
                        for (let ll of data["logical-link"]) {
                            thisNg.logicalLinks.push(ll);
                        }
                    }
                    if (--reqCount == 0) {
                        thisNg.finishNetworkView();
                        this.isSpinning = false;
                    }
                },
                (err) => {
                    console.log(err);
            })

        reqCount++;
        this.myhttp.getPnfsData()
            .subscribe((data) => {
                    if (data && !data["status"]) {
                        for (let ll of data["pnf"]) {
                            thisNg.pnfs.push(ll);
                        }
                    }
                    if (--reqCount == 0) {
                        thisNg.finishNetworkView();
                        this.isSpinning = false;
                    }
                },
                (err) => {
                    console.log(err);
            })

        reqCount++;
        this.myhttp.getVpnBindingsData()
            .subscribe((data) => {
                    if (data && !data["status"]) {
                        for (let ll of data["vpn-binding"]) {
                            thisNg.vpnBindings.push(ll);
                        }
                    }
                    if (--reqCount == 0) {
                        thisNg.finishNetworkView();
                        this.isSpinning = false;
                    }
                },
                (err) => {
                    console.log(err);
            })

        reqCount++;
        this.myhttp.getConnectivities()
            .subscribe((data) => {
                    if (data && !data["status"]) {
                        for (let ll of data["connectivity"]) {
                            thisNg.connectivities.push(ll);
                        }
                    }
                    if (--reqCount == 0) {
                        thisNg.finishNetworkView();
                        this.isSpinning = false;
                    }
                },
                (err) => {
                    console.log(err);
            })

        reqCount++;
        this.myhttp.getNetworkRoutes()
            .subscribe((data) => {
                    if (data && !data["status"]) {
                        for (let ll of data["network-route"]) {
                            thisNg.networkroutes.push(ll);
                        }
                    }
                    if (--reqCount == 0) {
                        thisNg.finishNetworkView();
                        this.isSpinning = false;
                    }
                },
                (err) => {
                    console.log(err);
            })
       reqCount++;
        this.myhttp.getUnisData()
            .subscribe((data) => {
                    if (data && !data["status"]) {
                        for (let ll of data["uni"]) {
                            thisNg.unis.push(ll);
                        }
                    }
                    if (--reqCount == 0) {
                        thisNg.finishNetworkView();
                        this.isSpinning = false;
                    }
                },
                (err) => {
                    console.log(err);
            })
    }

    connectivityList = [];
    connectivitySelected = {name: null, id: null};
    serviceGraphModel: { [k: string]: any } = {};

    layerList = [
                { value: 3, name: 'Service layer' },
                { value: 2, name: 'Tunnel layer' },
                { value: 1, name: 'Link layer' }]
    layerSelected = { value: 1, name: 'Link layer' }
    serviceList = [];
    serviceSelected = '';


    addLinkDisabled = true;
    nonetwork = false;
    isVisible = false;
    outCloudShow = false;
    inputshow = false;
    delBoxisVisible = false;
    isSpinning = true;

    pnfs = [];
    unis = [];
    logicalLinks = [];//logicalLinks Existing connection data returned by the interface
    connectivities = [];
    vpnBindings = [];
    networkroutes = [];

    layer1Tps = [];

    d3Data = [];//D3Render the required data

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

    svcContainerOpt = {
        containerId: "svcContainer",
        width: 1000,
        height: this.winHeight
    };

    tpoption = {
        container: '#tpContainer',
        data: '',
        width: 1000,
        height: this.winHeight
    };

    finishNetworkView() {
        if (!this.logicalLinks.length) return;
        if (!this.pnfs.length) return;
        this.updateTopoData();
        console.log("Domain Map: ", this.domainMap);
        this.finishSotnView();
    }

    updateTopoData(){
        let thisNg = this;
        // Update the network topo data
        // Update node data
        for (let pnf of thisNg.pnfs){
            let pnfId = pnf["pnf-id"];
            let arr = pnfId.split('.');
            let domainId = arr[1];
            let domain = thisNg.domainMap.get(domainId);
            if (!domain){
              let sotnDomain = {
                  domainId : domainId,
                  nodeMap: new Map<any, any>(),
                  localLinkMap: new Map<any, any>(),
                  inniMap: new Map<any, any>(),
                  uniMap: new Map<any, any>(),
                  clientNodeMap: new Map<any, any>()
              }
              thisNg.domainMap.set(domainId, sotnDomain);
              domain = sotnDomain;
            }
            let node = {
                id: pnfId,
                name: pnfId
            }
            domain.nodeMap.set(pnfId, node);
        }

        // Update serive data
        for (let cn of this.connectivities){
            if (cn['vpn-type'] === "mdsc"){
                //let svcInstId = this.getValueFromRelationList(cn, "service-instance", "service-instance.service-instance-id")
                //                    .pop();
                let svcInstName = cn["etht-svc-name"];
                let svcInstId = svcInstName;
                let bw = cn["bandwidth-profile-name"];
                let cvlan = cn["cvlan"];
                let svc = this.servicesMap.get(svcInstId);
                if (!svc){
                     svc = {
                         name: svcInstName,
                         id: svcInstId,
                         connections: [],
                         bw : bw,
                         vlan : cvlan,
                         unis : [],
                         otnEdges: []
                     }
                     this.servicesMap.set(svcInstId, svc);
                }
                if (!this.serviceSelected){
                    this.serviceSelected = svcInstId;
                }
            }
        }
        // Update link data
        for (let ll of thisNg.logicalLinks) {
            let linkName = ll["link-name"];
            let linkType = ll["link-type"];
            let linkRole = ll["link-role"];
            let linkId = ll["link-id"];

            if (linkName.search("topologyId-2") >= 0) {
            // uni links
                let arr = linkId.split('-');
                let arr1 = arr[0].split('.');
                let domainId = arr1[1];
                let domain = thisNg.domainMap.get(domainId);
                let remoteNode = domain.nodeMap.get(arr[0]);
                if (!remoteNode) continue;
                let cpeNode = {
                    networkNode: remoteNode,
                    isCloud: arr[1].length <= 3 ? true: false
                }

                if (!domain) continue;
                domain.clientNodeMap.set(linkId, cpeNode);
                let uni = {
                    srcNodeId: arr[0],
                    srcUniTp: arr[1],
                    dstNode: cpeNode
                }
                domain.uniMap.set(linkId, uni)
            } else if (linkRole && linkRole.search("cross-domain") >= 0){
            // enni link
                let localLink: Array<any> = new Array();
                let domainLocal:any = null;
                let linkId = this.getJsonValue(ll, 'link-id');
                let rlArr: Array<any> = this.getJsonValue(ll, 'relationship-list.relationship');
                for (let rl of rlArr){

                    if (rl['related-to'] === "p-interface"){
                        let pnfNameS: String;
                        let tpNameS: String;
                        for (let rld of rl['relationship-data']){
                            if (rld['relationship-key'] === 'p-interface.interface-name'){
                                 let tpNameL = rld['relationship-value'];
                                 let tpNameArr = tpNameL.split('-')
                                 tpNameS = tpNameArr[tpNameArr.length - 1];
                                 pnfNameS = tpNameArr[tpNameArr.length - 3];
                                 if (!domainLocal){
                                     let arr = pnfNameS.split('.');
                                     let domainId = arr[1];
                                     domainLocal = thisNg.domainMap.get(domainId);
                                 }
                            }
                        }
                        let end = {
                             pnfId : pnfNameS,
                             tpId: tpNameS
                        }
                        localLink.push(end);
                    }
                }
                this.enniMap.set(linkId, {data: localLink});
            } else if (linkType.search("Tsci") >= 0) {
            } else {
            // local link
                let localLink: Array<any> = new Array();
                let domainLocal:any = null;
                let linkId = this.getJsonValue(ll, 'link-id');
                let rlArr: Array<any> = this.getJsonValue(ll, 'relationship-list.relationship');
                for (let rl of rlArr){

                    if (rl['related-to'] === "p-interface"){
                        let pnfNameS: String;
                        let tpNameS: String;
                        for (let rld of rl['relationship-data']){
                           if (rld['relationship-key'] === 'p-interface.interface-name'){
                               let tpNameL = rld['relationship-value'];
                               let tpNameArr = tpNameL.split('-')
                               tpNameS = tpNameArr[tpNameArr.length - 1];
                               pnfNameS = tpNameArr[tpNameArr.length - 3];
                               if (!domainLocal){
                                    let arr = pnfNameS.split('.');
                                    let domainId = arr[1];
                                    domainLocal = thisNg.domainMap.get(domainId);
                               }
                           }
                        }
                        let end = {
                             pnfId : pnfNameS,
                             tpId: tpNameS
                        }
                        localLink.push(end);
                    }
                }
                localLink.sort(function(a, b){
                return (a.pnfId + '-' + a.tpId).localeCompare(b.pnfId + '-' + b.tpId)});
                if (!domainLocal) continue;
                let srcNodeId = localLink[0].pnfId;
                let srcTpId = localLink[0].tpId;
                let srcNode = domainLocal.nodeMap.get(srcNodeId);
                let dstNodeId = localLink[1].pnfId;
                let dstTpId = localLink[1].tpId;
                let dstNode = domainLocal.nodeMap.get(dstNodeId);
                let inni = domainLocal.inniMap.get(srcNodeId + '-' + srcTpId);
                if (!inni){
                    let inni = {
                        data: [linkId, null],
                        srcNode: srcNode,
                        srcTpId: srcTpId,
                        dstNode: dstNode,
                        dstTpId: dstTpId,
                        id: srcNodeId + '-' + srcTpId
                    }
                    domainLocal.inniMap.set(srcNodeId + '-' + srcTpId, inni);
                } else {
                    inni.data[1] = linkId;
                }
            }
        }
        let tunnels = [];
        for (let ll of thisNg.vpnBindings) {
            let svcInstId = this.getValueFromRelationList(ll, "connectivity", "property", "connectivity.etht-svc-name")
               .pop()
            let svc = this.servicesMap.get(svcInstId);
            let srcNodeId = ll["src-access-node-id"];
            let dstNodeId = ll["dst-access-node-id"];
            let domainId = srcNodeId.split(".")[1];
            let domain = thisNg.domainMap.get(domainId);
            if (!svc || !domain){
                continue;
            }
            let tunnelSeg = {
                id: ll["vpn-id"],
                tunnelId: ll["vpn-name"],
                srcNodeId: srcNodeId,
                dstNodeId: dstNodeId
            }
            let exist = false;
            for (let tl of svc.connections){
                if (tl["id"] === ll["vpn-name"]){
                    tl.segs.push(tunnelSeg)
                    exist = true;
                }
            }
            if (!exist){
                let conn = {
                    srcId: "",
                    dstId: "",
                    id: ll["vpn-name"],
                    segs: [tunnelSeg]
                }
                svc.connections.push(conn);
            }
        }
        for(let [id, svc] of thisNg.servicesMap){
            for (let con of svc.connections){
                con.segs.sort(function(a, b){
                    return a.srcNodeId.split(".")[1] - b.dstNodeId.split(".")[1];
                });
                con.srcId = con.segs[0].srcNodeId;
                con.dstId = con.segs[con.segs.length-1].dstNodeId;
            }
        }
        for (let ll of thisNg.unis){
            let ltpIdArr = ll["id"].split('-');
            ltpIdArr.pop();
            let ltpId = ltpIdArr.join("-");
            let svcInstId = this.getValueFromRelationList(ll, "connectivity", "property", "connectivity.etht-svc-name")
                                           .pop()
            let svc = this.servicesMap.get(svcInstId);
            if (!svc) continue;
            let bw = ll["data-source"];
            let uni = {
                id: ltpId,
                bw: bw
            }
            svc.unis.push(uni);
        }
        // Hack: deson't work for more then 2 domain system
        for (let ll of thisNg.vpnBindings) {
            let svcInstId = this.getValueFromRelationList(ll, "connectivity", "property", "connectivity.etht-svc-name")
                                           .pop();
            let svc = this.servicesMap.get(svcInstId);
            let srcNodeId = ll["src-access-node-id"];
            let dstNodeId = ll["dst-access-node-id"];
            let domainId = srcNodeId.split(".")[1];
            let domain = thisNg.domainMap.get(domainId);
            if (!svc || !domain){
                 continue;
            }
            for (let [, inni] of domain.inniMap){
                if (srcNodeId === inni.srcNode.id){
                    if (dstNodeId === inni.dstNode.id){
                         svc.otnEdges.push(inni);
                    }
                }
                if (dstNodeId === inni.srcNode.id){
                    if (srcNodeId === inni.dstNode.id){
                         svc.otnEdges.push(inni);
                    }
                }
            }
            // For enni link
            if (!ll["src-access-ltp-id"]){
                 for (let [key, enni] of this.enniMap) {
                    if (dstNodeId === key.split("-")[0]){
                        svc.otnEdges.push(enni);
                    };
                 }
            }
            svc.otnEdges = Array.from(new Set(svc.otnEdges));
        }
    }

    // main function that draws the topology view
    finishSotnView() {
        this.graph.model.clear()
        this.graph.model.beginUpdate()
        this.gLayers = [this.graph.getDefaultParent()]
        for (let i = 0; i < 3; i++) {
            this.gLayers.push(this.graph.model.root.insert(new mxCell()))
        }

        // Insert domains
        for (let [networkId, domain] of this.domainMap) {
            domain.vertex = this.graph.insertVertex(this.gLayers[0], null, null, 0, 0, 0, 0, this.DOMAIN_STYLE)
            domain.vertex.connectable = false
            domain.vertex.value = {
                label: '(DOMAIN: ' + domain.domainId + ')',
                networkId: networkId
            }
            // Insert nodes
            for (let [nodeId, node] of domain.nodeMap) {
                node.vertex = this.graph.insertVertex(domain.vertex, null, null, 0, 0, 26, 26)
                node.vertex.value = {
                    nodeId: nodeId, name: node.name, label: node.name, node: node
                }
            }
            // Insert INNI links
            for (let [key, inni] of domain.inniMap) {
                inni.edge = this.graph.insertEdge(this.gLayers[1], null, null,
                    inni.srcNode.vertex, inni.dstNode.vertex, this.LINK_STYLE)
                inni.edge.value = {
                    linkId: key,
                    inni: inni,
                    domain: domain,
                    label: ""
                }
                //inni.srcNniTp.edge = inni.edge
                //inni.dstNniTp.edge = inni.edge
            }

            // Insert client nodes
            for (let [nodeName, clientNode] of domain.clientNodeMap) {
                if (clientNode.isCloud) {
                    clientNode.vertex = this.graph.insertVertex(domain.vertex, null, null, 0, 0, 52, 26, this.CLOUD_STYLE)
                } else {
                    clientNode.vertex = this.graph.insertVertex(domain.vertex, null, null, 0, 0, 26, 13, this.CPE_STYLE)
                }
                let labelName = nodeName.split('-')[1];
                clientNode.vertex.value = {
                    name: nodeName, label: labelName, clientNode: clientNode
                }
            }
            // Insert UNI links
            for (let [key, uni] of domain.uniMap) {
                let srcNode = domain.nodeMap.get(uni.srcNodeId);
                uni.edge = this.graph.insertEdge(domain.vertex, null, null,
                    srcNode.vertex, uni.dstNode.vertex, this.UNI_LINK_STYLE)
                uni.edge.value = {
                    linkId: key, uni: uni, domain: domain,
                    maximum: 1000000 / 1000000 + 'G',
                    unused: 1000000 / 1000000 + 'G'
                }
                //uni.srcUniTp.edge = uni.edge
            }
            // Insert ENNI links
            for (let [key, enni] of this.enniMap) {
                let srcNode = null;
                let dstNode = null;

                for (let [, tmpDomain] of this.domainMap){
                    srcNode = tmpDomain.nodeMap.get(enni.data[0].pnfId);
                    if (srcNode) break;
                }
                for (let [, tmpDomain] of this.domainMap){
                    dstNode = tmpDomain.nodeMap.get(enni.data[1].pnfId);
                    if (dstNode) break;
                }

                enni.edge = this.graph.insertEdge(this.gLayers[1], null, {
                plugId: key, enni: enni }, srcNode.vertex, dstNode.vertex, this.LINK_STYLE)
            //enni.data[0].nniTp.edge = enni.edge
            //enni.data[1].nniTp.edge = enni.edge
            }
        }

            // Insert tunnel edges
        for (let [id, svc] of this.servicesMap){
            for (let conn of svc.connections){
                let srcNodeId = conn.srcId;
                let dstNodeId = conn.dstId;

                let srcNode = getNode(srcNodeId, this.domainMap);
                let dstNode = getNode(dstNodeId, this.domainMap);
                if(!srcNode.vertex || !dstNode.vertex) {
                    continue;
                };
                let e2eTunnel = {
                        name: conn.id,
                        srcNode: srcNode,
                        dstNode: dstNode,
                        e2eEdge: null,
                        serviceId: id,
                        srcVertex: srcNode.vertex,
                        dstVertex: dstNode.vertex
                }
                e2eTunnel.e2eEdge =
                this.graph.insertEdge(this.gLayers[2], null, {
                tunnel: e2eTunnel, tunnelName: e2eTunnel.name
                    }, e2eTunnel.srcNode.vertex, e2eTunnel.dstNode.vertex, this.TUNNEL_STYLE)
                this.e2eTunnels.push(e2eTunnel);

            }
        }



        this.graph.model.endUpdate();
        this.graph.zoomTo(this.graphScale);
        this.autoLayout(1);
        this.changeLayer({ value:1, name: 'Link Layer'});

        if (this.serviceSelected){
            this.chooseService(this.serviceSelected);
        }
        function getNode(nodeId, domainMap){
            let arr = nodeId.split('.');
            return domainMap.get(arr[1]).nodeMap.get(nodeId);
        }

    }

    changeLayer(layer){
       this.layerSelected = layer;
       for (let i = 1; i < this.gLayers.length; i++) {
           this.gLayers[i].setVisible(i == this.layerSelected.value)
       }
       this.graph.refresh()
    }

    chooseService(svcInstId) {

        this.serviceSelected = svcInstId;
        //clear the label and color of all UNI links
        for (let [, domain] of this.domainMap) {
            for (let [, uni] of domain.uniMap) {
                this.graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, CE_COLOR, [uni.edge])
                this.graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, CE_COLOR, [uni.dstNode.vertex])
                this.graph.setCellStyles(mxConstants.STYLE_DASHED, '1', [uni.edge])
                uni.edge.value.label = ''
                uni.edge.value.endpoints = null
            }
        }

        // Update the label and color of UNI links of current service
        let service = this.servicesMap.get(this.serviceSelected);
        console.log("Choosing service: ", service);
        if (service){
           for (let uniRecord of service.unis){
               let srcUniLinkId = getShortName(uniRecord.id);
               let bw = uniRecord.bw;
               let arr = srcUniLinkId.split('.');
               let uni = this.domainMap.get(arr[1]).uniMap.get(srcUniLinkId);
               colorUni(uni, this.graph, bw);
           }
        }

        // Update tunnel edges
        for (let e2eTunnel of this.e2eTunnels) {
            e2eTunnel.e2eEdge.setVisible(e2eTunnel.serviceId === svcInstId)
        }

        // clear the label of all inni links
        for (let [, svc] of this.servicesMap) {
            for (let ed of svc.otnEdges){
                this.graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, DEFAULT_COLOR, [ed.edge])
                ed.edge.value.label = '';
                ed.edge.value.endpoints = null
            }
        }
        // Update the label of inni links of current service
        if (service){
            let bw = service.bw;
            for (let ed of service.otnEdges){
                colorOtnEdge(ed, this.graph, bw);
            }
        }
        this.graph.refresh();

        // Utility func
        function getShortName(ltpId){
            let arr = ltpId.split('-');
            let nodeId = arr[arr.length-3];
            let ltp = arr[arr.length-1];
            return nodeId + '-' + ltp;
        }
        function colorUni(uni, graph, bw){
            let bandwidth = parseInt(bw);
            let newColor = EP_COLOR_MAP.get("update")
            graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, newColor, [uni.edge])
            graph.setCellStyles(mxConstants.STYLE_FONTCOLOR, newColor, [uni.edge])
            graph.setCellStyles(mxConstants.STYLE_DASHED, '0', [uni.edge])
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, newColor, [uni.dstNode.vertex])
            if (!uni.edge.value.endpoints) {
                uni.edge.value.endpoints = [];
            }
            uni.edge.value.endpoints.push(bandwidth);
            let sum = uni.edge.value.endpoints.reduce((a, b) => a + b, 0);
            uni.edge.value.label = sum +  'G' ;
        }
        function colorOtnEdge(ed, graph, bw){
            let bandwidth = parseInt(bw);
            graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, EP_COLOR_MAP.get("update"), [ed.edge]);
            if (!ed.edge.value.endpoints) {
                ed.edge.value.endpoints = [];
            }
            //ed.edge.value.endpoints.push(bandwidth);
            //let sum = ed.edge.value.endpoints.reduce((a, b) => a + b, 0);
            //ed.edge.value.label = sum + 'G';
        }

    }

    getValueFromRelationList(relationshipList, relatedTo, dataOrProperty, relatedKey){
        let rlArr: Array<any> = this.getJsonValue(relationshipList, 'relationship-list.relationship');
        let valList : Array<any> = [];
        for (let rl of rlArr){
            if (rl['related-to'] === relatedTo){
                let containerName = dataOrProperty === "data"? "relationship-data": "related-to-property";
                let keyString = dataOrProperty === "data"? "relationship-key": "property-key";
                let valString = dataOrProperty === "data"? 'relationship-value' : "property-value";

                for (let rld of rl[containerName]){
                   if (rld[keyString] === relatedKey){
                       let val = rld[valString];
                       if (val) valList.push(val);
                   }
                }
            }
        }
        return valList;
    }
    // get the key of an Endpoint
    getEndPointKey(endPoint) {
        return endPoint.networkId + '-' + endPoint.nodeId + '-' + endPoint.portId
    }

    // Get color from slice Id
    getSliceColor(sliceId) {
        // let colorId = sliceMap.get(sliceId)
        // if (!sliceId || colorId >= SLICE_COLORS.length) colorId = 1
        return 'black'
    }

    // Function to create a table from js array data
    createJsonTable(data) {
        let table = document.createElement('table')
        table.className = 'display compact'
        this.tableContainer.nativeElement.appendChild(table)

        if (!data.length) return
        let columns = []
        for (let key of Object.keys(data[0])) {
            if (this.isBasicType(data[0][key]) && key[0] != '$') {
                columns.push({
                    data: key, name: key,
                    title: key.charAt(0).toUpperCase() + key.slice(1),
                    defaultContent: ''
                })
            }
        }
        let dataTable = $(table).DataTable({
            autoWidth: false,
            dom: 'ti',
            order: [],
            select: {toggleable: false},
            columnDefs: [{className: 'dt-center', targets: '_all'}],
            columns: columns,
            data: data
        })
        dataTable.on('user-select', function (e, dt, type, cell, originalEvent) {
            if (dt.row('.selected').index() != cell.index().row)
                this.selectTableRow(cell.index().row, true)
            return false
        })

        return dataTable
    }

    // disable mouse for application
    disableAppMouse(disabled) {
        //header.style.pointerEvents = disabled ? 'none' : 'auto'
        //container.style.pointerEvents = disabled ? 'none' : 'auto'
        this.graph.setEnabled(!disabled)
        document.body.style.cursor = disabled ? 'wait' : 'default'
    }

    choseConnectivity(item) {
        if (this.connectivitySelected !== item) this.connectivitySelected = item;
        //this.drawService(this.getSvcTree());
    }

    _debounce(func: Function, delay: number) {
        let inDebounce;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(inDebounce)
            inDebounce = setTimeout(() => func.apply(context, args), delay);
        }
    }

    // Layout the label of client nodes
    clientNodeLabelLayout() {
        for (let [,sotnDomain] of this.domainMap) {
            for (let [, clientNode] of sotnDomain.clientNodeMap) {
                let vertex = clientNode.vertex
                let remote = clientNode.networkNode.vertex
                let isAbove = (vertex.geometry.y + vertex.geometry.height / 2) < (remote.geometry.y + remote.geometry.height / 2)
                this.graph.setCellStyles(mxConstants.STYLE_VERTICAL_LABEL_POSITION, isAbove ? 'top' : 'bottom', [vertex])
                this.graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, isAbove ? 'bottom' : 'top', [vertex])
            }
        }
    }

    // Center the graph in the container
    centerGraph() {

        let domains = this.graph.model.getChildVertices(this.gLayers[0])
        if (!domains) return
        let bounds = this.graph.getBoundingBoxFromGeometry(domains, false)
        if (!bounds) return
        this.graphScale = this.graph.view.scale
        let dx = (this.graph.container.clientWidth / this.graphScale - bounds.width) / 2
        let dy = (this.graph.container.clientHeight / this.graphScale - bounds.height) / 2
        this.graph.view.setTranslate(dx < 0 ? 0 : dx, dy < 0 ? 0 : dy)
        this.graph.refresh()
    }

    // Functions ..0.
    // Create popup menu for graph
    createPopupMenu(menu, cell, evt) {
    }

    // A utility function for setting the values of part of an Object's properties
    setObjValues(obj, newValues, keyObj = null): void {
        for (let key of Object.keys(newValues)) {
            if (!keyObj) obj[key] = newValues[key]
            else obj[keyObj[key]] = newValues[key]
        }
    }

    // Save changed services to local storage
    saveServices() {
        let storedServices = []
        for (let e2eService of this.e2eServices) {
            let storedService = this.cloneWithSimpleProperties(e2eService)
            storedService["endPoints"] = []
            for (let endPointMap of [e2eService.rootEndPointMap, e2eService.leafEndPointMap]) {
                for (let [, endPoint] of endPointMap) {
                    if (endPoint.status == 'retrieve') continue
                    storedService["endPoints"].push(this.cloneWithSimpleProperties(endPoint))
                }
            }
            storedServices.push(storedService)
        }
        (this.storage)['actn-viewer-service'] = JSON.stringify(storedServices)
    }

    // Hold for next release
    // Read stored services from local storage.
    readServices() {
        /* let storedServices = JSON.parse((this.storage)['actn-viewer-service'] || '[]')
        for (let storedService of storedServices) {
            let e2eService = this.e2eServiceMap.get(storedService.name)
            if (!e2eService) { //not exist then add new one
                e2eService = storedService
                e2eService.leafEndPointMap = new Map()
                e2eService.rootEndPointMap = new Map()
                e2eService.active = false
                for (let endPoint of e2eService.endPoints) {
                    if (!endPoint.newBand) endPoint.newBand = endPoint.bandwidth
                    this.addNewEndPointToService(e2eService, endPoint, 'create')
                }
                this.updateOneE2eService(e2eService)
            } else { //otherwise update the status of endpoint
                for (let storedEndPoint of storedService.endPoints) {
                    let endPoint = e2eService.leafEndPointMap.get(storedEndPoint.id) || e2eService.rootEndPointMap.get(storedEndPoint.id)
                    if (endPoint) {
                        switch (storedEndPoint.status) {
                            case 'create':
                                break
                            case 'delete':
                                endPoint.status = 'delete';
                                endPoint.newBand = 0;
                                break
                            case 'update':
                                if (endPoint.bandwidth != storedEndPoint.newBand) {
                                    endPoint.newBand = storedEndPoint.newBand
                                    endPoint.status = 'update'
                                }
                        }
                    } else {
                        this.addNewEndPointToService(e2eService, storedEndPoint, 'create')
                    }
                }
                this.updateRootBandwidth(e2eService)
            }
        } */
    }

    // add a new endpoint to e2e service
    addNewEndPointToService(e2eService, endPoint, status) {
        endPoint.edge = this.getUniEdgeFromEp(endPoint)
        if (!endPoint.edge) return
        endPoint.status = status
        let endPointMap = endPoint.role == 'leaf-access' ? e2eService.leafEndPointMap : e2eService.rootEndPointMap
        endPoint.id = endPoint.id || this.getEndPointKey(endPoint)
        endPointMap.set(endPoint.id, endPoint)
    }

    // add a new uni to e2e service
    addNewUni(e2eService, uni, isLeaf) {
        let newEndPoint = {
            networkId: uni.networkId,
            nodeId: uni.srcNode.nodeId,
            portId: uni.srcUniTp.tpId,
            role: isLeaf ? 'leaf-access' : 'root-primary',
            newBand: this.defBandwidth,
        }
        this.addNewEndPointToService(e2eService, newEndPoint, 'create')
        this.updateCurrentCloud(e2eService)
    }

    deleteNewUni(e2eService, endPoint, isLeaf, doUpdate = true) {
        let endPointMap = isLeaf ? e2eService.leafEndPointMap : e2eService.rootEndPointMap
        endPointMap.delete(endPoint.id)
        if (doUpdate) this.updateCurrentCloud(e2eService)
    }

    deleteOldUni(e2eService, endPoint) {
        endPoint.status = 'delete'
        endPoint.newBand = 0
        this.updateCurrentCloud(e2eService)
    }

    cancelUniDeletion(e2eService, endPoint, doUpdate = true) {
        endPoint.status = 'retrieve'
        endPoint.newBand = endPoint.bandwidth
        if (doUpdate) this.updateCurrentCloud(e2eService)
    }

    cancelUniModification(e2eService, endPoint, doUpdate = true) {
        endPoint.status = 'retrieve'
        endPoint.newBand = endPoint.bandwidth
        if (doUpdate) this.updateCurrentCloud(e2eService)
    }

    updateCurrentCloud(e2eService) {
        this.updateRootBandwidth(e2eService)
        this.saveServices()
        //this.showSotnCloud(this.currentCloud)
    }

    // Calculate and update the bandwidth of roots
    updateRootBandwidth(e2eService) {
        let newRootBand = 0
        for (let [, endPoint] of e2eService.leafEndPointMap) {
            newRootBand += endPoint.newBand
        }
        for (let [, endPoint] of e2eService.rootEndPointMap) {
            if (endPoint.status == 'delete') continue
            endPoint.newBand = newRootBand
            if (endPoint.status == 'create') continue
            endPoint.status = (endPoint.newBand != endPoint.bandwidth) ? 'update' : 'retrieve'
        }
        e2eService.changed = false
        for (let endPointMap of [e2eService.leafEndPointMap, e2eService.rootEndPointMap]) {
            for (let [, endPoint] of endPointMap) {
                if (endPoint.status != 'retrieve') {
                    e2eService.changed = true;
                    break
                }
            }
            if (e2eService.changed) break
        }
        this.serviceTable.row(e2eService.$index).data(e2eService)
    }

    // cancel all service changes
    cancelAllCloudChanges(currentService) {
        for (let endPointMap of [currentService.leafEndPointMap, currentService.rootEndPointMap]) {
            for (let [, endPoint] of endPointMap) {
                switch (endPoint.status) {
                    case 'create':
                        this.deleteNewUni(currentService, endPoint, endPoint.role == 'leaf-access', false)
                        break
                    case 'delete':
                        this.cancelUniDeletion(currentService, endPoint, false)
                        break
                    case 'update':
                        if (endPoint.role == 'leaf-access') {
                            this.cancelUniModification(currentService, endPoint, false)
                        }
                        break
                }
            }
        }
        currentService.changed = false
        this.updateCurrentCloud(currentService)
    }

    // function for interact with ONAP SO
    onapApplyCloudChanges(currentService) {
        alert('Future feature.')
        // let newSliceServices = e2eServices.filter(service =>
        //     service.sliceId == currentSlice && !service.active)
        // if (newSliceServices.length == 0) return
        // let connections = []
        // newSliceServices.forEach((s, i) => {
        //     connections.push({
        //         epa: s.srcVertex.value.node.uniTpMap.get(s.srcPort).name.split(':')[0],
        //         epb: s.dstVertex.value.node.uniTpMap.get(s.dstPort).name.split(':')[0],
        //         bandwidth: s.bandwidth,
        //         name: s.name,
        //     })
        // })
        // let jsonData = jsonRender('ONAP_TS_ALLOCATE_TMPL',
        //     { sliceId: currentSlice, connections: connections })
        // setRestJsonData('POST', onap, 'allocate', jsonData, null, false)

        // let jsonData = jsonRender('ONAP_TS_OTHERS_TMPL',
        //     { sliceId: currentSlice })
        // setRestJsonData(method, onap, action, jsonData, null, false)
    }

    // Reset the database of controllers
/*    resetControllerData() {
        let result = confirm('The data of all controllers will be reset to initial state.')
        if (!result) return
        let reqNumber = 0
        for (let controller of controllers) {
            setRestJsonData('POST', {controller: controller}, RPC_RESET_DATA_URL, null)
        }
    }*/

    // Filter table by cloud Id
    filterTable(table, cloudId) {
        if (table) table.column('cloudId:name').search(cloudId, true).draw()
    }

    // Hide or show table
    hideTable(table, hide) {
        let index;
        if (table && !hide) {
            $(table.table().container()).show()
            index = table.row({selected: true, search: 'applied'}).index()
            if (index == null) {
                this.tableContainer.nativeElement.scrollTo(0, 0)
            } else {
                table.row(index).node().scrollIntoView(false)
            }
        } else if (table && hide) {
            $(table.table().container()).hide()
        }
    }

    // Select table row
    selectTableRow(index = null, click = false) {
        this.graph.clearSelection()
        if ((this.currentLayer == 1 || this.currentLayer == 2) && this.tunnelTable) {
            let indexes
            if (index == null) {
                indexes = this.tunnelTable.rows({selected: true, search: 'applied'}).indexes()
                if (indexes.length == 0) return this.tunnelTable.rows('.selected').deselect()
                indexes = indexes.toArray()
            } else {
                this.tunnelTable.rows('.selected').deselect()
                let node = this.tunnelTable.row(index).select().node()
                if (!click) node.scrollIntoView(false)
                this.serviceTable.rows('.selected').deselect()
                indexes = [index]
            }
            for (let i in indexes) {
                mxConstants.EDGE_SELECTION_COLOR = parseInt(i) % 2 ? '#0000FF' : '#00FF00'
                this.graph.addSelectionCells((this.currentLayer == 1) ?
                    this.e2eTunnels[indexes[i]].edges : [this.e2eTunnels[indexes[i]].e2eEdge])
                this.showJsonData(this.tunnelsMap.get(this.e2eTunnels[indexes[i]].name), false)
            }
            mxConstants.EDGE_SELECTION_COLOR = '#00FF00'
        } else if (this.currentLayer == 3 && this.serviceTable) {
            if (index == null) {
                index = this.serviceTable.row({selected: true, search: 'applied'}).index()
                if (index == null) return this.serviceTable.rows('.selected').deselect()
            } else {
                this.serviceTable.rows('.selected').deselect()
                let node = this.serviceTable.row(index).select().node()
                if (!click) node.scrollIntoView(false)
            }
            this.graph.addSelectionCell(this.e2eServices[index].e2eEdge)
            let currentService = this.e2eServices[index].name
            this.showJsonData(this.servicesMap.get(this.e2eServices[index].name), false)
            if (this.tunnelTable) this.tunnelTable.rows('.selected').deselect()
        }
    }

    // Function to show the data of js object in JSON format
    showJsonData(data, show = true) {
        /*        $(jsonViewer).jsonViewer(data, { withLinks: false })
                if (show) { popupWnd.show(); popupWnd.fit() }*/
    }

// A utility function for getting value from nested JSON data
    getJsonValue(obj, path) {
        if (!obj) return
        let arr = path.split('.');
        let tempObj = obj;
        for (let e of arr) {
            if (!e) continue
            if (!(tempObj = tempObj[e]))
                return;
        }
        return tempObj;
    }

// A utility function for getting the last part of a string split by :
    getLastColonPart(longStr) {
        if (!longStr) return ''
        let strArray = longStr.split(':')
        if (strArray.length > 1) return strArray[strArray.length - 1]
        else return ''
    }

// A utility function for cloning a new object with simple properties of the source ojbect
    cloneWithSimpleProperties(source) {
        let target = {}
        for (let key of Object.keys(source)) {
            if (this.isBasicType(source[key])) {
                target[key] = source[key]
            }
        }
        return target
    }

// A utility function for copying same properties from the source to the target
    copySameProperties(source, target) {
        for (let key of Object.keys(source)) {
            if (key in target) target[key] = source[key]
        }
    }

// A utility function for getting a JSON Array
    getJsonArray(obj, path) {
        let tmpObj = this.getJsonValue(obj, path)
        if (Array.isArray(tmpObj)) return tmpObj
        else return
    }

// basic type of js object
    isBasicType(obj) {
        return /^(string|number|boolean)$/.test(typeof obj)
    }


    // Get uni edge from endpoint
    getUniEdgeFromEp(ep) {
        let node = this.getNodeFromId(ep.networkId, ep.nodeId)
        if (!node || !ep.portId) return null
        let uniTp = node.uniTpMap.get(ep.portId.toString())
        if (uniTp) return uniTp.edge
    }


    // Get node from Ids
    getNodeFromId(networkId, nodeId) {
        if (!networkId || !nodeId) return
        let domain = this.domainMap.get(networkId)
        if (!domain) return
        return domain.nodeMap.get(nodeId)
    }

    // Lay out the multi-domain topology automatically
    autoLayout(layer = null) {
        switch (layer || this.currentLayer) {
            case 1: this.vertexLayout();
            case 2: this.edgeLayout.execute((this.gLayers)[2]); break
            case 3: this.edgeLayout.execute((this.gLayers)[3]); break
        }
    }
    // Lay out domains and nodes automatically
    vertexLayout() {
        // Move nodes out of domain for layout
        for (let [, sotnDomain] of this.domainMap) {
            for (let [, node] of sotnDomain.nodeMap) {
                this.graph.model.add((this.gLayers)[1], node.vertex)
            }
            for (let [, clientNode] of sotnDomain.clientNodeMap) {
                this.graph.model.add((this.gLayers)[1], clientNode.vertex)
            }
        }
        // Disconnect tunnel edge from source and target
        for (let item of this.e2eTunnels) {
            item.srcVertex.removeEdge(item.e2eEdge, true)
            item.dstVertex.removeEdge(item.e2eEdge, false)
        }

        // Lay out the muti-domain topology including all nodes
        this.graph.zoomTo(1);
        this.organicLayout.execute(this.gLayers[1])
        // get the center point of each domain
        let centerPoints = []
        for (let [, sotnDomain] of this.domainMap) {
            let x = 0, y = 0
            if (sotnDomain.nodeMap.size == 0) continue
            for (let [, node] of sotnDomain.nodeMap) {
                x += node.vertex.geometry.x
                y += node.vertex.geometry.y
            }
            centerPoints.push({ x: x / sotnDomain.nodeMap.size, y: y / sotnDomain.nodeMap.size })
        }
        // calculate the rotation angel of topology in order to rotote it to horizontal direction
        if (centerPoints.length >= 2) {
            let theta = Math.atan2(centerPoints[centerPoints.length - 1].y - centerPoints[0].y,
                centerPoints[centerPoints.length - 1].x - centerPoints[0].x) * 180 / Math.PI
            let i = 0
            for (let [, sotnDomain] of this.domainMap) {
                for (let [, node] of sotnDomain.nodeMap) {
                    rotateVertex(node.vertex, centerPoints[i], -theta)
                }
                for (let [, clientNode] of sotnDomain.clientNodeMap) {
                    let vertex = clientNode.vertex
                    rotateVertex(vertex, centerPoints[i], -theta)
                    // shorten the length of uni link by 1/3
                    let remote = clientNode.networkNode.vertex
                    vertex.geometry.x = (vertex.geometry.x * 2 + remote.geometry.x) / 3
                    vertex.geometry.y = (vertex.geometry.y * 2 + remote.geometry.y) / 3
                }
                i++
            }
        }
        // resize the domains to just contain the nodes in each domain
        for (let [, sotnDomain] of this.domainMap) {
            let vertexes = []
            for (let [, node] of sotnDomain.nodeMap) {
                vertexes.push(node.vertex)
            }
            for (let [, clientNode] of sotnDomain.clientNodeMap) {
                vertexes.push(clientNode.vertex)
            }
            let bounds = this.graph.getBoundingBoxFromGeometry(vertexes, false)
            sotnDomain.vertex.geometry.setRect(bounds.x, bounds.y, bounds.width, bounds.height)
        }
        // Move nodes back to their orginal domain
        for (let [, sotnDomain] of this.domainMap) {
            for (let [, node] of sotnDomain.nodeMap) {
                this.graph.model.add(sotnDomain.vertex, node.vertex)
            }
            for (let [, clientNode] of sotnDomain.clientNodeMap) {
                this.graph.model.add(sotnDomain.vertex, clientNode.vertex)
            }
        }
        // Reconnect tunnel edge to source and target
        for (let item of this.e2eTunnels) {
            item.srcVertex.insertEdge(item.e2eEdge, true)
            item.dstVertex.insertEdge(item.e2eEdge, false)
        }

        this.clientNodeLabelLayout()
        this.domainLayout(50, 50, 50)
        this.centerGraph()

        function rotateVertex(vertex, centerPoint, theta) {
            let newPoint = mxAbstractCanvas2D.prototype.rotatePoint(
                vertex.geometry.x, vertex.geometry.y, theta, centerPoint.x, centerPoint.y)
            vertex.geometry.x = newPoint.x
            vertex.geometry.y = newPoint.y
        }
    }
    // Layout domains automatically with the same domain size
    domainLayout(marginWidth, marginHeight, marginBetween) {
        let domains = this.graph.model.getChildVertices(this.gLayers[0])
        this.graph.cellsFolded(domains, false, false)
        let maxWidth = 0, maxHeight = 0
        for (let domain of domains) {
            if (maxWidth < domain.geometry.width) maxWidth = domain.geometry.width
            if (maxHeight < domain.geometry.height) maxHeight = domain.geometry.height
        }
        maxWidth += marginWidth;
        maxHeight += marginHeight
        // Center the nodes in the domain
        for (let domain of domains) {
            domain.geometry.width = maxWidth + marginBetween
            domain.geometry.height = maxHeight
            let nodes = this.graph.model.getChildVertices(domain)
            let bounds = this.graph.getBoundingBoxFromGeometry(nodes, false)
            let xOffset = (maxWidth / 2 - bounds.x - bounds.width / 2)
            let yOffset = (maxHeight / 2 - bounds.y - bounds.height / 2)
            for (let node of nodes) {
                node.geometry.x += xOffset
                node.geometry.y += yOffset
            }
        }
        this.stackLayout.execute(this.gLayers[0])
        for (let domain of domains) {
            domain.geometry.width -= marginBetween
        }
    }
    getKeys(map){
        return Array.from(map.keys());
    }
    getValues(map){
        return Array.from(map.values());
    }
    getTunnels(){
        let svc = this.servicesMap.get(this.serviceSelected);
        if (svc){
            let name = svc.name;
            let bw = svc.bw;
            return svc.connections.map(({id, srcId, dstId}) => ({
                name: name,
                id: id,
                srcId: srcId,
                dstId: dstId,
                bw: bw
            }));
        }
        return [];
    }

}