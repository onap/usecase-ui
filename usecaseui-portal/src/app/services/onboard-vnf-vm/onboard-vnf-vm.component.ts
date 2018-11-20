import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, OnInit, HostBinding } from '@angular/core';
// import { MyhttpService } from '../../myhttp.service';
import { onboardService } from '../../onboard.service';
import { slideToRight } from '../../animates';
import { NzMessageService, UploadFile, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

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
  fileListNS: UploadFile[] = [];
  fileListVNF: UploadFile[] = [];
  fileListPNF: UploadFile[] = [];
  // onboard initial value
  status = "Onboard Available";
  jobid = '';
  //url
  url = {
    // line up
    ns: '/api/nsd/v1/ns_descriptors/'+this.nsdInfoId +'/nsd_content',
    vnf: '/api/vnfpkgm/v1/vnf_packages/'+this.vnfPkgId+'/package_content',
    pnf: '/api/nsd/v1/pnf_descriptors/'+this.pnfdInfoId+'/pnfd_content'
    // 本地
    // ns: 'https://jsonplaceholder.typicode.com/posts/',
    // vnf: 'https://jsonplaceholder.typicode.com/posts/',
    // pnf: 'https://jsonplaceholder.typicode.com/posts/',
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
  isVisible = false;
  isOkLoading = false; 
  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

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
        break
      case 'VNF':
          this.vnftableData = [];
          this.getTableVnfData()
        break
      case 'PNF':
          this.pnftableData = [];
          this.getTablePnfData()
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
    //  requestBody = {};
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
    console.log('fileListPNF--->' + this.fileListPNF);
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
  //拖拽后点击上传按钮
  onClick (tab) {
    switch (tab) {
      case 'NS':
      console.log(this.nsdInfoId);
      this.handleUpload('/api/nsd/v1/ns_descriptors/'+this.nsdInfoId+'/nsd_content',tab);
        // this.handleUpload(this.url.ns, tab);
        this.getTableData();
        break
      case 'VNF':
      console.log(this.vnfPkgId);
     this.handleUpload('/api/vnfpkgm/v1/vnf_packages/'+this.vnfPkgId+'/package_content',tab); 
        // this.handleUpload(this.url.vnf, tab); 
        this.getTableVnfData()
        break
      case 'PNF':
      console.log(this.pnfdInfoId);
      this.handleUpload('/api/nsd/v1/pnf_descriptors/'+this.pnfdInfoId+'/pnfd_content',tab);
        // this.handleUpload(this.url.pnf, tab);  
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
    //vfc
    this.myhttp.getOnboardTableData()
    .subscribe((data) => {
      console.log("NSlist-vfc-->",data);
      console.log("NSlist-length-vfc-->",data.length);
      this.nsvfcData = data;
      //loading
      this.nstableData = this.nsvfcData
    }, (err) => {
      console.log(err);
    })
    // sdc
    this.myhttp.getSDC_NSTableData()
    .subscribe((data) => {
      console.log('NSlist-sdc-->',data);
      console.log("NSlist-length-vfc-->",data.length);
      this.nssdcData = data;
      if (this.nsvfcData.length != 0 && this.nssdcData.length != 0){
        this.nstableData = this.MergeArray(this.nsvfcData, this.nssdcData) //Array deduplication
        }else if(this.nsvfcData.length === 0 && this.nssdcData.length != 0){
        this.nstableData = this.nsvfcData.concat(this.nssdcData); //Array concat
        }else if(this.nsvfcData.length != 0 && this.nssdcData.length === 0){
        this.nstableData = this.nsvfcData.concat(this.nssdcData); //Array concat
      }
      this.isSpinning = false;
    }, (err) => {
     console.log(err);
    })
    
    
  }

  // 获取vnf列表
  getTableVnfData() {
    this.isSpinning = true;
    this.myhttp.getOnboardTableVnfData()
      .subscribe((data) => {
        console.log("vnfList--vnf>", data);
        console.log("vnfList--vnf>", data.length);
        this.vnfvfcData = data;
        this.vnftableData = this.vnfvfcData
      }, (err) => {
        console.log(err);
      })

    // sdc
    this.myhttp.getSDC_VNFTableData()
      .subscribe((data) => {
        console.log('vnfList-sdc-->', data)
        console.log('vnfList-sdc-->', data.length)
        this.vnfsdcData = data;
        if (this.vnfvfcData.length != 0 && this.vnfsdcData.length != 0){
          this.vnftableData = this.MergeArray(this.vnfvfcData, this.vnfsdcData) //Array deduplication
          }else if(this.vnfvfcData.length === 0 && this.vnfsdcData.length != 0){
          this.vnftableData = this.vnfvfcData.concat(this.vnfsdcData); //Array concat
          }else if(this.vnfvfcData.length != 0 && this.vnfsdcData.length === 0){
          this.vnftableData = this.vnfvfcData.concat(this.vnfsdcData); //Array concat
          console.log(this.vnftableData)
        }
        this.isSpinning = false;
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
        this.isSpinning = false;
      }, (err) => {
        console.log(err);
      })
  }

  //合并并去重
  MergeArray(arr1, arr2) {
    var _arr = new Array();
    for (var i = 0; i < arr1.length; i++) {
      if (arr1[i] != "") {
        _arr.push(arr1[i]);
      }
    }
    for (var i = 0; i < arr2.length; i++) {
      var flag = true;
      for (var j = 0; j < arr1.length; j++) {
        // 根据vfc列表arr1的id和sdc列表arr2的uuid去重
        if (arr2[i].uuid == arr1[j].id) {
          flag = false;
          break;
        }
      }
      if (flag && arr2[i] != "") {
        _arr.push(arr2[i]);
      }
    }
    return _arr;
  }

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
    window.setTimeout(() => modal.destroy(), 2000);
  }

  //失败弹框
  error(): void {
    this.modalService.error({
      nzTitle: 'This is an error message',
      nzContent: 'Package Onboard Failed!'
    });
  }

  // ns onboard 上传按钮
  updataNsService(id) {
    console.log(id);
    let requestBody = {
        "csarId": id
    }
    this.myhttp.getNsonboard(requestBody)
      .subscribe((data) => {
        console.log('onboard ns sdc-->', data);
        this.jobid =  data.jobid;
        this.queryProgress(this.jobid,0);
      }, (err) => {
        console.log(err);
      })
  }

  // vnf onboard 上传按钮
  updataVnfService(id) {
    // this.status = "Onboarding";
    console.log(id)
    let requestBody = {
      "csarId": id
    }
  this.myhttp.getVnfonboard(requestBody)
    .subscribe((data) => {
      console.log('onboard vnf sdc-->', data);
      this.jobid =  data.jobid;
      this.queryProgress(this.jobid,0);
    }, (err) => {
      console.log(err);
    })
  }

  // pnf onboard 
  // updataPnfService(id) {
  //   console.log('pnf',id);
  // }
 queryProgress(jobid,responseId){
    let mypromise = new Promise((res,rej)=>{
        this.myhttp.getProgress(jobid,responseId)
          .subscribe((data)=>{
            console.log("progressData-->");
            console.log(data);
            if(data.responseDescriptor == null || data.responseDescriptor.progress==undefined){
              this.error();
            };
            if(data.responseDescriptor.progress < 100){
              this.error();
            }else if(data.responseDescriptor.progress == 100){
              res(data);
              console.log(data);
              this.success();
            }     
          })
    })
    return mypromise;
  }


  // queryProgress(jobid,callback){
  //   let mypromise = new Promise((res,rej)=>{
  //     let requery = (responseId)=>{

  //         this.myhttp.getProgress(jobid,responseId)
  //           .subscribe((data)=>{
  //             if(data.responseDescriptor.progress==undefined){
  //               console.log(data);
  //               setTimeout(()=>{
  //                 requery(data.responseDescriptor.responseId);
  //               },5000)
  //               return false;
  //             }
  //             if(data.responseDescriptor.progress < 100){
  //               callback(data);
  //               setTimeout(()=>{
  //                 requery(data.responseDescriptor.responseId);
  //               },5000)
  //             }else {
  //               res(data);
  //             }     
  //           })
  //     }
  //     requery(0);
  //   })
  //   return mypromise;
  // }


  //--------------------------------------------------------------------------------
  /* delete  删除按钮 */
  // ns
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

  /* delete  删除按钮 */
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
