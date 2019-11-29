import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WIRELESS_FORM_ITEMS, TRANSFRER_FORM_ITEMS } from '../.../../../../../../../../constants/constants'

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

	constructor() { }

	ngOnInit() {

	}

	handleCancel() {
		this.showModel = false
		this.cancel.emit(this.showModel)
	}

	handleOk(): void {
		this.handleCancel()
	}

}
