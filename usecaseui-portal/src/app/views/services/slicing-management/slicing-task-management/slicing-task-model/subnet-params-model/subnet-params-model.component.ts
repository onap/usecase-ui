import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WIRELESS_FORM_ITEMS, TRANSFRER_FORM_ITEMS, CORE_FORM_ITEMS } from '../.../../../../../../../../constants/constants'

@Component({
	selector: 'app-subnet-params-model',
	templateUrl: './subnet-params-model.component.html',
	styleUrls: ['./subnet-params-model.component.less']
})
export class SubnetParamsModelComponent implements OnInit {

	@Input() showModel: boolean;
	@Input() detailData: any;
	@Input() title: string;
	@Output() cancel = new EventEmitter<boolean>();

	transferFormItems = TRANSFRER_FORM_ITEMS;
	coreFormItems = CORE_FORM_ITEMS;
	wirelessFormItems = WIRELESS_FORM_ITEMS;
	areaList: any[] = [];

	constructor() { }

	ngOnInit() { }

	ngOnChanges() {
		if (this.title === '无线域') {
		  	this.AreaFormatting();
		}
	}

	AreaFormatting () {
		let areaList = [...this.detailData.an_coverage_area_ta_list];
		this.areaList = areaList.map ( (item: any) => {
			let arr = item.split(';');
			item = arr.map( ite => {
				let obj: any = {};
				obj.selected = ite
				obj.options = [{name: ite, id: ite}]
				return obj
			})
			return item;
		})
	}

	creatAreaList () {
		
	}

	handleCancel() {
		this.showModel = false
		this.cancel.emit(this.showModel)
	}

	handleOk(): void {
		this.handleCancel()
	}

}
