import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TRANSFRER_FORM_ITEMS, CORE_FORM_ITEMS, ADDRESS , NexthopInfo_Options } from '@src/constants/constants'

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
	coreFormItems: any[] = [];
	areaList: any[] = [];
    // 2020.08.17  Add 3 parameters for Endpoint, Comment: The following code
    NexthopInfoOptions = NexthopInfo_Options;
    EndpointInputs: any[] = [];
    EndpointEnable: boolean = false;  // Whether to enable the three parameters of Endpoint
    //  Comment: Above code

	constructor() { }

	ngOnInit() { }

	ngOnChanges() {
		if(this.title){
            this.coreFormItems = this.title === 'An'?CORE_FORM_ITEMS.An:this.title === 'Cn'?CORE_FORM_ITEMS.Cn:[];
            if(this.detailData !==undefined && Object.keys(this.detailData).length!==0){
                this.EndpointEnable = (this.detailData.hasOwnProperty("an_Endpoint") && this.detailData['an_Endpoint'].length!==0) || (this.detailData.hasOwnProperty("cn_Endpoint") && this.detailData['cn_Endpoint'].length!==0)
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

	AreaFormatting () {
		let areaList = [...this.detailData.an_coverage_area_ta_list];
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

	handleOk(): void {
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
			params = {...this.detailData, an_coverage_area_ta_list}
		} else {
			params = {...this.detailData}
		}
		this.paramsDataChange.emit(params)
		this.handleCancel()
	}

}
