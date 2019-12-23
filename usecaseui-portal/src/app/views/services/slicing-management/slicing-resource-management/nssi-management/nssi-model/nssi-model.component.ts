import {Component, Input, OnInit} from '@angular/core';
import {NzModalService} from "ng-zorro-antd";
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
        private modalService: NzModalService
    ) {
    }
    @Input() nssiId;
    nsiList: any[];
    isSpinning: boolean = true;
  ngOnInit() {
      this.getNssiDetail()
  }
    getNssiDetail(){
        this.myhttp.getSlicingNssiDetail(this.nssiId).subscribe(res => {
            this.isSpinning = false;
            const {result_header: {result_code}, result_body: {hosted_nsi_list} } = res;
            if (+result_code === 200) {
                this.nsiList = hosted_nsi_list.map((item)=>{
                    if(item.service_instance_id !==null){
                        return item
                    }
                });
            }
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
