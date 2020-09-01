import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { TRANSFRER_FORM_ITEMS, CORE_FORM_ITEMS, ADDRESS , NexthopInfo_Options } from '@src/constants/constants';
import { NzMessageService } from "ng-zorro-antd";

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
	@Output() paramsDataChange = new EventEmitter<any>();

	transferFormItems = TRANSFRER_FORM_ITEMS;
	formData: any;
	coreFormItems : any = [];
	areaList: any[] = [];
    // 2020.08.17  Add 3 parameters for Endpoint, Comment: The following code
    NexthopInfoOptions = NexthopInfo_Options;
    EndpointInputs: any[] = [];
	EndpointEnable: boolean = true;  // Whether to enable the three parameters of Endpoint
    //  Comment: Above code

	constructor(
		private message: NzMessageService,
		) {
		}

	ngOnInit() {
	 }

	ngOnChanges() {
		if(this.title){
			this.coreFormItems = this.title === 'An'?CORE_FORM_ITEMS.An:this.title === 'Cn'?CORE_FORM_ITEMS.Cn:[];
			this.formData = JSON.parse(JSON.stringify(this.detailData));
            if(this.formData !==undefined && Object.keys(this.formData).length!==0){
                this.EndpointEnable = (this.formData.hasOwnProperty("an_Endpoint") && this.formData['an_Endpoint'].length!==0) || (this.formData.hasOwnProperty("cn_Endpoint") && this.formData['cn_Endpoint'].length!==0)
            }
            // -------> 2020.08.17  Add 3 parameters for Endpoint, Comment: The following code
            if(this.EndpointEnable){
                this.EndpointInputs = this.title === 'An'
                    ?this.detailData["an_Endpoint"]
                    :this.title === 'Cn'
                        ?this.detailData["cn_Endpoint"]
                        :[];
            }else{
                this.coreFormItems.map((item,index)=>{
                    if(item.title === 'Endpoint'){
                        this.coreFormItems.splice(index,1)
                    }
                })
            }
		}
        //-------> Comment: Above code
		if (this.title === 'An') {
		  	this.AreaFormatting();
		}
	}
	validateEndPoint (key: string, value: any): string {
		if (value === '') {
			return 'can not be empty';
		}
		if (key === 'ip_address') {
			const regxp = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
			if (!regxp.test(value)) {
				return 'xxx.xxx.xxx.xxx';
			} else {
				return '';
			}
		} else if (key === 'logical_link') {
			return '';
		} else {
			return '';
		}
	}
	// endPointOnBlur ($event:any, title: string): void {
	// 	const target = $event.target;
	// 	if (title === 'ip_address') {
	// 		const regxp = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
	// 		if (!regxp.test(target.value)) {
	// 			target.value = '';
	// 			this.message.error('Please enter legal IP address');
	// 		}
	// 	}
	// }
	// endPointEnter ($event:any, title: string): void {
	// 	if ($event.keyCode === 13) {
	// 		const target = $event.target;
	// 		if (title === 'ip_address') {
	// 			const regxp = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
	// 			if (!regxp.test(target.value)) {
	// 				target.value = '';
	// 				this.message.error('Please enter legal IP address');
	// 			}
	// 		}
	// 	}
	// }
	onInput ($event:any, title: string) {
		if (!$event) {
			return;
		}
		const target = $event.target;
		if (title === 'ip_address') {
		    // only number and '.' can be inputted
			const regexp = /[^\d^\.]+/g;
			target.value = target.value.replace(regexp, '');
		} else if (title === 'logical_link') {
		    // only number can be inputted
			const regxp = /[^\d]/g;
			target.value = target.value.replace(regxp, '');
		}
	}
	AreaFormatting () {
		let areaList = [...this.formData.an_coverage_area_ta_list];
		this.areaList = areaList.map ( (item: any) => {
			let arr = item.split(';');
			item = arr.map( (ite, index) => {
				let key: string;
				if (!index) {
					key = 'province';
				} else if (index === 1){
					key = 'city'
				} else {
					key = 'district'
				}
				const obj: any = {};
				obj.key = key;
				obj.selected = ite
				obj.options = [{name: ite, id: ite}]
				return obj
			})
			return item;
		})
	}

	creatAreaList (): void {
		let arr = [
			{
				key: 'province',
				selected: '',
				options: []
			},
			{
				key: 'city',
				selected: '',
				options: []
			},
			{
				key: 'district',
				selected: '',
				options: []
			}
		]
		this.areaList.push(arr)
	}

	deleteAreaList (index: number): void {
		this.areaList.splice(index,1);
	}

	handleChange(area: any[], areaItem: any): void{
		if (areaItem.key === 'province' && areaItem.options.length <= 1) {
			areaItem.options = ADDRESS;
		} else if (areaItem.key === 'city' && areaItem.options.length <= 1) {
			ADDRESS.forEach( item => {
				if(item.name === area[0].selected) {
					areaItem.options = item.city;
				}
			})
		}else if (areaItem.key === 'district' && areaItem.options.length <= 1) {
			ADDRESS.forEach( (item: any) => {
				item.city.forEach(city => {
					if (city.name === area[1].selected) {
						areaItem.options = city.county;
					}
				})
			})
		}
	}

	handleChangeSelected(area: any[], areaItem: any) {
		if (areaItem.key === 'province') {
			area[1].selected = ''
			area[1].options = [];
			area[2].selected = '';
			area[2].options = [];
		} else if (areaItem.key === 'city') {
			area[2].selected = '';
			area[2].options = [];
		}
	}

	handleCancel() {
		this.showModel = false
		this.cancel.emit(this.showModel)
	}
	
	checkArea () {
		let result = true;
		console.log(this.areaList);
		this.areaList.forEach((item) => {
			if (item.some((val) => {return val['selected'] === ''})) {
				result = false;
			}
		})
		if (!result) {
			return 'can not be empty!';
		} else {
			return '';
		}
	}

	judgeType (a) {
		return Object.prototype.toString.call(a)
	}

	// used to verify that each item is not empty in a object
	deepCheck (target) {
		let type = this.judgeType(target);
		if (type === '[object Array]') {
			for (let i = 0; i < target.length; i++) {
				if (!this.deepCheck(target[i])) {
					return false;
				}
			  }
		} else if (type === '[object Object]') {
			for (const prop in target) {
				if (target.hasOwnProperty(prop)) { // special handling for address
				  if (prop === 'an_coverage_area_ta_list' || prop ==='cn_coverage_area_ta_list') {
					  return target[prop].every((item) => {return this.deepCheck(item.split(';'))});
				  } else if (!this.deepCheck(target[prop])) {
					  return false;
				  }
				}
			}
		} else {
			if (!target && target!==0) {
				return false;
			} else {
				return true;
			}
		}
		return true;
	}

	// endCheckBeforeSubmit (params) {
	// 	let target;
	// 	if (this.title === 'An') {
	// 		target = params['an_Endpoint'];
	// 		for (let item of target) {
	// 			if (Object.keys[0] === 'an_ip_address') { 
	// 				const regxp = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
	// 				if (regxp.test(item['an_ip_address'])) {
	// 					this.message.error('illegal IpAddress');
	// 					return false;
	// 				} 
	// 			}
	// 		}
	// 	} else if (this.title === 'Cn'){
	// 		target = params['cn_Endpoint'];
	// 		for (let item of target) {
	// 			if (Object.keys[0] === 'cn_ip_address') { 
	// 				const regxp = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
	// 				if (regxp.test(item['cn_ip_address'])) {
	// 					this.message.error('illegal IpAddress');
	// 					return false;
	// 				} 
	// 			}
	// 		}
	// 	} else {
	// 		return true;
	// 	}
	// 	return true;
	// }

	handleOk(): void {
		let params: object;
		// Verify that each item is not empty
		if (this.title === 'An') {
			const an_coverage_area_ta_list: string[] = [];
			this.areaList.forEach( item => {
				let str: string = '';
				item.forEach( area => {
					str += area.selected + ';';
				})
				an_coverage_area_ta_list.push(str.substring(0, str.length-1));
			})
			params = {...this.formData, an_coverage_area_ta_list};
		} else {
			params = {...this.formData};
		}
		if (this.deepCheck(params)) {
			this.paramsDataChange.emit(params);
			this.handleCancel();
		} else {
			this.message.error('Please complete the form');
		}
	}

}
