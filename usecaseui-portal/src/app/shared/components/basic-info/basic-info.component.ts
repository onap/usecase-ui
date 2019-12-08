import { Component, OnInit, Input } from '@angular/core';
import { BUSINESS_REQUIREMENT } from '../../../../constants/constants';
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

  constructor() { }

  ngOnInit() {
  }

}
