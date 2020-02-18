import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {COMMUNICATION_FORM_ITEMS, COMMUNICATION_FORM_ADDRESS} from "../../../../../../constants/constants";
import {SlicingTaskServices} from "../../../../../core/services/slicingTaskServices";
import {NzMessageService} from "ng-zorro-antd";
@Component({
  selector: 'app-business-order',
  templateUrl: './business-order.component.html',
  styleUrls: ['./business-order.component.less']
})
export class BusinessOrderComponent implements OnInit {

    constructor(
        private myhttp: SlicingTaskServices,
        private message: NzMessageService
        ) {
    }

    ngOnInit() {
    }
    ngOnChanges() {
        this.AreaFormatting();
    }
    @Input() showModel: boolean;
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
        coverageArea: ''
    };
    areaList: any[] = [];
    isSpinning: boolean = false;
    validateRules: any[] = [];
    rulesText: any[] = [];
    tooltipText: string = 'Scope: 1-100000';
    AreaFormatting() {
        let areaList = ['Beijing;Beijing;Haidian District;Wanshoulu Street'];
        this.areaList = areaList.map((item: any) => {
            let arr = item.split(';');
            item = arr.map((ite, index) => {
                let key: string;
                if (!index) {
                    key = 'province';
                } else if (index === 1) {
                    key = 'city'
                } else if (index === 2) {
                    key = 'district'
                } else {
                    key = 'street'
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
            },
            {
                key: 'street',
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
            areaItem.options = COMMUNICATION_FORM_ADDRESS;
        } else if (areaItem.key === 'city' && areaItem.options.length <= 1) {
            COMMUNICATION_FORM_ADDRESS.forEach( item => {
                if(item.name === area[0].selected) {
                    areaItem.options = item.city;
                }
            })
        }else if (areaItem.key === 'district' && areaItem.options.length <= 1) {
            COMMUNICATION_FORM_ADDRESS.forEach( (item: any) => {
                item.city.forEach(city => {
                    if (city.name === area[1].selected) {
                        areaItem.options = city.county;
                    }
                })
            })
        }else if (areaItem.key === 'street' && areaItem.options.length <= 1) {
            COMMUNICATION_FORM_ADDRESS.forEach( (item: any) => {
                item.city.forEach(city => {
                    if (city.name === area[1].selected) {
                        city.county.forEach(county => {
                            if (county.name === area[2].selected) {
                                areaItem.options = county.street;
                            }
                        })
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
            area[3].selected = '';
            area[3].options = [];
        } else if (areaItem.key === 'city') {
            area[2].selected = '';
            area[2].options = [];
            area[3].selected = '';
            area[3].options = [];
        }else if (areaItem.key === 'district') {
            area[3].selected = '';
            area[3].options = [];
        }
    }

    handleCancel() {
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
            coverageArea: ''
        };
    }

    changeTooltipText(title){
        if(title === 'Max Number of UEs'){
            this.tooltipText = 'Scope: 1-100000'
        }else if(title === 'Data Rate Downlink (Mbps)' || title === 'Data Rate Uplink (Mbps)'){
            this.tooltipText = 'Scope: 100-3000'
        }else if(title === 'Latency'){
            this.tooltipText = 'Scope: 10-200'
        }else if(title === 'Use Interval (Month)'){
            this.tooltipText = 'Scope: ≥1'
        }
    }

    getRulesText = (words,title,val,index) => {
        return this.rulesText[index] = words + title
    };

    validator(key,val,i){
        if(val === null || val.replace(/\s*/g,'').length<=0){
            this.validateRules[i] = true;
            this.getRulesText('Please enter',key,val,i,);
            return false
        }else {
            this.validateRules[i] = false;
        }
        if(key === 'maxNumberofUEs' && !/^([1-9]\d{0,4}|100000)$/.test(val) && isNaN(val)){
            this.validateRules[i] = true;
            this.getRulesText('Only numbers can be entered','','',i);
            return false
        }else if(key === 'maxNumberofUEs' && !/^([1-9]\d{0,4}|100000)$/.test(val) && !isNaN(val)){
            console.log("-----maxNumberofUEs")
            this.validateRules[i] = true;
            this.getRulesText('Scope: 1-100000','','',i);
            return false
        }else {
            this.validateRules[i] = false;
        }if((key === 'expDataRateDL' || key === 'expDataRateUL') && !/^([1-9]\d{2}|[1-3]\d{3}|3000)$/.test(val) && isNaN(val)){
            this.validateRules[i] = true;
            this.getRulesText('Only numbers can be entered','','',i);
            return false
        }else if((key === 'expDataRateDL' || key === 'expDataRateUL') && !/^([1-9]\d{2}|[1-3]\d{3}|3000)$/.test(val) && !isNaN(val)){
            this.validateRules[i] = true;
            this.getRulesText('Scope: 100-3000','','',i);
            return false
        }else {
            this.validateRules[i] = false;
        }if(key === 'latency' && !/^1[0-9]$|^[2-9]\d$|^1\d{2}$|^200$/.test(val) && isNaN(val)){
            this.validateRules[i] = true;
            this.getRulesText('Only numbers can be entered','','',i);
            return false
        }else if(key === 'latency' && !/^1[0-9]$|^[2-9]\d$|^1\d{2}$|^200$/.test(val) && !isNaN(val)){
            this.validateRules[i] = true;
            this.getRulesText('Scope: 10-200','','',i);
            return false
        }else {
            this.validateRules[i] = false;
        }
    }

    handleOk(): void {
        Object.keys(this.slicing_order_info).forEach((item,index)=>{
            if(item !== 'resourceSharingLevel' && item !== 'uEMobilityLevel' && item !== 'coverageArea'){
                this.validator(item,this.slicing_order_info[item],index)
            }
        });
        if(this.validateRules.indexOf(true)>-1){
            return
        };
            const coverage_list: string[] = [];
            this.areaList.forEach( item => {
                let str: string = '';
                item.forEach( area => {
                    str += area.selected + ';';
                });
                coverage_list.push(str.substring(0, str.length-1));
            });
            if(coverage_list.length>1){
                this.slicing_order_info.coverageArea = coverage_list.join('|')
            }else {
                this.slicing_order_info.coverageArea = coverage_list.toString();
            }
        let paramsObj = {
            slicing_order_info:this.slicing_order_info
        };
        console.log(paramsObj,"-----paramsObj");
        this.isSpinning = true;
        this.myhttp.csmfSlicingPurchase(paramsObj).subscribe(res => {
            const { result_header: { result_code, result_message }, result_body: { service_id,operation_id } } = res;
            if (+result_code === 200) {
                this.isSpinning = false;
                this.handleCancel();
            }
        }, (err) => {
            this.message.error(err);
            this.handleCancel();
            this.isSpinning = false;
        })
    }
}
