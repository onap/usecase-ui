import {Component, Input, OnInit} from '@angular/core';
import {NzModalService} from "ng-zorro-antd";
import {SlicingTaskServices} from '.././../../../../../core/services/slicingTaskServices';
import { SlicingBusinessModelComponent } from '../../slicing-business-management/slicing-business-model/slicing-business-model.component';
import { NssiModelComponent } from '../../nssi-management/nssi-model/nssi-model.component';
@Component({
  selector: 'app-nsi-model',
  templateUrl: './nsi-model.component.html',
  styleUrls: ['./nsi-model.component.less']
})
export class NsiModelComponent implements OnInit {

    constructor(
        private myhttp: SlicingTaskServices,
        private modalService: NzModalService
    ) {
    }
    @Input() nsiId;
    businessList: any[];
    nssiList: any[];
    isSpinning: boolean = true;
  ngOnInit() {
      this.getNsiDetail()
  }
    getNsiDetail() {
        this.myhttp.getSlicingNsiDetail(this.nsiId).subscribe(res => {
            this.isSpinning = false;
            const {result_header: {result_code}, result_body: {hosted_business_list,included_nssi_list} } = res;
            if (+result_code === 200) {
                this.businessList = hosted_business_list.map((item)=>{
                    if(item.service_instance_id !==null){
                        return item
                    }
                });
                this.nssiList = included_nssi_list.map((item)=>{
                    if(item.service_instance_id !==null){
                        return item
                    }
                });
            }
        })
    }
    showBusinessDetail(data){
        this.modalService.create({
            nzContent:SlicingBusinessModelComponent,
            nzTitle:"Detail",
            nzWidth:"70%",
            nzOkText: null,
            nzCancelText: null,
            nzComponentParams:{
                businessId:data.service_instance_id
            }
        });
    }
    showNssiDetail(data){
        this.modalService.create({
            nzContent:NssiModelComponent,
            nzTitle:"Detail",
            nzWidth:"70%",
            nzOkText: null,
            nzCancelText: null,
            nzComponentParams:{
                nssiId:data.service_instance_id
            }
        });
    }
}
