/*
    Copyright (C) 2018 CMCC, Inc. and others. All rights reserved.

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
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MyhttpService } from '../myhttp.service';
import * as d3 from 'd3';

@Component({
    selector: 'app-ccvpn-detail',
    templateUrl: './ccvpn-detail.component.html',
    styleUrls: ['./ccvpn-detail.component.css']
})
export class CcvpnDetailComponent implements OnInit {

    constructor(private myhttp:MyhttpService) { }

    ngOnInit() {
        // this.getDetails();
        this.dataInit();
        this.drawImages();
    }

    @Input() detailParams;
    @Input() namesTranslate;
    @Output() closeDetail = new EventEmitter();

    sotnVpnInfo:any;
    siteList=[];
    siteGroupList=[];
    dataInit(){
        console.log(this.detailParams);

        this.sotnVpnInfo = JSON.parse(this.detailParams['input-parameters']).service.parameters.requestInputs;
        for(let key in this.sotnVpnInfo){
            for(let key2 in this.namesTranslate.sotnNameTranslate){
                let partnames = this.namesTranslate.sotnNameTranslate[key2].split("_");
                if(key.startsWith(partnames[0])&&key.endsWith(partnames[1])){
                    this.sotnVpnInfo[key2] = this.sotnVpnInfo[key];
                    break;
                }
            }
        }

        this.siteList = this.detailParams.siteSer.map((item)=>{
            return JSON.parse(item['input-parameters']).service.parameters.requestInputs;
        })
        this.siteList.forEach((oneSite,idex)=>{
            oneSite["baseNames"]={};oneSite["cpeNames"]={};oneSite["wanportNames"]=[];
            for(let key in oneSite){
                let hasfind = false;
                if(key == "baseNames" || key == "cpeNames" || key == "wanportNames"){ continue };
                for(let key2 in this.namesTranslate.siteNameTranslate.baseNames){
                    if(key.endsWith(this.namesTranslate.siteNameTranslate.baseNames[key2])){
                        oneSite["baseNames"][key2] = oneSite[key];
                        hasfind = true;
                        break;
                    }
                }
                if(hasfind){ continue };
                for(let key3 in this.namesTranslate.siteNameTranslate.cpeNames){
                    if(key.endsWith(this.namesTranslate.siteNameTranslate.cpeNames[key3])){
                        oneSite["cpeNames"][key3] = oneSite[key];
                        hasfind = true;
                        break;
                    }
                }
                if(hasfind){ continue };
                let wanportStartName = key.split("_")[0];

                let theItem =  oneSite["wanportNames"].find((item,index)=>{
                    if(item){
                        return Object.keys(item)[0].startsWith(wanportStartName)
                    }
                })
                theItem?theItem[key]=oneSite[key]:oneSite["wanportNames"].push({[key]:oneSite[key]})
            }
            let wanportTs = Object.values(this.namesTranslate.siteNameTranslate.wanportNames);
            oneSite["wanportNames"].forEach((item)=>{
                for(let key in item){
                    let newName = wanportTs.find((name)=>{
                        return key.endsWith(name);
                    })
                    newName?item[newName]=item[key]:null;
                }
            })

        })

        this.siteGroupList = this.detailParams.sdwanSer.map((item)=>{
            return JSON.parse(item['input-parameters']).service.parameters.requestInputs;
        })
        this.siteGroupList.forEach((oneSiteGroup)=>{
            for(let key in oneSiteGroup){
                for(let key2 in this.namesTranslate.siteGroupNameTranslate){
                    let partnames = this.namesTranslate.siteGroupNameTranslate[key2].split("_");
                    if(key.startsWith(partnames[0])&&key.endsWith(partnames[1])){
                        oneSiteGroup[key2] = oneSiteGroup[key];
                        break;
                    }
                }
            }
        })
    }


    siteDetailData={baseNames:{},cpeNames:{},wanportNames:[]};
    siteDetail = false;
    showSiteDetail(item){
        this.siteDetail = true;
        this.siteDetailData = item;
    }

    wanPortModal = false;
    wanPortDetail = {};
    showWanportDetail(item){
        this.wanPortModal = true;
        this.wanPortDetail = item;
    }
    handleCancel(){
        this.wanPortModal = false;
    }





    localSite = [];
    outerSite = [];

    getSiteAResource(){
        return new Promise((res,rej)=>{
            this.detailParams.siteSer.forEach((site)=>{
                site["relationship-list"]["relationship"].find((item)=>{return item["related-to"]=="site-resource"})?this.localSite.push(site):this.outerSite.push(site);
            });

            if(this.localSite[0] && this.localSite[0]["service-instance-name"].startsWith("Dc")){
                this.localSite.reverse();
            }

            if(this.outerSite[0] && this.outerSite[0]["service-instance-name"].startsWith("Dc")){
                this.outerSite.reverse();
            }
            console.log(this.localSite);
            console.log(this.outerSite);

            this.localSite.forEach((site)=>{
                let obj = {
                    customerId: this.detailParams.customer.id,
                    serviceType: this.detailParams.serviceType,
                    serviceId: site["service-instance-id"]
                };
                this.myhttp.getAllottedResource(obj)
                    .subscribe((data)=>{
                        let resource = data["allotted-resource"].find((item)=>{ return item["allotted-resource-name"]=="sotn ar"});
                        let tps_pnfs = resource["relationship-list"]["relationship"].find((item)=>{ return item["related-to"]=="p-interface"})["relationship-data"];
                        site.tpsitename = tps_pnfs.find((item)=>{return item["relationship-key"]=="p-interface.interface-name"})["relationship-value"];
                        res("sites-domain");
                    })
            })
        })
    }


    vpns = [{
        name:"",
        domain: "",
        tp1: "",
        tp2: "",
        tps:[],
        site: [],
        type: "domain",
        start:false,
        end:false
    }];
    cloudDomain={
        cloud: "Partent Network",
        site: [],
        type: "cloud"
    };
    d3Data={
        dates:[],
        linkss:[]
    };
    svg;
    scale=1;
    width=600;
    height=600;
    container;
    nodes;
    lineGroup;

    getSotnAresource(){
        // return new Promise((res,rej)=>{
        let connectivityId = this.detailParams["relationship-list"]["relationship"]
            .find((item)=>{return item["related-to"]=="connectivity"})["relationship-data"]
            .find((item2)=>{return item2["relationship-key"]=="connectivity.connectivity-id"})["relationship-value"];
        this.myhttp.getSotnConnectivity(connectivityId)
            .subscribe((data)=>{

                let vpns = data.connectivity[0]["relationship-list"]["relationship"]
                    .filter((item)=>{ return item["related-to"]=="vpn-binding"})
                    .map((item2)=>{return item2["relationship-data"].find((item3)=>{return item3["relationship-key"]=="vpn-binding.vpn-id"})["relationship-value"]});
                console.log(vpns);
                this.detailParams.vpns = vpns.map((item)=>{return {
                    name:item,
                    domain: "",
                    tp1: "",
                    tp2: "",
                    tps:[],
                    site: [],
                    type: "domain",
                    start:false,
                    end:false
                }});
                console.log(this.detailParams.vpns)
                let getDomain = this.detailParams.vpns.map((vpn,index)=>{
                    return new Promise((res,rej)=>{
                        this.myhttp.getVpnBinding(vpn.name)
                            .subscribe((data2)=>{

                                let tps_pnfs = data2["vpn-binding"][0]["relationship-list"]["relationship"]
                                    .filter((item)=>{ return item["related-to"]=="p-interface"})
                                    .map((item2)=>{return item2["relationship-data"]});
                                let pnfname = tps_pnfs.map((item)=>{return item.find((item2)=>{return item2["relationship-key"]=="pnf.pnf-name"})["relationship-value"]});
                                let tpnames = tps_pnfs.map((item)=>{return item.find((item2)=>{return item2["relationship-key"]=="p-interface.interface-name"})["relationship-value"]});

                                vpn.tps = tpnames;
                                this.myhttp.getPnfDetail(pnfname[0])
                                    .subscribe((data2)=>{

                                        let networkRelation = data2["relationship-list"]["relationship"].find((item)=>{ return item["related-to"]=="network-resource"})["relationship-data"];
                                        vpn.domain = networkRelation.find((item)=>{return item["relationship-key"]=="network-resource.network-id"})["relationship-value"];
                                        console.log(this.localSite)
                                        for(let i=0;i<this.localSite.length;i++){
                                            for(let a=0;a<this.detailParams.vpns.length;a++){
                                                let tps=this.detailParams.vpns[a].tps;
                                                if(i==0){
                                                    if(tps.indexOf(this.localSite[i]["tpsitename"])>-1){
                                                        this.detailParams.vpns[a].site=[];
                                                        let index=tps.indexOf(this.localSite[i]["tpsitename"]);
                                                        let tp1=tps.slice(index,1)[0];
                                                        let tp2=tps.find((name)=>{return name != tp1});
                                                        this.detailParams.vpns[a].tp1=tp1;
                                                        this.detailParams.vpns[a].tp2=tp2;
                                                        this.detailParams.vpns[a].site.push(this.localSite[i]["service-instance-name"]);
                                                        this.detailParams.vpns[a].start=true;
                                                        let first=this.detailParams.vpns.splice(a,1)[0];
                                                        console.log(first)
                                                        this.detailParams.vpns.unshift(first);
                                                        console.log(this.detailParams.vpns)
                                                    }else {
                                                        this.detailParams.vpns[a].tp1=tps[0];
                                                        this.detailParams.vpns[a].tp2=tps[1];
                                                    }

                                                } else if(i==1){
                                                    if(tps.indexOf(this.localSite[i]["tpsitename"])>-1){
                                                        let thisDomain=this.detailParams.vpns[a].domain;
                                                        if(thisDomain==this.detailParams.vpns[0].domain){
                                                            console.log(this.detailParams.vpns[0]);
                                                            console.log(this.localSite[i]["service-instance-name"]);
                                                            this.detailParams.vpns[0].site.push(this.localSite[i]["service-instance-name"])
                                                            console.log(this.detailParams.vpns[0])
                                                        }else {
                                                            this.detailParams.vpns[a].site=[];
                                                            let index=tps.indexOf(this.localSite[i]["tpsitename"]);
                                                            let tp2=tps.slice(index,1)[0];
                                                            let tp1=tps.find((name)=>{return name != tp2});
                                                            this.detailParams.vpns[a].tp1=tp1;
                                                            this.detailParams.vpns[a].tp2=tp2;
                                                            console.log("有多个domain,2个site");
                                                            this.detailParams.vpns[a].site.push(this.localSite[i]["service-instance-name"]);
                                                            this.detailParams.vpns[a].start=false;
                                                            this.detailParams.vpns[a].end=true;
                                                            let last=this.detailParams.vpns.splice(a,1)[0];
                                                            console.log(last);
                                                            this.detailParams.vpns.push(last);
                                                        }

                                                    }
                                                    console.log(this.detailParams.vpns)
                                                }

                                            }
                                        }
                                        this.vpns = this.detailParams.vpns;
                                        console.log(this.vpns);
                                        res(this.detailParams.vpns)
                                    })
                                console.log(this.detailParams.vpns)
                            })
                    })

                });
                Promise.all(getDomain).then((data)=>{
                    console.log(this.vpns);
                    console.log(this.detailParams.vpns);
                    for(let b=0;b<this.outerSite.length;b++){
                        this.cloudDomain.site.push(this.outerSite[b]["service-instance-name"]);
                    }
                    this.detailParams.vpns.push(this.cloudDomain);
                    this.vpns = this.detailParams.vpns;
                    this.getD3Data(this.detailParams.vpns)
                });
                // res(this.detailParams.vpns)
            });
        // })
    }

    drawImages(){
        this.getSiteAResource().then((data)=>{
            console.log(data);
            this.getSotnAresource();
        });
    }

    getD3Data(data){
        console.log(data);
        console.log("start d3data");
        console.log(this.detailParams.vpns);
        this.detailParams.vpns.forEach((item)=>{
            if(item.type == "domain" && item.site.length == 0){
                this.d3Data.dates.push(
                    {
                        name: item.domain,
                        type: 'domain'
                    },{
                        name: item.tp1,
                        type: 'tp'

                    },{
                        name: item.tp2,
                        type: 'tp'
                    });
                this.d3Data.linkss.push({
                    source: item.domain,
                    target: item.domain
                },{
                    source: item.domain,
                    target: item.tp1
                },{
                    source: item.domain,
                    target: item.tp2
                })
            };
            if (item.type == "domain" && item.site.length == 1) {
                this.d3Data.dates.push({
                    name: item.domain,
                    type: 'domain'
                }, {
                    name: item.tp1,
                    type: 'tp'
                }, {
                    name: item.tp2,
                    type: 'tp'
                });
                this.d3Data.linkss.push({
                    source: item.domain,
                    target: item.domain
                }, {
                    source: item.domain,
                    target: item.tp1
                }, {
                    source: item.domain,
                    target: item.tp2
                });
                if (item.start == true && item.end == false) {
                    this.d3Data.dates.push(
                        {
                            name: item.site[0],
                            type: 'site'
                        });
                    this.d3Data.linkss.push({
                        source: item.tp1,
                        target: item.site[0]
                    })
                }
                if (item.start == false && item.end == true) {
                    this.d3Data.dates.push(
                        {
                            name: item.site[0],
                            type: 'site'
                        });
                    this.d3Data.linkss.push({
                        source: item.tp2,
                        target: item.site[0]
                    })
                }

            }else if (item.type == "domain" && item.site.length == 2) {
                this.d3Data.dates.push({
                        name: item.domain,
                        type: 'domain'
                    }, {
                        name: item.tp1,
                        type: 'tp'
                    }, {
                        name: item.tp2,
                        type: 'tp'
                    },
                    {
                        name: item.site[0],
                        type: 'site'
                    },
                    {
                        name: item.site[1],
                        type: 'site'
                    });
                this.d3Data.linkss.push({
                    source: item.domain,
                    target: item.domain
                }, {
                    source: item.domain,
                    target: item.tp1
                }, {
                    source: item.domain,
                    target: item.tp2
                }, {
                    source: item.tp1,
                    target: item.site[0]
                }, {
                    source: item.tp2,
                    target: item.site[1]
                });
            }else if (item.type == "cloud" && item.site.length == 1) {
                this.d3Data.dates.push({
                        name: item.cloud,
                        type: 'cloud'
                    },
                    {
                        name: item.site[0],
                        type: 'site'
                    });
                this.d3Data.linkss.push({
                    source: item.cloud,
                    target: item.cloud
                }, {
                    source: item.cloud,
                    target: item.site[0]
                })
            }
            else if (item.type == "cloud" && item.site.length == 2) {
                this.d3Data.dates.push({
                        name: item.cloud,
                        type: 'cloud',
                        source: item.cloud,
                        target: item.cloud
                    },
                    {
                        name: item.site[0],
                        type: 'site',
                        source: item.cloud,
                        target: item.site[0]
                    },
                    {
                        name: item.site[1],
                        type: 'site',
                        source: item.cloud,
                        target: item.site[1]
                    });
                this.d3Data.linkss.push({
                    source: item.cloud,
                    target: item.cloud
                }, {
                    source: item.cloud,
                    target: item.site[0]
                }, {
                    source: item.cloud,
                    target: item.site[1]
                })
            }


        });

        var siteNum = 0;

        for (var b = 0; b < this.d3Data.dates.length; b++) {
            if (this.d3Data.dates[b].type == "site") {
                siteNum++;
            }
        }

        if (this.detailParams.vpns.length == 2) {
            var source = this.detailParams.vpns.find((item) => {return item["type"] == "domain"}).site[1];
            var target = this.detailParams.vpns.find((item) => {return item["type"] == "cloud"}).site[0];
            this.d3Data.linkss.push({
                source: source,
                target: target
            })
        } else if (this.detailParams.vpns.length > 2) {
            if (siteNum == 2) {
                for (var c = 0; c < this.detailParams.vpns.length - 1; c++) {
                    if (c + 1 == this.detailParams.vpns.length - 1) {
                        var sourcess = this.detailParams.vpns[c].tp2,
                            targetss = this.detailParams.vpns.find((item)=> {return item["type"] == "cloud";}).cloud;
                        this.d3Data.linkss.push({
                            source: sourcess,
                            target: targetss
                        });
                        break;
                    }
                    var sources = this.detailParams.vpns[c].tp2,
                        targets = this.detailParams.vpns[c + 1].tp1;
                    this.d3Data.linkss.push({
                        source: sources,
                        target: targets
                    })
                }
            } else if (siteNum == 4) {
                for (var c = 0; c < this.detailParams.vpns.length - 1; c++) {
                    if (c + 1 == this.detailParams.vpns.length - 1) {
                        break;
                    }
                    var sources = this.detailParams.vpns[c].tp2,
                        targets = this.detailParams.vpns[c + 1].tp1;
                    this.d3Data.linkss.push({
                        source: sources,
                        target: targets
                    })
                }
            }
        }
        setTimeout(this.render(),0)
    }


    clickShow = false;
    hoverShow = false;
    toggleClick(){
        this.clickShow = !this.clickShow;
    }
    hoverShowcould(){
        this.hoverShow = true;
    }
    hoverHidecould(){
        this.hoverShow = false;
    }



    goback(){
        this.closeDetail.emit();
    }


    render() {
        console.log("dadada");
        console.log(this.d3Data);
        console.log(this.detailParams.vpns);
        this.scale = 1;
        var svgs=d3.select("#togo");
        this.svg=svgs;
        this.svg.attr('width', this.width)
            .attr('height', this.height);
        this.container = this.svg.append('g')
            .attr('transform', 'scale(' + this.scale + ')');
        this.initPosition();
        this.initLink();
        this.initNode();
    }


    initPosition() {
        let origin = [this.width / 6, this.height / 7];
        var data=this.d3Data.dates;
        let points = this.getVertices(origin, Math.min(this.width, this.height) * 0.3,data.length,this.detailParams.vpns);

        this.d3Data.dates.forEach((item,i)=>{
            item.x = points[i].x;
            item.y = points[i].y;
        })
    }


    getVertices(origin, r, n,data) {
        if (typeof n !== 'number') return;
        var ox = origin[0];
        var oy = origin[1];
        var i = 0;
        var points = [];
        var tempAngle =180,
            reduce=50,
            add=100;
        for(let a=0;a<this.detailParams.vpns.length;a++){
            if(this.detailParams.vpns[a].type=="domain"){
                if(this.detailParams.vpns[a].site.length == 0){
                    tempAngle =180*i;
                    points.push({
                        x: ox +tempAngle,
                        y: oy
                    },{
                        x: ox +tempAngle-reduce,
                        y: oy+add
                    },{
                        x: ox +tempAngle+reduce,
                        y: oy+add
                    });
                    i++;
                }else if((this.detailParams.vpns[a].site.length == 1)){
                    tempAngle =180*i;
                    points.push({
                        x: ox +tempAngle,
                        y: oy
                    },{
                        x: ox +tempAngle-reduce,
                        y: oy+add
                    },{
                        x: ox +tempAngle+reduce,
                        y: oy+add
                    },{
                        x: ox +tempAngle-1.5*reduce,
                        y: oy+2*add
                    });
                    i++;
                } else if((this.detailParams.vpns[a].site.length == 2)){
                    tempAngle =350*i;
                    reduce=70;
                    points.push({
                            x: ox +tempAngle,
                            y: oy
                        },{
                            x: ox +tempAngle-reduce,
                            y: oy+add
                        },{
                            x: ox +tempAngle+reduce,
                            y: oy+add
                        },{
                            x: ox +tempAngle-1.5*reduce,
                            y: oy+2*add
                        }
                        ,{
                            x: ox +tempAngle+reduce,
                            y: oy+2*add
                        });
                    i++;
                }

            }else if((this.detailParams.vpns[a].type=="cloud")){
                if((this.detailParams.vpns[a].site.length ==1)){
                    tempAngle =180*i;
                    points.push({
                        x: ox +tempAngle,
                        y: oy
                    },{
                        x: ox +tempAngle+1.5*reduce,
                        y: oy+2*add
                    });
                    i++;
                } else if((this.detailParams.vpns[a].site.length == 2)){
                    if((this.detailParams.vpns.length>2)){
                        tempAngle =180*i;
                    }else{
                        tempAngle =400*i;
                    }
                    points.push({
                            x: ox +tempAngle,
                            y: oy
                        },{
                            x: ox +tempAngle-1.5*reduce,
                            y: oy+2*add
                        }
                        ,{
                            x: ox +tempAngle+1.5*reduce,
                            y: oy+2*add
                        });
                    i++;
                }

            }
        }

        return points;
    }


    initLink() {
        this.drawLinkLine();
    }


    initNode() {
        var self = this;

        this.nodes = this.container.selectAll(".node")
            .data(this.d3Data.dates)
            .enter()
            .append("g")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .attr('class', 'node')
            .style("cursor","pointer")
            .call(d3.behavior.drag()
                .on("drag", function (d) {
                    self.onDrag(this, d)
                })
            );


        this.drawNodeSymbol();

        this.drawNodeTitle();
    }



    drawNodeSymbol() {
        var  imgmap = {
            'domain': '../../assets/images/domain.png',
            'tp': '../../assets/images/tp.png',
            'site': '../../assets/images/site.png',
            'cloud': '../../assets/images/out-domain.png'
        };


        this.nodes.append('image')
            .attr('width', function (d) {
                let width = "15%";
                switch (d.type) {
                    case 'domain':
                        width ="15%";
                        break;
                    case 'tp':
                        width ="4%";
                        break;
                    case 'site':
                        width ="10%";
                        break;
                    case 'cloud':
                        width ="15%";
                        break;
                    default:
                        break;
                }
                return width;
            })
            .attr('height', function (d) {
                let height = "15%";
                switch (d.type) {
                    case 'domain':
                        height ="15%";
                        break;
                    case 'tp':
                        height ="4%";
                        break;
                    case 'site':
                        height ="10%";
                        break;
                    case 'cloud':
                        height ="15%";
                        break;
                    default:
                        break;
                }
                return height;
            })
            .attr('xlink:href', function (d) {
                return imgmap[d.type];
            })
            .attr('x',function () {
                return -this.getBBox().width/2
            })
            .attr('y',function () {
                return -this.getBBox().height/2
            });
    }



    drawNodeTitle() {

        this.nodes.append("text")
            .attr('class','node-title')
            .text(function (d) {
                return d.name;
            })
            .attr("dx",function (d) {
                var x=0;
                if(d.type=="tp"){
                    x=20;
                }else {
                    x=0;
                }
                return x;
            })
            .attr("dy",function (d) {
                var y=0;
                if(d.type=="tp"){
                    y=25;
                }else {
                    y=0;
                }
                return y;
            });
    }


    drawLinkLine() {
        let data = this.d3Data.dates;
        if (this.lineGroup) {
            this.lineGroup.selectAll('.link')
                .attr('d', link => genLinkPath(link))
        } else {
            this.lineGroup = this.container.append('g');
            this.lineGroup.selectAll('.link')
                .data(this.d3Data.linkss)
                .enter()
                .append('path')
                .attr('class', 'link')
                .style("stroke","#FFC000")
                .style("stroke-width",1)
                .attr('d',function (link) {
                    return genLinkPath(link)
                })

        }
        function genLinkPath(d) {
            let sx = data.find(function(item){
                return item["name"]==d.source;
            }).x;
            let sy = data.find(function(item){
                return item["name"]==d.source;
            }).y;
            let tx =data.find(function(item){
                return item["name"]==d.target;
            }).x;
            let ty =data.find(function(item){
                return item["name"]==d.target;
            }).y;
            return 'M' + sx + ',' + sy + ' L' + tx + ',' + ty;
        }
    }



    update(d) {
        this.drawLinkLine();
    }


    onDrag(ele, d) {
        d.x = d3.event.x;
        d.y = d3.event.y;
        d3.select(ele)
            .attr('transform', "translate(" + d3.event.x + "," + d3.event.y + ")");
        this.update(d);
    }


}
