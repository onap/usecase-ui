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

  //url
  url = {
    // line up
    ns: '/api/nsd/v1/ns_descriptors/'+this.nsdInfoId+'/nsd_content',
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
  tableData:any;
  sdcData:any;
  vfcData:any;
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
  
  isVisible = false;
  isOkLoading = false; 
  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  // 处理tab切换 请求数据
  handleTabChange(tab,nsdInfoId,url) {
    this.tabTitle = tab;
    console.log(tab);
    console.log('nsdInfoId'+ nsdInfoId);
    console.log('vnfPkgId'+ vnfPkgId);
    console.log('pnfdInfoId'+ pnfdInfoId);
    console.log(this.url);
    switch (tab) {
      case 'NS':
          this.getTableData();
        break
      case 'VNF':
          this.getTableVnfData()
        break
      case 'PNF':
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
          formData.append('files[]', file);
        });
        this.nsuploading = true;
      break
      case "VNF": 
        this.fileListVNF.forEach((file: any) => {
          formData.append('files[]', file);
        });
        this.vnfuploading = true;
      break
      case "PNF": 
        this.fileListPNF.forEach((file: any) => {
          formData.append('files[]', file);
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
    //vfc
    this.myhttp.getOnboardTableData()
    .subscribe((data) => {
      console.log(data)
      this.vfcData = data;
      console.log(typeof this.vfcData)
      console.log("NSlist-vfc-->",data)
    }, (err) => {
      console.log(err);
    })
    // sdc
    this.myhttp.getSDC_NSTableData()
    .subscribe((data) => {
      console.log('NSlist-sdc-->',data)
      this.sdcData = data;
      this.tableData = this.MergeArray(this.vfcData, this.sdcData)
    }, (err) => {
     console.log(err);
    })
  }

  // 获取vnf列表
  getTableVnfData() {
    this.myhttp.getOnboardTableVnfData()
      .subscribe((data) => {
        console.log("vnfList-->", data);
        this.vfcData = data;
        console.log("vnfList-vfc-->",data)
      }, (err) => {
        console.log(err);
      })

    // sdc
    this.myhttp.getSDC_VNFTableData()
      .subscribe((data) => {
        console.log('vnfList-sdc-->', data)
        this.sdcData = data;
        this.tableData = this.MergeArray(this.vfcData, this.sdcData)
      }, (err) => {
        console.log(err);
      })
  }

  // 获取pnf列表
  getTablePnfData() {   
    this.myhttp.getOnboardTablePnfData()
      .subscribe((data) => {
        console.log("pnfList-->", data);
        this.total = data["body"];
        this.tableData = data;
      }, (err) => {
        console.log(err);
      })
  }

  /* onboard  上传按钮 */
  // ns onboard
 
  success(): void {
    const modal = this.modalService.success({
      nzTitle: 'This is an success message',
      nzContent: 'Package Onboard Completed.'
    });

    window.setTimeout(() => modal.destroy(), 2000);
  }

  error(): void {
    this.modalService.error({
      nzTitle: 'This is an error message',
      nzContent: 'Package Onboard Failed!'
    });
  }
  updataNsService(id) {
    console.log(id);
    let requestBody = {
        "csarId": id
    }
    this.myhttp.getNsonboard(requestBody)
      .subscribe((data) => {
        console.log('onboard ns sdc', data);
        if(data["status"] == 200) {
          this.success();
         
        } else {
          this.error();
        }
        this.getTableData();
      }, (err) => {
        console.log(err);
      })
  }

  // vnf onboard
  updataVnfService(id) {
    this.status = "Onboarding";
    console.log(id)
    let requestBody = {
      "csarId": id
    }
  this.myhttp.getVnfonboard(requestBody)
    .subscribe((data) => {
      console.log('onboard vnf sdc', data);
     if(data["status"] == "200"){
          this.success();
        }else {
          this.error();
        }
    }, (err) => {
      console.log(err);
    })
  }

  // pnf onboard ?
  updataPnfService(id) {
    console.log('pnf',id);
  }


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
          setTimeout(Math.random() > 0.5 ? resolve : reject,1000);
          break
        case 'VNF':
          this.deleteVnfService(index,pkgid);
          setTimeout(Math.random() > 0.5 ? resolve : reject,1000);
          break
        case 'PNF':
          this.deletePnfService(index,pkgid);
          setTimeout(Math.random() > 0.5 ? resolve : reject,1000);
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
        console.log(44, data);
      }, (err) => {
        console.log(err);
      })
      console.log(index)
    this.tableData.splice(index, 1)
    console.log('数组长度',this.tableData.length)
	  this.getTableData()
   }

  //delete vnfItem
  deleteVnfService(index,pkgid) {
    console.log(pkgid)
    console.log("deleteVnfService!");
    this.myhttp.deleteVnfIdData(pkgid)
      .subscribe((data) => {
        console.log(44, data);
      }, (err) => {
        console.log(err);
      })
      console.log(index)
    this.tableData.splice(index, 1)
    console.log(this.tableData.length)
    this.getTableVnfData()
  }

  //delete PnfItem
  deletePnfService(index,pkgid) {
    console.log(pkgid)
    console.log("deletePnfService!");
    this.myhttp.deletePnfIdData(pkgid)
      .subscribe((data) => {
        console.log(44, data);
      }, (err) => {
        console.log(err);
      })
      console.log(index)
    this.tableData.splice(index, 1)
    console.log(this.tableData.length)
    this.getTablePnfData()
  }

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
}
