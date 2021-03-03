import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { BUSINESS_STATUS } from "../../../../../constants/constants";
import { SlicingTaskServices } from ".././../../../core/services/slicingTaskServices";
import { NzModalService, NzMessageService } from "ng-zorro-antd";
import * as moment from "moment";
import { INTERVAL_TIME } from "../constant";
@Component({
	selector: "app-csmf-slicing-business-management",
	templateUrl: "./csmf-slicing-business-management.component.html",
	styleUrls: ["./csmf-slicing-business-management.component.less"],
})
export class CsmfSlicingBusinessManagementComponent implements OnInit {
	constructor(
		private myhttp: SlicingTaskServices,
		private modalService: NzModalService,
		private message: NzMessageService
	) {}
	@Input() currentTabTitle;

	intervalTime: number = INTERVAL_TIME;

	ngOnChanges(changes: SimpleChanges) {
		if (changes.currentTabTitle.currentValue === "Communication Service") {
			this.getCSMFBusinessList();
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
	statusOptions: any[] = BUSINESS_STATUS;
	progressingTimer: any[] = [];
	terminateStart: any[] = [];
	businessOrderShow: boolean = false;
	getCSMFBusinessList(): void {
		this.loading = true;
		// this.listOfData = []; //solve the problem of blank screen after each operation
		const paramsObj = {
			status: this.selectedValue.toLocaleLowerCase(),
			pageNo: this.pageIndex,
			pageSize: this.pageSize,
		};
		const getCSMFSlicingBusinessListFailedCallback = () => {
			this.loading = false;
		};
		this.myhttp
			.getCSMFSlicingBusinessList(
				paramsObj,
				getCSMFSlicingBusinessListFailedCallback
			)
			.then((res) => {
				const {
					result_body: { slicing_order_list, record_number },
				} = res;
				this.loading = false;
				this.total = record_number;
				if (
					slicing_order_list !== null &&
					slicing_order_list.length > 0
				) {
					this.listOfData = slicing_order_list.map((item, index) => {
						item.order_creation_time = moment(
							Number(item.order_creation_time)
						).format("YYYY-MM-DD HH:mm:ss");
						if (
							item.last_operation_progress &&
							item.last_operation_type &&
							Number(item.last_operation_progress) < 100
						) {
							const updata = (prodata: {
								operation_progress: string;
							}) => {
								item.last_operation_progress =
									prodata.operation_progress ||
									item.last_operation_progress;
							};
							const obj = { serviceId: item.order_id };
							if (
								item.last_operation_type.toUpperCase() ===
								"DELETE"
							)
								this.terminateStart[index] = true;
							else this.terminateStart[index] = false;
							this.queryProgress(obj, index, updata).then(() => {
								item.last_operation_progress = "100";
								this.getCSMFBusinessList();
							});
						}
						return item;
					});
				}
			});
	}

	getListOfProcessingStatus(): void {
		this.pageIndex = 1;
		this.pageSize = 10;
		this.progressingTimer.forEach((item) => {
			clearInterval(item.timer);
		});
		this.progressingTimer = [];
		this.getCSMFBusinessList();
	}

	searchData(): void {
		this.progressingTimer.forEach((item) => {
			clearInterval(item.timer);
		});
		this.progressingTimer = [];
		this.getCSMFBusinessList();
	}

	switchChange(slicing: any, i: number): void {
		this.modalService.confirm({
			nzTitle: "<i>Are you sure you want to perform this task?</i>",
			nzContent: "<b>Name:" + slicing.order_name + "</b>",
			nzOnOk: () => {
				let paramsObj = {
					serviceId: slicing.order_id,
				};
				if (slicing.order_status === "activated") {
					this.changeActivate(paramsObj, false, i);
				} else {
					this.changeActivate(paramsObj, true, i);
				}
			},
			nzCancelText: "No",
			nzOnCancel: () => {
				const singleSlicing = Object.assign({}, this.listOfData[i]);
				this.listOfData[i] = singleSlicing;
				this.listOfData = [...this.listOfData];
			},
		});
	}
	changeActivate(paramsObj: any, isActivate: boolean, index: number): void {
		const changeActivateFailedCallback = () => {
			const singleSlicing = Object.assign({}, this.listOfData[index]);
			this.listOfData[index] = singleSlicing;
			this.listOfData = [...this.listOfData];
			this.getCSMFBusinessList();
		};
		this.myhttp
			.changeActivateSlicingService(
				paramsObj,
				isActivate,
				changeActivateFailedCallback
			)
			.then((res) => {
				this.getCSMFBusinessList();
			});
	}

	terminate(slicing: any, index: number): void {
		this.modalService.confirm({
			nzTitle: "Are you sure you want to terminate this task?",
			nzContent: "<b>Name:&nbsp;</b>" + slicing.order_name,
			nzOnOk: () => {
				const paramsObj = { serviceId: slicing.order_id };
				this.terminateStart[index] = true;
				const terminateFailedCallback = () => {
					this.terminateStart[index] = false;
				};
				this.myhttp
					.terminateSlicingService(paramsObj, terminateFailedCallback)
					.then((res) => {
						this.getCSMFBusinessList();
					});
			},
			nzCancelText: "No",
			nzOnCancel: () => {
				console.info("Cancel termination");
			},
		});
	}
	queryProgress(obj: any, index: number, callback: any) {
		return new Promise((res) => {
			const requery = () => {
				const queryProgressFailedCallback = () => {
					this.progressingTimer.forEach((item) => {
						if (item.serviceId === obj.serviceId) {
							clearInterval(item.timer);
						}
					});
					this.getCSMFBusinessList();
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

	OrderModelShow(): void {
		this.businessOrderShow = true;
	}
	orderModelClose($event: any): void {
		this.businessOrderShow = $event;
		this.getCSMFBusinessList();
	}
}
