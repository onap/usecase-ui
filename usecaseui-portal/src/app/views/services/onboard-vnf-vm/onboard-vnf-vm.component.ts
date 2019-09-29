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

  // upload
  tabs: string[] = ['NS', 'VNF', 'PNF'];
  currentTab: string = 'NS'
  fileList: UploadFile[] = [];
  uploading:boolean = false;
  infoId: string;
  display: string = 'block';

  // table
  isSpinning: boolean = false;
  nsTableData: any[];
  vnfTableData: any[];
  pnfTableData: any[];
  status: string = "Onboard Available";
  pageIndex: number = 1;
  pageSize: number = 10;

  // update or delete
  isUpdate: boolean = false;
  jobId: string;

  //url
  url = {
    ns: '/api/nsd/v1/ns_descriptors/*_*/nsd_content',
    vnf: '/api/vnfpkgm/v1/vnf_packages/*_*/package_content',
    pnf: '/api/nsd/v1/pnf_descriptors/*_*/pnfd_content'
  };

  file: {
    name: string,
    uid: string,
    progress: number,
    status: boolean,
    success: number
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

  notificationAttributes: {
    title: string,
    imgPath: string,
    action: string,
    status: string,
    id: string
  }
  setNotification({ imgPath, action, status, id }):void{
    this.notificationAttributes = { title: this.currentTab, imgPath, action, status, id }
  }

  notificationSuccess(notificationModel: TemplateRef<{}>, action: string, id: string): void {
    this.setNotification({ imgPath:"assets/images/execute-success.png", action, status:"Success", id })
    this.notification.template(notificationModel);
  }
  notificationFailed(notificationModel: TemplateRef<{}>, action: string ,id: string): void{
    this.setNotification({ imgPath:"assets/images/execute-faild.png", action, status:"Failed", id })    
    this.notification.template(notificationModel);
  }

  // Handling tab switching request data
  handleTabChange(tab: string): void {
    this.currentTab = tab;
    this.fileList = [];
    delete this.file;
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

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList.splice(0,1,file);
    let API: string;
    if(this.currentTab === 'NS'){
      API = 'createNetworkServiceData';
    }else if(this.currentTab === 'VNF'){
      API = 'createVnfData';
    }else {
      API = 'createPnfData';
    }
    this.myhttp.getCreatensData(API, this.requestBody)//on-line
      .subscribe((data) => {
        this.infoId = data["id"];
      }, (err) => {
        console.log(err);
      })
    return false;
  }

  // Drag and drop and click the upload button
  onClick(): void {
    this.display = 'none';
    switch (this.currentTab) {
      case 'NS':
        this.handleUpload(this.url.ns.replace("*_*", this.infoId));
        this.getTableData();
        break
      case 'VNF':
        this.handleUpload(this.url.vnf.replace("*_*", this.infoId));
        this.getTableVnfData()
        break
      case 'PNF':
        this.handleUpload(this.url.pnf.replace("*_*", this.infoId));
        this.getTablePnfData();
        break
    }
  }

  handleUpload(url: string): void {
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    this.fileList.forEach((file: any) => {
      formData.set('file', file);
    });
    this.uploading = true;
    this.file = {
      name: this.fileList[0].name,
      uid: this.fileList[0].uid,
      progress: 0,
      status: true,
      success: 0
    };
    let requery = (file) => {
      file.progress += 3;
      setTimeout(() => {
        if (file.progress < 100) {
          requery(file)
        }
      }, 100)
    };
    requery(this.file);
    const req = new HttpRequest('PUT', url, formData, {
      reportProgress: true,
      withCredentials: true
    });
    //Upload pre-empty array
    this.fileList = [];
    this.http.request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe(
        (event: {}) => {
          this.file.progress = 100;
          this.file.status = false;
          this.display = 'block';
          this.uploading = false;
          this.msg.success('upload successfully.');
        },
        err => {
          this.file.progress = 100;
          this.file.status = false;
          this.file.success = 1;
          this.uploading = false;
          this.msg.error('upload failed.');
        }
      );
  }

  // Get the NS list
  getTableData(): void{
    this.isSpinning = true;
    //ns vfc lists 
    this.myhttp.getOnboardTableData()
      .subscribe((data) => {
        this.nsTableData = data;
        //ns sdc list
        this.myhttp.getSDC_NSTableData()
          .subscribe((data) => {
            this.isSpinning = false; //loading hide
            let nsData = data;
            // this.NSTableData.map((nsvfc) => { nsvfc.sameid = nsData.find((nssdc) => { return nsvfc.id == nssdc.uuid }) && nsvfc.id; return nsvfc; });
            let sameData = nsData.filter((nssdc) => { return !this.nsTableData.find((nsvfc) => { return nsvfc.id == nssdc.uuid }) });
            this.nsTableData = this.nsTableData.concat(sameData);
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
  getTableVnfData(): void{
    this.isSpinning = true;
    //vnf vfc lists
    this.myhttp.getOnboardTableVnfData()
      .subscribe((data) => {
        this.vnfTableData = data;
        //vnf sdc lists
        this.myhttp.getSDC_VNFTableData()
          .subscribe((data) => {
            this.isSpinning = false; //loading hide
            let vnfData = data;
            // this.VNFTableData.map((vnfvfc) => { vnfvfc.sameid = this.vnfData.find((nssdc) => { return vnfvfc.id == nssdc.uuid }) && vnfvfc.id; return vnfvfc; });
            let sameData = vnfData.filter((vnfsdc) => { return !this.vnfTableData.find((vnfvfc) => { return vnfvfc.id == vnfsdc.uuid }) });
            this.vnfTableData = this.vnfTableData.concat(sameData);
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
        this.pnfTableData = data;
        this.isSpinning = false;   //loading hide
      }, (err) => {
        console.error(err);
        this.isSpinning = false; 
      })
  }

  // confirm
  showConfirm(requestBody: object, notificationModel: TemplateRef<{}>, id: string): void{
    let API = this.currentTab === 'NS'? 'getNsonboard' : 'getVnfonboard';
    this.modalService.confirm({
      nzTitle: '<p>Are you sure you want to do this?</p>',
      nzOnOk: () => {
        this.myhttp[API](requestBody)
          .subscribe((data) => {
            if (data.status == "success") {
              if(this.currentTab === 'NS'){
                this.isUpdate = false;
                this.notificationSuccess(notificationModel, "OnboardingState", id);
                this.getTableData();
              }else{
                this.jobId = data.jobId;
                this.queryProgress(this.jobId, notificationModel,id);
                this.getTableVnfData();
              }
            } else {
              this.isUpdate = false;
              this.notificationFailed(notificationModel, "OnboardingState", id);
              return false
            } 
          }, (err) => {
            console.log(err);
          })
      }
    })
  }


  // ns onboard Upload button
  updataService(id: string, notificationModel: TemplateRef<{}>) {
    this.isUpdate = true;
    let requestBody = { "csarId": id };
    this.showConfirm(requestBody, notificationModel, id)
  } 

  //Progress Progress inquiry
  queryProgress(jobId: string,  notificationModel: TemplateRef<{}>, id: string): any{
    let mypromise = new Promise((res) => {
      this.myhttp.getProgress(jobId, 0)
        .subscribe((data) => {
          if (data.responseDescriptor == null || data.responseDescriptor == "null" || data.responseDescriptor.progress == undefined || data.responseDescriptor.progress == null) {
            this.isUpdate = true;
            setTimeout(() => {
              this.queryProgress(this.jobId, notificationModel, id);
            }, 10000)
            return false
          }
          if (data.responseDescriptor.progress > 100) {
            this.isUpdate = false;
            this.notificationFailed(notificationModel, 'OnboardingState', id);
          }else if (data.responseDescriptor.progress < 100) {
            this.isUpdate = true;
            setTimeout(() => {
              this.queryProgress(this.jobId, notificationModel,id);
            }, 5000)
          } else {
            res(data);
            this.isUpdate = false;
            this.notificationSuccess(notificationModel, 'OnboardingState', id);
          }
          return false
        })
    })
    return mypromise;
  }

  /* delete button */
  showDeleteConfirm(pkgid: string, notificationModel: TemplateRef<{}>): void {
    this.modalService.confirm({
      nzTitle: 'Do you Want to delete these items?',
      nzContent: 'Do you Want to delete these items?',
      nzOkText: 'Yes',
      nzCancelText: 'No',
      nzOnOk: () => new Promise((resolve) => {
        this.deleteService(pkgid, notificationModel,resolve);
      }).catch(() => console.log('Oops errors!'))
    });
  }

  //delete nsItem
  deleteService(pkgid, notificationModel,resolve) {
    let API: string;
    if(this.currentTab === 'NS'){
      API = 'deleteNsIdData';
    }else if(this.currentTab === 'VNF'){
      API = 'deleteVnfIdData';
    }else{
      API = 'deletePnfIdData';
    }
    this.myhttp[API](pkgid)
      .subscribe((data) => {
        this.notificationSuccess(notificationModel, 'OnboardingState', pkgid);
        resolve()
        //refresh list after successful deletion
        switch(this.currentTab){
          case 'NS':
            this.getTableData();
            break
          case 'VNF':
            this.getTableVnfData();
            break
          case 'PNF':
            this.getTablePnfData();
            break
        }
      }, (err) => {
        console.log(err);
        this.notificationFailed(notificationModel, 'OnboardingState', pkgid);
      })
  }
}
