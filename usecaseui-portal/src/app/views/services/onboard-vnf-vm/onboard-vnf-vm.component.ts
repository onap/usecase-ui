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
import { NzNotificationService } from 'ng-zorro-antd';
// import { MyhttpService } from '../../myhttp.service';
import { onboardService } from '../../../core/services/onboard.service';
import { slideToRight } from '../../../shared/utils/animates';
import { NzMessageService, UploadFile, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

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
  vnfPkgId = '';
  pnfdInfoId = '';
  tabTitle = "NS";
  nsuploading:boolean = false;
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
    ns: '/api/nsd/v1/ns_descriptors/*_*/nsd_content',
    vnf: '/api/vnfpkgm/v1/vnf_packages/*_*/package_content',
    pnf: '/api/nsd/v1/pnf_descriptors/*_*/pnfd_content'
  };
  constructor(
    private myhttp: onboardService,
    private http: HttpClient,
    private msg: NzMessageService,
    private titleService: Title,
    private modal: NzModalService,
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
  nssdcData: any;

  vnfsdcData: any;
  nspageIndex: number = 1;
  nspageSize: number = 10;
  vnfpageIndex = 1;
  vnfpageSize = 10;
  pnfpageIndex = 1;
  pnfpageSize = 10;

  total;
  nsloading = false;
  sortName = null;
  sortValue = null;
  tabs = ['NS', 'VNF', 'PNF'];
  isSpinning: boolean = false;
  isNone: string = 'block';

  //2019.08.14 add
  notificationAttributes = {
    "title": this.tabs[0],
    "imgPath": "../../../../assets/images/execute-inproess.png",
    "action": "OnboardingState",
    "status": "InProgress",
    "id": null
  };
  notificationModelShow(template: TemplateRef<{}>): void {
    this.notification.template(template);
  }
  notificationSuccess(notificationModel) {
    this.notificationAttributes.imgPath = "../../../../assets/images/execute-success.png";
    this.notificationAttributes.status = "Success";
    this.notificationModelShow(notificationModel);
  }
  notificationFailed(notificationModel) {
    this.notificationAttributes.imgPath = "../../../../assets/images/execute-faild.png";
    this.notificationAttributes.status = "Failed";
    this.notificationModelShow(notificationModel);
  }
  // Handling tab switching request data
  handleTabChange(tab) {
    switch (tab) {
      case 'NS':
        this.nstableData = [];
        this.getTableData();
        this.fileList = []; //Empty uploaded files when switching
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

  //NS/VNF List add file
  beforeUpload = (file: UploadFile): boolean => {
    this.fileList.push(file);
    return false;
  }

  // ns  beforeUpload
  beforeUploadNS = (file: UploadFile): boolean => {
    this.fileListNS.splice(0,1,file);
    this.myhttp.getCreatensData("createNetworkServiceData", this.requestBody)//on-line
      .subscribe((data) => {
        this.nsdInfoId = data["id"];
      }, (err) => {
        console.log(err);
      })
    return false;
  }

  //vnf  beforeUpload
  beforeUploadVNF = (file: UploadFile): boolean => {
    this.fileListVNF.push(file);
    this.myhttp.getCreatensData("createVnfData", this.requestBody)//on-line
      // this.myhttp.getCreatensData("creatensDataVNF") //local
      .subscribe((data) => {
        this.vnfPkgId = data["id"];
      }, (err) => {
        console.log(err);
      })
    return false;
  }

  // //pnf eforeUpload
  beforeUploadPNF = (file: UploadFile): boolean => {
    this.fileListPNF.push(file);
    this.myhttp.getCreatensData("createPnfData", this.requestBody)  //on-line
      // this.myhttp.getCreatensData("creatensDataPNF")  //local
      .subscribe((data) => {
        this.pnfdInfoId = data["id"];
      }, (err) => {
        console.log(err);
      })
    return false;
  }

  //Get list list id
  onClickId(id, tab) {
    switch (tab) {
      case 'NS':
        this.nsdInfoId = id;
        break
      case 'VNF':
        this.vnfPkgId = id;
        break
      case 'PNF':
        this.pnfdInfoId = id;
        break
    }
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
  vnfRightList = [];
  vnfNum = 0;
  pnfRightList = [];
  pnfNum = 0;
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
          formData.append('file', file);
        });
        this.vnfuploading = true;
        let lastVnf = this.fileListVNF[this.fileListVNF.length - 1];
        let vnffile = {
          name: lastVnf.name,
          uid: lastVnf.uid,
          progress: 0,
          status: true,
          success: 0
        };
        this.vnfNum += 1;
        this.vnfRightList.push(vnffile);
        let requeryVnf = (vnffile) => {
          setTimeout(() => {
            vnffile.progress += 2;
            if (vnffile.progress < 100) {
              requeryVnf(vnffile)
            } else {
              vnffile.progress = 100;
              vnffile.status = false;
            }
          }, 100)
        };
        requeryVnf(vnffile);
        break
      case "PNF":
        this.fileListPNF.forEach((file: any) => {
          formData.append('file', file);
        });
        this.pnfloading = true;
        let lastPnf = this.fileListPNF[this.fileListPNF.length - 1];
        let pnffile = {
          name: lastPnf.name,
          uid: lastPnf.uid,
          progress: 0,
          status: true,
          success: 0
        };
        this.pnfNum += 1;
        this.pnfRightList.push(pnffile);
        let requeryPnf = (pnffile) => {
          setTimeout(() => {
            pnffile.progress += 2;
            if (pnffile.progress < 100) {
              requeryPnf(pnffile)
            } else {
              pnffile.progress = 100;
              pnffile.status = false;
            }
          }, 100)
        };
        requeryPnf(pnffile);
        break
    }
    // line PUT
    const req = new HttpRequest('PUT', url, formData, {
      reportProgress: true,
      withCredentials: true
    });
    //Upload pre-empty array
    this.fileList = [];
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
            this.isNone = 'block';
          }
          if (tab == "VNF") {
            this.vnfRightList[this.vnfNum - 1].progress = 100;
            this.vnfRightList[this.vnfNum - 1].status = false;
            this.vnfRightList[this.vnfNum - 1].success = 0;
          }
          if (tab == "PNF") {
            this.pnfRightList[this.pnfNum - 1].progress = 100;
            this.pnfRightList[this.pnfNum - 1].status = false;
            this.pnfRightList[this.pnfNum - 1].success = 0;
          }
          this.changeUploadingSta(tab);
          this.msg.success('upload successfully.');
        },
        err => {
          if (tab == "NS") {
            this.nsfile.progress = 100;
            this.nsfile.status = false;
            this.nsfile.success = 1;
          }
          if (tab == "VNF") {
            this.vnfRightList[this.vnfNum - 1].progress = 100;
            this.vnfRightList[this.vnfNum - 1].status = false;
            this.vnfRightList[this.vnfNum - 1].success = 1;
          }
          if (tab == "PNF") {
            this.pnfRightList[this.pnfNum - 1].progress = 100;
            this.pnfRightList[this.pnfNum - 1].status = false;
            this.pnfRightList[this.pnfNum - 1].success = 1;
          }
          this.changeUploadingSta(tab);
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
            this.nssdcData = data;
            this.nstableData.map((nsvfc) => { nsvfc.sameid = this.nssdcData.find((nssdc) => { return nsvfc.id == nssdc.uuid }) && nsvfc.id; return nsvfc; });
            let sameData = this.nssdcData.filter((nssdc) => { return !this.nstableData.find((nsvfc) => { return nsvfc.id == nssdc.uuid }) });
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
            this.vnfsdcData = data;
            this.vnftableData.map((vnfvfc) => { vnfvfc.sameid = this.vnfsdcData.find((nssdc) => { return vnfvfc.id == nssdc.uuid }) && vnfvfc.id; return vnfvfc; });
            let sameData = this.vnfsdcData.filter((vnfsdc) => { return !this.vnftableData.find((vnfvfc) => { return vnfvfc.id == vnfsdc.uuid }) });
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
  /* onboard */
  //Successful frame
  success(tab): void {
    const modal = this.modalService.success({
      nzTitle: 'This is an success message',
      nzContent: 'Package Onboard Completed.'
    });
    switch (tab) {
      case "NS":
        this.getTableData();
        break
      case "VNF":
        this.getTableVnfData();
        break
    }
  }

  //Failure frame
  error(): void {
    this.modalService.error({
      nzTitle: 'This is an error message',
      nzContent: 'Package Onboard Failed!'
    });
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
    let requestBody = {
      "csarId": id
    };
    this.notificationAttributes = {
      "title": this.tabs[0],
      "imgPath": "../../../../assets/images/execute-inproess.png",
      "action": "OnboardingState",
      "status": "InProgress",
      "id": id
    };
    this.notificationModelShow(notificationModel);
    this.myhttp.getNsonboard(requestBody)
      .subscribe((data) => {
        if (data.status == "failed") {
          this.onboardData.status = "Failed";
          this.notificationFailed(notificationModel);
          this.error();
          return false
        } else if (data.status == "success") {
          this.success("NS");
          this.onboardData.status = "onboarded";
          this.notificationSuccess(notificationModel);
        }
      }, (err) => {
        console.log(err);
      })
  }

  // vnf onboard Upload button
  updataVnfService(id, index, notificationModel) {
    this.currentIndex = index;
    this.onboardData.status = "onboarding";  //Disabled button
    this.onboardData.progress = 0;


    let requestBody = {
      "csarId": id
    };
    this.notificationAttributes = {
      "title": this.tabs[1],
      "imgPath": "../../../../assets/images/execute-inproess.png",
      "action": "OnboardingState",
      "status": "InProgress",
      "id": id
    };
    this.notificationModelShow(notificationModel);
    this.myhttp.getVnfonboard(requestBody)
      .subscribe((data) => {
        this.jobId = data.jobId;
        this.queryProgress(this.jobId, 0, notificationModel);   //vnf Need to query progress interface
      }, (err) => {
        console.log(err);
      })
  }

  //Progress Progress inquiry
  queryProgress(jobId, responseId, notificationModel) {
    let mypromise = new Promise((res) => {
      this.myhttp.getProgress(jobId, responseId)
        .subscribe((data) => {
          if (data.responseDescriptor == null || data.responseDescriptor == "null" || data.responseDescriptor.progress == undefined || data.responseDescriptor.progress == null) {
            this.onboardData.status = "onboarding";
            setTimeout(() => {
              this.queryProgress(this.jobId, 0, notificationModel);
            }, 10000)
            return false
          }
          if (data.responseDescriptor.progress > 100) {
            this.onboardData.status = "Failed";
            this.notificationFailed(notificationModel);
            this.error();
            return false
          }
          if (data.responseDescriptor.progress < 100) {
            this.onboardData.status = "onboarding";
            setTimeout(() => {
              this.queryProgress(this.jobId, 0, notificationModel);
            }, 5000)
          } else if (data.responseDescriptor.progress == 100) {
            res(data);
            this.success("VNF");
            this.onboardData.status = "onboarded";
            this.notificationSuccess(notificationModel);
          }
          return false
        })
    })
    return mypromise;
  }

  //--------------------------------------------------------------------------------
  /* delete button */
  showConfirm(index, pkgid, tab, notificationModel): void {
    this.notificationAttributes = {
      "title": this.tabs[0],
      "imgPath": "../../../../assets/images/execute-inproess.png",
      "action": "OnboardingState",
      "status": "InProgress",
      "id": pkgid
    };
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete these items?',
      nzContent: 'Do you Want to delete these items?',
      nzOkText: 'Yes',
      nzCancelText: 'No',
      nzOnOk: () => new Promise((resolve, reject) => {
        switch (tab) {
          case 'NS':
            this.notificationAttributes.title = this.tabs[0];
            this.notificationModelShow(notificationModel);
            this.deleteNsService(index, pkgid, notificationModel);
            setTimeout(Math.random() > 0.5 ? resolve : reject, 2000);
            break
          case 'VNF':
            this.notificationAttributes.title = this.tabs[1];
            this.notificationModelShow(notificationModel);
            this.deleteVnfService(index, pkgid, notificationModel);
            setTimeout(Math.random() > 0.5 ? resolve : reject, 2000);
            break
          case 'PNF':
            this.notificationAttributes.title = this.tabs[2];
            this.notificationModelShow(notificationModel);
            this.deletePnfService(index, pkgid, notificationModel);
            setTimeout(Math.random() > 0.5 ? resolve : reject, 2000);
            break
        }
      }).catch(() => console.log('Oops errors!'))
    });
  }

  //delete nsItem
  deleteNsService(index, pkgid, notificationModel) {
    this.myhttp.deleteNsIdData(pkgid)
      .subscribe((data) => {
        this.notificationSuccess(notificationModel);
        //refresh list after successful deletion
        this.getTableData();
      }, (err) => {
        console.log(err);
        this.notificationFailed(notificationModel);
      })
  }

  //delete vnfItem
  deleteVnfService(index, pkgid, notificationModel) {
    this.myhttp.deleteVnfIdData(pkgid)
      .subscribe((data) => {
        this.notificationSuccess(notificationModel);
        //refresh list after successful deletion
        this.getTableVnfData()
      }, (err) => {
        console.log(err);
        this.notificationFailed(notificationModel);
      })
  }

  //delete PnfItem
  deletePnfService(index, pkgid, notificationModel) {
    this.myhttp.deletePnfIdData(pkgid)
      .subscribe((data) => {
        //refresh list after successful deletion
        this.notificationSuccess(notificationModel);
        this.getTablePnfData()
      }, (err) => {
        console.log(err);
        this.notificationFailed(notificationModel);
      })
  }

}
