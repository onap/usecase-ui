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
import { Component, OnInit, HostBinding, TemplateRef } from '@angular/core';
import { NzNotificationService, NzCollapseModule } from 'ng-zorro-antd';
import { onboardService } from '../../../core/services/onboard.service';
import { slideToRight } from '../../../shared/utils/animates';
import { NzMessageService, UploadFile, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-onboard-vnf-vm',
  templateUrl: './onboard-vnf-vm.component.html',
  styleUrls: ['./onboard-vnf-vm.component.less'],
  animations: [slideToRight]
})
export class OnboardVnfVmComponent implements OnInit {
  @HostBinding('@routerAnimate') routerAnimateState;

  // delete Modal
  confirmModal: NzModalRef;
  nsdInfoId: string;
  vnfPkgId: string;
  pnfdInfoId: string;
  nsuploading:boolean = false;
  vnfuploading:boolean = false;
  pnfloading: boolean = false;
  fileListNS: UploadFile[] = [];
  fileListVNF: UploadFile[] = [];
  fileListPNF: UploadFile[] = [];
  // onboard initial value
  status: string = "Onboard Available";
  jobId: string;
  //url
  url = {
    // line up
    ns: '/api/nsd/v1/ns_descriptors/*_*/nsd_content',
    vnf: '/api/vnfpkgm/v1/vnf_packages/*_*/package_content',
    pnf: '/api/nsd/v1/pnf_descriptors/*_*/pnfd_content'
  };
  constructor(
    private myhttp: onboardService,
    private http: HttpClient,
    private msg: NzMessageService,
    private modalService: NzModalService,
    private notification: NzNotificationService
  ) { }
  //default Call ns data by default
  ngOnInit() {
    this.getTableData();
  }

  //Tabular data
  nstableData: any;
  vnftableData: any;
  pnftableData: any;
  nspageIndex: number = 1;
  nspageSize: number = 10;
  vnfpageIndex: number = 1;
  vnfpageSize: number = 10;
  pnfpageIndex: number = 1;
  pnfpageSize: number = 10;

  nsloading: boolean = false;
  tabs: string[] = ['NS', 'VNF', 'PNF'];
  isSpinning: boolean = false;
  isNone: string = 'block';

  //2019.08.14 add
  notificationAttributes: {
    title: string,
    imgPath: string,
    action: string,
    status: string,
    id: string
  }
  setNotification({ title, imgPath, action, status, id }):void{
    this.notificationAttributes = { title, imgPath, action, status, id }
  }

  notificationSuccess(notificationModel,title,action,id) {
    this.setNotification({ title, imgPath:"assets/images/execute-success.png", action, status:"Success", id })
    this.notification.template(notificationModel);
  }
  notificationFailed(notificationModel,title,action,id) {
    this.setNotification({ title, imgPath:"assets/images/execute-faild.png", action, status:"Failed", id })    
    this.notification.template(notificationModel);
  }


  // Handling tab switching request data
  handleTabChange(tab) {
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


  // ns  beforeUpload
  beforeUploadNS = (file: UploadFile): boolean => {
    this.fileListNS.splice(0,1,file);
    this.myhttp.getCreatensData("createNetworkServiceData", this.requestBody)//on-line
      .subscribe((data) => {
        console.log(data)
        this.nsdInfoId = data["id"];
      }, (err) => {
        console.log(err);
      })
    return false;
  }

  //vnf  beforeUpload
  beforeUploadVNF = (file: UploadFile): boolean => {
    this.fileListVNF.splice(0,1,file);
    this.myhttp.getCreatensData("createVnfData", this.requestBody)//on-line
      .subscribe((data) => {
        this.vnfPkgId = data["id"];
      }, (err) => {
        console.log(err);
      })
    return false;
  }

  // //pnf eforeUpload
  beforeUploadPNF = (file: UploadFile): boolean => {
    this.fileListPNF.splice(0,1,file)
    this.myhttp.getCreatensData("createPnfData", this.requestBody)  //on-line
      .subscribe((data) => {
        this.pnfdInfoId = data["id"];
      }, (err) => {
        console.log(err);
      })
    return false;
  }

  //Drag and drop and click the upload button
  onClick(tab) {
    this.isNone = 'none';
    switch (tab) {
      case 'NS':
        this.handleUpload(this.url.ns.replace("*_*", this.nsdInfoId), tab);
        this.getTableData();
        break
      case 'VNF':
        this.handleUpload(this.url.vnf.replace("*_*", this.vnfPkgId), tab);
        this.getTableVnfData()
        break
      case 'PNF':
        this.handleUpload(this.url.pnf.replace("*_*", this.pnfdInfoId), tab);
        this.getTablePnfData();
        break
    }
  }

  nsfile: {
    name: string,
    uid: string,
    progress: number,
    status: boolean,
    success: number
  };
  vnffile: {
    name: string,
    uid: string,
    progress: number,
    status: boolean,
    success: number
  };
  pnffile:{
    name: string,
    uid: string,
    progress: number,
    status: boolean,
    success: number
  }
  //put Upload Upload
  handleUpload(url, tab): void {
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    switch (tab) {
      case "NS":
        this.fileListNS.forEach((file: any) => {
          formData.set('file', file);
        });
        this.nsuploading = true;
        this.nsfile = {
          name: this.fileListNS[0].name,
          uid: this.fileListNS[0].uid,
          progress: 0,
          status: true,
          success: 0
        };
        let requeryNS = (nsfile) => {
          nsfile.progress += 3;
          setTimeout(() => {
            if (nsfile.progress < 100) {
              requeryNS(nsfile)
            }
          }, 100)
        };
        requeryNS(this.nsfile);
        break
      case "VNF":
        this.fileListVNF.forEach((file: any) => {
          formData.set('file', file);
        });
        this.vnfuploading = true;
        this.vnffile = {
          name: this.fileListVNF[0].name,
          uid: this.fileListVNF[0].uid,
          progress: 0,
          status: true,
          success: 0
        };
        let requeryVnf = (vnffile) => {
          setTimeout(() => {
            vnffile.progress += 3;
            if (vnffile.progress < 100) {
              requeryVnf(vnffile)
            }
          }, 100)
        };
        requeryVnf(this.vnffile);
        break
      case "PNF":
        this.fileListPNF.forEach((file: any) => {
          formData.set('file', file);
        });
        this.pnfloading = true;
        this.pnffile = {
          name: this.fileListPNF[0].name,
          uid: this.fileListPNF[0].uid,
          progress: 0,
          status: true,
          success: 0
        };
        let requeryPnf = (pnffile) => {
          setTimeout(() => {
            pnffile.progress += 3;
            if (pnffile.progress < 100) {
              requeryPnf(pnffile)
            }
          }, 100)
        };
        requeryPnf(this.pnffile);
        break
    }
    // line PUT
    const req = new HttpRequest('PUT', url, formData, {
      reportProgress: true,
      withCredentials: true
    });
    //Upload pre-empty array
    this.fileListNS = [];
    this.fileListVNF = [];
    this.fileListPNF = [];
    this.http.request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe(
        (event: {}) => {
          if (tab == "NS") {
            this.nsfile.progress = 100;
            this.nsfile.status = false;
          }
          if (tab == "VNF") {
            this.vnffile.progress = 100;
            this.vnffile.status = false;
          }
          if (tab == "PNF") {
            this.pnffile.progress = 100;
            this.pnffile.status = false;
          }
          this.changeUploadingSta(tab);
          this.isNone = 'block';
          this.msg.success('upload successfully.');
        },
        err => {
          if (tab == "NS") {
            this.nsfile.progress = 100;
            this.nsfile.status = false;
            this.nsfile.success = 1;
          }
          if (tab == "VNF") {
            this.vnffile.progress = 100;
            this.vnffile.status = false;
            this.vnffile.success = 1;
          }
          if (tab == "PNF") {
            this.pnffile.progress = 100;
            this.pnffile.status = false;
            this.pnffile.success = 1;
          }
          this.changeUploadingSta(tab);
          this.isNone = 'block';
          this.msg.error('upload failed.');
        }
      );
  }

  //  Control the status of uploading
  changeUploadingSta(tab) {
    switch (tab) {
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

  // Get the NS list
  getTableData() {
    this.isSpinning = true;
    //ns vfc lists 
    this.myhttp.getOnboardTableData()
      .subscribe((data) => {
        this.nstableData = data;
        //ns sdc list
        this.myhttp.getSDC_NSTableData()
          .subscribe((data) => {
            this.isSpinning = false; //loading hide
            let nssdcData = data;
            this.nstableData.map((nsvfc) => { nsvfc.sameid = nssdcData.find((nssdc) => { return nsvfc.id == nssdc.uuid }) && nsvfc.id; return nsvfc; });
            let sameData = nssdcData.filter((nssdc) => { return !this.nstableData.find((nsvfc) => { return nsvfc.id == nssdc.uuid }) });
            this.nstableData = this.nstableData.concat(sameData);
          }, (err) => {
            console.error(err);
            this.isSpinning = false;
          })
      }, (err) => {
        console.error(err);
        this.isSpinning = false;
      })
    
  }

  // Get the vnf list
  getTableVnfData() {
    this.isSpinning = true;
    //vnf vfc lists
    this.myhttp.getOnboardTableVnfData()
      .subscribe((data) => {
        this.vnftableData = data;
        //vnf sdc lists
        this.myhttp.getSDC_VNFTableData()
          .subscribe((data) => {
            this.isSpinning = false; //loading hide
            let vnfsdcData = data;
            this.vnftableData.map((vnfvfc) => { vnfvfc.sameid = vnfsdcData.find((nssdc) => { return vnfvfc.id == nssdc.uuid }) && vnfvfc.id; return vnfvfc; });
            let sameData = vnfsdcData.filter((vnfsdc) => { return !this.vnftableData.find((vnfvfc) => { return vnfvfc.id == vnfsdc.uuid }) });
            this.vnftableData = this.vnftableData.concat(sameData);
          }, (err) => {
            console.error(err);
            this.isSpinning = false;
          })

      }, (err) => {
        console.error(err);
        this.isSpinning = false;
      })
  }

  // Get pnf list
  getTablePnfData() {
    this.isSpinning = true;
    this.myhttp.getOnboardTablePnfData()
      .subscribe((data) => {
        this.pnftableData = data;
        this.isSpinning = false;   //loading hide
      }, (err) => {
        console.error(err);
        this.isSpinning = false; 
      })
  }

  //-----------------------------------------------------------------------------------

  // modal
  showConfirm(requestBody, notificationModel, id, type): void{
    let API = type === 'NS'? 'getNsonboard' : 'getVnfonboard';
    this.modalService.confirm({
      nzTitle: '<p>Are you sure you want to do this?</p>',
      nzContent: '<b>Some descriptions</b>',
      nzOnOk: () => {
        this.myhttp[API](requestBody)
          .subscribe((data) => {
            if (data.status == "success") {
              if(type === 'NS'){
                this.onboardData.status = "onboarded";
                this.notificationSuccess(notificationModel, this.tabs[0],"OnboardingState",id);
                this.getTableData();
              }else{
                this.jobId = data.jobId;
                this.queryProgress(this.jobId, notificationModel,id);
                this.getTableVnfData();
              }
            } else {
              this.onboardData.status = "Failed";
              this.notificationFailed(notificationModel,this.tabs[0],"OnboardingState",id);
              return false
            } 
          }, (err) => {
            console.log(err);
          })
      }
    })
  }

  //onboard status
  onboardData = {
    status: "onboard",
    progress: 0,
  }
  currentIndex = 0;
  // ns onboard Upload button
  updataNsService(id, index, notificationModel) {
    this.currentIndex = index;
    this.onboardData.status = "onboarding"; //Disabled
    this.onboardData.progress = 0;
    let requestBody = { "csarId": id };
    this.showConfirm(requestBody,notificationModel,id,'NS')
  }

  // vnf onboard Upload button
  updataVnfService(id, index, notificationModel) {
    this.currentIndex = index;
    this.onboardData.status = "onboarding";  //Disabled button
    this.onboardData.progress = 0;
    let requestBody = { "csarId": id };
    this.showConfirm(requestBody,notificationModel,id,'VNF')
  }

  //Progress Progress inquiry
  queryProgress(jobId, notificationModel,id) {
    let mypromise = new Promise((res) => {
      this.myhttp.getProgress(jobId, 0)
        .subscribe((data) => {
          if (data.responseDescriptor === null ||data.responseDescriptor ===  "null" || data.responseDescriptor.progress == undefined ||  data.responseDescriptor.progress === null) {
            this.onboardData.status = "onboarding";
            setTimeout(() => {
              this.queryProgress(this.jobId, notificationModel,id);
            }, 10000)
            return false
          }
          if (data.responseDescriptor.progress > 100) {
            this.onboardData.status = "Failed";
            this.notificationFailed(notificationModel,'VNS','OnboardingState',id);
          }else if (data.responseDescriptor.progress < 100) {
            this.onboardData.status = "onboarding";
            setTimeout(() => {
              this.queryProgress(this.jobId, notificationModel,id);
            }, 5000)
          } else {
            res(data);
            this.onboardData.status = "onboarded";
            this.notificationSuccess(notificationModel,'VNS','OnboardingState',id);
          }
          return false
        })
    })
    return mypromise;
  }

  //--------------------------------------------------------------------------------
  /* delete button */
  showDeleteConfirm(pkgid, tab, notificationModel): void {
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Do you Want to delete these items?',
      nzContent: 'Do you Want to delete these items?',
      nzOkText: 'Yes',
      nzCancelText: 'No',
      nzOnOk: () => new Promise((resolve) => {
        switch (tab) {
          case 'NS':
            this.deleteNsService(pkgid, notificationModel,resolve);
            break
          case 'VNF':
            this.deleteVnfService(pkgid, notificationModel,resolve);
            break
          case 'PNF':
            this.deletePnfService(pkgid, notificationModel,resolve);
            break
        }
      }).catch(() => console.log('Oops errors!'))
    });
  }

  //delete nsItem
  deleteNsService(pkgid, notificationModel,resolve) {
    this.myhttp.deleteNsIdData(pkgid)
      .subscribe((data) => {
        this.notificationSuccess(notificationModel,'NS','OnboardingState',pkgid);
        resolve()
        //refresh list after successful deletion
        this.getTableData();
      }, (err) => {
        console.log(err);
        this.notificationFailed(notificationModel,'NS','OnboardingState',pkgid);
      })
  }

  //delete vnfItem
  deleteVnfService(pkgid, notificationModel,resolve) {
    this.myhttp.deleteVnfIdData(pkgid)
      .subscribe((data) => {
        this.notificationSuccess(notificationModel,'VNF','OnboardingState',pkgid);
        resolve()
        //refresh list after successful deletion
        this.getTableVnfData()
      }, (err) => {
        console.log(err);
        this.notificationFailed(notificationModel,'VNF','OnboardingState',pkgid);
      })
  }

  //delete PnfItem
  deletePnfService(pkgid, notificationModel,resolve) {
    this.myhttp.deletePnfIdData(pkgid)
      .subscribe((data) => {
        this.notificationSuccess(notificationModel,'PNF','OnboardingState',pkgid);
        resolve()
        //refresh list after successful deletion
        this.getTablePnfData()
      }, (err) => {
        console.log(err);
        this.notificationFailed(notificationModel,'PNF','OnboardingState',pkgid);
      })
  }

}
