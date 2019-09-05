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
import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { HomesService } from '../../../core/services/homes.service';
import * as addDays from 'date-fns/add_days';
import { DatePipe } from "@angular/common"

@Component({
  selector: 'app-graphiclist',
  templateUrl: './graphiclist.component.html',
  styleUrls: ['./graphiclist.component.less'],
  providers: [DatePipe]
})
export class GraphiclistComponent implements OnInit {
  public startTime: string ='';
  public endTime: string = '';
  public currentPage: number = 1;
  public pageSize: number = 10;
  list: any;
  constructor( private datePipe: DatePipe,
    private myhttp: HomesService) { }
  isVisibleMiddle = false;

  showModalMiddle(): void {
    this.isVisibleMiddle = true;
  }
  handleOkMiddle(): void {
    this.isVisibleMiddle = false;
  }
  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
  }

  ngOnInit() {
  }
  ngOnChanges(changes){
    this.getPerformanceFormData();
  }
  getPerformanceFormData() {
    this.myhttp.getPerformanceFormData(this.currentPage, this.pageSize, this.vnfname, this.startTime, this.endTime).subscribe((data) => {
      this.list = data.performances;
    })
  }
 // Date screening
 dateRange =  [ addDays(new Date(), -30), new Date() ];

 onChange(result: Date): void {
  this.startTime = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss');
  this.endTime = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
}
  sort(e){
  }
  @Input () vnfname;
  @Output() detailData = new EventEmitter();
  detailShow(id){
    let prems = {
      id:id,
      detailShow: true
    }
    this.detailData.emit(prems);

  }

}
