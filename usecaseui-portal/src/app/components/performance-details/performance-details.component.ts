import { Component, OnInit, Input } from '@angular/core';
import { slideUpDown } from '../../animates';
import { MyhttpService } from '../../myhttp.service';

@Component({
  selector: 'app-performance-details',
  templateUrl: './performance-details.component.html',
  styleUrls: ['./performance-details.component.less'],
  animations: [ slideUpDown ]
})
export class PerformanceDetailsComponent implements OnInit {

 
  constructor(private myhttp:MyhttpService) { }

  ngOnInit() {
    this.getAlarmDetailData(7);
  }

  ngOnChanges(changes){
    console.log(changes);
  }
  datailheaderdata: any = {};
  dataillistdata: any = [];
  getAlarmDetailData(id){
    this.myhttp.getAlarmDetailData(id).subscribe((data)=>{
      console.log(data)
      this.datailheaderdata = data.alarmsHeader;
      this.dataillistdata = data.list;
    })
  }
  moredetailShow = false;
  @Input() detailId;
  state = 'up'
  slideUpDown(){
    this.moredetailShow = !this.moredetailShow;
    this.state = this.state === 'up' ? 'down' : 'up';
  }
}
