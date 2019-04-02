import { Component, OnInit , HostBinding} from '@angular/core';
import { showHideAnimate, slideToRight } from '../animates';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.less'],
  animations: [
    showHideAnimate, slideToRight
  ]
})
export class ManagementComponent implements OnInit {
  @HostBinding('@routerAnimate') routerAnimateState; //Routing animation

  constructor() { }

  ngOnInit() {
  }

  show = "show";
  hide = "hide";
  custerhide = false;
  customershow(){
    this.show = "show";
    this.hide = "hide";
    this.custerhide = true;
  }
  customerhide(){
    this.show = "hide";
    this.hide = "show";
    this.custerhide = false;
  }

}
