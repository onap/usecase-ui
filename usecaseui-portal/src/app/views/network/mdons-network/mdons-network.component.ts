/*
    Copyright (C) 2020 Fujitsu Network Communications, Inc. and others. All rights reserved.

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
import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { slideToRight } from '../../../shared/utils/animates';
import { ServiceListService } from '../../../core/services/serviceList.service';
import { networkHttpservice } from '../../../core/services/networkHttpservice.service';
import { Observable } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-mdons-network',
  templateUrl: './mdons-network.component.html',
  styleUrls: ['./mdons-network.component.less'],
  animations: [slideToRight]
})
export class MdonsNetworkComponent implements OnInit {
  
  @HostBinding('@routerAnimate') routerAnimateState;
  @ViewChild('notification') notification: any;

  ngOnInit(): void {
    //Load all the data
    this.getAllResources().subscribe(() => {
        this.getDomainList();
    });
  }
  constructor(private serviceHttp: ServiceListService, private networkHttp: networkHttpservice,private modalService: NzModalService)
  {
      
  }

  // variables
  isSpinning = false;
  messageShow = false;
  dm2Disable=true;
  node2Disable=true;
  isConfirmCreating = false;
  linkName = null;
  data= [];
  dataNNI=[]
  dm1List = [];
  dm1Selected = null;
  dm2List = [];
  dm2Selected = null;
  nodeList1= [];
  nodeList2= [];
  endPoint1Selected = null;
  endPoint2Selected = null;
  pInterfaceList1= [];
  pInterfaceList2= [];
  pInterface1Selected = null;
  pInterface2Selected = null;
  logicalLinkList = [];
  logicalLinkSelected=null;
  isConfirmDeleting =null;

  delBoxisVisible = false;

  //Fetching All domains and nodes (ie. NNI Nodes)
  getAllResources():Observable<boolean>{
    this.isSpinning = true;
    return new Observable(observer => {
            this.networkHttp.getNetworkD3Data()
              .subscribe((data) => {
                  this.data=data.slice();
                  if (data.length == 0) {
                      //write logic for error message
                      observer.error("No data avaliable");
                      observer.complete();
                  }
            this.serviceHttp.getAllNI("NNI")
             .subscribe((data) => {
               this.dataNNI=data.slice();
                }, (err) => {
                console.log(err);
                });
                  observer.next(true);
                  observer.complete();
                  this.isSpinning = false;
              })
            }) 
      }

  //get domain list
  getDomainList(){
    for (let i = 0; i < this.data.length; i++) {
        let dm = {};
        dm['id']=i;
        dm['name']=this.data[i]['networkId'];
        this.dm1List.push(dm);
    }
    this.dm2List=this.dm1List.slice();
  }

  //On change of domain 1
  dm1Change(): void {
    this.dm2List=this.dm1List.slice();
    this.dm2Disable=true;
    if(this.dm1Selected!=null){
        this.dm2Selected = null;
        this.endPoint1Selected = null;
        this.pInterface1Selected = null;
        this.dm2List.splice(this.dm1Selected, 1);
        this.dm2Disable=false;
        this.getNodeList1();
     }
    }

  //On change of domain 2
  dm2Change(): void {
    this.node2Disable=true;
    if(this.dm2Selected!=null){
        this.endPoint2Selected = null;
        this.pInterface2Selected = null;
        this.getNodeList2();
        this.node2Disable=false;
     }
    }

  //Fetch respective nodes for 1
  getNodeList1(){
    this.nodeList1=[];
    for (let i = 0; i < this.data[this.dm1Selected]["pnfs"].length; i++) {
        let node={};
        node['id']=this.data[this.dm1Selected]['pnfs'][i]['pnfName'];     
        this.serviceHttp.getPnfDetail(this.data[this.dm1Selected]['pnfs'][i]['pnfName'])
            .subscribe((data) => {
               node['name']=data['pnf-id']
            }, (err) => {
                console.log(err);
            });
            this.nodeList1.push(node);
    }
  }

  //Fetch respective nodes for 1
  getNodeList2(){
    this.nodeList2=[];
    for (let i = 0; i < this.data[this.dm2Selected]["pnfs"].length; i++) {
        let node={};
        node['id']=this.data[this.dm2Selected]['pnfs'][i]['pnfName'];     
        this.serviceHttp.getPnfDetail(this.data[this.dm2Selected]['pnfs'][i]['pnfName'])
            .subscribe((data) => {
               node['name']=data['pnf-id']
            }, (err) => {
                console.log(err);
            });
            this.nodeList2.push(node);
    }
  }

   //On change of node 1
  node1Change(): void {
        this.pInterface1Selected = null;
        this.getPInterfaces1();
    }

  //Get the Physical Interface data under the node 1
  getPInterfaces1() {
        let params = {
            pnfName: this.endPoint1Selected,
        };
        this.networkHttp.getPInterfacesData(params)
            .subscribe((data) => {
                this.pInterfaceList1 = [];
                let iplist=[];
                for (let i = 0; i < data.length; i++) {
                    let pi = {};
                    this.dataNNI.find(function(element) { 
                         if (element.includes(data[i]['interface-name']))
                         {
                            pi['id']= data[i]['interface-name'];
                            pi['name']= element.replace(data[i]['interface-name'],"");
                            iplist.push(pi);
                            return true;
                         } 
                         return false;
                      })
                }
                this.pInterfaceList1=iplist.slice();
            }, (err) => {
                console.log(err);
            });
    }

  //On change of node 2
  node2Change(): void {
        this.pInterface2Selected = null;
        this.getPInterfaces2();
    }

  //Get the Physical Interface data under the node 2
  getPInterfaces2() {
    let params = {
        pnfName: this.endPoint2Selected,
    };
    this.networkHttp.getPInterfacesData(params)
        .subscribe((data) => {
            this.pInterfaceList2 = [];
            let iplist=[];
            for (let i = 0; i < data.length; i++) {
                let pi = {};
                this.dataNNI.find(function(element) { 
                     if (element.includes(data[i]['interface-name']))
                     {
                        pi['id']= data[i]['interface-name'];
                        pi['name']= element.replace(data[i]['interface-name'],"");
                        iplist.push(pi);
                        return true;
                     } 
                     return false;
                  });
            }
            this.pInterfaceList2=iplist.slice();
        }, (err) => {
            console.log(err);
        });
    }
  //Create Logical connection, call interface createLink
  createLogicalLink() {
    let params = {
        'link-name': this.linkName,
        'link-type': 'inter-domain',
        'operational-status': 'up',
        'relationship-list': {
            'relationship': [
                {
                    'related-to': 'p-interface',
                    'related-link': '/aai/v14/network/pnfs/pnf/' + this.endPoint1Selected + '/p-interfaces/p-interface/' + this.pInterface1Selected,
                    'relationship-data': [
                        {
                            'relationship-key': 'pnf.pnf-id',
                            'relationship-value': this.endPoint1Selected
                        },
                        {
                            'relationship-key': 'p-interface.p-interface-id',
                            'relationship-value': this.pInterface1Selected,
                        }
                    ]
                },
                {
                    'related-to': 'p-interface',
                    'related-link': '/aai/v14/network/pnfs/pnf/' + this.endPoint2Selected + '/p-interfaces/p-interface/' + this.pInterface2Selected,
                    'relationship-data': [
                        {
                            'relationship-key': 'pnf.pnf-id',
                            'relationship-value': this.endPoint2Selected
                        },
                        {
                            'relationship-key': 'p-interface.p-interface-id',
                            'relationship-value': this.pInterface2Selected
                        }
                    ]
                }
            ]
        }
    };
    this.networkHttp.createLink(params)
        .subscribe((data) => {
            if (data['status'] == 'SUCCESS') {
                this.queryLogicalLink();
            }
            else if (data['status'] == 'FAILED') {
                console.log("Link Creation Failed : ", data);
                alert('\n\nLink Creation FAILED');
                this.isConfirmCreating=false;
            }
        }, (err) => {
            console.log(err);
            console.log('Create connection interface call failed');
            this.isConfirmCreating=false;
        });
    }

  //Query the newly added connection immediately after creating the logical link
  queryLogicalLink() {
        let linkName = this.linkName;
        let params = {
            'link-name': linkName,
        };
        this.networkHttp.querySpecificLinkInfo(params)
            .subscribe((data) => {
                console.log("Created Link: ", data);
                alert('\n\nLink Created With, \n\nName : ' + data['link-name'] + '\nResource version : ' + data['resource-version']);

                //Resetting the form
                this.linkName = null;
                this.dm1Selected = null;
                this.dm2Selected = null;
                this.endPoint1Selected = null;
                this.endPoint2Selected = null;
                this.pInterface1Selected = null;
                this.pInterface2Selected = null;
                this.dm2Disable=true;
                this.node2Disable=true;
                this.isConfirmCreating=false;
            }, (err) => {
                console.log(err);
            });
    }

  //When the form is submitted  
  submitForm(){
      this.isConfirmCreating=true;
        if (this.linkName == null ||this.linkName == ''|| this.dm1Selected == null || this.dm2Selected == null || this.endPoint1Selected == null || this.endPoint2Selected == null || this.pInterface1Selected == null || this.pInterface2Selected == null) {
            alert('Mandatory fields cannot be empty. Please select the right information.');
            this.isConfirmCreating=false;
            return;
        } 
        else{
            this.createLogicalLink();
        }
    }

  //Pop for confirming deletion
  showDeleteConfirm(): void {
        this.modalService.confirm({
          nzTitle: 'Confirm',
          nzContent: '<b>Are you sure you want to delete the link?</b>',
          nzOkText: 'Yes',
          nzOkType: 'danger',
          nzOnOk: () => this.deteleLink(),
          nzCancelText: 'No'
        });
    }

   //When detele link is clicked  
  showDelete(){
        this.getLinksData();
        this.delBoxisVisible = true;
    }

  //Delete link validaton
  delLink(){
        if (this.logicalLinkSelected===null || this.logicalLinkSelected.length===0) {
            alert('Mandatory fields cannot be empty. Please select the right information.');
            return;
        } 
        else{
            this.showDeleteConfirm();
        }
    }

   //Delete link
  deteleLink(){
    this.isConfirmDeleting = true;
    let params = {
        'logical-link': this.logicalLinkList[this.logicalLinkSelected]['name'],
        'resource-version': this.logicalLinkList[this.logicalLinkSelected]['resourceVersion'],
    };
    this.networkHttp.deleteLink(params)
        .subscribe((data) => {
            if (data['status'] == 'SUCCESS') {
                alert('Link ' + this.logicalLinkList[this.logicalLinkSelected]['name'] + ' deleted successfully.');
                this.delBoxisVisible = false;
                this.isConfirmDeleting = false;
                this.logicalLinkSelected = null;
            }
            else if (data['status'] == 'FAILED')
            {
                this.isConfirmDeleting = false;
                alert('Link deletion failed!');
                console.log("Response :", data);
                console.log('Deleting the logical link failed');
            }
        }, (err) => {
            this.isConfirmDeleting = false;
            alert('Link deletion failed!');
            console.log(err);
            console.log('Deleting a connection interface call failed');
        });
    }

  //On cancel of deletion  
  hideDel(){
    this.delBoxisVisible=false;
  }

  //Get Logical links
  getLinksData() {
    this.isSpinning = true;
    this.logicalLinkList=[];
    this.networkHttp.getLogicalLinksData()
        .subscribe((data) => {
            let j = 0;
            for (let i = 0; i < data['logical-link'].length; i++) {
                if(data['logical-link'][i]['link-type']=="inter-domain"){
                    let logicalLink = {};
                    logicalLink['id']=j++;
                    logicalLink['resourceVersion']=data['logical-link'][i]['resource-version'];
                    logicalLink['name']=data['logical-link'][i]['link-name'];
                    this.logicalLinkList.push(logicalLink);
                }
            }
            this.isSpinning = false;
        }, (err) => {
            alert('Fetching logical links failed!');
            console.log(err);
            console.log('Fetching logical links failed!');
            this.isSpinning = false;
        })
    }
}
