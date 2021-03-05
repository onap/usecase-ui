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
    @Input() outerData;
    businessRequirement: any[];
    NSTinfo: any[] = [];
    nsiInfo: any[] = [];
    taskModel: boolean = false;
    isSpinning: boolean = true;
    status: string = "";
    ngOnInit() {
        console.log(this.businessId, "id",this.outerData);
        const param = {
            anVersion:'10.2.3.4.5',
            vLanText:'111',
            tnVersion:'10.0.1.1.1',
            tnText:'TN EDGEText',
            mbps:'333',
            msText:'555',
            linkType:'p2p/mp2p',
            tnEndVersion:'10.1.1.1',
            tnEndText:'TN EDGEText',
            cnVlan:'66',
            cnVersion:'1.1.2.3'
        }
        this.outerData = {...this.outerData,...param}
        console.log('new',this.outerData)
        this.status = this.outerData.orchestration_status
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
            console.log('ngs',this.NSTinfo)
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
