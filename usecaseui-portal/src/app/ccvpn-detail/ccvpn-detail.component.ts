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
    // 循环真实参数，对比名字转换配置文件，将真实参数名字改成通用名字
    this.sotnVpnInfo = JSON.parse(this.detailParams.sotnvpnSer['input-parameters']).service.parameters.requestInputs;
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
        // 先分组，后面再变换名字
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
    console.log(this.siteList)
    this.drawImage(this.siteList);
  }

  // site详情
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

  // sitegroup详情

  // site节点图形描绘
  // site分类，根据site查tp pnf --> allotted-resource
  localSite = [];//本地site
  outerSite = [];//外部site
  
  getSiteAResource(){
    return new Promise((res,rej)=>{
      this.detailParams.siteSer.forEach((site)=>{
        site["relationship-list"]["relationship"].find((item)=>{return item["related-to"]=="site-resource"})?this.localSite.push(site):this.outerSite.push(site);
      })
    
      if(this.localSite[0]["service-instance-name"].startsWith("Dc")){
        this.localSite.reverse();
      }

      if(this.outerSite[0]["service-instance-name"].startsWith("Dc")){
        this.outerSite.reverse();
      }

      // 本地site获取tp pnf
      this.localSite.forEach((site)=>{
        let obj = {
          customerId: this.detailParams.customer.id,
          serviceType: this.detailParams.serviceType,
          serviceId: site["service-instance-id"]
        }
        this.myhttp.getAllottedResource(obj)
          .subscribe((data)=>{
            // console.log(data);
            let resource = data["allotted-resource"].find((item)=>{ return item["allotted-resource-name"]=="sotn ar"});
            // console.log(resource);
            let tps_pnfs = resource["relationship-list"]["relationship"].find((item)=>{ return item["related-to"]=="p-interface"})["relationship-data"];
            // console.log(tps_pnfs);
            // site.pnfname = tps_pnfs.find((item)=>{return item["relationship-key"]=="pnf.pnf-name"})["relationship-value"];
            site.tpsitename = tps_pnfs.find((item)=>{return item["relationship-key"]=="p-interface.interface-name"})["relationship-value"];
            // // 通过pnfname获取domain（network-resource）;
            // this.myhttp.getPnfDetail(site.pnfname)
            //   .subscribe((data2)=>{
            //     // console.log(data2);
            //     let networkRelation = data2["relationship-list"]["relationship"].find((item)=>{ return item["related-to"]=="network-resource"})["relationship-data"];
            //     site.domain = networkRelation.find((item)=>{return item["relationship-key"]=="network-resource.network-id"})["relationship-value"];
            //     res("sites-domain");
            //   })
            res("sites-domain");
          })
      })
    })   
  }
  //通过sotn 查vpn-id --> tp pnf --> allotted-resource
  relation = {sotn:{
    name:"sotn1",
    vpns:[
      {
        name:"vpn1",
        domain:"domain1",
        site:"site1",
        tps:[
          {name:"tp1",lineto:"site1"},
          {name:"tp2",lineto:"domain1"}
        ]
      },
      {
        name:"vpn2",
        domain:"domain2",
        site:"site2",
        tps:[
          {name:"tp3",lineto:"site2"},
          {name:"tp4",lineto:"domain2"}
        ]
      }
    ]
  }};

  vpns = [{name: "", tps: [], domain: "", sitetpname: "", othertpname: ""}];
  getSotnAresource(){
    return new Promise((res,rej)=>{
      let connectivityId = this.detailParams.sotnvpnSer["relationship-list"]["relationship"]
                            .find((item)=>{return item["related-to"]=="connectivity"})["relationship-data"]
                            .find((item2)=>{return item2["relationship-key"]=="connectivity.connectivity-id"})["relationship-value"];
      this.myhttp.getSotnConnectivity(connectivityId)
        .subscribe((data)=>{
          // console.log(data);  //默认一个connectivityId只能查到一个connectivity
          let vpns = data.connectivity[0]["relationship-list"]["relationship"]
                      .filter((item)=>{ return item["related-to"]=="vpn-binding"})
                      .map((item2)=>{return item2["relationship-data"].find((item3)=>{return item3["relationship-key"]=="vpn-binding.vpn-id"})["relationship-value"]});         
          console.log(vpns);
          this.detailParams.sotnvpnSer.vpns = vpns.map((item)=>{return {name:item}});
          this.detailParams.sotnvpnSer.vpns.forEach((vpn,index)=>{
            this.myhttp.getVpnBinding(vpn.name)
              .subscribe((data2)=>{
                // console.log(data2); //默认一个vpnid只能查到一个vpnbinding
                let tps_pnfs = data2["vpn-binding"][0]["relationship-list"]["relationship"]
                                .filter((item)=>{ return item["related-to"]=="p-interface"})
                                .map((item2)=>{return item2["relationship-data"]});
                let pnfname = tps_pnfs.map((item)=>{return item.find((item2)=>{return item2["relationship-key"]=="pnf.pnf-name"})["relationship-value"]});
                let tpnames = tps_pnfs.map((item)=>{return item.find((item2)=>{return item2["relationship-key"]=="p-interface.interface-name"})["relationship-value"]});
                // console.log(pnfname)
                // console.log(tpnames)
                vpn.tps = tpnames;
                // let thissite = this.localSite.find((item)=>{return item.pnfname == pnfname[0]}); //查找site上pnfname相同的项，即同domain
                // console.log(thissite);
                // thissite.tpsotnname = tpsotnnames.find((item)=>{return item!=thissite.tpsitename});
                // 通过pnfname获取domain（network-resource）;
                this.myhttp.getPnfDetail(pnfname[0])
                  .subscribe((data2)=>{
                    // console.log(data2);
                    let networkRelation = data2["relationship-list"]["relationship"].find((item)=>{ return item["related-to"]=="network-resource"})["relationship-data"];
                    vpn.domain = networkRelation.find((item)=>{return item["relationship-key"]=="network-resource.network-id"})["relationship-value"];
                    if(this.localSite[index]){
                      vpn.sitetpname = this.localSite.find((site)=>{return tpnames.includes(site.tpsitename)}).tpsitename;
                      console.log(tpnames)
                      console.log(vpn.sitetpname)
                      vpn.othertpname = tpnames.find((name)=>{return name != vpn.sitetpname});
                    }else{
                      vpn.sitetpname = this.localSite[0].tpsitename;
                      vpn.othertpname = tpnames.find((name)=>{return name != vpn.sitetpname});
                    }

                    this.vpns = this.detailParams.sotnvpnSer.vpns;
                    res("sotn-domain");
                    // console.log(vpn);
                  })
               
              })
          })
        })
    })
  }
  
  drawImages(){

    this.getSiteAResource().then((data)=>{
      console.log(data);
      return this.getSotnAresource()
    }).then((data)=>{
      console.log(data);
      console.log(this.localSite);
      this.detailSites = this.detailParams.sotnvpnSer.Type == "CCVPN"?false:true;
      this.detailParams.sotnvpnSer.Type == "CCVPN"?null:this.detailLines.length = this.detailLines.length-3;
      // 当只有一个vpn的时候
      if(this.detailParams.sotnvpnSer.Type == "CCVPN" && this.vpns.length == 1){
        let line =  {
            "x1":"32%","y1":"12%","x2":"32%","y2":"50%"//t2--site2   当本地云只有一朵的时候，tp2与本地site2相连 
          }
        this.detailLines.length = this.detailLines.length-6;
        this.detailLines.push(line);
        // 当本地site有两个的时候
        if(this.localSite.length==2){
          let line = {
            "x1":"40%","y1":"52%","x2":"52%","y2":"52%"//site2--site3
          }
          this.detailLines.push(line);
        }
        // 当外部site有两个的时候
        if(this.outerSite.length==2){
          let line = {
            "x1":"75%","y1":"20%","x2":"60%","y2":"50%"//out-domain--site3
          }
          this.detailLines.push(line);
        }
      }
    })
    // let allnodes = [this.getSiteAResource(),this.getSotnAresource()];
    // Promise.all(allnodes).then((data)=>{
    //   console.log(data)
    //   console.log(this.localSite);


    // })
  }

  detailSites=false;
  detailLines=[ //详情拓扑图连线的坐标
    {
      "x1":"5%","y1":"50%","x2":"17%","y2":"25%"//site1--tp1
    },
    {
      "x1":"22%","y1":"20%","x2":"17%","y2":"25%"//tp1--domian1
    }
    ,
    {
      "x1":"26%","y1":"15%","x2":"30%","y2":"12%"//domian1--tp2
    },

    {
      "x1":"80%","y1":"20%","x2":"85%","y2":"50%"//out-domain--site4
    },

    {
      "x1":"50%","y1":"22%","x2":"45%","y2":"28%"//tp4--domian2
    },
    {
      "x1":"40%","y1":"11%","x2":"50%","y2":"15%"//domian2--tp3
    },
    {
      "x1":"32%","y1":"11%","x2":"41%","y2":"11%"//tp2--tp3
    },

    {
      "x1":"45%","y1":"30%","x2":"35%","y2":"50%"//site2--tp4
    },
    {
      "x1":"75%","y1":"20%","x2":"60%","y2":"50%"//out-domain--site3
    },
    {
      "x1":"40%","y1":"52%","x2":"52%","y2":"52%"//site2--site3
    }
  ];
  lines=[];
  siteImage=[];
  drawImage(sitelist){
    let cx = 200;
    let cy = 200;
    let r = 150;
    let startAngle = -210 * (Math.PI/180);
    let step = sitelist.length > 1 ? 120/(sitelist.length-1) * (Math.PI/180) : 1;

    this.lines = sitelist.map((item,index)=>{
      let x = cx + Math.cos(startAngle - step*index)*r;
      let y = cy + Math.sin(startAngle - step*index)*r;
      return {img:"line",x1:cx,y1:cy,x2:x,y2:y}
    })
    this.siteImage = this.lines.map((item)=>{
      return {img:"site",x:item.x2 - 25,y:item.y2 - 25}
    })
    console.log(this.siteImage,this.lines)
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

}
