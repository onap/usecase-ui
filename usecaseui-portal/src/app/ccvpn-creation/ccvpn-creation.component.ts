import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() namesTranslate;  //输入项参数名字转换
  @Output() closeCreate = new EventEmitter();

  templateParameters = {};
  getTemParameters(){ //获取模板参数
    let chosedtemplates = Object.values(this.createParams.templates);
    // console.log(this.createParams);
    console.log(chosedtemplates);  //模板id数组
    let types = ["sotnvpn","site","sdwanvpn"];
    chosedtemplates.forEach((item,index)=>{
      this.myhttp.getTemplateParameters(types[index],item)
        .subscribe((data)=>{
          if(index === 0){
            this.templateParameters["sotnvpn"] = data;
            this.sotnNames = data.inputs.map((item)=>{return item.name}); //云的真实名字
          }else if(index === 1){
            this.templateParameters["site"] = data;
            let wanportnames = {};
            this.siteNames = data.inputs.map((item)=>{return item.name}); //site中所有真实名字,没有分组，放在一起了
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
              this.siteWanData.push(this.siteWanParams);  //根据wanport组添加表格中
            })
            // console.log(this.sotnNames)
            // console.log(this.siteNames)
            // console.log(this.siteBaseNames)
            // console.log(this.siteCpeNames)
            // console.log(this.siteWanNames)
            // console.log(this.siteWanData)
          }else if(index === 2){
            this.templateParameters["sdwan"] = data;
            this.siteGroupNames = data.inputs.map((item)=>{return item.name}); //sdwanvpn真实名字
            // console.log(this.siteGroupNames);
          }
         
        },(err)=>{

        })
    })

  }
  // SOTN VPN Info 输入参数
  sotnInfo = {
    name:null,description:null,
    startTime:null,endTime:null,
    COS:"premium",reroute:false,
    SLS:null,dualLink:false,
    CIR:null,EIR:null,
    CBS:null,EBS:null,
    colorAware:false,couplingFlag:false
  }
  sotnNames = [] //真实名字

  startTimeChange(event){
    console.log(event)
  }
  endTimeChange(event){
    console.log(event)
  }


  // Site List
  siteTableData = [

  ]
  siteModeAddress = [];//site地址，筛选框数据,本地配置文件
  siteNames = [];//site中所有真实名字，未分组，模拟真实请求情况；

  siteBaseData = {  //模态框数据，输入参数，绑定数据
    name:null,
    description:null,
    type:null,
    role:null,
    postcode:null,
    address:null,
    vlan:null,
    sotnVpnName:null, //SOTN VPN Info中name
    controlPoint:null, //site group里面site的Role设置为spoke时，传递site group里面Role设置为hub的site name；否则传递空白
    groupRole:null, //site group的role
    groupName:null, //site group的name
    emails:null,//  不显示传空
    latitude:null,//
    longitude:null,//
    clientSignal:null//
  };
  siteBaseNames = [] //真实名字
  // cpe 编辑
  siteCpeData = {
    device_name:null,
    device_version:null,
    device_esn:null,
    device_class:null,
    device_systemIp:null,
    device_vendor:null,
    device_type:null
  };
  siteCpeNames = [] //真实名字
  // Wan Port 编辑
  siteWanData = [];  //wan port 表格绑定数据
  siteWanParams = {  //每一行数据详细参数，模态框
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
  siteWanNames = [] //真实名字
  wanPortModal = false;  //模态框显示隐藏
  wanPortEditNum = 0;//编辑哪行
  editWanPort(num){
    this.wanPortModal = true;
    this.wanPortEditNum = num;
    this.siteWanParams = Object.assign({},this.siteWanData[num-1]);
  }
  wanPortModal_Ok(){
    let inputsData = Object.assign({},this.siteWanParams); //新建对象，断开原引用，因为后面要清空模态框
    inputsData.sitewanport_deviceName = this.siteCpeData.device_name;
    this.siteWanData[this.wanPortEditNum-1] = inputsData; 
    this.siteWanData = [...this.siteWanData]; //表格刷新
    Object.keys(this.siteWanParams).forEach((item)=>{ //清空模态框
      this.siteWanParams[item] = null;
    })
    this.wanPortModal = false;
    console.log(this.siteWanData)
  }
  wanPortModal_Cancel(){
    this.wanPortModal = false;
  }


  // 获取site地址，手动文件
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
  // addsite模态框按钮
  isEdit = 0; //编辑序号，No值，0表示增加
  addsite_OK(){
    this.siteBaseData.sotnVpnName = this.sotnInfo.name;
    // let inputsData = Object.assign({},this.siteBaseData,this.siteCpeData,this.siteWanData); //新建对象，断开原引用，因为后面要清空模态框
    let inputs = {};
    inputs["baseData"] = Object.assign({},this.siteBaseData);
    inputs["cpeData"] = Object.assign({},this.siteCpeData);
    inputs["wanportData"] = this.siteWanData.map((item)=>{
      return Object.assign({},item);
    })
    console.log(inputs);
    if(this.isEdit){
      // 编辑状态不增加
      this.siteTableData[this.isEdit-1] = inputs; 
      this.siteTableData = [...this.siteTableData]; //表格刷新
      this.siteGroupTableData.forEach((item)=>{  //site修改名字后，更新组中sites值
        if(item.sites.split(";").filter((d)=>{return d!=""}).includes(this.lastSiteName)){
          item.sites = item.sites.replace(this.lastSiteName,this.siteBaseData.name);
        }
      })
    }else{
      // this.siteTableData.push(inputs);//使用 push 或者 splice 修改 nzData 失效 当加上[nzFrontPagination]="false" 时，生效
      this.siteTableData = [...this.siteTableData,inputs];
    }
    
    Object.keys(this.siteBaseData).forEach((item)=>{ //清空模态框
      this.siteBaseData[item] = null;
    })
    Object.keys(this.siteCpeData).forEach((item)=>{ //清空模态框
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
    Object.keys(this.siteBaseData).forEach((item)=>{ //清空模态框
      this.siteBaseData[item] = null;
    })
    Object.keys(this.siteCpeData).forEach((item)=>{ //清空模态框
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
  lastSiteName = null; //当site修改之后，若修改了名字，则需要更新group中sites的名字
  editSite(num){ //编辑修改选中site信息
    this.siteModelShow = true;
    this.isEdit=num;
    this.siteBaseData = Object.assign({},this.siteTableData[num-1].baseData);
    this.siteCpeData = Object.assign({},this.siteTableData[num-1].cpeData);
    this.siteWanData = this.siteTableData[num-1].wanportData.map((item)=>{return Object.assign({},item)});
    this.lastSiteName = this.siteBaseData.name;
  }
  deleteSite(num){
    let deleteSiteName = this.siteTableData[num-1].baseData.name;   //删除的site中name
    let groupSites = [];
    this.siteGroupTableData.forEach((item)=>{ groupSites.push(...item.sites.split(";").filter((d)=>{return d!=""})) });
    if(groupSites.includes(deleteSiteName)){
      alert("this site has in grouplist；can't delete！")
      return false;
    }
    this.siteTableData = this.siteTableData.filter((d,i) => i !== num-1);
    // this.siteTableData.splice(num-1,1); //模板中加上[nzFrontPagination]="false" 时，生效
    this.drawImage(this.siteTableData);

    // let groupIndex = this.siteGroupTableData.findIndex((item)=>{return item.sites.split(";").includes(deleteSiteName)});
    // console.log(groupIndex)
    // this.deleteGroupSite(groupIndex + 1); //删除时首行编号为1
  }

  // site节点图形描绘
  lines=[];
  siteImage=[];
  drawImage(sitelist){
    let cx = 200;
    let cy = 200;
    let r = 180;
    let startAngle = -210 * (Math.PI/180);
    let step = sitelist.length > 1 ? 120/(sitelist.length-1) * (Math.PI/180) : 1;

    this.lines = sitelist.map((item,index)=>{
      let x = cx + Math.cos(startAngle - step*index)*r;
      let y = cy + Math.sin(startAngle - step*index)*r;
      return {img:"line",site:item.baseData.name,x1:cx,y1:cy,x2:x,y2:y}
    })
    this.siteImage = this.lines.map((item)=>{
      return {img:"site",name:item.site,x:item.x2 - 40,y:item.y2 - 40}
    })
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
  siteGroupNames=[];  //sdwanvpn真实名字

  // 勾选框
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
    let checkedSite = this.siteGroupTableData.map((item)=>{return item.sites}).join(";").split(";").filter((d)=>{return d!=""});//循环组中是否已经选用了某个site，若存在 则新组不可选
    // console.log(checkedSite);
    this.siteTableData.forEach((item,index)=>{ 
      if(checkedSite.includes(item.baseData.name)){ 
        this.siteGroupModalTableData.push({siteName:item.baseData.name,role:null,checked:false,disabled:true})
      }else {
        this.siteGroupModalTableData.push({siteName:item.baseData.name,role:null,checked:false,disabled:false})
      }    
    })
  }
  // addsiteGroup模态框按钮
  addsitegroup_OK(){  //将模态框中的值赋给表中对应项--->将选中的site中的groupRole、groupName、controlPoint更新--->
                      //拷贝数据判断是增加或编辑，更新表中数据---> 清除模态框中数据,便于下次添加，关闭模态框
    console.log(this.siteGroupModalTableData);
    this.siteGroupModelData.sites="";  //置空组成员名字，写成""方便+=  ,若为null +=时会转成 "null"
    this.siteGroupModelData.role="";  //
    let site_controlPoint = this.siteGroupModalTableData.map((item)=>{ if(item.checked&&item.role=="hub"){ return item.siteName}}).filter((item)=>{return item!=undefined});  
    // console.log(site_controlPoint);
    this.siteGroupModalTableData.forEach((item,index)=>{  //模态框中site顺序和 表中site顺序一致
      if(item.checked){
        this.siteGroupModelData.sites += item.siteName+";";
        this.siteGroupModelData.role += item.role+";";
        this.siteTableData[index].baseData.groupRole = item.role; //site group的role
        this.siteTableData[index].baseData.groupName = this.siteGroupModelData.name; //site group的name
        if(item.role == "spoke"){
          this.siteTableData[index].baseData.controlPoint = site_controlPoint.join(); //site group里面site的Role设置为spoke时，传递site group里面Role设置为hub的site name；否则传递空白
        }
      }
    })

    let inputsData = {};
    Object.assign(inputsData,this.siteGroupModelData);
    if(this.isGroupEdit){
      // 编辑状态不增加
      this.siteGroupTableData[this.isGroupEdit-1] = inputsData; 
      this.siteGroupTableData = [...this.siteGroupTableData]; //表格刷新
    }else{
      // this.siteTableData.push(inputsData);//使用 push 或者 splice 修改 nzData 失效
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
  isGroupEdit = 0; //编辑序号，No值，0表示增加
  editGroupSite(num){ //将当前编辑的行数据填入模态框--->获取当前编辑项sites名--->判断更新模态框中site项状态
    this.siteGroupModelShow = true;
    this.isGroupEdit=num;
    this.siteGroupModelData = Object.assign({},this.siteGroupTableData[num-1]);
    console.log(this.siteGroupModelData)
    let editSites = this.siteGroupTableData[num-1].sites.split(";").filter((item)=>{return item!=""}); //获取组中的site名
    // console.log(editSites);
    let checkedSite = this.siteGroupTableData.map((item)=>{return item.sites}).join(";").split(";").filter((d)=>{return d!=""});//循环组中是否已经选用了某个site，若存在 则新组不可选
    // console.log(checkedSite);
    this.siteTableData.forEach((item,index)=>{ 
      if(editSites.includes(item.baseData.name)){//先将编辑组中的site 中这三个值还原，否则减少某个site时 不会更新不选中的
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
    let deleteSiteGroupsites = this.siteGroupTableData[num-1].sites.split(";").filter((item)=>{return item!=""}); //删除的site中name
    this.siteGroupTableData = this.siteGroupTableData.filter((d,i) => i !== num-1);
    this.siteTableData.forEach((item,index)=>{
      if(deleteSiteGroupsites.includes(item.baseData.name)){ 
        item.baseData.groupRole = null; //site group的role
        item.baseData.groupName = null; //site group的name
        item.baseData.controlPoint = null; 
      }
    })
  }



  // 提交创建数据
  submit(){   
    let globalCustomerId = this.createParams.commonParams.customer.id;
    let globalServiceType = this.createParams.commonParams.serviceType;
    let sotnInputs = {}; 
    // 由于请求模板不一样，所以外层需要循环请求回来的真实名字，内层循环本地参数，将当前值赋给真实名字
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
