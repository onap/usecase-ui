import { Component, OnInit, Input } from '@angular/core';
import { NzModalService, NzMessageService } from "ng-zorro-antd";
import { SlicingTaskServices } from '.././../../../../../core/services/slicingTaskServices';
import { NsiModelComponent } from "../../nsi-management/nsi-model/nsi-model.component";

@Component({
    selector: 'app-slicing-business-model',
    templateUrl: './slicing-business-model.component.html',
    styleUrls: ['./slicing-business-model.component.less']
})
export class SlicingBusinessModelComponent implements OnInit {

    constructor(
        private myhttp: SlicingTaskServices,
        private modalService: NzModalService,
        private message: NzMessageService
    ) {
    }

    @Input() businessId;
    businessRequirement: any[];
    NSTinfo: any[] = [];
    nsiInfo: any[] = [];
    taskModel: boolean = false;
    isSpinning: boolean = true;
    ngOnInit() {
        console.log(this.businessId, "id");
        this.getDetail()
    }

    getDetail() {
        this.myhttp.getSlicingBusinessDetail(this.businessId).then(res => {
            this.isSpinning = false;
            const { business_demand_info, business_demand_info: { coverage_area_ta_list }, nst_info, nsi_info } = res.result_body;
            business_demand_info.area = coverage_area_ta_list.map(item => {
                item = item.split(';').join('-');
                return item
            });
            // area : Front-end analog data
            let area = ["Haidian District;Beijing;Beijing", "Xicheng District;Beijing;Beijing", "Changping District;Beijing;Beijing"].map(item => {
                item = item.split(';').join(' - ');
                return item
            });
            this.businessRequirement = [{ ...business_demand_info, area }];
            this.NSTinfo = [nst_info];
            if (nsi_info.nsi_id !== null) {
                this.nsiInfo = [nsi_info];
            }
        })
    }
    showdetail(data) {
        console.log(data, "data.nsi_id");
        const nsiModal = this.modalService.create({
            nzTitle: "Detail",
            nzContent: NsiModelComponent,
            nzWidth: "70%",
            nzOkText: null,
            nzCancelText: null,
            nzComponentParams: {
                nsiId: data.nsi_id
            }
        });
    }
}
