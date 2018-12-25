import { Component, OnInit, Input } from '@angular/core';
import { slideUpDown } from '../../animates';
import { HomesService } from '../../homes.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less'],
  animations: [ slideUpDown ]
})
export class DetailsComponent implements OnInit {

  constructor(private myhttp:HomesService) { }

  ngOnInit() {
  }

  ngOnChanges(changes){
    this.getAlarmDetailData(this.detailId);
  }

  datailheaderdata: any = {

  };
  dataillistdata: any = [];
  getAlarmDetailData(id){
    if(id){
      this.myhttp.getAlarmDetailData(id).subscribe((data)=>{
        this.datailheaderdata = data.alarmsHeader;
        this.dataillistdata = data.list;
      })
    }

  }
  // 详情显示
  moredetailShow = false;
  @Input() detailId;
  
  state = 'up'
  slideUpDown(){
    this.moredetailShow = !this.moredetailShow;
    this.state = this.state === 'up' ? 'down' : 'up';
  }
}
