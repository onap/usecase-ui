import { Component, OnInit, Input } from '@angular/core';
import { slideUpDown } from '../../animates';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less'],
  animations: [ slideUpDown ]
})
export class DetailsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes){
    console.log(changes);
  }
  // 详情显示
  moredetailShow = false;
  @Input() detailId;
  detailData = [
    {name:"DNS.AttDnsQuery",value:"0"},
    {name:"DNS.SuccDnsQuery",value:"0"},
    {name:"DNS.SuccDnsQuery",value:"0"},
    {name:"DNS.SuccDnsQuery",value:"0"},
    {name:"DNS.SuccDnsQuery",value:"0"},
    {name:"sssssss",value:"1111"},
  ]
  state = 'up'
  slideUpDown(){
    this.moredetailShow = !this.moredetailShow;
    this.state = this.state === 'up' ? 'down' : 'up';
  }
}
