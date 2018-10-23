import { Component, OnInit, HostBinding } from '@angular/core';
import { MyhttpService } from '../../myhttp.service';
import { slideToRight } from '../../animates';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.less'],
  animations: [ slideToRight ]
})
export class ServicesListComponent implements OnInit {
  @HostBinding('@routerAnimate') routerAnimateState;
  constructor(private myhttp: MyhttpService, private modalService: NzModalService) { }

  ngOnInit() {
    this.getallCustomers();
    this.getTemplateSubTypes();
    this.inputNamests();
  }
  // 筛选框（下拉框）customer servicetype
  customerList = [];
  customerSelected = {name:null,id:null};
  serviceTypeList = [];
  serviceTypeSelected = {name:null,id:null};

  // 获取所有customer
  getallCustomers(){
    this.myhttp.getAllCustomers()
      .subscribe((data)=>{
        this.customerList = data.map((item)=>{return {name:item["subscriber-name"],id:item["global-customer-id"]}});
        this.customerSelected = this.customerList[0];
        this.choseCustomer(this.customerSelected);
        // console.log(this.customers)
      })
  }

  choseCustomer(item){
    this.customerSelected = item;
    this.myhttp.getServiceTypes(this.customerSelected)
      .subscribe((data)=>{
        this.serviceTypeList = data.map((item)=>{return {name:item["service-type"]}});
        this.serviceTypeSelected = this.serviceTypeList[0];
        this.choseServiceType(this.serviceTypeSelected);
        // console.log(this.listServiceTypes);
      })
  }
  choseServiceType(item){
    this.serviceTypeSelected = item;
    this.getTableData();
  }

  // 模态框（对话框） create
  isVisible = false;
  showModal(): void {
    this.isVisible = true;
  }
  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }
  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
    this.isVisible2 = false;
  }

  // 创建模态框2（对话框） create -------------------------------
  isVisible2 = false;
  showModal2(): void {
    this.isVisible2 = true;
    this.templates1 = [];  //多次创建会push累积名字，从新置空
    this.templates2 = [];
    this.templates3 = [];
    this.getAlltemplates();
  }
  // 服务
  templateTypeSelected = "SOTN";
  choseTemplateType(){
    // this.filterTemplates();//分类
  }
  // 模板
  templates = []; templates1;templates2;templates3;
    template1={name:null};
    template2={name:null};
    template3={name:null};
  // 模板分类数据,创建、获取实例分类共用
  templateSubTypes = {};  //子类，sotnvpn、site、sdwan
  getTemplateSubTypes(){
    this.myhttp.getServicesCategory()
      .subscribe((data)=>{
        this.templateSubTypes = data;
      },(err)=>{
        console.log("getTemplateTypes err")
      })
  }

  getAlltemplates(){  //获取所有模板类型
    this.myhttp.getAllServiceTemplates()
      .subscribe((data)=>{
        console.log(data)
        this.templates = data;
        this.template1 = data[0];
        this.template2 = data[1];
        this.template3 = data[2];
        // this.filterTemplates();//分类
      },(err)=>{

      })
  }
  // filterTemplates(){ //模板类型分类，本地配置文件
  //     this.templates1 = [];
  //     this.templates2 = [];
  //     this.templates3 = [];
  //     this.templates.forEach((item)=>{
  //       this.templateSubTypes[this.templateTypeSelected].sotnvpn.find((d)=>{
  //         return d["model-invariant-id"] == item.uuid && d["model-version-id"] == item.invariantUUID 
  //       })?this.templates1.push(item):null;
  //       this.templateSubTypes[this.templateTypeSelected].site.find((d)=>{
  //         return d["model-invariant-id"] == item.uuid && d["model-version-id"] == item.invariantUUID 
  //       })?this.templates2.push(item):null;
  //       if(this.templateTypeSelected=="CCVPN"){
  //         this.templateSubTypes[this.templateTypeSelected].sdwan.find((d)=>{
  //           return d["model-invariant-id"] == item.uuid && d["model-version-id"] == item.invariantUUID 
  //         })?this.templates3.push(item):null;
  //       }
  //     })
  //     this.template1 = this.templates1[0];
  //     this.template2 = this.templates2[0];
  //     if(this.templates3[0]){
  //       this.template3 = this.templates3[0];
  //     } 
  // }


  // 确定、取消
  createshow = false;
  createData:Object={};
  handleOk2(): void {
    console.log('Button ok clicked!');
    this.isVisible2 = false;
    let data1 = {commonParams:{customer:this.customerSelected, serviceType:this.serviceTypeSelected, templateType:"SOTN"},templates:{template1:this.template1,template2:this.template2}};
    let data2 = {commonParams:{customer:this.customerSelected, serviceType:this.serviceTypeSelected, templateType:"CCVPN"},templates:{template1:this.template1,template2:this.template2,template3:this.template3}};
    
    this.createData = this.templateTypeSelected == "SOTN" ? data1 : data2;
    this.createshow = true;
  }
  // handleCancel(): void {
  //   console.log('Button cancel clicked!');
  //   this.isVisible2 = false;
  // }


  //表格数据
  tableData = [];
  pageIndex = 1;
  pageSize = 10;
  total = 100;
  loading = false;
  sortName = null;
  sortValue = null;
  getTableData(){
    // 查询参数: customer serviceType 当前页码，每页条数，排序方式
    let paramsObj = {
      customer:this.customerSelected,
      serviceType:this.serviceTypeSelected,
      pageIndex:this.pageIndex,
      pageSize:this.pageSize,
      serviceIdSort:this.sortValue
    }
    this.myhttp.getServicesTableData(paramsObj)
      .subscribe((data)=>{
        console.log(data);
        this.total = data.body.total;
        this.tableData = data.body.tableList;
      },(err)=>{
        console.log(err);
      })
  }
  sort(sort: { key: string, value: string }): void {
    console.log(sort);
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.getTableData();
  }
  searchData(reset:boolean = false){
    console.log(reset)
    this.getTableData();
  }

  scaleService(){
    console.log("scaleService!");
  }
  updataService(){
    console.log("updataService!");
  }
  deleteService(){
    console.log("deleteService!");
  }

  //表格数据
  tableData2 = [];
  getTableData2(){
    let params = {
      customerId:this.customerSelected.id,
      serviceType:this.serviceTypeSelected
    }
    this.myhttp.getInstanceTableData(params)
      .subscribe((data)=>{
        this.pageIndex = 1;
        this.tableData2 = [];
        console.log(data)
        // data.results.forEach((item)=>{ 
        //   item["sotnvpnSer"] = item["service-subscription"]["service-instances"]["service-instance"].find((d)=>{ 
        //     return this.templateSubTypes["SOTN"].sotnvpn.find((m)=>{ 
        //       return d["model-invariant-id"]==m["model-invariant-id"] && d["model-version-id"]==m["model-version-id"]
        //     })?item["Type"]="SOTN":null || this.templateSubTypes["CCVPN"].sotnvpn.find((m)=>{ 
        //       return d["model-invariant-id"]==m["model-invariant-id"] && d["model-version-id"]==m["model-version-id"]
        //     })?item["Type"]="CCVPN":null
        //   })

        //   if(item["sotnvpnSer"]){
        //     this.tableData2.push(item);
        //   }
        // })

        //---------数据结构有问题，模拟只有一组数据情况---------//
        data["sotnvpnSer"] = data["service-instance"].find((d)=>{ 
          return this.templateSubTypes["SOTN"].sotnvpn.find((m)=>{ 
            return d["model-invariant-id"]==m["model-invariant-id"] && d["model-version-id"]==m["model-version-id"]
          })?d["Type"]="SOTN":null || this.templateSubTypes["CCVPN"].sotnvpn.find((m)=>{ 
            return d["model-invariant-id"]==m["model-invariant-id"] && d["model-version-id"]==m["model-version-id"]
          })?d["Type"]="CCVPN":null
        })
        let inputParams = JSON.parse(data["sotnvpnSer"]["input-parameters"]).service.parameters.requestInputs;
        let descriptionName = Object.keys(inputParams).find((item)=>{ return item.endsWith("_description")});
        data["sotnvpnSer"]["description"] = inputParams[descriptionName];
        data["sotnvpnSer"]["status"] = "Active";
        this.tableData2.push(data);

        console.log(this.tableData2)
      },(err)=>{
        console.log(err);
      })
  }

  // 显示详情
  detailshow = false;
  detailData:Object;
  showDetail(service){
    service["siteSer"]=[];
    service["sdwanSer"]=[];
    service["customer"]=this.customerSelected;
    service["serviceType"] = this.serviceTypeSelected;
    // service["service-subscription"]["service-instances"]["service-instance"].forEach((item)=>{
    //   this.templateSubTypes[service.Type].site.find((d)=>{
    //     return d["model-invariant-id"] == item["model-invariant-id"] && d["model-version-id"] == item["model-version-id"] 
    //   })?service["siteSer"].push(item):null;
    //   if(service.Type=="CCVPN"){
    //     this.templateSubTypes[service.Type].sdwan.find((d)=>{
    //       return d["model-invariant-id"] == item["model-invariant-id"] && d["model-version-id"] == item["model-version-id"] 
    //     })?service["sdwanSer"].push(item):null;
    //   }
    // })
    service["service-instance"].forEach((item)=>{
      this.templateSubTypes[service.sotnvpnSer.Type].site.find((d)=>{
        return d["model-invariant-id"] == item["model-invariant-id"] && d["model-version-id"] == item["model-version-id"] 
      })?service["siteSer"].push(item):null;
      if(service.sotnvpnSer.Type=="CCVPN"){
        this.templateSubTypes[service.sotnvpnSer.Type].sdwan.find((d)=>{
          return d["model-invariant-id"] == item["model-invariant-id"] && d["model-version-id"] == item["model-version-id"] 
        })?service["sdwanSer"].push(item):null;
      }
    })
    this.detailshow = true;
    this.detailData = service;
    console.log(service);
  }
  // 删除 确认模态框
  deleteInstace(service){
    // 创建确认框
    this.modalService.confirm({
      nzTitle     : 'Are you sure delete this instance?',
      nzContent   : `Instance ID: <b class="deleteModelContent"> ${service.sotnvpnSer["service-instance-id"]}</b>`,
      nzOkText    : 'Yes',
      nzOkType    : 'danger',
      nzOnOk      : () => {
        console.log(service);
        let allprogress = {};  //所有进度值，以operationId为键
        let querypros = [];  //所有查询
        service.sotnvpnSer.rate = 0;
        service.sotnvpnSer.status = "deleting";
        // let deletePros = service["service-subscription"]["service-instances"]["service-instance"].map((item)=>{
        //   let id = item["service-instance-id"];
        //   return new Promise((res,rej)=>{
        //     this.myhttp.deleteInstance(id)
        //     .subscribe((data)=>{
        //       let obj = {serviceId:id,operationId:data.operationId}
        //       let updata = (prodata)=>{
        //         allprogress[prodata.operationId] = prodata.progress;
        //         let average = ((arr)=>{return eval(arr.join("+"))/arr.length})(Object.values(allprogress));
        //         service.sotnvpnSer["rate"]=average;
        //       }
        //       querypros.push(this.queryProgress(obj,updata));
        //       res();
        //     })
        //   })  
        // })
        let deletePros = service["service-instance"].map((item)=>{
          let params = {
            globalSubscriberId:this.customerSelected.id,
            serviceType:this.serviceTypeSelected,
            serviceInstanceId:item["service-instance-id"]
          }
          return new Promise((res,rej)=>{
            this.myhttp.deleteInstance(params)
            .subscribe((data)=>{
              let obj = {serviceId:params.serviceInstanceId,operationId:data.operationId}
              let updata = (prodata)=>{
                allprogress[prodata.operationId] = prodata.progress;
                let average = ((arr)=>{return eval(arr.join("+"))/arr.length})(Object.values(allprogress));
                service.sotnvpnSer["rate"]=average;
              }
              querypros.push(this.queryProgress(obj,updata));
              res();
            })
          })  
        })
        console.log(deletePros)
        Promise.all(deletePros).then(()=>{
          Promise.all(querypros).then((data)=>{
            console.log(data);
            service.sotnvpnSer.rate = 100;
            service.sotnvpnSer.status = "deleted";
            setTimeout(()=>{
              this.getTableData();
            },1000)
          })
        })

      },
      nzCancelText: 'No',
      nzOnCancel  : () => console.log('Cancel')
    });
  }


  closeCreate(obj){
    if(!obj){
      this.createshow = false; //关闭创建窗口
      return false;
    }
    this.createshow = false; //关闭创建窗口
    console.log(obj);
    let newData; //主表格中新创建的服务数据
    let stageNum = 0; //不同阶段进度，用于后续服务进度相加；
    // --------------------------------------------------------------------------
        // obj.groupbody.map((group)=>{  //所有创建
        //   return this.createService(group)
        // })
        // obj.sitebody.map((group)=>{  //所有创建
        //   console.log(group)
        //   return this.createService(group)
        // })
    // -----------------------------------------------------------------------------
    this.createService(obj.vpnbody).then((data)=>{
      console.log(data)
      newData = {  //主表格中新创建的服务数据
        'service-instance-id':data["serviceId"],
        'service-instance-name':obj.vpnbody.service.name,
        description:obj.vpnbody.service.description,
        status:"creating",
        rate:0,
      }
      this.tableData2 = [{sotnvpnSer:newData},...this.tableData2];
      let updata = (prodata)=>{
        newData.rate = Math.floor(prodata.progress/3);   
      }
      let queryParams = {serviceId:data["serviceId"],operationId:data["operationId"]};
      return this.queryProgress(queryParams,updata);
    }).then((data)=>{
      console.log(data);
      stageNum = newData.rate; //阶段进度值更新；
      let allprogress = {};  //所有进度值，以operationId为键
      let querypros = [];  //所有查询
      let createPros = obj.groupbody.map((group)=>{  //所有创建
        return this.createService(group).then((data)=>{
          console.log(data);
          let updata = (prodata)=>{
            allprogress[prodata.operationId] = prodata.progress;
            let average = ((arr)=>{return eval(arr.join("+"))/arr.length})(Object.values(allprogress)) 
            newData.rate = Math.floor(average/3) + stageNum;
          }
          let queryParams = {serviceId:data["serviceId"],operationId:data["operationId"]};
          querypros.push(this.queryProgress(queryParams,updata))
        })
      })

      return new Promise((res)=>{
        Promise.all(createPros).then(()=>{  //所有创建好之后querypros中查询进度才全都添加完毕
          Promise.all(querypros).then((data)=>{
            console.log(data);
            res("site--begin");
          })
        }) 
      })
    }).then((data)=>{
      console.log(data);
      stageNum = newData.rate; //阶段进度值更新；
      let allprogress = {};
      let querypros = [];  //所有查询
      let createPros = obj.sitebody.map((group)=>{  //所有创建
        return this.createService(group).then((data)=>{
          console.log(data);
          let updata = (prodata)=>{
            allprogress[prodata.operationId] = prodata.progress;
            let average =((arr)=>{return eval(arr.join("+"))/arr.length})(Object.values(allprogress)) 
            newData.rate = Math.floor(average/3) + stageNum;
          }
          let queryParams = {serviceId:data["serviceId"],operationId:data["operationId"]};
          querypros.push(this.queryProgress(queryParams,updata))
        })
      })
      console.log(createPros);
      Promise.all(createPros).then(()=>{  //所有创建好之后querypros中查询进度才全都添加完毕
        Promise.all(querypros).then((data)=>{
          console.log(data);
          newData.rate = 100;
          newData.status = "completed";
          setTimeout(()=>{
            this.getTableData();
          },1000)
        })
      }) 
    })

  }

  createService(params){
    let mypromise = new Promise((res,rej)=>{
      this.myhttp.createInstance(params)
        .subscribe((data)=>{
          
          res(data.service);
        })
    })
    return mypromise;
  }
 
  queryProgress(obj,callback){
    let mypromise = new Promise((res,rej)=>{
      // let data = {
      //   operationStatus:{
      //     "operationId": "XXXXXX",
      //     "operation": "create|delete|update|scale",
      //     "result": "finished|error|processing",
      //     "reason": "",
      //     "userId": "",
      //     "operationContent": "Be creating pop.",
      //     "progress": 0,
      //     "operateAt": "",
      //     "finishedAt": "" 
      //   }
      // }
      let requery = ()=>{
        this.myhttp.getProgress(obj)
          .subscribe((data)=>{
            if(data.operationStatus.progress==undefined){
              console.log(data);
              setTimeout(()=>{
                requery();
              },5000)
              return false;
            }
            if(data.operationStatus.progress < 100){
              callback(data.operationStatus);
              setTimeout(()=>{
                requery();
              },5000)
            }else {
              res(data.operationStatus);
            }     
          })
        // setTimeout(()=>{
        //   console.log(data.operationStatus.progress)
        //   data.operationStatus.progress++;        
        //   if(data.operationStatus.progress<100){
        //     callback(data.operationStatus);
        //     requery()
        //   }else{
        //     callback(data.operationStatus);
        //     res(data.operationStatus)
        //   }
        // },100)
      }
      requery();
    })
    return mypromise;
  }


  // 名字转换参数匹配 --> 传给子组件用
  namesTranslate:Object;
  inputNamests(){
    this.myhttp.inputNamesTransform()
      .subscribe((data)=>{
        this.namesTranslate = data;
      })
  }

}
