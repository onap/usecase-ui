import { Component, OnInit, Input } from '@angular/core';
import { slideUpDown } from '../../animates';
import { HomesService } from '../../homes.service';

@Component({
  selector: 'app-performance-details',
  templateUrl: './performance-details.component.html',
  styleUrls: ['./performance-details.component.less'],
  animations: [ slideUpDown ]
})
export class PerformanceDetailsComponent implements OnInit {

 
  constructor(private myhttp:HomesService) { }

  ngOnInit() {
    
  }

  ngOnChanges(changes){
    console.log(this.detailId)
    this.getPerformanceHeaderDetail(this.detailId);
  }
  datailheaderdata: any = {};
  dataillistdata: any = [];
  getPerformanceHeaderDetail(id){
    if(id){
      this.myhttp.getPerformanceHeaderDetail(id).subscribe((data)=>{
        console.log(data)
        this.datailheaderdata = data.performanceHeader;
        this.dataillistdata = data.list;
      })
    }
  }
  moredetailShow = false;
  @Input() detailId;
  state = 'up'
  slideUpDown(){
    this.moredetailShow = !this.moredetailShow;
    this.state = this.state === 'up' ? 'down' : 'up';
  }
}
