import { Component, OnInit, HostBinding } from '@angular/core';
import { slideToRight } from '../../../shared/utils/animates';

@Component({
  selector: 'app-sotn-management',
  templateUrl: './sotn-management.component.html',
  styleUrls: ['./sotn-management.component.less'],
  animations: [slideToRight]
})
export class SotnManagementComponent implements OnInit {

  @HostBinding('@routerAnimate') routerAnimateState;
  selectedIndex:number = 0;

  constructor() { }

  ngOnInit() {
  }
  
  handleTabChange($event): void {
    this.selectedIndex = $event.index;
  }

  changeTab() {
    this.selectedIndex = 1;
  }
}
