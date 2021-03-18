import { Component, OnInit, Input } from "@angular/core";
import { NzModalService, NzMessageService } from "ng-zorro-antd";
import { SlicingTaskServices } from ".././../../../../../core/services/slicingTaskServices";
import { NsiModelComponent } from "../../nsi-management/nsi-model/nsi-model.component";

@Component({
	selector: "app-slicing-business-model",
	templateUrl: "./slicing-business-model.component.html",
	styleUrls: ["./slicing-business-model.component.less"],
})
export class SlicingBusinessModelComponent implements OnInit {
	constructor(
		private myhttp: SlicingTaskServices,
		private modalService: NzModalService,
		private message: NzMessageService
	) {}

	@Input() businessId;
	@Input() outerData;
	businessRequirement: any[];
	NSTinfo: any[] = [];
	nsiInfo: any[] = [];
	taskModel: boolean = false;
	isSpinning: boolean = true;
	status: string = "";
	businessDetailInfo: any = {};
	rantext: string = "RAN Network Edge IP address";
	isshowcore: boolean = false;
	isshowran: boolean = false;
	ngOnInit() {
		this.status = this.outerData.orchestration_status;
		this.getDetail();
	}
	detailFn(flag, form) {
		this.rantext =
			form == "ran"
				? "RAN Network Edge IP address"
				: "Core Network Edge IP address";
		if (form == "ran") {
			this.isshowran = !this.isshowran;
		} else {
			this.isshowcore = !this.isshowcore;
		}
	}
	getDetail() {
		this.myhttp.getSlicingBusinessDetail(this.businessId).then((res) => {
			this.isSpinning = false;
			const {
				business_demand_info,
				business_demand_info: { coverage_area_ta_list },
				nst_info,
				nsi_info,
				connection_link: {
					an_slice_task_info,
					cn_slice_task_info,
					tn_bh_slice_task_info,
				},
			} = res.result_body;
			const connect_info = {
				an_ip_adrress: an_slice_task_info.ip_adrress,
				an_interface_id: an_slice_task_info.interface_id,
				an_nextHop_info: an_slice_task_info.nextHop_info,
				cn_interface_id: cn_slice_task_info.interface_id,
				cn_ip_adrress: cn_slice_task_info.ip_adrress,
				cn_nextHop_info: cn_slice_task_info.nextHop_info,
				max_bandWidth: tn_bh_slice_task_info.max_bandWidth,
				link_type: tn_bh_slice_task_info.link_type,
				lantency: tn_bh_slice_task_info.lantency,
			};
			this.businessDetailInfo = connect_info;

			business_demand_info.area = coverage_area_ta_list.map((item) => {
				item = item.split(";").join("-");
				return item;
			});
			// area : Front-end analog data
			let area = [
				"Haidian District;Beijing;Beijing",
				"Xicheng District;Beijing;Beijing",
				"Changping District;Beijing;Beijing",
			].map((item) => {
				item = item.split(";").join(" - ");
				return item;
			});
			this.businessRequirement = [{ ...business_demand_info, area }];
			this.NSTinfo = [nst_info];
			console.log("ngs", this.NSTinfo);
			if (nsi_info.nsi_id !== null) {
				this.nsiInfo = [nsi_info];
			}
		});
	}
	showdetail(data) {
		const nsiModal = this.modalService.create({
			nzTitle: "Detail",
			nzContent: NsiModelComponent,
			nzWidth: "70%",
			nzOkText: null,
			nzCancelText: null,
			nzComponentParams: {
				nsiId: data.nsi_id,
			},
		});
	}
}
