/*
    Copyright (C) 2019 CMCC, Inc. and others. All rights reserved.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
import { Component, OnInit, Input } from '@angular/core';
import { slideUpDown } from '../../utils/animates';
import { HomesService } from '../../../core/services/homes.service';

@Component({
  selector: 'app-performance-details',
  templateUrl: './performance-details.component.html',
  styleUrls: ['./performance-details.component.less'],
  animations: [slideUpDown]
})
export class PerformanceDetailsComponent implements OnInit {


  constructor(private myhttp: HomesService) { }

  ngOnInit() {

  }

  ngOnChanges(changes) {
    console.log(this.detailId)
    this.getPerformanceHeaderDetail(this.detailId);
  }
  datailheaderdata: any = {};
  dataillistdata: any = [];
  getPerformanceHeaderDetail(id) {
    if (id) {
      this.myhttp.getPerformanceHeaderDetail(id).subscribe((data) => {
        console.log(data)
        this.datailheaderdata = data.performanceHeader;
        this.dataillistdata = data.list;
      })
    }
  }
  moredetailShow = false;
  @Input() detailId;
  state = 'up'
  slideUpDown() {
    this.moredetailShow = !this.moredetailShow;
    this.state = this.state === 'up' ? 'down' : 'up';
  }
}
