/*******
    Input
	areaList /MUST/: Selected region data
	level /MUST/: 
	- 3: province;city;district
	- 4: province;city;district;street
********/
import { Component, OnInit } from "@angular/core";
import { Input } from "@angular/core";
import { LEVEL3ADDRESS, LEVEL4ADDRESS } from "./constants";

@Component({
	selector: "app-city-select",
	templateUrl: "./city-select.component.html",
	styleUrls: ["./city-select.component.less"],
})
export class CitySelectComponent implements OnInit {
	@Input() areaList: any[];
	@Input() level: number;
	initAddress: any[];

	constructor() {}

	ngOnInit() {}
	ngOnChanges() {
		this.chooseInitAddress();
	}
	chooseInitAddress() {
		switch (this.level) {
			case 3:
				this.initAddress = LEVEL3ADDRESS;
				break;
			case 4:
				this.initAddress = LEVEL4ADDRESS;
				break;
			default:
				this.initAddress = LEVEL3ADDRESS;
				break;
		}
	}
	computeSpan(ind: number) {
		let res: number = 4;
		switch (this.level) {
			case 4:
				if (ind === 0 || ind === 1 || ind === 2) {
					res = 3;
				} else {
					res = 4;
				}
				break;
			default:
				// 3 or others
				res = 4;
				break;
		}
		return res;
	}
	computeOffset(ind: number, i: number) {
		let res: number = 0;
		switch (this.level) {
			case 4:
				if (i && !ind) {
					res = 7;
				} else {
					res = 0;
				}
				break;
			default:
				if (i && !ind) {
					res = 7;
				} else {
					res = 0;
				}
				break;
		}
		return res;
	}
	handleChange(area: any[], areaItem: any): void {
		if (areaItem.key === "province" && areaItem.options.length <= 1) {
			areaItem.options = this.initAddress;
		} else if (areaItem.key === "city" && areaItem.options.length <= 1) {
			this.initAddress.forEach((item) => {
				if (item.name === area[0].selected) {
					areaItem.options = item.city;
				}
			});
		} else if (
			areaItem.key === "district" &&
			areaItem.options.length <= 1
		) {
			this.initAddress.forEach((item: any) => {
				item.city.forEach((city) => {
					if (city.name === area[1].selected) {
						areaItem.options = city.district;
					}
				});
			});
		} else if (areaItem.key === "street" && areaItem.options.length <= 1) {
			this.initAddress.forEach((item: any) => {
				item.city.forEach((city) => {
					if (city.name === area[1].selected) {
						city.district.forEach((district) => {
							if (district.name === area[2].selected) {
								areaItem.options = district.street;
							}
						});
					}
				});
			});
		}
	}

	handleChangeSelected(area: any[], areaItem: any) {
		let areaItemIndex = area.indexOf(areaItem);
		area.map((item, index) => {
			if (index > areaItemIndex) {
				item.selected = "";
				item.options = [];
			}
		});
	}

	// prompt text for each item of area_list
	checkArea(area: any): string {
		if (
			area.every((item) => {
				return item.selected === "";
			})
		) {
			return "empty";
		}
		if (
			area.some((item) => {
				return item.selected === "";
			})
		) {
			return "incomplete";
		}
		return "";
	}

	creatAreaList(): void {
		let arr: any[] = [];
		switch (this.level) {
			case 4:
				arr = [
					{
						key: "province",
						selected: "",
						options: [],
					},
					{
						key: "city",
						selected: "",
						options: [],
					},
					{
						key: "district",
						selected: "",
						options: [],
					},
					{
						key: "street",
						selected: "",
						options: [],
					},
				];
				break;
			default:
				arr = [
					{
						key: "province",
						selected: "",
						options: [],
					},
					{
						key: "city",
						selected: "",
						options: [],
					},
					{
						key: "district",
						selected: "",
						options: [],
					},
				];
		}
		this.areaList.push(arr);
	}

	deleteAreaList(index: number): void {
		this.areaList.splice(index, 1);
	}
}
