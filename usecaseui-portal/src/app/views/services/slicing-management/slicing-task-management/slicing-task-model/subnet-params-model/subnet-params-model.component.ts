import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { TRANSFRER_FORM_ITEMS, CORE_FORM_ITEMS, ADDRESS , NexthopInfo_Options } from '@src/constants/constants';
import { NzMessageService } from "ng-zorro-antd";
import { stringify } from '@angular/core/src/util';
import { Util } from '../../../../../../shared/utils/utils';

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
	regxpIP =  /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/; // check for correct ip address
	formData: any;
	coreFormItems : any = [];
	areaList: any[] = [];
    // 2020.08.17  Add 3 parameters for Endpoint, Comment: The following code
    NexthopInfoOptions = NexthopInfo_Options;
    EndpointInputs: object = {};
	EndpointEnable: boolean = true;  // Whether to enable the three parameters of Endpoint
	keyList: string[] = []; // keys of endPoint
    //  Comment: Above code

	constructor(
		private message: NzMessageService,
		private Util: Util
		) {
		}

	ngOnInit() {
	 }

	ngOnChanges() {
		// test
		if(this.title){
   this.formData = JSON.parse(JSON.stringify(this.detailData));
   if (this.title === 'An' || this.title === 'Cn') {
    this.coreFormItems = this.title === 'An'?CORE_FORM_ITEMS.An:this.title === 'Cn'?CORE_FORM_ITEMS.Cn:[];
    this.keyList = this.coreFormItems.find((item) => {return item.title === 'Endpoint'}).options.map((val) => {return val.key});
    if(this.formData !==undefined && Object.keys(this.formData).length!==0){
     this.EndpointEnable = this.keyList.every((item) => {return this.formData.hasOwnProperty(item)})
    }
    if(this.EndpointEnable){
     this.EndpointInputs = this.Util.pick(this.formData, this.keyList)// no?
    }else{
     this.coreFormItems.map((item,index)=>{
      if(item.title === 'Endpoint'){
       this.coreFormItems.splice(index,1)
      }
     })
    }
   }

		}
        //-------> Comment: Above code
		if (this.title === 'An') {
		  	this.AreaFormatting();
		}
	}
	validateEndPoint (key: string, value: any): string {
		if (this.Util.isEmpty(value)) {
			return 'can not be empty';
		}
		if (key === 'ip_address') {
			if (!this.regxpIP.test(value)) {
				return 'xxx.xxx.xxx.xxx';
			} else {
				return '';
			}
		} else if (key === 'logical_link') {
			if (!this.Util.isInteger(value)){
				return 'integer only'
			} else {
				return ''
			}
		} else {
			return '';
		}
	}

	// onInput ($event:any, title: string) {
	// 	if (!$event) {
	// 		return;
	// 	}
	// 	const target = $event.target;
	// 	if (title === 'ip_address') {
	// 	    // only number and '.' can be inputted
	// 		const regexp = /[^\d^\.]+/g;
	// 		target.value = target.value.replace(regexp, '');
	// 	} else if (title === 'logical_link') {
	// 	    // only number can be inputted
	// 		const regxp = /[^\d]/g;
	// 		target.value = target.value.replace(regxp, '');
	// 	}
	// }
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
	
	// prompt text for each item of area_list
	checkArea (area: any) {
		if (area.every((item) => {return item.selected === ''})) {
			return 'empty';
		}
		if (area.some((item) => {return item.selected === ''})) {
			return 'incomplete';
		}
		return '';
	}

	// special handling for address
	areaCheckBeforeSubmit (target: object) : Boolean{
		for (const prop in target) {
			if (target.hasOwnProperty(prop)) { 
				if (prop === 'an_coverage_area_ta_list' || prop ==='cn_coverage_area_ta_list') {
					// if the vlaue is "shanghai;shanghai;", the input is incomplete
					return target[prop].every((item) => {return this.Util.deepCheck(item.split(';'))});
				}
			}
		}
		return true;
	}

	endCheckBeforeSubmit () : Array<any>{
		// check params of Endpoint
		let result: Array<any> = [true, ''];
		const endPointList = this.coreFormItems&&this.coreFormItems.length!==0?this.coreFormItems.find((item) => {return item.title === 'Endpoint'}).options:{};
		let ipKey = '';
		let logicalKey = '';
		for (let item of endPointList) {
			if (item.title === 'ip_address') {
				ipKey = item.key
			} else if (item.title === 'logical_link') {
				logicalKey = item.key
			}
		}
		for (let prop in this.EndpointInputs) {
			if (prop === ipKey) {
				if (!this.regxpIP.test(this.EndpointInputs[prop])) {
					result = [false, 'Illegal IpAddress']
				}
			} else if (prop === logicalKey) {
				if (!this.Util.isInteger(this.EndpointInputs[prop])) {
					result = [false, 'LogicalID can only be an integer']
				}
			}
		} 
		return result;
	}

	inputHolder (title: string): string {
		const titleArr = title.split(' ')
		if (titleArr.length > 1) {
			return titleArr.slice(0, 2).join('');
		} else {
			return title;
		}
	}
	
	labelStyle (required: boolean) : object{
		let style;
		if (!required) {
			style = {'margin-left': '18px', 'margin-right': '-18px'};
		} else {
			style = {}
		}
		return style;
	}

	handleOk(): void {
		// Verify that items of EndPoint is correct
		let endCheckResult = this.endCheckBeforeSubmit()
		if (!endCheckResult[0]) {
			this.message.error(endCheckResult[1].toString());
			return;
		}
		// replace the params about endPoint
		for (let prop in this.formData) {
			if (typeof this.EndpointInputs[prop] !== 'undefined') {
				this.formData[prop] = this.EndpointInputs[prop];
			}
		}
		let params: object;
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
		// Verify that each item is not empty, include special handeling of area_list
		if (this.Util.deepCheck(params) && this.areaCheckBeforeSubmit(params)) {
			this.paramsDataChange.emit(params);
			this.handleCancel();
		} else {
			this.message.error('Please complete the form');
		}
	}

}
