import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {COMMUNICATION_FORM_ITEMS, COMMUNICATION_FORM_ADDRESS} from "../../../../../../constants/constants";
import { Util } from '../../../../../shared/utils/utils';
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
        private message: NzMessageService,
        private Util: Util
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
        coverageArea: '',
        coverageAreaNumber: null
    };
    areaList: any[] = [];
    isSpinning: boolean = false;
    validateRulesShow: any[] = [];
    rulesText: any[] = [];
    tooltipText: string = 'Scope: 1-100000';

    AreaFormatting(): void {
        let areaList = ['Beijing;Beijing;Haidian District;Wanshoulu Street'];
        this.areaList = areaList.map((item: any) => {
            let arr = item.split(';');
            item = arr.map((it, index) => {
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
                obj.selected = it;
                obj.options = [{name: it, id: it}]
                return obj
            })
            return item;
        })
    }

    creatAreaList(): void {
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

    deleteAreaList(index: number): void {
        this.areaList.splice(index, 1);
    }

    handleChange(area: any[], areaItem: any): void {
        if (areaItem.key === 'province' && areaItem.options.length <= 1) {
            areaItem.options = COMMUNICATION_FORM_ADDRESS;
        } else if (areaItem.key === 'city' && areaItem.options.length <= 1) {
            COMMUNICATION_FORM_ADDRESS.forEach(item => {
                if (item.name === area[0].selected) {
                    areaItem.options = item.city;
                }
            })
        } else if (areaItem.key === 'district' && areaItem.options.length <= 1) {
            COMMUNICATION_FORM_ADDRESS.forEach((item: any) => {
                item.city.forEach(city => {
                    if (city.name === area[1].selected) {
                        areaItem.options = city.county;
                    }
                })
            })
        } else if (areaItem.key === 'street' && areaItem.options.length <= 1) {
            COMMUNICATION_FORM_ADDRESS.forEach((item: any) => {
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

    handleChangeSelected(area: any[], areaItem: any): void {
        let areaItemIndex = area.indexOf(areaItem);
        area.map((item,index)=>{
            if(index > areaItemIndex){
                item.selected = '';
                item.options = [];
            }
        })
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
            coverageArea: '',
            coverageAreaNumber: null
        };
    }

    changeTooltipText(title: string): void {
        if (title === 'Max Number of UEs') {
            this.tooltipText = 'Scope: 1-100000'
        } else if (title === 'Data Rate Downlink (Mbps)' || title === 'Data Rate Uplink (Mbps)') {
            this.tooltipText = 'Scope: 100-3000'
        } else if (title === 'Latency') {
            this.tooltipText = 'Scope: 10-200'
        } else if (title === 'Use Interval (Month)') {
            this.tooltipText = 'Scope: ≥1'
        }
    }

    handleOk(): void {
        const coverage_list: string[] = [];
        let coverageAreaNumber = null;
        let coverageAreas;
        
        COMMUNICATION_FORM_ITEMS.forEach((item, index) => {
            if (item.key !== 'resourceSharingLevel' && item.key !== 'uEMobilityLevel' && item.key !== 'coverageArea' && item.key !== 'coverageAreaNumber') {
                this.Util.validator(item.title,item.key, this.slicing_order_info[item.key], index, this.rulesText, this.validateRulesShow)
            }else if(item.key === 'coverageAreaNumber'){
                coverageAreaNumber = this.slicing_order_info[item.key]
            }
        });
        if (this.validateRulesShow.indexOf(true) > -1) {
            return
        }
        
        this.areaList.forEach(item => {
            let str = '';
            item.forEach(area => {
                str += area.selected + ';';
            });
            coverage_list.push(str.substring(0, str.length - 1));
        });
        
        if (coverage_list.length > 1) {
            coverageAreas = coverage_list.join('|')
        } else {
            coverageAreas = coverage_list.toString();
        }
        if(coverageAreaNumber){
            this.slicing_order_info.coverageArea = `${coverageAreas}-${coverageAreaNumber}`;
        }else{
            this.slicing_order_info.coverageArea = `${coverageAreas}`;
        }
        delete this.slicing_order_info.coverageAreaNumber

        const paramsObj = {
            slicing_order_info: this.slicing_order_info
        };
        this.isSpinning = true;
        const csmfSlicingPurchaseFailedCallback  = () => {
            this.handleCancel();
            this.isSpinning = false;
        }
        this.myhttp.csmfSlicingPurchase(paramsObj, csmfSlicingPurchaseFailedCallback).then(res => {
            this.isSpinning = false;
            this.handleCancel();
        })
    }
}
