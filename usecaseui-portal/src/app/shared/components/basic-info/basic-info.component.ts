import { Component, OnInit, Input } from '@angular/core';
import { BUSINESS_REQUIREMENT } from '@src/constants/constants';
import {el} from "@angular/platform-browser/testing/src/browser_util";
@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.less']
})
export class BasicInfoComponent implements OnInit {

  @Input() checkDetail: any;
  @Input() businessRequirement: any;
  @Input() NSTinfo: any;
  @Input() taskModel: any;

  // 业务需求列表
  businessList: object[] = BUSINESS_REQUIREMENT;
  requirement: object = [{}];
  businessListAfterSorting: object[] = [];
  constructor() { }

  ngOnInit() {

  }

    ngOnChanges() { // Business Requirement Info: Render the page according to whether there is a value
        this.businessListAfterSorting = [];
        this.businessList = BUSINESS_REQUIREMENT.concat([]);
        if(this.businessRequirement && this.businessRequirement.length !== 0){
            Object.keys(this.businessRequirement[0]).map((item,index)=>{
                if(this.businessRequirement[0][item] !== '' && this.businessRequirement[0][item] !== null){
                    this.requirement[0][item] = this.businessRequirement[0][item];

                }else{
                    this.businessList.map((items,indexs)=>{
                        if(Array.isArray(items) === false && items.key === item){
                            this.businessList.splice(indexs,1)
                        }
                    })
                }
            });
            let area = this.businessList.pop();
            for(let i=0;i<this.businessList.length-1;i+=3){
                this.businessListAfterSorting.push(this.businessList.slice(i,i+3));
            }
            this.businessListAfterSorting.push(area);
        }
    }

}
