import {Component, Input, OnInit} from '@angular/core';
import {NzModalService, NzMessageService} from "ng-zorro-antd";
import {SlicingTaskServices} from '.././../../../../../core/services/slicingTaskServices';
import { NsiModelComponent } from '../../nsi-management/nsi-model/nsi-model.component';
@Component({
  selector: 'app-nssi-model',
  templateUrl: './nssi-model.component.html',
  styleUrls: ['./nssi-model.component.less']
})
export class NssiModelComponent implements OnInit {

    constructor(
        private myhttp: SlicingTaskServices,
        private modalService: NzModalService,
        private message: NzMessageService
    ) {
    }
    @Input() nssiId;
    nsiList: any[];
    isSpinning: boolean = true;
  ngOnInit() {
      this.getNssiDetail()
  }
    getNssiDetail(){
        this.myhttp.getSlicingNssiDetail(this.nssiId).then(res => {
            this.isSpinning = false;
            const { result_body: {hosted_nsi_list} } = res;
            this.nsiList = hosted_nsi_list.map((item)=>{
                if(item.service_instance_id !==null){
                    return item
                }
            });
        })
    }
    showSingleNsiDetail(data){
        this.modalService.create({
            nzContent:NsiModelComponent,
            nzTitle:"Detail",
            nzWidth:"70%",
            nzOkText: null,
            nzCancelText: null,
            nzComponentParams:{
                nsiId:data.service_instance_id
            }
        });
    }
}
