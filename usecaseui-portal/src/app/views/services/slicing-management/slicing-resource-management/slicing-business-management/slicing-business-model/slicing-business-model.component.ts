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
    businessDetailInfo : any = {}
    rantext: string = "RAN Network Edge IP address";

    isshowran: boolean = false;
    ngOnInit() {
        this.status = this.outerData.orchestration_status
        console.log('status',this.status)
        this.getDetail()
    }
    detailFn(flag,form){
      this.rantext  = form =='ran'? "RAN Network Edge IP address" : "Core Network Edge IP address";
      this.isshowran = !this.isshowran
    }
    getDetail() {
        this.myhttp.getSlicingBusinessDetail(this.businessId).then(res => {
            this.isSpinning = false;
            const { business_demand_info, business_demand_info: { coverage_area_ta_list }, nst_info, nsi_info ,connection_link: { tn_bh_slice_task_info }} = res.result_body;
            console.log(JSON.stringify(tn_bh_slice_task_info),11111)
            // tn_bh_slice_task_info  = {"suggestNssiId":null,"suggestNSSIName":null,"progress":null,"status":null,"statusDescription":null,"scriptName":null,"enableNSSISelection":null,"sliceProfile":null,"lantency":null,"max_bandWidth":null,"link_type":null}
           
            this.businessDetailInfo = {
                "suggestNssiId": '',
                "suggestNSSIName": '11111',
                "progress": 'active',
                "status": 'active',
                "statusDescription": 'p2p/mp2p',
                "scriptName": '10.1.1.1',
                "enableNSSISelection": '11',
                "sliceProfile": '10.1.1.1',
                "lantency": '10.2.3.4.5',
                "max_bandWidth": '1111',
                "link_type": '333'
              }
            // this.businessDetailInfo = {
            //     "anVersion":"10.2.3.4.5",
            //       "vLanText":"11111",
            //       "tnVersion":"10.0.1.1.1",
            //       "mbps":"11111",
            //       "msText":"11111",
            //       "linkType":"p2p/mp2p",
            //       "tnEndVersion":"10.1.1.1",
            //       "cnVlan":"11",
            //       "cnVersion":"1.1.2.3",
            //       "orchestration_status":"active"
            //   }
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
