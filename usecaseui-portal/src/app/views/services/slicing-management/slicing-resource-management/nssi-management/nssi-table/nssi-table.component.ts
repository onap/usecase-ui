import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { BUSINESS_STATUS } from "../../../../../../../constants/constants";
import { SlicingTaskServices } from "../../../../../../core/services/slicingTaskServices";
import { NzModalService, NzMessageService } from "ng-zorro-antd";
import { NssiModelComponent } from "../nssi-model/nssi-model.component";

@Component({
	selector: "app-nssi-table",
	templateUrl: "./nssi-table.component.html",
	styleUrls: ["./nssi-table.component.less"],
})
export class NssiTableComponent implements OnInit {
	constructor(
		private myhttp: SlicingTaskServices,
		private modalService: NzModalService,
		private message: NzMessageService
	) {}

	@Input() currentTabName;

	ngOnChanges(changes: SimpleChanges) {
		if (
			changes.currentTabName.currentValue ===
			"Slicing Subnet Instance Management"
		) {
			this.getNssiList();
		}
	}
	ngOnInit() {}

	selectedValue: string = BUSINESS_STATUS[0];
	listOfData: any[] = [];
	pageIndex: number = 1;
	pageSize: number = 10;
	total: number = 0;
	loading = false;
	isSelect: boolean = false;
	statusOptions: any[] = BUSINESS_STATUS;

	getNssiList(): void {
		this.loading = true;
		this.isSelect = false;
		this.listOfData = [];
		let paramsObj = {
			pageNo: this.pageIndex,
			pageSize: this.pageSize,
		};
		if (this.selectedValue !== BUSINESS_STATUS[0]) {
			paramsObj[
				"instanceStatus"
			] = this.selectedValue.toLocaleLowerCase();
			this.isSelect = true;
		}
		let getSlicingNssiListFailedCallback = () => {
			this.loading = false;
		};
		this.myhttp
			.getSlicingNssiList(
				paramsObj,
				this.isSelect,
				getSlicingNssiListFailedCallback
			)
			.then((res) => {
				const {
					result_body: { nssi_service_instances, record_number },
				} = res;
				this.loading = false;
				this.total = record_number;
				this.loading = false;
				if (
					nssi_service_instances !== null &&
					nssi_service_instances.length > 0
				) {
					this.listOfData = nssi_service_instances;
				}
			});
	}

	getListOfProcessingStatus() {
		this.pageIndex = 1;
		this.pageSize = 10;
		this.getNssiList();
	}

	searchData(reset: boolean = false) {
		this.getNssiList();
	}

	showdetail(data) {
		const nssiModal = this.modalService.create({
			nzTitle: "Detail",
			nzContent: NssiModelComponent,
			nzWidth: "70%",
			nzOkText: null,
			nzCancelText: null,
			nzComponentParams: {
				nssiId: data.service_instance_id,
			},
		});
	}
}
