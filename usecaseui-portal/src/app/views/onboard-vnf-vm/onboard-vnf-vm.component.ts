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
import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { onboardService } from '../../core/services/onboard.service';
import { slideToRight } from '../../shared/utils/animates';
import { NzMessageService, UploadFile, NzModalService } from 'ng-zorro-antd';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-onboard-vnf-vm',
  templateUrl: './onboard-vnf-vm.component.html',
  styleUrls: ['./onboard-vnf-vm.component.less'],
  animations: [slideToRight]
})
export class OnboardVnfVmComponent implements OnInit {
  @HostBinding('@routerAnimate') routerAnimateState;
  @ViewChild('notification') notification: any;

  // upload
  tabs: string[] = ['NS', 'VNF', 'PNF', 'NLP Model Reource'];
  currentTab: string = 'NS'
  fileList: UploadFile[] = [];
  uploading: boolean = false;
  infoId: string;
  display: string = 'block';

  // table
  isSpinning: boolean = false;
  nsTableData: any[];
  vnfTableData: any[];
  pnfTableData: any[];
  modelTableData: any[];
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
    pnf: '/api/nsd/v1/pnf_descriptors/*_*/pnfd_content',
    model: '/api/usecaseui-server/v1/intent/uploadModel'
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
    private modalService: NzModalService
  ) { }

  //default Call ns data by default
  ngOnInit() {
    this.getTableData();
  }

  // Handling tab switching request data
  handleTabChange(tab: string): void {
    this.currentTab = tab;
    this.fileList = [];
    this.display = 'block';
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
      case 'NLP Model Reource':
        this.getTableModelData();
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
    this.fileList.splice(0, 1, file);
    let API: string;
    if (this.currentTab === 'NS') {
      API = 'createNetworkServiceData';
    } else if (this.currentTab === 'VNF') {
      API = 'createVnfData';
    } else if (this.currentTab === 'PNF') {
      API = 'createPnfData';
    } else {
      return false;
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
    let tab = this.currentTab === 'NS' ? 'ns' : (this.currentTab === 'VNF' ? 'vnf' : (this.currentTab === 'PNF' ? 'pnf' : 'model'));
    let url = tab === "model" ? this.url[tab] : this.url[tab].replace("*_*", this.infoId);
    tab === "model" ? this.handleUploadModel(url) : this.handleUpload(url);
  }

  handleUploadModel(url: string): void {
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
    const req = new HttpRequest('POST', url, formData, {
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
          this.uploading = false;
          this.msg.success('upload successfully.');
          this.getTableModelData();
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
          this.uploading = false;
          this.msg.success('upload successfully.');
          this.currentTab === 'NS' ? this.getTableData() : (this.currentTab === 'VNF' ? this.getTableVnfData() : this.getTablePnfData());
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
  getTableData(): void {
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
            this.msg.error(err);
            this.isSpinning = false;
          })
      }, (err) => {
        this.msg.error(err);
        this.isSpinning = false;
      })
  }

  // Get the vnf list
  getTableVnfData(): void {
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

  // Get Model list
  getTableModelData() {
    this.isSpinning = true;
    this.myhttp.getOnboardTableModelData()
      .subscribe((data) => {
        data.forEach(element => {
          element['size'] = `${element['size']}K`;
        })
        this.modelTableData = data;
        this.isSpinning = false;   //loading hide
      }, (err) => {
        console.error(err);
        this.isSpinning = false;
      })
  }

  // confirm
  showConfirm(requestBody: object, id: string): void {
    let API = this.currentTab === 'NS' ? 'getNsonboard' : 'getVnfonboard';
    this.modalService.confirm({
      nzTitle: '<p>Are you sure you want to do this?</p>',
      nzOnOk: () => {
        this.myhttp[API](requestBody)
          .subscribe((data) => {
            if (data.status == "success") {
              if (this.currentTab === 'NS') {
                this.isUpdate = false;
                this.notification.notificationSuccess(this.currentTab, "OnboardingState", id);
                this.getTableData();
              } else {
                this.jobId = data.jobId;
                this.queryProgress(this.jobId, id);
                this.getTableVnfData();
              }
            } else {
              this.isUpdate = false;
              this.notification.notificationFailed(this.currentTab, "OnboardingState", id);
              return false
            }
          }, (err) => {
            console.log(err);
          })
      }
    })
  }


  // ns onboard Upload button
  updataService(id: string) {
    this.isUpdate = true;
    let requestBody = { "csarId": id };
    this.showConfirm(requestBody, id)
  }

  //Progress Progress inquiry
  queryProgress(jobId: string, id: string): any {
    let mypromise = new Promise((res) => {
      this.myhttp.getProgress(jobId, 0)
        .subscribe((data) => {
          if (data.responseDescriptor == null || data.responseDescriptor == "null" || data.responseDescriptor.progress == undefined || data.responseDescriptor.progress == null) {
            this.isUpdate = true;
            setTimeout(() => {
              this.queryProgress(this.jobId, id);
            }, 10000)
            return false
          }
          if (data.responseDescriptor.progress > 100) {
            this.isUpdate = false;
            this.notification.notificationFailed(this.currentTab, 'OnboardingState', id);
          } else if (data.responseDescriptor.progress < 100) {
            this.isUpdate = true;
            setTimeout(() => {
              this.queryProgress(this.jobId, id);
            }, 5000)
          } else {
            res(data);
            this.isUpdate = false;
            this.notification.notificationSuccess(this.currentTab, 'OnboardingState', id);
          }
          return false
        })
    })
    return mypromise;
  }

  /* delete button */
  showDeleteConfirm(pkgid: string): void {
    this.modalService.confirm({
      nzTitle: 'Do you Want to delete these items?',
      nzContent: 'Do you Want to delete these items?',
      nzOkText: 'Yes',
      nzCancelText: 'No',
      nzOnOk: () => new Promise((resolve) => {
        this.deleteService(pkgid, resolve);
      }).catch(() => console.log('Oops errors!'))
    });
  }

  //delete nsItem
  deleteService(pkgid, resolve) {
    let API: string;
    if (this.currentTab === 'NS') {
      API = 'deleteNsIdData';
    } else if (this.currentTab === 'VNF') {
      API = 'deleteVnfIdData';
    } else if (this.currentTab === 'PNF') {
      API = 'deletePnfIdData';
    } else {
      API = 'deleteModelIdData';
    }
    this.myhttp[API](pkgid)
      .subscribe((data) => {
        resolve()
        let tipTitle = this.currentTab === 'NLP Model Reource' ? 'MODELREOURCE' : this.currentTab
        if(data.status === 'FAILED'){
            this.notification.notificationFailed(tipTitle, 'delete', pkgid);
        }else {
            this.notification.notificationSuccess(tipTitle, 'delete', pkgid);
        }
        //refresh list after successful deletion
        switch (this.currentTab) {
          case 'NS':
            this.getTableData();
            break
          case 'VNF':
            this.getTableVnfData();
            break
          case 'PNF':
            this.getTablePnfData();
            break
          case 'NLP Model Reource':
            this.getTableModelData();
            break
        }
      }, (err) => {
        console.log(err);
        this.notification.notificationFailed(this.currentTab, 'delete', pkgid);
      })
  }

  // Actived Model Resource
  activedModelFile(data) {
    console.log('actived model');
    let url = `/api/usecaseui-server/v1/intent/activeModel?modelId=${data.id}`;
    this.myhttp.getOnboardTableActiveModelData(url)
      .subscribe((data) => {
        if(data.status === 'FAILED'){
          this.msg.success('Actived Failed');
          return;
        }
        this.msg.success('Actived Successfully');
        this.getTableModelData();
      }, (err) => {
        console.error(err);
      });
  }
}
