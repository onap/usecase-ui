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
        uEMobilityLevel: null,
        useInterval: null,
        coverageArea: ''
    };
    areaList: any[] = [];
    isSpinning: boolean = false;
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
        this.cancel.emit(this.showModel)
    }

    handleOk(): void {
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
