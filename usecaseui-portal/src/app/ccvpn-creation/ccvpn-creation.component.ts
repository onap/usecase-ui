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
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import * as d3 from 'd3';
import * as $ from 'jquery';
import { MyhttpService } from '../myhttp.service';

@Component({
  selector: 'app-ccvpn-creation',
  templateUrl: './ccvpn-creation.component.html',
  styleUrls: ['./ccvpn-creation.component.css']
})
export class CcvpnCreationComponent implements OnInit {

  constructor(private myhttp:MyhttpService) { }

  ngOnInit() {
    this.getSiteAddressList();
    this.getTemParameters();
  }

  @Input() createParams;
  @Input() namesTranslate;  //Input parameter name conversion
  @Output() closeCreate = new EventEmitter();

    //tabBarStyle
    tabBarStyle = {
        "height": "58px",
        "width": "528px",
        "box-shadow": "none",
        "margin": "0",
        "border-radius": "4px 4px 0px 0px"
    };
  templateParameters = {};
  getTemParameters(){ //Get template parameters
    let chosedtemplates = Object.values(this.createParams.templates);
    // console.log(this.createParams);
    console.log(chosedtemplates);  //Template id array
        if(this.createParams.commonParams.templateType == 'SOTN'){
            this.tabBarStyle["width"]="351px";
        }
    let types = ["sotnvpn","site","sdwanvpn"];
    chosedtemplates.forEach((item,index)=>{
      this.myhttp.getTemplateParameters(types[index],item)
        .subscribe((data)=>{
          if(index === 0){
            this.templateParameters["sotnvpn"] = data;
            this.sotnNames = data.inputs.map((item)=>{return item.name}); //The real name of the cloud
          }else if(index === 1){
            this.templateParameters["site"] = data;
            let wanportnames = {};
            this.siteNames = data.inputs.map((item)=>{return item.name}); //All the real names in the site, no grouping, put together
            this.siteNames.forEach((item)=>{
              if(item.includes("_device_")){
                this.siteCpeNames.push(item);
              }else if(item.includes("_sitewanport_")){
                let firstName = item.split("_")[0];
                wanportnames[firstName]?wanportnames[firstName].push(item):wanportnames[firstName]=[item];
              }else {
                this.siteBaseNames.push(item);
              }
            })
            this.siteWanNames = Object.values(wanportnames);
            this.siteWanNames.forEach((item)=>{
              this.siteWanData.push(this.siteWanParams);  //Add a table according to the wanport group
            })
            // console.log(this.sotnNames)
            // console.log(this.siteNames)
            // console.log(this.siteBaseNames)
            // console.log(this.siteCpeNames)
            // console.log(this.siteWanNames)
            // console.log(this.siteWanData)
          }else if(index === 2){
            this.templateParameters["sdwan"] = data;
            this.siteGroupNames = data.inputs.map((item)=>{return item.name}); //sdwanvpn Real name
            // console.log(this.siteGroupNames);
          }
         
        },(err)=>{

        })
    })

  }
  // SOTN VPN Info Input parameters
  sotnInfo = {
    name:null,description:null,
    startTime:null,endTime:null,
    COS:"premium",reroute:false,
    SLS:null,dualLink:false,
    CIR:null,EIR:null,
    CBS:null,EBS:null,
    colorAware:false,couplingFlag:false
  }
  sotnNames = [] //Real name

  startTimeChange(event){
    console.log(event)
  }
  endTimeChange(event){
    console.log(event)
  }


  // Site List
  siteTableData = [

  ]
  siteModeAddress = [];//site Address, filter box data, local configuration file
  siteNames = [];//All real names in the site, not grouped, simulating real request conditions；

  siteBaseData = {  //Modal box data, input parameters, binding data
    name:null,
    description:null,
    type:null,
    role:null,
    postcode:null,
    address:null,
    vlan:null,
    sotnVpnName:null, //SOTN VPN Info name
    controlPoint:null, //When the Role of the site in the site group is set to spoke, pass the site name to the site name of the hub. Otherwise, pass the blank.
    groupRole:null, //site group role
    groupName:null, //site group name
    emails:null,//  Do not show air
    latitude:null,//
    longitude:null,//
    clientSignal:null//
  };
  siteBaseNames = [] //Real name
  // cpe edit
  siteCpeData = {
    device_name:null,
    device_version:null,
    device_esn:null,
    device_class:null,
    device_systemIp:null,
    device_vendor:null,
    device_type:null
  };
  siteCpeNames = [] //Real name
  // Wan Port edit
  siteWanData = [];  //wan port Table binding data
  siteWanParams = {  //Detailed parameters of each line of data, modal box
    sitewanport_name:null,
    sitewanport_deviceName:null,
    sitewanport_description:null,
    sitewanport_portType:null,
    sitewanport_portNumber:null,
    sitewanport_ipAddress:null,
    sitewanport_providerIpAddress:null,
    sitewanport_transportNetworkName:null,
    sitewanport_inputBandwidth:null,
    sitewanport_outputBandwidth:null
  };
  siteWanNames = [] //Real name
  wanPortModal = false;  //Modal box display hidden
  wanPortEditNum = 0;//Which line to edit
    editWanPort(num) {
        // if(){
        console.log(this)
        console.log(num)
        if (!this.wanPortModal) {
            console.log(11111)
            console.log(this.wanPortModal)
            this.wanPortModal = true;
            this.wanPortEditNum = num;
            this.siteWanParams = Object.assign({}, this.siteWanData[num - 1]);
        } else {
            console.log(22222)
            let inputsData = Object.assign({}, this.siteWanParams); //Create a new object, disconnect the original reference, because you want to empty the modal box later
            inputsData.sitewanport_deviceName = this.siteCpeData.device_name;
            this.siteWanData[this.wanPortEditNum - 1] = inputsData;
            this.siteWanData = [...this.siteWanData]; //Table refresh
            Object.keys(this.siteWanParams).forEach((item) => { //Clear modal box
                this.siteWanParams[item] = null;
            })
            this.wanPortModal = false;
            console.log(this.siteWanData)
        }
        // }

    }
  wanPortModal_Cancel(){
    this.wanPortModal = false;
  }


  // Get the site address, manual file
  getSiteAddressList(){
    this.myhttp.getSiteAddress()
      .subscribe((data)=>{
        console.log(data);
        this.siteModeAddress = data.map((item)=>{ return item.location});
      },(err)=>{
        console.log(err);
      })
  }
  siteModelShow = false;
  addSite(){
    this.siteModelShow = true;
    this.isEdit = 0;
  }
  // addsite Modal box button
  isEdit = 0; //Edit serial number, No value, 0 means increase
  addsite_OK(){
    this.siteBaseData.sotnVpnName = this.sotnInfo.name;
    // let inputsData = Object.assign({},this.siteBaseData,this.siteCpeData,this.siteWanData); //Create a new object, disconnect the original reference, because you want to empty the modal box later
    let inputs = {};
    inputs["baseData"] = Object.assign({},this.siteBaseData);
    inputs["cpeData"] = Object.assign({},this.siteCpeData);
    inputs["wanportData"] = this.siteWanData.map((item)=>{
      return Object.assign({},item);
    })
    console.log(inputs);
    if(this.isEdit){
      // Edit status does not increase
      this.siteTableData[this.isEdit-1] = inputs; 
      this.siteTableData = [...this.siteTableData]; //Table refresh
      this.siteGroupTableData.forEach((item)=>{  //After the site changes the name, update the sites value in the group.
        if(item.sites.split(";").filter((d)=>{return d!=""}).includes(this.lastSiteName)){
          item.sites = item.sites.replace(this.lastSiteName,this.siteBaseData.name);
        }
      })
    }else{
      // this.siteTableData.push(inputs);//use push or splice modify nzData Invalid When added [nzFrontPagination]="false" ，Effective
      this.siteTableData = [...this.siteTableData,inputs];
    }
    
    Object.keys(this.siteBaseData).forEach((item)=>{ //Clear modal box
      this.siteBaseData[item] = null;
    })
    Object.keys(this.siteCpeData).forEach((item)=>{ //Clear modal box
      this.siteCpeData[item] = null;
    })
    this.siteWanData.forEach((item)=>{
      Object.keys(item).forEach((item2)=>{
        item[item2] = null;
      })
    })
    // console.log(this.siteTableData);
    this.lastSiteName = null;
    this.drawImage(this.siteTableData);
    this.siteModelShow = false;
  }
  addsite_cancel(){
    Object.keys(this.siteBaseData).forEach((item)=>{ //Clear modal box
      this.siteBaseData[item] = null;
    })
    Object.keys(this.siteCpeData).forEach((item)=>{ //Clear modal box
      this.siteCpeData[item] = null;
    })
    this.siteWanData.forEach((item)=>{
      Object.keys(item).forEach((item2)=>{
        item[item2] = null;
      })
    })
    this.lastSiteName = null;
    this.siteModelShow = false;
  }
  lastSiteName = null; //After the site is modified, if the name is changed, the name of the sites in the group needs to be updated.
  editSite(num){ //Edit and modify the selected site information
    this.siteModelShow = true;
    this.isEdit=num;
    this.siteBaseData = Object.assign({},this.siteTableData[num-1].baseData);
    this.siteCpeData = Object.assign({},this.siteTableData[num-1].cpeData);
    this.siteWanData = this.siteTableData[num-1].wanportData.map((item)=>{return Object.assign({},item)});
    this.lastSiteName = this.siteBaseData.name;
  }
  deleteSite(num){
    let deleteSiteName = this.siteTableData[num-1].baseData.name;   //Deleted site name
    let groupSites = [];
    this.siteGroupTableData.forEach((item)=>{ groupSites.push(...item.sites.split(";").filter((d)=>{return d!=""})) });
    if(groupSites.includes(deleteSiteName)){
      alert("this site has in grouplist；can't delete！")
      return false;
    }
    this.siteTableData = this.siteTableData.filter((d,i) => i !== num-1);
    // this.siteTableData.splice(num-1,1); //Add in template [nzFrontPagination]="false" ，Effective
    this.drawImage(this.siteTableData);

    // let groupIndex = this.siteGroupTableData.findIndex((item)=>{return item.sites.split(";").includes(deleteSiteName)});
    // console.log(groupIndex)
    // this.deleteGroupSite(groupIndex + 1); //The first line number is 1 when deleting
  }

// Site node graphic depiction
    lines = [];
    siteImage = [];
    tpImage = [];
    imgmap = {
        '1': './assets/images/domain1.png',
        '2': './assets/images/site.png'
    };

    drawImage(sitelist) {
        let cx = 550;
        let cy = 0;
        let innerx1 = 720;
        let innery1 = 80;
        let ox = 950;
        let oy = 0;
        let innerx2 = 780;
        let innery2 = 60;
        let lateX1 = Math.random() * 30 + 55;
        let lateY1 = Math.random() * -20 + 10;
        let lateX2 = 15;
        let lateY2 = 20;
        // let step = sitelist.length > 1 ?sitelist.length: 1;

        this.lines = sitelist.map((item, index) => {
            let step = index + 1;
            let x = cx;
            let y = cy;
            let innerX = innerx1;
            let innerY = innery1;
            if (step % 2 != 0) {
                x = cx;
                y = cy;
                innerX = innerx1;
                innerY = innery1;
                if (step == 1) {
                    innerX = innerx1;
                    innerY = innery1;
                } else {
                    x = cx - lateX1 * Math.ceil((step / 2)) >= 0 ? cx - lateX1 * Math.ceil((step / 2)) : -(cx - lateX1 * Math.ceil((step / 2)));
                    y = cy + lateY1 * step >= 0 ? cy + lateY1 * step : -(cy + lateY1 * step);
                    innerX = this.lines[step - 3].innerX - lateX2;
                    innerY = this.lines[step - 3].innerY + lateY2;
                }
            } else {
                x = ox;
                y = oy;
                innerX = innerx2;
                innerY = innery2;
                if (step / 2 == 1) {
                    innerX = innerx2;
                    innerY = innery2;
                } else {
                    x = ox + lateX1 * (step / 2) >= 0 ? ox + lateX1 * (step / 2) : -(ox + lateX1 * (step / 2));
                    y = oy + lateY1 * step >= 0 ? oy + lateY1 * step : -(oy + lateY1 * step);
                    innerX = this.lines[step - 3].innerX + lateX2;
                    innerY = this.lines[step - 3].innerY + lateY2;
                }
            }
            return {
                img: "line",
                site: item.baseData.name,
                x1: x + 25,
                y1: y + 25,
                x2: innerX,
                y2: innerY,
                innerX: innerX,
                innerY: innerY
            }
        });

        console.log(this.lines)
        this.render(this.imgmap, this.lines);
    }

    render(imgmap, lines) {

        //enter
        var svg = d3.select("svg"),
            _g_lines = svg.selectAll('line.line')
                .data(lines)
                .enter()
                .append('line')
                .style('stroke', '#3fa8eb'
                )
                .style('stroke-width', 2)
                .attr('class', 'line')
                .attr("x1", function (d) {
                    return d.x1;
                })
                .attr("y1", function (d) {
                    return d.y1;
                })
                .attr("x2", function (d) {
                    return d.x2;
                })
                .attr("y2", function (d) {
                    return d.y2;
                }),
            _g_site = svg.selectAll('g.g-site')
                .data(lines)
                .enter()
                .append('g')
                .style('cursor', 'pointer')
                .attr('class', 'g-site');
        _g_site.append('image')
            .style("width", "50px")
            .attr('xlink:href', function (d) {
                return imgmap[2];
            })
            .attr("x", function (d) {
                return d.x1 - 25;
            })
            .attr("y", function (d) {
                return d.y1 - 25;
            })

        //quit
        svg.selectAll("g.g-site")
            .data(lines)
            .exit() //Select a picture without bound data
            .remove();
        svg.selectAll("line.line")
            .data(lines)
            .exit() //Select the connection without binding data
            .remove();

    }

  siteName=null;
  siteNameStyle = {
    'display':'none',
    'left':'0',
    'top':'0'
  }
  showSite($event,item){
    this.siteName = item.name;
    this.siteNameStyle.display = 'block';
  }
  moveSite($event,item){
    this.siteNameStyle.left = $event.clientX  + "px";
    this.siteNameStyle.top = $event.clientY - 35 + "px";
  }
  hideSite($event){
    this.siteNameStyle.display = 'none'; 
  }
  // siteGroup List
  siteGroupTableData = [

  ]
  siteGroupModelData = {
    name:null,
    topology:null,
    sites:null,
    role:null
  }
  siteGroupModelShow = false;
  siteGroupModalTableData = [];// ==> siteTableData?
  siteGroupNames=[];  //sdwanvpn Real name

  // Check box
  allChecked = false;
  indeterminate = false;
  groupModal_checkAll(value){
    this.siteGroupModalTableData.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }
  refreshStatus(){
    const allChecked = this.siteGroupModalTableData.filter(item => !item.disabled).every(item => item.checked === true);
    const allUnChecked = this.siteGroupModalTableData.filter(item => !item.disabled).every(item => !item.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  addSiteGroup(){
    this.isGroupEdit = 0;
    this.siteGroupModelShow = true;
    let checkedSite = this.siteGroupTableData.map((item)=>{return item.sites}).join(";").split(";").filter((d)=>{return d!=""});//Whether a site has been selected in the loop group, if it exists, the new group is not optional.
    // console.log(checkedSite);
    this.siteTableData.forEach((item,index)=>{ 
      if(checkedSite.includes(item.baseData.name)){ 
        this.siteGroupModalTableData.push({siteName:item.baseData.name,role:null,checked:false,disabled:true})
      }else {
        this.siteGroupModalTableData.push({siteName:item.baseData.name,role:null,checked:false,disabled:false})
      }    
    })
  }
  // addsiteGroup Modal box button
  addsitegroup_OK(){  //Assign the value in the modal box to the corresponding item in the table ---> update the groupRole, groupName, and controlPoint in the selected site --->
                      //Copy data judgment is to add or edit, update the data in the table ---> Clear the data in the modal box, easy to add next time, close the modal box
    console.log(this.siteGroupModalTableData);
    this.siteGroupModelData.sites="";  //Empty group member name，"" Convenience +=  ,if it's null += Will turn into "null"
    this.siteGroupModelData.role="";  //
    let site_controlPoint = this.siteGroupModalTableData.map((item)=>{ if(item.checked&&item.role=="hub"){ return item.siteName}}).filter((item)=>{return item!=undefined});  
    // console.log(site_controlPoint);
    this.siteGroupModalTableData.forEach((item,index)=>{  //The order of the sites in the modal box is the same as the order of the sites in the table.
      if(item.checked){
        this.siteGroupModelData.sites += item.siteName+";";
        this.siteGroupModelData.role += item.role+";";
        this.siteTableData[index].baseData.groupRole = item.role; //site group的role
        this.siteTableData[index].baseData.groupName = this.siteGroupModelData.name; //site group的name
        if(item.role == "spoke"){
          this.siteTableData[index].baseData.controlPoint = site_controlPoint.join(); //When site group site Role it's spoke，Pass the site group inside the Role set to the hub's site name; otherwise pass the blank
        }
      }
    })

    let inputsData = {};
    Object.assign(inputsData,this.siteGroupModelData);
    if(this.isGroupEdit){
      // Edit status does not increase
      this.siteGroupTableData[this.isGroupEdit-1] = inputsData; 
      this.siteGroupTableData = [...this.siteGroupTableData]; //Table refresh
    }else{
      // this.siteTableData.push(inputsData);//use push or splice modify nzData Invalid
      this.siteGroupTableData = [...this.siteGroupTableData,inputsData];
    }

    Object.keys(this.siteGroupModelData).forEach((item)=>{   
      this.siteGroupModelData[item] = null;
    })
    this.siteGroupModalTableData = [];
    this.siteGroupModelShow = false;
  }
  addsitegroup_cancel(){
    this.siteGroupModalTableData = [];
    this.siteGroupModelShow = false;
  }
  isGroupEdit = 0; //Edit serial number, No value, 0 means increase
  editGroupSite(num){ //Fill the currently edited row data into the modal box--->Get the current edit item sites name--->Determine the status of the site item in the updated modal box
    this.siteGroupModelShow = true;
    this.isGroupEdit=num;
    this.siteGroupModelData = Object.assign({},this.siteGroupTableData[num-1]);
    console.log(this.siteGroupModelData)
    let editSites = this.siteGroupTableData[num-1].sites.split(";").filter((item)=>{return item!=""}); //Get the site name in the group
    // console.log(editSites);
    let checkedSite = this.siteGroupTableData.map((item)=>{return item.sites}).join(";").split(";").filter((d)=>{return d!=""});//Whether a site has been selected in the loop group，If present, the new group is not optional
    // console.log(checkedSite);
    this.siteTableData.forEach((item,index)=>{ 
      if(editSites.includes(item.baseData.name)){//First restore these three values in the site in the edit group, otherwise it will not be updated when the site is reduced.
        item.baseData.groupRole = null; //site group的role
        item.baseData.groupName = null; //site group的name
        item.baseData.controlPoint = null;
        this.siteGroupModalTableData.push({siteName:item.baseData.name,role:item.baseData.groupRole,checked:true,disabled:false})
      }else
      if(checkedSite.includes(item.baseData.name)){ 
        this.siteGroupModalTableData.push({siteName:item.baseData.name,role:null,checked:false,disabled:true})
      }else {
        this.siteGroupModalTableData.push({siteName:item.baseData.name,role:null,checked:false,disabled:false})
      }    
    })
      
  }
  deleteGroupSite(num){
    let deleteSiteGroupsites = this.siteGroupTableData[num-1].sites.split(";").filter((item)=>{return item!=""}); //delete site name
    this.siteGroupTableData = this.siteGroupTableData.filter((d,i) => i !== num-1);
    this.siteTableData.forEach((item,index)=>{
      if(deleteSiteGroupsites.includes(item.baseData.name)){ 
        item.baseData.groupRole = null; //site group role
        item.baseData.groupName = null; //site group name
        item.baseData.controlPoint = null; 
      }
    })
  }



  // Submit creation data
  submit(){   
    let globalCustomerId = this.createParams.commonParams.customer.id;
    let globalServiceType = this.createParams.commonParams.serviceType.name;
    let sotnInputs = {}; 
    // Since the request template is different, the outer layer needs to loop back the real name of the request, the inner loop loops the local parameter, and assigns the current value to the real name.
    this.sotnNames.forEach((name)=>{
      for(let key in this.sotnInfo){
        let nameParts = this.namesTranslate.sotnNameTranslate[key].split("_");
        if(name.startsWith(nameParts[0])&&name.endsWith(nameParts[1])){
          sotnInputs[name] = this.sotnInfo[key];
          break;
        }
      }
    })
    console.log(sotnInputs);
    let vpnbody = {
        service:{
          name:this.sotnInfo.name,
          description:this.sotnInfo.description,
          serviceInvariantUuid:this.templateParameters["sotnvpn"].invariantUUID,  //template.invariantUUID, //serviceDefId
          serviceUuid:this.templateParameters["sotnvpn"].uuid,  //template.uuid, // uuid ?? templateId
          globalSubscriberId:globalCustomerId,  //customer.id
          serviceType:globalServiceType,  //serviceType.value
          parameters:{
            locationConstraints:[],
            resources:[],
            requestInputs:sotnInputs
          }
        }
    }
    
    let sitebody = this.siteTableData.map((site)=>{
      let siteInputs = {};
      this.siteBaseNames.forEach((basename)=>{
        for(let key in site.baseData){
          let namePart = this.namesTranslate.siteNameTranslate.baseNames[key];
          if(basename.endsWith(namePart)){
            siteInputs[basename] = site.baseData[key];
            break;
          }
        }
      })
      this.siteCpeNames.forEach((cpename)=>{
        for(let key in site.cpeData){
          let namePart = this.namesTranslate.siteNameTranslate.cpeNames[key];
          if(cpename.endsWith(namePart)){
            siteInputs[cpename] = site.cpeData[key];
            break;
          }
        }
      })
      this.siteWanNames.forEach((item,index)=>{
        item.forEach((wanportname)=>{
          for(let key in site.wanportData[index]){
            let namePart = this.namesTranslate.siteNameTranslate.wanportNames[key];
            if(wanportname.endsWith(namePart)){
              siteInputs[wanportname] = site.wanportData[index][key];
              break;
            }
          }
        })
      })

      return {
        service:{
          name:site.baseData.name,
          description:site.baseData.description,
          serviceInvariantUuid:this.templateParameters["site"].invariantUUID,
          serviceUuid:this.templateParameters["site"].uuid,
          globalSubscriberId:globalCustomerId,
          serviceType:globalServiceType,
          parameters:{
            locationConstraints:[],
            resources:[],
            requestInputs:siteInputs
          }
        }
      }
    });
    console.log(sitebody);

    let groupbody = this.siteGroupTableData.map((item)=>{
      let siteGroupInputs = {};
      this.siteGroupNames.forEach((name)=>{
        for(let key in item){
          if(this.namesTranslate.siteGroupNameTranslate[key] == undefined){
              continue;
          }
          let nameParts = this.namesTranslate.siteGroupNameTranslate[key].split("_");
          if(name.startsWith(nameParts[0])&&name.endsWith(nameParts[1])){
            siteGroupInputs[name] = item[key];
            break;
          }
        }
      })
      return {
        service:{
          name:item.name,
          description:item.topology,
          serviceInvariantUuid:this.templateParameters["sdwan"].invariantUUID,
          serviceUuid:this.templateParameters["sdwan"].uuid,
          globalSubscriberId:globalCustomerId,
          serviceType:globalServiceType,
          parameters:{
            locationConstraints:[],
            resources:[],
            requestInputs:siteGroupInputs
          }
        }
      }
    })
    console.log(groupbody);

    let createObj = {
      vpnbody:vpnbody,
      sitebody:sitebody,
      groupbody:groupbody
    }
    
    this.closeCreate.emit(createObj);

  }

  goback(){
    this.closeCreate.emit(); 
  }
}
