import {
	Component,
	Input,
	OnInit,
	ViewChild,
	SimpleChanges,
} from "@angular/core";
import { SlicingTaskServices } from ".././../../../../../core/services/slicingTaskServices";
import { BUSINESS_STATUS } from "../../../../../../../constants/constants";
import { NzModalService, NzMessageService } from "ng-zorro-antd";
import { SlicingBusinessModelComponent } from "../slicing-business-model/slicing-business-model.component";
import { INTERVAL_TIME } from "../../../constant";
@Component({
	selector: "app-slicing-business-table",
	templateUrl: "./slicing-business-table.component.html",
	styleUrls: ["./slicing-business-table.component.less"],
})
export class SlicingBusinessTableComponent implements OnInit {
	constructor(
		private myhttp: SlicingTaskServices,
		private modalService: NzModalService,
		private message: NzMessageService
	) {}

	@Input() currentTabName;

	intervalTime: number = INTERVAL_TIME;

	ngOnChanges(changes: SimpleChanges) {
		if (
			changes.currentTabName.currentValue ===
			"Slicing Business Management"
		) {
			this.getBusinessList();
		} else {
			this.progressingTimer.forEach((item) => {
				clearInterval(item.timer);
			});
			this.progressingTimer = [];
		}
	}
	ngOnInit() {}
	ngOnDestroy() {
		this.progressingTimer.forEach((item) => {
			clearInterval(item.timer);
		});
	}
	selectedValue: string = BUSINESS_STATUS[0];
	listOfData: any[] = [];
	pageIndex: number = 1;
	pageSize: number = 10;
	total: number = 0;
	loading = false;
	isSelect: boolean = false;
	statusOptions: any[] = BUSINESS_STATUS;
	progressingTimer: any[] = [];
	terminateStart: any[] = [];
	@ViewChild("notification") notification1: any;

	getBusinessList(): void {
		this.loading = true;
		this.isSelect = false;
		this.listOfData = [];
		let paramsObj = {
			pageNo: this.pageIndex,
			pageSize: this.pageSize,
		};
		if (this.selectedValue !== BUSINESS_STATUS[0]) {
			paramsObj[
				"businessStatus"
			] = this.selectedValue.toLocaleLowerCase();
			this.isSelect = true;
		}
		let getSlicingBusinessListFailedCallback = () => {
			this.loading = false;
		};
		this.myhttp
			.getSlicingBusinessList(
				paramsObj,
				this.isSelect,
				getSlicingBusinessListFailedCallback
			)
			.then((res) => {
				const {
					result_body: { slicing_business_list, record_number },
				} = res;
				this.loading = false;
				this.total = record_number;
				if (
					slicing_business_list !== null &&
					slicing_business_list.length > 0
				) {
					this.listOfData = slicing_business_list.map(
						(item, index) => {
							if (
								item.last_operation_progress &&
								item.last_operation_type &&
								Number(item.last_operation_progress) < 100
							) {
								let updata = (prodata: {
									operation_progress: string;
								}) => {
									item.last_operation_progress =
										prodata.operation_progress ||
										item.last_operation_progress;
								};
								let obj = {
									serviceId: item.service_instance_id,
								};
								if (
									item.last_operation_type.toUpperCase() ===
									"DELETE"
								)
									this.terminateStart[index] = true;
								else this.terminateStart[index] = false;
								this.queryProgress(
									obj,
									item.orchestration_status,
									index,
									updata
								).then((res) => {
									item.last_operation_progress = "100";
									this.getBusinessList();
								});
							}
							return item;
						}
					);
				}
			});
	}
	getListOfProcessingStatus() {
		this.pageIndex = 1;
		this.pageSize = 10;
		this.progressingTimer.forEach((item) => {
			clearInterval(item.timer);
		});
		this.progressingTimer = [];
		this.getBusinessList();
	}
	searchData(reset: boolean = false) {
		this.progressingTimer.forEach((item) => {
			clearInterval(item.timer);
		});
		this.progressingTimer = [];
		this.getBusinessList();
	}
	switchChange(slicing, i) {
		this.modalService.confirm({
			nzTitle:
				"<i>Do you Want to " +
				(slicing.orchestration_status === "activated"
					? "deactivate"
					: "activate") +
				" slicing business?</i>",
			nzContent: "<b>Name:" + slicing.service_instance_name + "</b>",
			nzOnOk: () => {
				this.notification1.notificationStart(
					"slicing business",
					slicing.orchestration_status === "activated"
						? "deactivate"
						: "activate",
					slicing.service_instance_id
				);
				let paramsObj = {
					serviceId: slicing.service_instance_id,
				};
				if (slicing.orchestration_status === "activated") {
					this.changeActivate(
						paramsObj,
						false,
						slicing,
						"deactivate",
						"deactivated",
						i
					);
				} else {
					this.changeActivate(
						paramsObj,
						true,
						slicing,
						"activate",
						"activated",
						i
					);
				}
			},
			nzCancelText: "No",
			nzOnCancel: () => {
				let singleSlicing = Object.assign({}, this.listOfData[i]);
				this.listOfData[i] = singleSlicing;
				this.listOfData = [...this.listOfData];
			},
		});
	}
	changeActivate(
		paramsObj,
		isActivate,
		slicing,
		activateValue,
		finished,
		index
	) {
		this.loading = true;
		let changeActivateFailedCallback = () => {
			this.loading = false;
			let singleSlicing = Object.assign({}, this.listOfData[index]);
			this.listOfData[index] = singleSlicing;
			this.listOfData = [...this.listOfData];
			this.notification1.notificationFailed(
				"slicing business",
				finished,
				slicing.service_instance_id
			);
			this.getBusinessList();
		};
		this.myhttp
			.changeActivateSlicingService(
				paramsObj,
				isActivate,
				changeActivateFailedCallback
			)
			.then((res) => {
				this.loading = false;
				this.notification1.notificationSuccess(
					"slicing business",
					finished,
					slicing.service_instance_id
				);
				this.getBusinessList();
			});
	}
	terminate(slicing, index) {
		this.modalService.confirm({
			nzTitle: "Do you Want to terminate slicing business?",
			nzContent: "<b>Name:&nbsp;</b>" + slicing.service_instance_name,
			nzOnOk: () => {
				this.notification1.notificationStart(
					"slicing business",
					"terminate",
					slicing.service_instance_id
				);
				let paramsObj = { serviceId: slicing.service_instance_id };
				this.terminateStart[index] = true;
				this.loading = true;
				let terminateFailedCallback = () => {
					this.loading = false;
					this.notification1.notificationFailed(
						"slicing business",
						"terminate",
						slicing.service_instance_id
					);
					this.terminateStart[index] = false;
				};
				this.myhttp
					.terminateSlicingService(paramsObj, terminateFailedCallback)
					.then((res) => {
						this.loading = false;
						this.notification1.notificationSuccess(
							"slicing business",
							"terminate",
							slicing.service_instance_id
						);
						this.getBusinessList();
					});
			},
			nzCancelText: "No",
			nzOnCancel: () => {
				console.info("Cancel termination");
			},
		});
	}
	showdetail(data) {
		const BusinessModal = this.modalService.create({
			nzTitle: "Detail",
			nzContent: SlicingBusinessModelComponent,
			nzWidth: "70%",
			nzOkText: null,
			nzCancelText: null,
			nzComponentParams: {
				businessId: data.service_instance_id,
				outerData: data,
			},
		});
	}
	queryProgress(obj, action, index, callback) {
		return new Promise((res) => {
			let requery = () => {
				let queryProgressFailedCallback = () => {
					this.progressingTimer.forEach((item) => {
						if (item.serviceId === obj.serviceId) {
							clearInterval(item.timer);
						}
					});
					this.getBusinessList();
				};
				this.myhttp
					.getSlicingBusinessProgress(
						obj,
						queryProgressFailedCallback
					)
					.then((data) => {
						if (
							data.result_body.operation_progress &&
							Number(data.result_body.operation_progress) < 100
						) {
							callback(data.result_body);
							let progressSetTimeOut = setTimeout(() => {
								requery();
							}, this.intervalTime);
							this.progressingTimer.push({
								id: obj.serviceId,
								timer: progressSetTimeOut,
							});
						} else {
							this.progressingTimer.forEach((item) => {
								if (item.serviceId === obj.serviceId) {
									clearInterval(item.timer);
								}
							});
							res(data.result_body);
						}
					});
			};
			requery();
		});
	}
}
