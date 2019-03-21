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
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, OnInit, HostBinding } from '@angular/core';
// import { MyhttpService } from '../../myhttp.service';
import { onboardService } from '../../onboard.service';
import { slideToRight } from '../../animates';
import { NzMessageService, UploadFile, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import * as $ from 'jquery';


@Component({
  selector: 'app-onboard-vnf-vm',
  templateUrl: './onboard-vnf-vm.component.html',
  styleUrls: ['./onboard-vnf-vm.component.less'],
  animations: [ slideToRight ]
})
export class OnboardVnfVmComponent implements OnInit {
  @HostBinding('@routerAnimate') routerAnimateState;
  
  // delete Modal
  confirmModal: NzModalRef; 
  nsdInfoId = '';
  vnfPkgId ='';
  pnfdInfoId = '';
  tabTitle = "NS";
  nsuploading = false;
  vnfuploading = false;
  pnfloading = false;
  fileList: UploadFile[] = [];
  fileListNS: UploadFile[] = [];
  fileListVNF: UploadFile[] = [];
  fileListPNF: UploadFile[] = [];
  // onboard initial value
  status = "Onboard Available";
  jobId = '';
  //url
  url = {
    // line up
    ns:  '/api/nsd/v1/ns_descriptors/'+this.nsdInfoId +'/nsd_content',
    vnf: '/api/vnfpkgm/v1/vnf_packages/'+this.vnfPkgId+'/package_content',
    pnf: '/api/nsd/v1/pnf_descriptors/'+this.pnfdInfoId+'/pnfd_content'
    // line local
    //ns: 'https://jsonplaceholder.typicode.com/posts/',
    //vnf: 'https://jsonplaceholder.typicode.com/posts/',
    //pnf: 'https://jsonplaceholder.typicode.com/posts/',
  };
  constructor(private myhttp: onboardService, private http: HttpClient, private msg: NzMessageService,private titleService: Title,private modal: NzModalService, private modalService: NzModalService) { }

  //default 默认调用ns数据
  ngOnInit() {
    this.getTableData();
  }

  //表格数据
  nstableData:any;
  vnftableData:any;
  pnftableData:any;
  nssdcData:any;
  nsvfcData:any;

  vnfsdcData:any;
  vnfvfcData:any;
  nspageIndex = 1;
  nspageSize = 10;
  vnfpageIndex = 1;
  vnfpageSize = 10;
  pnfpageIndex = 1;
  pnfpageSize = 10;
  total;
  nsloading = false;
  sortName = null;
  sortValue = null;
  tabs = ['NS', 'VNF', 'PNF'];
  isSpinning = false;

  // 处理tab切换 请求数据
  handleTabChange(tab) {
    this.tabTitle = tab;
    console.log(tab);
    console.log('nsdInfoId--->'+ this.nsdInfoId);
    console.log('vnfPkgId--->'+ this.vnfPkgId);
    console.log('pnfdInfoId--->'+ this.pnfdInfoId);
    console.log(this.url);
    switch (tab) {
      case 'NS':
          this.nstableData = [];
          this.getTableData();
          this.fileList = []; //切换时清空上传的文件
        break
      case 'VNF':
          this.vnftableData = [];
          this.getTableVnfData()
          this.fileList = [];
        break
      case 'PNF':
          this.pnftableData = [];
          this.getTablePnfData()
          this.fileList = [];
        break
    }
  }


  //before put create--Drag and drop files to the page before uploading
    requestBody = {
           "userDefinedData": {
                "additionalProp1": "",
                "additionalProp2": "",
                "additionalProp3": ""
           }
      }

  //NS/VNF列表添加文件
  beforeUpload = (file: UploadFile): boolean => {
    this.fileList.push(file);
    console.log('fileList' + this.fileList)
    return false;
  }

   // ns  beforeUpload
  beforeUploadNS = (file: UploadFile): boolean => {
    this.fileListNS.push(file);
    console.log('beforeUpload');
    console.log('fileListNS' + this.fileListNS);
    console.log('fileListNS' + JSON.stringify(this.fileListNS));
      this.myhttp.getCreatensData("createNetworkServiceData",this.requestBody)//on-line
      // this.myhttp.getCreatensData("creatensDataNS")  //local
        .subscribe((data) => {
          console.log("Data returned after dragging a file NS-->", data);
          this.nsdInfoId = data["id"];
          console.log("Data returned after dragging a file id-->",this.nsdInfoId);
        }, (err) => {
          console.log(err);
        })
    return false;
  }

  //vnf  beforeUpload
  beforeUploadVNF = (file: UploadFile): boolean => {
    this.fileListVNF.push(file);
    console.log('beforeUpload');
    console.log('fileListVNF--->' + this.fileListVNF);
    console.log('fileListVNF--->' + JSON.stringify(this.fileListVNF));
      this.myhttp.getCreatensData("createVnfData",this.requestBody)//on-line
      // this.myhttp.getCreatensData("creatensDataVNF") //local
        .subscribe((data) => {
          console.log("Data returned after dragging a file VNF-->", data);
          this.vnfPkgId = data["id"];
          console.log("Data returned after dragging a file id-->",this.vnfPkgId);
        }, (err) => {
          console.log(err);
        })
    return false;
  }

  // //pnf eforeUpload
  beforeUploadPNF = (file: UploadFile): boolean => {
    this.fileListPNF.push(file);
    console.log('beforeUpload');
    console.log('fileListPNF--->' + JSON.stringify(this.fileListPNF));
      this.myhttp.getCreatensData("createPnfData",this.requestBody)  //on-line
      // this.myhttp.getCreatensData("creatensDataPNF")  //local
        .subscribe((data) => {
          console.log("Data returned after dragging a file PNF-->", data);
          this.pnfdInfoId = data["id"];
          console.log("Data returned after dragging a file id-->",this.pnfdInfoId);
        }, (err) => {
          console.log(err);
        })
    return false;
  }

  //获取列表单条id
  onClickId(id,tab){
    switch (tab) {
      case 'NS':
      this.nsdInfoId = id;
      console.log(this.nsdInfoId);
      break
      case 'VNF':
      this.vnfPkgId = id;
      console.log(this.vnfPkgId);
      break
      case 'PNF':
      this.pnfdInfoId = id;
      console.log(this.pnfdInfoId);
      break
    }
  }
  
  //拖拽后点击上传按钮
  onClick (tab) {
    switch (tab) {
      case 'NS':
        console.log(this.nsdInfoId);
     // this.handleUpload('/api/nsd/v1/ns_descriptors/'+this.nsdInfoId+'/nsd_content',tab);
         this.handleUpload(this.url.ns, tab);
        this.getTableData();
        break
      case 'VNF':
      console.log(this.vnfPkgId);
     // this.handleUpload('/api/vnfpkgm/v1/vnf_packages/'+this.vnfPkgId+'/package_content',tab); 
        this.handleUpload(this.url.vnf, tab); 
        this.getTableVnfData()
        break
      case 'PNF':
      console.log(this.pnfdInfoId);
      // this.handleUpload('/api/nsd/v1/pnf_descriptors/'+this.pnfdInfoId+'/pnfd_content',tab);
        this.handleUpload(this.url.pnf, tab);  
        this.getTablePnfData();  
        break
    }
  }

  //put Upload 上传
  handleUpload(url,tab): void { 
    console.log('startUpload')
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    switch(tab) {
      case "NS": 
        this.fileListNS.forEach((file: any) => {
          formData.append('file', file);
        });
        this.nsuploading = true;
      break
      case "VNF": 
        this.fileListVNF.forEach((file: any) => {
          formData.append('file', file);
        });
        this.vnfuploading = true;
      break
      case "PNF": 
        this.fileListPNF.forEach((file: any) => {
          formData.append('file', file);
        });
        this.pnfloading = true;
      break
    }

    // this.nsuploading = true;
    // You can use any AJAX library you like
    // const req = new HttpRequest('POST', url, formData, {
    //   reportProgress: true,
    //   withCredentials: true
    // });
    // line PUT
    const req = new HttpRequest('PUT', url, formData, {
      reportProgress: true,
      withCredentials: true
    });
    console.log('req--->'+ JSON.stringify(req));
    console.log('formData--->'+ JSON.stringify(formData));
    //上传前置空数组
    this.fileList = [];
    this.fileListNS = [];
    this.fileListVNF = [];
    this.fileListPNF = [];
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe(
        (event: {}) => {
          this.changeUploadingSta(tab)
          console.log('upload successfully')
          this.msg.success('upload successfully.');
        },
        err => {
          this.changeUploadingSta(tab)
          console.log('upload failed')
          this.msg.error('upload failed.');
        }
      );
  }
  
//  控制uploading的状态
changeUploadingSta(tab) {
  switch(tab) {
    case "NS":
      this.nsuploading = false;
      break
    case "VNF": 
      this.vnfuploading = false;
      break
    case "PNF": 
      this.pnfloading = false;
  }
}

//----------------------------------------------------------------------------------------------

  // 获取NS列表
  getTableData() {
    this.isSpinning = true;
    //ns vfc lists 
    this.myhttp.getOnboardTableData()
    .subscribe((data) => {
      console.log("NSlist-vfc-->",data);
      console.log("NSlist-length-vfc-->",data.length);
      this.nsvfcData = data;
      this.nstableData = this.nsvfcData;


      //ns sdc list
      this.myhttp.getSDC_NSTableData()
        .subscribe((data) => {
          this.isSpinning = false; //loading hide
          console.log('NSlist-sdc-->',data);
          console.log("NSlist-length-vfc-->",data.length);
          this.nssdcData = data;

          this.nsvfcData.map((nsvfc)=>{ nsvfc.sameid = this.nssdcData.find((nssdc)=>{ return nsvfc.id == nssdc.uuid }) && nsvfc.id; return nsvfc;});
          console.log(this.nsvfcData);
          let sameData = this.nssdcData.filter((nssdc)=>{ return !this.nsvfcData.find((nsvfc)=>{ return nsvfc.id == nssdc.uuid})});
          this.nstableData = this.nstableData.concat(sameData);

         
          // if (this.nsvfcData.length != 0 && this.nssdcData.length != 0){
          //   this.nstableData = this.MergeArray(this.nsvfcData, this.nssdcData) //Array deduplication
          //   }else if(this.nsvfcData.length === 0 && this.nssdcData.length != 0){
          //   this.nstableData = this.nsvfcData.concat(this.nssdcData); //Array concat
          //   }else if(this.nsvfcData.length != 0 && this.nssdcData.length === 0){
          //   this.nstableData = this.nsvfcData.concat(this.nssdcData); //Array concat
          // }
      }, (err) => {
      console.log(err);
      })

    }, (err) => {
      console.log(err);
    }) 
    
  }

  // 获取vnf列表
  getTableVnfData() {
    this.isSpinning = true;
    //vnf vfc lists
    this.myhttp.getOnboardTableVnfData()
      .subscribe((data) => {
        console.log("vnfList--vnf>", data);
        console.log("vnfList--vnf>", data.length);
        this.vnfvfcData = data;
        this.vnftableData = this.vnfvfcData;
        //vnf sdc lists
        this.myhttp.getSDC_VNFTableData()
        .subscribe((data) => {
          this.isSpinning = false; //loading hide
          console.log('vnfList-sdc-->', data)
          console.log('vnfList-sdc-->', data.length)
          this.vnfsdcData = data;

          this.vnfvfcData.map((vnfvfc)=>{ vnfvfc.sameid = this.vnfsdcData.find((nssdc)=>{ return vnfvfc.id == nssdc.uuid }) && vnfvfc.id; return vnfvfc;});
          console.log(this.nsvfcData);
          let sameData = this.vnfsdcData.filter((vnfsdc)=>{ return !this.vnfvfcData.find((vnfvfc)=>{ return vnfvfc.id == vnfsdc.uuid})});
          this.vnftableData = this.vnftableData.concat(sameData);

          // if (this.vnfvfcData.length != 0 && this.vnfsdcData.length != 0){
          //   this.vnftableData = this.MergeArray(this.vnfvfcData, this.vnfsdcData) //Array deduplication
          //   }else if(this.vnfvfcData.length === 0 && this.vnfsdcData.length != 0){
          //   this.vnftableData = this.vnfvfcData.concat(this.vnfsdcData); //Array concat
          //   }else if(this.vnfvfcData.length != 0 && this.vnfsdcData.length === 0){
          //   this.vnftableData = this.vnfvfcData.concat(this.vnfsdcData); //Array concat
          //   console.log(this.vnftableData);
          // }
        }, (err) => {
          console.log(err);
        })

      }, (err) => {
        console.log(err);
      })
  }

  // 获取pnf列表
  getTablePnfData() { 
    this.isSpinning = true;  
    this.myhttp.getOnboardTablePnfData()
      .subscribe((data) => {
        console.log("pnfList-->", data);
        console.log("pnfList-->", data.length);
        this.pnftableData = data;
        this.isSpinning = false;   //loading hide
      }, (err) => {
        console.log(err);
      })
  }

  //合并并去重
  // MergeArray(arr1, arr2) {
  //   var _arr = new Array();
  //   for (var i = 0; i < arr1.length; i++) {
  //     if (arr1[i] != "") {
  //       _arr.push(arr1[i]);
  //     }
  //   }
  //   for (var i = 0; i < arr2.length; i++) {
  //     var flag = true;
  //     for (var j = 0; j < arr1.length; j++) {
  //       // 根据vfc列表arr1的id和sdc列表arr2的uuid去重
  //       if (arr2[i].uuid == arr1[j].id) {
  //         flag = false;
  //         break;
  //       }
  //     }
  //     if (flag && arr2[i] != "") {
  //       _arr.push(arr2[i]);
  //     }
  //   }
  //   return _arr;
  // }

//-----------------------------------------------------------------------------------
  /* onboard */
  //成功弹框
  success(tab): void {
    const modal = this.modalService.success({
      nzTitle: 'This is an success message',
      nzContent: 'Package Onboard Completed.'
    });
    switch(tab) {
      case "NS":
          console.log("NS成功弹框")
          this.getTableData();
        break
      case "VNF": 
        console.log("VNF成功弹框")
        this.getTableVnfData();
        break
    }
    // window.setTimeout(() => modal.destroy(), 5000);
  }

  //失败弹框
  error(): void {
    this.modalService.error({
      nzTitle: 'This is an error message',
      nzContent: 'Package Onboard Failed!'
    });
  }

  //onboard status
  onboardData ={
    status:"onboard",
    progress: 0,
  }
  currentIndex = 0;
  // ns onboard 上传按钮
  updataNsService(id,index) {
    this.currentIndex = index;
    this.onboardData.status = "onboarding"; //置灰
    this.onboardData.progress = 0;
    console.log("NS-onboard-id-->" + id);
    let requestBody = {
        "csarId": id
    }
    this.myhttp.getNsonboard(requestBody)
      .subscribe((data) => {
        console.log('onboard ns sdc-->', data);
        if(data.status == "failed"){
          console.log("Package Onboard Failed")
          this.onboardData.status = "Failed";
          this.error();
          return false
        }else if(data.status == "success"){
          this.success("NS");
          this.onboardData.status = "onboarded";
        }
      }, (err) => {
        console.log(err);
      })
  }

  // vnf onboard 上传按钮
  updataVnfService(id,index) {
    this.currentIndex = index;
    this.onboardData.status = "onboarding";  //按钮置灰
    this.onboardData.progress = 0;

    console.log("VNF-onboard-id-->" + id)
    let requestBody = {
      "csarId": id
    }
    this.myhttp.getVnfonboard(requestBody)
      .subscribe((data) => {
        console.log('onboard vnf sdc-->', data);
        this.jobId =  data.jobId;
        console.log('onboard vnf sdc jobId-->'+ data.jobId);
        this.queryProgress(this.jobId,0);   //vnf需要查询进度接口
      }, (err) => {
        console.log(err);
      })
  }

  // pnf onboard //暂时没有上传功能
  // updataPnfService(id) {
  //   console.log('pnf',id);
  // }

  //Progress 进度查询
  queryProgress(jobId,responseId){
    let mypromise = new Promise((res)=>{
        this.myhttp.getProgress(jobId,responseId)
          .subscribe((data)=>{
            console.log("progressData-->");
            console.log(data);
            if(data.responseDescriptor == null || data.responseDescriptor == "null" || data.responseDescriptor.progress == undefined || data.responseDescriptor.progress == null){
              console.log("progress == undefined");
              this.onboardData.status = "onboarding";
              setTimeout(()=>{
                this.queryProgress(this.jobId,0);
              },10000)
              return false
            }
            if(data.responseDescriptor.progress > 100){
              console.log("progress-->",data.responseDescriptor.progress)
              console.log("Package Onboard Failed")
              this.onboardData.status = "Failed";
              this.error();
              return false
            }
            if(data.responseDescriptor.progress < 100){
              this.onboardData.status = "onboarding";
              console.log("progress < 100")
              setTimeout(()=>{
                this.queryProgress(this.jobId,0);
              },5000)
            }else if(data.responseDescriptor.progress == 100){
              res(data);
              console.log("progress == 100");
              console.log(data);
              this.success("VNF");
              this.onboardData.status = "onboarded";
            }  
            return false
          })
    })
    return mypromise;
  }

  //--------------------------------------------------------------------------------
  /* delete  删除按钮 */
  showConfirm(index,pkgid,tab): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete these items?',
      nzContent: 'Do you Want to delete these items?',
      nzOkText    : 'Yes',
      nzCancelText: 'No',
      nzOnOk: () => new Promise((resolve, reject) => {
        switch (tab) {
          case 'NS':
          this.deleteNsService(index,pkgid);
          setTimeout(Math.random() > 0.5 ? resolve : reject,2000);
          break
        case 'VNF':
          this.deleteVnfService(index,pkgid);
          setTimeout(Math.random() > 0.5 ? resolve : reject,2000);
          break
        case 'PNF':
          this.deletePnfService(index,pkgid);
          setTimeout(Math.random() > 0.5 ? resolve : reject,2000);
          break   
        }
      }).catch(() => console.log('Oops errors!'))
    });
  }

  //delete nsItem
  deleteNsService(index,pkgid) {
    console.log(pkgid)
    console.log("deleteService!");
    this.myhttp.deleteNsIdData(pkgid)
      .subscribe((data) => {
        console.log("nsdel--->", data);
        //refresh list after successful deletion
        this.getTableData();
      }, (err) => {
        console.log(err);
      })
   }

  //delete vnfItem
  deleteVnfService(index,pkgid) {
    console.log(pkgid)
    console.log("deleteVnfService!");
    this.myhttp.deleteVnfIdData(pkgid)
      .subscribe((data) => {
        console.log('vnfdel--->', data);
        //refresh list after successful deletion
        this.getTableVnfData()
      }, (err) => {
        console.log(err);
      })
  }

  //delete PnfItem
  deletePnfService(index,pkgid) {
    console.log(pkgid)
    console.log("deletePnfService!");
    this.myhttp.deletePnfIdData(pkgid)
      .subscribe((data) => {
        console.log('pnfdel--->', data);
        //refresh list after successful deletion
        this.getTablePnfData()
      }, (err) => {
        console.log(err);
      })
  }

//------------------------------------------------------------------------------------
  //下载download
  // downloadNsService(id) {
  //   console.log('download')
  //   console.log(id)
  //   this.myhttp.downloadNsData(id)
  //   .subscribe((data) => {
  //     console.log(44, data);
  //   }, (err) => {
  //     console.log(err);
  //   })
  // }

  // downloadVnfService() {
  //   console.log('downloadVnf')
  //   this.myhttp.downloadVnfData()
  //   .subscribe((data) => {
  //     console.log('downloadVnf pack', data);
  //   }, (err) => {
  //     console.log(err);
  //   })
  // }

  // downloadPnfService(id) {
  //   console.log('downloadPnf')
  //   console.log(id)
  //   this.myhttp.downloadNsData(id)
  //   .subscribe((data) => {
  //     console.log(44, data);
  //   }, (err) => {
  //     console.log(err);
  //   })
  // }

}
