/*******
    Input
    areaList /MUST/: Selected region data
********/
import { Component, OnInit } from "@angular/core";
import { Input } from "@angular/core";
import { ADDRESS } from "./constants";

@Component({
	selector: "app-city-select",
	templateUrl: "./city-select.component.html",
	styleUrls: ["./city-select.component.less"],
})
export class CitySelectComponent implements OnInit {
	@Input() areaList: any[];

	constructor() {}

	ngOnInit() {}
	ngOnChanges() {}
	handleChange(area: any[], areaItem: any): void {
		if (areaItem.key === "province" && areaItem.options.length <= 1) {
			areaItem.options = ADDRESS;
		} else if (areaItem.key === "city" && areaItem.options.length <= 1) {
			ADDRESS.forEach((item) => {
				if (item.name === area[0].selected) {
					areaItem.options = item.city;
				}
			});
		} else if (
			areaItem.key === "district" &&
			areaItem.options.length <= 1
		) {
			ADDRESS.forEach((item: any) => {
				item.city.forEach((city) => {
					if (city.name === area[1].selected) {
						areaItem.options = city.county;
					}
				});
			});
		}
	}

	handleChangeSelected(area: any[], areaItem: any) {
		if (areaItem.key === "province") {
			area[1].selected = "";
			area[1].options = [];
			area[2].selected = "";
			area[2].options = [];
		} else if (areaItem.key === "city") {
			area[2].selected = "";
			area[2].options = [];
		}
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
		let arr = [
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
		this.areaList.push(arr);
	}

	deleteAreaList(index: number): void {
		this.areaList.splice(index, 1);
	}
}
