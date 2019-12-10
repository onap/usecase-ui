import {Component, OnInit, Input} from '@angular/core';
import {NzModalService} from "ng-zorro-antd";
import {SlicingTaskServices} from '.././../../../../../core/services/slicingTaskServices';
import {NsiModelComponent} from "../../nsi-management/nsi-model/nsi-model.component";

@Component({
    selector: 'app-slicing-business-model',
    templateUrl: './slicing-business-model.component.html',
    styleUrls: ['./slicing-business-model.component.less']
})
export class SlicingBusinessModelComponent implements OnInit {

    constructor(
        private myhttp: SlicingTaskServices,
        private modalService: NzModalService
    ) {
    }

    @Input() businessId;
    businessRequirement: any[];
    NSTinfo: any[];
    nsiInfo: any[];
    taskModel: boolean = false;
    ngOnInit() {
        console.log(this.businessId, "id");
        this.getDetail()
    }

    getDetail() {
        this.myhttp.getSlicingBusinessDetail(this.businessId).subscribe(res => {
            const { result_body, result_header: { result_code } } = res;
            if (+result_code === 200) {
                const {business_demand_info,business_demand_info: { coverage_area_ta_list },nst_info,nsi_info}  = result_body;
                business_demand_info.area = coverage_area_ta_list.map(item => {
                    item = item.split(';').join('-');
                    return item
                });
                this.businessRequirement = [business_demand_info];
                this.NSTinfo = [nst_info];
                this.nsiInfo = [nsi_info];
            }
        })
    }
    showdetail(data) {
        console.log(data,"data.nsi_id");
        const nsiModal = this.modalService.create({
            nzTitle:"Detail",
            nzContent: NsiModelComponent,
            nzWidth:"70%",
            nzOkText: null,
            nzCancelText: null,
            nzComponentParams:{
                businessId:data.nsi_id
            }
        });
    }
}
