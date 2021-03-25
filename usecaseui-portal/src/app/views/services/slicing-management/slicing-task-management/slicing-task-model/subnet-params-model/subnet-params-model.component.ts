import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	ElementRef,
} from "@angular/core";
import { TRANSFRER_FORM_ITEMS, CORE_FORM_ITEMS } from "./constants";
import { NzMessageService } from "ng-zorro-antd";
import { stringify } from "@angular/core/src/util";
import { Util } from "../../../../../../shared/utils/utils";
import { SlicingTaskServices } from "@src/app/core/services/slicingTaskServices";

@Component({
	selector: "app-subnet-params-model",
	templateUrl: "./subnet-params-model.component.html",
	styleUrls: ["./subnet-params-model.component.less"],
})
export class SubnetParamsModelComponent implements OnInit {
	@Input() showModel: boolean;
	@Input() detailData: any;
	@Input() title: string;
	@Output() cancel = new EventEmitter<boolean>();
	@Output() paramsDataChange = new EventEmitter<any>();
	@Output() noPassParaChange = new EventEmitter<any>();

	transferFormItems: any[] = TRANSFRER_FORM_ITEMS;
	regxpIP = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/; // check for correct ip address
	formData: any;
	coreFormItems: any = [];
	areaList: any[] = [];
	areaLevel: number = 3;
	ANEndpointInputs: object = {};
	CNEndpointInputs: object = {};
	ANkeyList: string[] = [];
	CNkeyList: string[] = [];
	EndpointEnable: boolean = false; // Whether to enable the three parameters of Endpoint
	keyList: string[] = []; // keys of endPoint
	specialParaTN: string[] = [
		"Resource Sharing Level",
		"Connection Links",
		"AN Endpoint",
		"CN Endpoint",
	];
	// Parameters not passed to the back end
	notPassPara: string[] = ["sliceProfile_TN_connection_links"];
	connectionLinkTable: any[] = [];
	connectionTableHeader: string[] = [];
	pageSize: number = 2;
	recordNum: number = 0;
	// hasPageNo: number[] = [];
	loading = false;
	loadingDelay = 100;
	objectKeys = Object.keys;
	//  Comment: Above code

	constructor(
		private message: NzMessageService,
		private Util: Util,
		private http: SlicingTaskServices
	) {}

	ngOnInit() {}

	ngOnChanges() {
		// It is excuted every time you open it
		if (this.title) {
			this.formData = JSON.parse(JSON.stringify(this.detailData));
			if (this.title === "An" || this.title === "Cn") {
				this.coreFormItems =
					this.title === "An"
						? CORE_FORM_ITEMS.An
						: this.title === "Cn"
						? CORE_FORM_ITEMS.Cn
						: [];
			} else if (this.title === "Tn") {
				const pageNo = 1; // start from page 1
				const pageSize = this.pageSize;
				this.getConnectionLinkTable(pageNo, pageSize);
				this.ANkeyList = this.transferFormItems
					.find((item) => {
						return item.title === "AN Endpoint";
					})
					.options.map((val) => {
						return val.key;
					});
				this.CNkeyList = this.transferFormItems
					.find((item) => {
						return item.title === "CN Endpoint";
					})
					.options.map((val) => {
						return val.key;
					});
				this.keyList = this.ANkeyList.concat(this.CNkeyList);
				if (
					typeof this.formData !== "undefined" &&
					Object.keys(this.formData).length !== 0
				) {
					this.EndpointEnable = this.keyList.every((item) => {
						return this.formData.hasOwnProperty(item);
					});
				}
				if (this.EndpointEnable) {
					this.ANEndpointInputs = this.Util.pick(
						this.formData,
						this.ANkeyList
					);
					this.CNEndpointInputs = this.Util.pick(
						this.formData,
						this.CNkeyList
					);
				} else {
					this.transferFormItems.map((item, index) => {
						if (
							item.title === "AN Endpoint" ||
							item.title === "CN Endpoint"
						) {
							this.transferFormItems.splice(index, 1);
						}
					});
				}
			}
			// If the endpoint related parameters from the back end are incomplete, delete the endpoint item
			//-------> Comment: Above code
			if (this.title === "An") {
				this.AreaFormatting();
			}
		}
	}

	addCheckStatus() {
		if (this.connectionLinkTable && this.connectionLinkTable.length > 0) {
			this.connectionLinkTable.forEach((item) => {
				if (
					item.hasOwnProperty("linkId") &&
					typeof this.formData["sliceProfile_TN_connection_links"] !==
						"undefined" &&
					this.formData["sliceProfile_TN_connection_links"] !== "" &&
					this.formData["sliceProfile_TN_connection_links"] !==
						null &&
					item["linkId"] ===
						this.formData["sliceProfile_TN_connection_links"]
				) {
					item.checked = true;
				} else {
					item.checked = false;
				}
			});
		}
	}

	// changeResourceShare() {
	// 	this.judgeTn();
	// }

	isObject(val) {
		if (Object.prototype.toString.call(val) === "[object Object]") {
			return true;
		} else {
			return false;
		}
	}

	getConnectionLinkTable(pageNo, pageSize): void {
		const pageObj = {
			pageNo: pageNo,
			pageSize: pageSize,
		};
		this.loading = true;
		this.http
			.getConnectionLinkTable(pageObj, this.getConnetionFailed)
			.then((res) => {
				if (pageNo === 1) {
					// the first page
					this.loading = false;
					this.connectionLinkTable =
						res.result_body.connection_links_list;
					this.recordNum = res.result_body.record_number;
					// Use default value to occupy
					// let defaultItem: object = {};
					// if (this.connectionLinkTable.length !== 0) {
					// 	defaultItem = JSON.parse(
					// 		JSON.stringify(this.connectionLinkTable[0])
					// 	);
					// 	for (let key in defaultItem) {
					// 		if (!this.isObject(defaultItem[key])) {
					// 			defaultItem[key] = "";
					// 		}
					// 		// else {
					// 		// 	for (let i in defaultItem[key]) {
					// 		// 		defaultItem[key][i] = "";
					// 		// 	}
					// 		// }
					// 	}
					// 	for (let i = pageSize; i < this.recordNum; i++) {
					// 		this.connectionLinkTable.push(defaultItem);
					// 	}
					// }
					// this.hasPageNo = [1];
				} else if (pageNo > 1) {
					// delete the default page of the page and add the actual data of the page
					// const startIndex = pageSize * (pageNo - 1);
					// const endIndex = startIndex + pageSize - 1;
					// this.connectionLinkTable.splice(startIndex, pageSize);
					// const frontArr = this.connectionLinkTable.slice(
					// 	0,
					// 	startIndex
					// );
					// const backArr = this.connectionLinkTable.slice(startIndex);
					// this.connectionLinkTable = frontArr.concat(
					// 	res.result_body.connection_links_list,
					// 	backArr
					// );
					this.connectionLinkTable =
						res.result_body.connection_links_list;
					this.recordNum = res.result_body.record_number;
					this.loading = false;
				}
				// this.hasPageNo.push(pageNo);
				this.addCheckStatus(); // add init check status for connection link table
				this.judgeTn(); // init judge
				this.getTableHeader();
			});
	}

	getTableHeader(): void {
		// Find the common key of all data
		if (this.connectionLinkTable && this.connectionLinkTable.length > 0) {
			let keyList: any[] = this.connectionLinkTable.map((item) => {
				return Object.keys(item);
			});
			this.connectionTableHeader = this.Util.intersection(keyList).filter(
				(item) => {
					return item !== "checked";
				}
			);
			// Filter redundant items in table data
			this.connectionLinkTable.forEach((item) => {
				for (let key in item) {
					if (
						key !== "linkId" &&
						key !== "checked" &&
						this.connectionTableHeader.indexOf(key) === -1
					) {
						delete item[key];
					} else {
						// Filter out the null values in each item
						for (let i in item[key]) {
							if (
								i === "jitter" &&
								(item[key][i] === "" ||
									item[key][i] === "null" ||
									item[key][i] === null)
							) {
								delete item[key][i];
							}
						}
					}
				}
			});
		}
	}

	pageIndexChange(e) {
		// judge whether there is data of the page, if not, request it from the back end
		// if (this.hasPageNo.indexOf(e) === -1) {
		this.getConnectionLinkTable(e, this.pageSize);
		// }
	}
	getConnetionFailed() {
		console.log("failed");
	}

	judgeTn(): void {
		console.log("fprm", this.formData);
		if (
			this.formData["sliceProfile_TN_resourceSharingLevel"] ===
				"non-shared" ||
			this.formData["sliceProfile_TN_resourceSharingLevel"] == null
		) {
			//:todo clear??
			// this.connectionLinkTable.forEach((item) => {
			// 	item.checked = false;
			// });
			// this.formData["sliceProfile_TN_connection_links"] = null;
			this.notPassPara = ["sliceProfile_TN_connection_links"];
			this.transferFormItems.forEach((item) => {
				if (item.title === "Connection Links") {
					item.disable = true;
				} else if (
					item.title === "AN Endpoint" ||
					item.title === "CN Endpoint"
				) {
					item.required = true;
					item.disable = false;
				}
			});
		} else if (
			this.formData["sliceProfile_TN_resourceSharingLevel"] === "shared"
		) {
			this.transferFormItems.forEach((item) => {
				if (item.title === "Connection Links") {
					item.disable = false;
				} else if (
					item.title === "AN Endpoint" ||
					item.title === "CN Endpoint"
				) {
					if (
						typeof this.formData[
							"sliceProfile_TN_connection_links"
						] !== "undefined" &&
						this.formData["sliceProfile_TN_connection_links"] !==
							null &&
						this.formData["sliceProfile_TN_connection_links"] !== ""
					) {
						item.disable = true;
						item.required = false;
						this.notPassPara = [];
						this.notPassPara = this.notPassPara.concat(
							this.ANkeyList,
							this.CNkeyList
						);
					} else {
						//:todo
						this.formData["sliceProfile_TN_connection_links"] = "";
						item.disable = false;
						item.required = true;
						this.notPassPara = [];
					}
				}
			});
		}
	}

	validateEndPoint(key: string, value: any, required: boolean): string {
		if (required) {
			if (this.Util.isEmpty(value)) {
				return "can not be empty";
			}
		}
		if (key === "ip_address") {
			if (!this.regxpIP.test(value)) {
				if (value !== "") {
					return "xxx.xxx.xxx.xxx";
				} else {
					return "";
				}
			} else {
				return "";
			}
		} else if (key === "logical_link") {
			if (!this.Util.isInteger(value)) {
				if (value !== "") {
					return "integer only";
				} else {
					return "";
				}
			} else {
				return "";
			}
		} else {
			return "";
		}
	}

	changeLinkCheck(id: string): void {
		// update the selection state
		this.connectionLinkTable.forEach((item) => {
			if (item["linkId"] === id) {
				item.checked = true;
			} else {
				item.checked = false;
			}
		});
		this.formData["sliceProfile_TN_connection_links"] = id; //  get the selected id
		this.judgeTn();
	}

	AreaFormatting() {
		let areaList = [...this.formData.an_coverage_area_ta_list];
		this.areaList = areaList.map((item: any) => {
			let arr = item.split(";");
			item = arr.map((ite, index) => {
				let key: string;
				if (!index) {
					key = "province";
				} else if (index === 1) {
					key = "city";
				} else {
					key = "district";
				}
				const obj: any = {};
				obj.key = key;
				obj.selected = ite;
				obj.options = [{ name: ite, id: ite }];
				return obj;
			});
			return item;
		});
	}

	handleCancel(): void {
		this.noPassParaChange.emit(this.notPassPara);
		this.showModel = false;
		this.cancel.emit(this.showModel);
	}

	// special handling for address
	areaCheckBeforeSubmit(target: object): Boolean {
		for (const prop in target) {
			if (target.hasOwnProperty(prop)) {
				if (
					prop === "an_coverage_area_ta_list" ||
					prop === "cn_coverage_area_ta_list"
				) {
					// if the vlaue is "shanghai;shanghai;", the input is incomplete
					return target[prop].every((item) => {
						return this.Util.deepCheck(item.split(";"));
					});
				}
			}
		}
		return true;
	}

	endCheckBeforeSubmit(endpoint, required): Array<any> {
		// check params of Endpoint
		let result: Array<any> = [true, ""];
		let endPointList;
		endPointList = this.transferFormItems.find((item) => {
			return item.title === "AN Endpoint";
		}).options;
		let ipKey = "";
		let logicalKey = "";
		let nextKey = "";
		for (let item of endPointList) {
			if (item.title === "ip_address") {
				ipKey = item.key;
			} else if (item.title === "logical_link") {
				logicalKey = item.key;
			} else if (item.title === "nexthop_info") {
				nextKey = item.key;
			}
		}
		for (let prop in endpoint) {
			if (prop === ipKey) {
				if (required) {
					if (endpoint[prop] === "") {
						result = [false, "Endpoint can not be empty"];
					} else if (!this.regxpIP.test(endpoint[prop])) {
						result = [false, "Illegal IpAddress"];
					}
				} else if (
					!this.regxpIP.test(endpoint[prop]) &&
					endpoint[prop] !== ""
				) {
					result = [false, "Illegal IpAddress"];
				}
			} else if (prop === logicalKey) {
				if (required) {
					if (endpoint[prop] === "") {
						result = [false, "logical can not be empty"];
					} else if (!this.Util.isInteger(endpoint[prop])) {
						result = [false, "LogicalID can only be an integer"];
					}
				} else if (
					!this.Util.isInteger(endpoint[prop]) &&
					endpoint[prop] !== ""
				) {
					result = [false, "LogicalID can only be an integer"];
				}
			} else if (prop === nextKey) {
				if (required && endpoint[prop] === "") {
					result = [false, "Endpoint can not be empty"];
				}
			}
		}
		return result;
	}

	inputHolder(title: string): string {
		const titleArr = title.split(" ");
		if (titleArr.length > 1) {
			return titleArr.slice(0, 2).join("");
		} else {
			return title;
		}
	}

	labelStyle(required: boolean): object {
		let style;
		if (!required) {
			style = { "margin-left": "18px", "margin-right": "-18px" };
		} else {
			style = {};
		}
		return style;
	}

	handleOk(): void {
		// Verify that items of EndPoint is correct
		if (this.EndpointEnable) {
			let endCheckResult = [];
			if (this.title === "Tn") {
				const ANendCheckResult = this.endCheckBeforeSubmit(
					this.ANEndpointInputs,
					this.transferFormItems.find((item) => {
						return item.title === "AN Endpoint";
					}).required
				);
				const CNendCheckResult = this.endCheckBeforeSubmit(
					this.CNEndpointInputs,
					this.transferFormItems.find((item) => {
						return item.title === "CN Endpoint";
					}).required
				);
				if (ANendCheckResult[0] && CNendCheckResult[0]) {
					endCheckResult[0] = true;
				} else {
					if (ANendCheckResult[0] === false) {
						endCheckResult = ANendCheckResult;
					} else {
						endCheckResult = CNendCheckResult;
					}
				}
			}
			if (!endCheckResult[0]) {
				this.message.error(endCheckResult[1].toString());
				return;
			}
			// replace the params about endPoint
			for (let prop in this.formData) {
				if (
					this.title === "Tn" &&
					typeof this.ANEndpointInputs[prop] !== "undefined"
				) {
					this.formData[prop] = this.ANEndpointInputs[prop];
				} else if (
					this.title === "Tn" &&
					typeof this.CNEndpointInputs[prop] !== "undefined"
				) {
					this.formData[prop] = this.CNEndpointInputs[prop];
				}
			}
		}
		let params: object;
		if (this.title === "An") {
			const an_coverage_area_ta_list: string[] = [];
			this.areaList.forEach((item) => {
				let str: string = "";
				item.forEach((area) => {
					str += area.selected + ";";
				});
				an_coverage_area_ta_list.push(str.substring(0, str.length - 1));
			});
			params = { ...this.formData, an_coverage_area_ta_list };
		} else {
			params = { ...this.formData };
		}
		// Verify that each item exclude endpoint is not empty, include special handeling of area_list
		let checkParams: object = params;
		let requireKeyList: string[] = [];
		let targetFormItems: any[] = [];
		if (this.title === "An" || this.title === "Cn") {
			targetFormItems = this.coreFormItems;
		} else if ((this.title = "Tn")) {
			targetFormItems = this.transferFormItems;
		}
		for (let item of targetFormItems) {
			if (typeof item.required !== "undefined" && item.required) {
				if (
					typeof item.type !== "undefined" &&
					item.type !== "endpoint"
				) {
					requireKeyList.push(item.key);
				}
			}
		}
		checkParams = this.Util.pick(params, requireKeyList);
		if (
			this.Util.deepCheck(checkParams) &&
			this.areaCheckBeforeSubmit(params)
		) {
			this.paramsDataChange.emit(params);
			this.noPassParaChange.emit(this.notPassPara);
			this.handleCancel();
		} else {
			this.message.error("Please complete the form");
		}
	}
}
