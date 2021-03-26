import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { COMMUNICATION_FORM_ITEMS, MASKTEXT } from "./constants";
import { Util } from "../../../../../shared/utils/utils";
import { SlicingTaskServices } from "../../../../../core/services/slicingTaskServices";
import { NzMessageService } from "ng-zorro-antd";

@Component({
	selector: "app-business-order",
	templateUrl: "./business-order.component.html",
	styleUrls: ["./business-order.component.less"],
})
export class BusinessOrderComponent implements OnInit {
	constructor(
		private myhttp: SlicingTaskServices,
		private message: NzMessageService,
		private Util: Util
	) {}

	ngOnInit() {}

	ngOnChanges() {
		let areaList = ["Beijing;Beijing;Haidian District;Wanshoulu Street"];
		if (this.modelParams && this.showModel) {
			this.slicing_order_info = { ...this.modelParams };
			if (this.slicing_order_info.coverageArea) {
				areaList = [];
				areaList.push(
					this.slicing_order_info.coverageArea.split(" ").join(";")
				);
			}
		}
		this.AreaFormatting(areaList);
	}
	detailFn(flag) {
		COMMUNICATION_FORM_ITEMS.forEach((item, index) => {
			if (item.key == "coverageAreaNumber") {
				item["coverflag"] = flag == true ? false : true;
			}
		});
	}

	@Input() showModel: boolean;
	@Input() modelParams: any;
	@Output() cancel = new EventEmitter<boolean>();
	comunicationFormItems = COMMUNICATION_FORM_ITEMS;
	slicing_order_info = {
		name: null,
		maxNumberofUEs: null,
		expDataRateDL: null,
		latency: null,
		expDataRateUL: null,
		resourceSharingLevel: "shared",
		uEMobilityLevel: "stationary",
		coverageArea: "",
		coverageAreaNumber: null,
	};
	areaList: any[] = [];
	validateRulesShow: any[] = [];
	rulesText: any[] = [];
	areaLevel: number = 4;
	masktext: string = MASKTEXT;
	loading: boolean = false;
	AreaFormatting(areaList): void {
		this.areaList = areaList.map((item: any) => {
			let arr = item.split(";");
			item = arr.map((it, index) => {
				let key: string;
				if (!index) {
					key = "province";
				} else if (index === 1) {
					key = "city";
				} else if (index === 2) {
					key = "district";
				} else {
					key = "street";
				}
				const obj: any = {};
				obj.key = key;
				obj.selected = it;
				obj.options = [{ name: it, id: it }];
				return obj;
			});
			return item;
		});
	}

	handleCancel(): void {
		this.showModel = false;
		this.cancel.emit(this.showModel);
		this.slicing_order_info = {
			name: null,
			maxNumberofUEs: null,
			expDataRateDL: null,
			latency: null,
			expDataRateUL: null,
			resourceSharingLevel: "shared",
			uEMobilityLevel: "stationary",
			coverageArea: "",
			coverageAreaNumber: null,
		};
		this.validateRulesShow = [];
	}

	handleOk(): void {
		const coverage_list: string[] = [];
		let coverageAreas;
		COMMUNICATION_FORM_ITEMS.forEach((item, index) => {
			if (item.required && item.type === "input") {
				this.Util.validator(
					item.title,
					item.key,
					this.slicing_order_info[item.key],
					index,
					this.rulesText,
					this.validateRulesShow
				);
			}
		});
		if (this.validateRulesShow.indexOf(true) > -1) {
			return;
		}
		for (const key in this.areaList) {
			const value = this.areaList[key];
			let str = "";
			for (const val of value) {
				const area = val;
				str += area.selected + ";";
				if (!area.selected) {
					this.message.error("Please complete the form");
					return;
				}
			}
			coverage_list.push(str.substring(0, str.length - 1));
		}
		if (coverage_list.length > 1) {
			coverageAreas = coverage_list.join("|");
		} else {
			coverageAreas = coverage_list.toString();
		}
		const coverageAreaNumber = this.slicing_order_info[
			"coverageAreaNumber"
		];
		if (coverageAreaNumber) {
			this.slicing_order_info.coverageArea = `${coverageAreas}-${coverageAreaNumber}`;
		} else {
			this.slicing_order_info.coverageArea = `${coverageAreas}`;
		}
		delete this.slicing_order_info.coverageAreaNumber;

		const paramsObj = {
			slicing_order_info: this.slicing_order_info,
		};
		const csmfSlicingPurchaseFailedCallback = () => {
			this.handleCancel();
		};
		this.loading = true;
		this.myhttp
			.csmfSlicingPurchase(paramsObj, csmfSlicingPurchaseFailedCallback)
			.then((res) => {
				const result = res.result_header;
				if (
					result &&
					result.result_code &&
					+result.result_code === 200
				) {
					console.log(res);
				} else {
					this.message.create("error", "Network error");
				}
				this.loading = false;
				this.handleCancel();
			});
	}
}
